# This program is public domain
# Author: Paul Kienzle
"""
Desktop GUI for monitoring an xpeek stream.
"""
from __future__ import with_statement
import sys
import time
import thread

import wx
import matplotlib as mpl
from matplotlib.backends.backend_wxagg import FigureCanvasWxAgg as Canvas
from matplotlib.backends.backend_wx import NavigationToolbar2Wx as Toolbar
from matplotlib.backends.backend_wx import StatusBarWx as StatusBar

import xpeek
import plot
import hfbs

LOGFORMAT_INSTRUMENTS =  set(['CGD','NGD','NG4','NG7'])

def _rescale(lo,hi,step,pt=None,bal=None,scale='linear'):
    """
    Rescale (lo,hi) by step, returning the new (lo,hi)
    The scaling is centered on pt, with positive values of step
    driving lo/hi away from pt and negative values pulling them in.
    If bal is given instead of point, it is already in [0,1] coordinates.

    This is a helper function for step-based zooming.
    """
    # Convert values into the correct scale for a linear transformation
    # TODO: use proper scale transformers
    if scale=='log':
        lo,hi = log10(lo),log10(hi)
        if pt is not None: pt = log10(pt)

    # Compute delta from axis range * %, or 1-% if persent is negative
    if step > 0:
        delta = float(hi-lo)*step/100
    else:
        delta = float(hi-lo)*step/(100-step)

    # Add scale factor proportionally to the lo and hi values, preserving the
    # point under the mouse
    if bal is None:
        bal = float(pt-lo)/(hi-lo)
    lo = lo - bal*delta
    hi = hi + (1-bal)*delta

    # Convert transformed values back to the original scale
    if scale=='log':
        lo,hi = pow(10.,lo),pow(10.,hi)

    return (lo,hi)

def _invert(ax,x,y):
    """
    Translate pixel position to data coordinates.
    """
    try:
        xdata,ydata = ax.transAxes.inverted().transform((x,y))
    except:
        # Support older matplot
        xdata,ydata = ax.transAxes.inverse_xy_tup((x,y))
    return xdata,ydata

class Plotter(wx.Panel):
    def __init__(self, parent, id = -1, dpi = None, data = None, **kwargs):
        # TODO: inherit directly from Canvas --- it is after all a panel.
        self.data = data

        # Set up the panel parameters
        #style = wx.NO_FULL_REPAINT_ON_RESIZE
        wx.Panel.__init__(self, parent, id = id, **kwargs)
        self.figure = mpl.figure.Figure(dpi=dpi,figsize=(1,1))
        self.canvas = Canvas(self, -1, self.figure)
        self.toolbar = Toolbar(self.canvas)
        self.toolbar.set_status_bar(parent.GetStatusBar())
        self.toolbar.Realize()
        self.canvas.mpl_connect('resize_event',self.onResize)
        self.canvas.mpl_connect('scroll_event',self.onWheel)
        sizer = wx.BoxSizer(wx.VERTICAL)
        sizer.Add(self.canvas,1,wx.EXPAND)
        sizer.Add(self.toolbar, 0, wx.LEFT | wx.EXPAND)
        self.SetSizer(sizer)

    def onResize(self,event):
        self.data.plot(self.figure)

    def onWheel(self, event):
        """
        Process mouse wheel as zoom events
        """
        ax = event.inaxes
        step = event.step

        # Icky hardcoding of colorbar zoom.
        if False and ax == self.coloraxes:
            # rescale colormap: the axes are already scaled to 0..1,
            # so use bal instead of pt for centering
            lo,hi = self.colormapper.get_clim()
            lo,hi = _rescale(lo,hi,step,bal=event.ydata,scale=self.vscale)
            self.colormapper.set_clim(lo,hi)
        elif ax != None:
            # Event occurred inside a plotting area
            lo,hi = ax.get_xlim()
            lo,hi = _rescale(lo,hi,step,pt=event.xdata)
            ax.set_xlim((lo,hi))

            lo,hi = ax.get_ylim()
            lo,hi = _rescale(lo,hi,step,pt=event.ydata)
            ax.set_ylim((lo,hi))
        else:
            # Check if zoom happens in the axes
            xdata,ydata = None,None
            x,y = event.x,event.y
            for ax in self.figure.axes:
                insidex,_ = ax.xaxis.contains(event)
                if insidex:
                    xdata,_ = _invert(ax,x,y)
                    #print "xaxis",x,"->",xdata
                insidey,_ = ax.yaxis.contains(event)
                if insidey:
                    _,ydata = _invert(ax,x,y)
                    #print "yaxis",y,"->",ydata
            if xdata is not None:
                lo,hi = ax.get_xlim()
                lo,hi = _rescale(lo,hi,step,bal=xdata)
                ax.set_xlim((lo,hi))
            if ydata is not None:
                lo,hi = ax.get_ylim()
                lo,hi = _rescale(lo,hi,step,bal=ydata)
                ax.set_ylim((lo,hi))

        self.canvas.draw()


class XPeekGUI(xpeek.XPeek):
    """
    Queue data notifications and plot when the plotting engine
    becomes available.
    """
    def __init__(self, *args, **kw):
        """Open plot canvas for instrument"""
        xpeek.XPeek.__init__(self, *args, **kw)
        if self.instrument in LOGFORMAT_INSTRUMENTS:
            self.scale = 'log'
        else:
            self.scale = 'linear'
        # Acquire lock before plotting; release lock when new data
        # is ready
        self.__flag = thread.allocate_lock()
        self.__lineid = None

    def newdata(self, lineid):
        """Start new plot"""
        #logging.debug('Processing new data for '+self.instrument)
        self.__lineid = None
        if self.__flag.locked(): self.__flag.release()

    def enddata(self, lineid):
        """End a plot; plot a peak"""
        #logging.debug('Processing end data for '+self.instrument)
        self.__lineid = lineid
        if self.__flag.locked(): self.__flag.release()

    def newpoint(self, lineid):
        """Queue the datapoint for later processing"""
        #logging.debug('Processing new point for '+self.instrument)
        self.__lineid = lineid
        if self.__flag.locked(): self.__flag.release()

    def plot(self, figure):
        with self.lock:
            if self.instrument == 'NG2':
                data, filename = hfbs.fetch_current()
                self.hfbs = hfbs.reduce(data,filename)
            figure.clear()
            if self.__lineid is not None:
                plot.layout_figure(figure,self,self.__lineid,scale=self.scale)
            figure.canvas.draw()
    def process_plots(self, figure):
        while True:
            time.sleep(1)
            self.__flag.acquire()
            self.plot(figure)

def main():
    """
    Start the GUI and connect to the xpeek stream.
    """
    if len(sys.argv) != 2:
        print "usage: xpeek <instrument>"
        sys.exit()
    else:
        instrument = sys.argv[1]

    xpeek = XPeekGUI(instrument)
    # One thread to process stream, one to update plot no more than once
    # per second, and the main thread to handle the GUI.
    thread.start_new_thread(xpeek.process_stream,())

    # Make a frame to show it
    app = wx.PySimpleApp()
    frame = wx.Frame(None,-1,'XPeek')
    statbar = StatusBar(frame)
    frame.SetStatusBar(statbar)
    plotter = Plotter(frame, data=xpeek)
    frame.Show()
    thread.start_new_thread(xpeek.process_plots,(plotter.figure,))

    app.MainLoop()

if __name__ == "__main__": main()
