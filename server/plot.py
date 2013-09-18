#!/usr/bin/env python
# This program is public domain
"""
Read xpeek stream and convert to plot on reflectometry.org.

Usage:
    python xpeek.py [optional list of instruments]

Updates the ipeek webpage with plots of the data.
Messages are logged to $HOME/.livedata/livedata.log
Plots are generated on /tmp.
"""
import logging
from numpy import sqrt, inf, log, isinf
import numpy
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as Canvas
from matplotlib import rcParams

from formatnum import format_uncertainty_pm as formatpm

rcParams['font.size']=8
rcParams['xtick.labelsize'] = 'small'
rcParams['ytick.labelsize'] = 'small'
rcParams['legend.fontsize'] = 'small'
rcParams['axes.labelsize'] = 'medium'
rcParams['axes.titlesize'] = 'medium'
rcParams['legend.numpoints'] = 1

LINESTYLE = dict(NGD='o-',CGD='o-',BT1='o-',NG2='o-')
POINTSIZE = dict(BT1=-2, NG2=-2, BT4=-2, BT9=-2)
ERRORBARS = ['BT7','BT9']
THUMBDIMS=210,110
IMAGEDIMS=700,450

def create_figure(size=None, dpi=72.):
    # Note: need to use fig/canvas directly rather than pylab since
    # pylab is not thread safe.
    if size=='thumb':
        w,h = THUMBDIMS[0]/dpi, THUMBDIMS[1]/dpi  # dims in inches
    else:
        w,h = IMAGEDIMS[0]/dpi, IMAGEDIMS[1]/dpi
    fig = Figure(figsize=(w,h),dpi=dpi)
    return fig


def export_figure(fig,filename):
    canvas = Canvas(fig)
    canvas.print_figure(filename,dpi=fig.get_dpi())


def layout_figure(fig,stream,dataid,scale=None):
    """Plot layout routine."""

    line = stream.data[dataid]

    try:
        px,py = fig.get_window_extent().size
    except:
        # support for pre-0.98 matplotlib
        bb = fig.get_window_extent()
        px,py = bb.width(), bb.height()
    dpi = fig.get_dpi() # pixels per inch on figure
    w,h = px/dpi,py/dpi # figure size in inches

    # Use small font for tiny figures
    dpoint = POINTSIZE.get(stream.instrument,0)
    if w < 3 or h < 2:
        rcParams['font.size']=8
        rcParams['lines.markersize']=3+dpoint
        rcParams['lines.markeredgewidth']=0.2
    else:
        rcParams['font.size']=18
        rcParams['lines.markersize']=5+dpoint
        rcParams['lines.markeredgewidth']=0.5

    fontsize = rcParams['font.size']/dpi # fontsize in inches
    dw,dh = [fontsize/t for t in (w,h)]  # font size in figure units
    #l,r,t,b= 0.75/w, .25/w, .5/h, .5/h  # margins in inches
    l,r,t,b = 5*dw,1*dw,3*dh,2.5*dh      # margin in lines for normal font size

    ax = fig.gca()
    ax.set_position([l, b, 1-(l+r), 1-(t+b)])

    aw,ah = w*(1-(l+r)),h*(1-(t+b))
    adw,adh = [fontsize/t for t in (aw,ah)]  # font size in axes units
    textattr=dict(color=(0.7,0,0.8), fontsize='small',
                  bbox=dict(facecolor=(0.7,0.8,0),lw=0,alpha=0.4,zorder=-10),
                  zorder=-9, transform=ax.transAxes, 
                  )

    ax.hold(True)
    #ax.set_title(line.runid+' : '+line.comment)
    ax.set_title(line.runid)
    ax.set_xlabel(line.primary)
    force_legend = False
    legend = []
    linestyle = LINESTYLE.get(stream.instrument,'o')
    limits = Limits()
    if line.instrument=='BT1' \
        and 'A04' in line.columns \
        and not numpy.isscalar(line.columns['DATA'][0]):
        bt1plot(line, ax, scale, limits, legend)
    elif line.instrument in ['NG2']: # HFBS
        hfbs = stream.hfbs
        x = numpy.array(hfbs['xval'])
        y = numpy.array(hfbs['yval'])
        yerr = sqrt(y)
        limits.add(x,y)
        if line.instrument in ERRORBARS:
            ax.errorbar(x,y,yerr=yerr,fmt=linestyle)
        else:
            axplot(ax,x,y,linestyle)
        ax.set_xlabel(hfbs['xlabel'])
        ax.set_ylabel(hfbs['ylabel'])
        info = hfbs['energyrange']+' tbm: '+formatpm(*hfbs['tbm'])
        ax.text(0.5*adw,1.5*adh,info, 
                ha='left',va='bottom',**textattr)

    elif line.pixels == 1:
        # Some instruments (CGD and NGD) have multiple lines
        # that need to be plotted simultaneously.  All of these
        # are stored in stream.data[lineid]
        keys = stream.data.keys()
        keys.sort()
        for id in keys:
            line_i = stream.data[id]
            x = numpy.array(line_i.columns[line_i.primary])
            y = numpy.array(line_i.columns['DATA'])
            yerr = numpy.sqrt(y)
            limits.add(x,y)
            if line.instrument in ERRORBARS:
                ax.errorbar(x,y,yerr=yerr,fmt=linestyle)
            else:
                axplot(ax,x,y,linestyle)
            legend.append(id)
        if line.instrument in ['NG7']:
            ax.set_ylabel('Counts/Monitor')


    elif line.pixels > 1 and line.instrument in ['NG2','NG4']:
        dcs_hfbs_plot(line, ax, scale, limits, legend)
  
    elif line.pixels > 1:
        # Keep life easy for now: only plot one 2-D image
        xc = numpy.array(line.columns[line.primary])
        if len(xc) == 1:
            x = numpy.array([xc[0]-0.5,xc[0]+0.5])
        else:
            dx = numpy.diff(xc)
            x0 = xc[0]-dx[0]/2
            xend = xc[-1]+dx[-1]/2
            x = numpy.hstack([x0,x0+numpy.cumsum(dx),xend])
        y = numpy.arange(line.pixels+1)+0.5
        v = numpy.array(line.columns['DATA'])
        if scale=='log':
            if numpy.any(v <= 0) and numpy.any(v>0):
                v[v<=0] = min(v[v>0])/2
                legend.append('log(Counts)')
                #force_legend = True
                v = numpy.log10(v)
            else:
                scale = 'linear'
        #print "plotting",x.shape,y.shape,v.T.shape
        ax.pcolorfast(x, y, v.T)
        ax.set_ylabel('Pixel')
        limits.add(x,y)
        scale = None  # Suppress scale

    if len(legend) > 1 or force_legend:
        # Set legend properties based on font size
        ax.legend(legend,
                  #pad=0.75/len(legend),   # padding is wrt legend box
                  #axespad=0.5*adh,        # axespad is wrt axes
                  #labelsep=0.2*adh,       # labelsep is wrt axes
                  #handletextsep=0.5*adw,
                  borderaxespad=0.5*adh,   # axespad is wrt axes
                  labelspacing=0.2*adh,    # labelsep is wrt axes
                  handletextpad=0.5*adw,
                  )  # handle text is wrt axes

    if line.peak:
        # Annotate plot with peak parameters
        xlo,xhi=line.columns[line.primary][0],line.columns[line.primary][-1]
        x = numpy.linspace(xlo,xhi,200)
        y = line.peak(x)
        #logging.info('peak:\n'+str(x)+'\n'+str(y))
        axplot(ax,x,y,'-')
        limits.add(x,y)
        ax.text(0.5*adw,1-0.5*adh,str(line.peak),
                ha='left',va='top',**textattr)
        scale = 'linear'
    else:
        # Annotate plot with environment variables
        keys = line.environment.keys()
        keys.sort()
        text = "\n".join(["%s = %g"%(k,line.environment[k]) for k in keys])
        if text != "":
            ax.text(0.5*adw,1-0.5*adh,text,
                    ha='left',va='top',**textattr)

    measured = len(line.columns['DATA'])
#    # Annotation on axes rather than figure
#    ax.text(0.5*adw,0.5*adh,"%d of %d points"%(measured,line.points),
#            transform=ax.transAxes, ha='left', va='bottom',color=textcolor,
#            fontsize='small', bbox=textbox)
    eta = line.eta()
    if eta is not "": eta = " ETA "+eta
    fig.text(2*dw,0,"%d of %d%s"%(measured,line.points,eta),
             ha='left',va='bottom',**textattr)
    point_time = line.timestamp("%m/%d %H:%M")
    if point_time != "":
        fig.text(1-1*dw,0,point_time, 
                 ha='right',va='bottom',**textattr)

    set_scale(ax, scale, limits)

def bt1plot(data, ax, scale, limits, legend):


    # BT1 scale factors
    BT1_scl=[ 2.700,  2.479,  2.827,  2.483,  2.260,  2.347,  2.011,  1.749,
              1.630,  1.360,  1.339,  1.218,  1.058,  1.000,  1.054,  0.953,
              0.941,  0.985,  1.031,  1.021,  0.982,  1.011,  0.900,  1.118,
              0.955,  1.056,  0.973,  0.974,  0.943,  0.877,  0.872,  0.820,
              ]

    # BT1 detector zeros in hundredths of a degree
    BT1_z_c=[ 0.00,   1.00,   1.29,  -0.48,   1.53,  -0.98,   2.03,   0.89,
              1.54,   1.28,   0.40,   0.35,   1.53,  -1.57,   0.63,   1.43,
             -0.08,  -0.01,  -0.78,   0.16,  -1.08,  -2.08,  -1.23,  -0.47,
              0.43,  -0.27,  -2.60,   0.88,  -1.34,   2.24,   3.00,   4.00,
              ]

    BT1_scale = numpy.array(BT1_scl)
    BT1_zeros = numpy.array(BT1_z_c)*0.01

    counts = numpy.array(data.columns['DATA'])
    counts *= BT1_scale
    a04 = numpy.array(data.columns['A04'])
    if scale == 'log': counts += 1
    linestyle = LINESTYLE.get('BT1','o-')
    for i in range(len(data.columns['DATA'][0])):
        x = a04 + 5*i - BT1_zeros[i]
        y = counts[:,i]
        yerr = numpy.sqrt(y)
        limits.add(x,y)
        if 'BT1' in ERRORBARS:
            if False and scale == 'log': yerr[y-yerr<=0] = 0
            ax.errorbar(x,y,yerr=yerr,fmt=linestyle)
        else:
            axplot(ax,x,y,linestyle)

def dcs_hfbs_plot(line, ax, scale, limits, legend):
    rcParams['lines.markersize'] -= 2
    counts = numpy.array(line.columns['DATA'][-1])
    bins = numpy.nonzero(counts)[0]
    if len(bins) == 0:
        x,y = numpy.array([1]),numpy.array([0])
        scale = 'linear'
    else:
        lo,hi = min(bins),max(bins)+1
        x = numpy.arange(lo,hi)
        y = counts[lo:hi]
    yerr = numpy.sqrt(y)
    linestyle = LINESTYLE.get(line.instrument,'o-')
    if line.instrument in ERRORBARS:
        ax.errorbar(x,y,yerr=yerr,fmt=linestyle)
    else:
        axplot(ax,x,y,linestyle)
    ax.set_xlabel('bin')
    limits.add(x,y)

def set_scale(ax,scale,limits):
    #TODO should not need to do adjust limits by hand!
    # Note: 2-D graphs come through with scale=None
    if isinf(limits.ythresh) or limits.yhi/limits.ythresh < 20: 
        scale = 'linear'
    if scale == 'log':
        t = limits.ythresh/2
        try:
            ax.set_yscale('symlog',linthreshy=t,linwidthy=0.1)
            if limits.ylo<0: ax.axhspan(-t,t,facecolor="k",alpha=0.1)
        except ValueError, e:
            logging.error("math error on log y range for ythresh=%g"%t)
            ax.set_yscale('linear')
    else:
        ax.set_yscale('linear')
    ax.set_xlim(*limits.xfudge(0.05))
    ax.set_ylim(*limits.yfudge(0.05,scale))
    #ax.set_ylim(-t/2,t/2)

def axplot(ax,x,y,linestyle):
    try:
        ax.plot(x,y,linestyle)
    except:
        logging.error('problems plotting; x.shape: %s y.shape: %s; may be related to MemoryError'%(str(x.shape),str(y.shape)))
        raise

class Limits:
    def __init__(self):
        self.xlo, self.xhi = inf, -inf
        self.ylo, self.yhi = inf, -inf
        self.xthresh = inf
        self.ythresh = inf
    def add(self, x, y):
        self.ylo = min(self.ylo,min(y))
        self.yhi = max(self.yhi,max(y))
        self.xlo = min(self.xlo,min(x))
        self.xhi = max(self.xhi,max(x))
        if (x>0).any():
            self.xthresh = min(self.xthresh,min(x[x>0]))
        if (y>0).any():
            self.ythresh = min(self.ythresh,min(y[y>0]))
    def xfudge(self, pct=0.05, scale=None):
        return Limits._fudge(self.xlo,self.xhi,self.xthresh,pct,scale)
    def yfudge(self, pct=0.05, scale=None):
        return Limits._fudge(self.ylo,self.yhi,self.ythresh,pct,scale)
    @staticmethod
    def _fudge(lo,hi,thresh,pct,scale):
        if scale == 'log' and not isinf(thresh):
            # ymin, ymax are at position log ymin, log ymax on linear scale
            # difference in positions is therefore log ymax - log ymin
            # log ymax' is x% higher so:
            #    log ymax' = log ymax + x*(log ymax - log ymin)
            #              = log ymax + log (ymax/ymin)**x
            #              = log ymax * (ymax/ymin)**x
            # similarly for log ymin' = log ymin - x%:
            #    log ymin' = log ymin / (ymax/ymin)**x
            # If ymin is negative, then we need to make it more negative
            # to leave room below ymin on the graph.
            delta = (hi/thresh)**pct
            lo = (thresh/delta if lo >= 0 else thresh*delta)
            hi = hi*delta
        elif not isinf(hi):
            delta = (hi-lo)*pct
            if delta <= 0: delta = abs(hi)*0.1
            if delta <= 0: delta = 1
            lo, hi = lo-delta, hi+delta
        else:
            lo, hi = -1, 1
        return lo,hi

