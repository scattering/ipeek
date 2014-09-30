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
import simplejson
#from numpy import sqrt, inf, log, isinf
import numpy
import copy

MAX_BT1_LINES = 3

#from matplotlib.figure import Figure
#from matplotlib.backends.backend_agg import FigureCanvasAgg as Canvas
#from matplotlib import rcParams

#from formatnum import format_uncertainty_pm as formatpm

#rcParams['font.size']=8
#rcParams['xtick.labelsize'] = 'small'
#rcParams['ytick.labelsize'] = 'small'
#rcParams['legend.fontsize'] = 'small'
#rcParams['axes.labelsize'] = 'medium'
#rcParams['axes.titlesize'] = 'medium'
#rcParams['legend.numpoints'] = 1

def getPoissonUncertainty(y):
    """ for a poisson-distributed observable, get the range of 
     expected actual values for a particular measured value.
     As described in the documentation for the error analysis
     on the BaBar experiment: 
    
    4)      An alternative with some nice properties is +-0.5 + sqrt(n+0.25)
    i.e upper error = 0.5 + sqrt(n+0.25), lower error = -0.5 + sqrt(n+0.25).
    These produce the following intervals:  
    n    low      high     cred.        
    0 0.000000  1.000000 0.632121
    1 0.381966  2.618034 0.679295
    2 1.000000  4.000000 0.681595
    3 1.697224  5.302776 0.682159
    4 2.438447  6.561553 0.682378
    5 3.208712  7.791288 0.682485
    6 4.000000  9.000000 0.682545
    7 4.807418 10.192582 0.682582
    8 5.627719 11.372281 0.682607
    9 6.458619 12.541381 0.682624
    """
    hi =  0.5+numpy.sqrt(y+0.25);
    lo = -0.5+numpy.sqrt(y+0.25);
    #return {"yupper": y+hi, "ylower": y-lo, "hi": hi, "lo": lo}
    return {"yupper": y+hi, "ylower": y-lo}

def getLogPoissonUncertainty(y):
    """ apply small offset to keep log(zero) from being -infinity
     we'll make it -1 instead, just for kicks. """
    if (y <= 0):
        return {"ylower": -1, "yupper": 0}
    else: 
        hi =  0.5+numpy.sqrt(y+0.25)
        lo = -0.5+numpy.sqrt(y+0.25)
        yupper = numpy.log10(y+hi)
        ylower = numpy.log10(y-lo)
        log_hi = yupper - numpy.log10(y)
        log_lo = numpy.log10(y) - ylower;
        return {"yupper": yupper, "ylower": ylower, "hi": log_hi, "lo": log_lo}


"""
toPlots = [
    {"clear_existing": true, 
     "data": [[[1.0851660960380731, 3.0], [2.1270158958193246, 14.0],"..."]],
     "options": 
        {"axes": 
            {"xaxis": {"label": "A4"}, 
            "yaxis": {"label": "Counts"}}, 
         "series": [
            {"label": "ofcb3010.ng7"}, 
            {"label": "ofcb3009.ng7"}, 
            {"label": "ofcb3008.ng7"}, 
            {"label": "ofcb3007.ng7"}, 
            {"label": "ofcb3006.ng7"}, 
            {"label": "ofcb4010.ng7"}, 
            {"label": "ofcb4009.ng7"}, 
            {"label": "ofcb4008.ng7"}, 
            {"label": "ofcb4007.ng7"}, 
            {"label": "ofcb4006.ng7"}]}, 
     "title": "NG7 Data", 
     "type": "1d"}
];
"""
plottable_data_2d = {
            'type': '2d',
            'z':  "[data]",
            'title': "",
            'metadata': {},
            'options': {
                'series':[],
                'axes': {'xaxis': {'label':'A4'}, 'yaxis': {'label':'Counts'}},
                'fixedAspect': {
                    'fixAspect': False,
                    'aspectRatio': 1.0
                }
            },
            'dims': {
                'xmax': None,
                'xmin': None, 
                'ymin': None, 
                'ymax': None,
                'xdim': None,
                'ydim': None,
                'zmin': None,
                'zmax': None,
                },
            'xlabel': 'X',
            'ylabel': 'Y',
            'zlabel': 'Intensity (I)',
            };

plottable_data = {
            'type': '1d',
            'title': 'NG7 Data',
            'options': {
                'axes': {'xaxis': {'label':'A4'}, 'yaxis': {'label':'Counts'}},
                'series': [],
                'legend': {'show': False},
                'cursor': {'show': True, 'tooltipLocation':'se', 'tooltipOffset': 0},
                },
            'clear_existing': True,
            'data': []
        }

#for fn in files:
#    refldata = red.load(fn)
#    plottable_data['data'].append([[xx,yy] for xx,yy in zip(refldata.detector.angle_x, refldata.detector.counts)])
#    plottable_data['options']['series'].append({'label': refldata.name})

#toPlots = 'toPlots = [' + ','.join(plottables) + '];'
#toPlots = 'toPlots = [' + simplejson.dumps(plottable_data, sort_keys=True) + '];'
#pushdir = "/home/bbm/pydev/sanspush/magik_link/"

LINESTYLE = dict(NGD='o-',CGD='o-',BT1='o-',NG2='o-')
POINTSIZE = dict(BT1=-2, NG2=-2, BT4=-2, BT9=-2)
ERRORBARS = ['BT7','BT9', 'BT4', 'NGD', 'CGD']
THUMBDIMS=210,110
IMAGEDIMS=700,450

def create_figure(line):
    # Note: need to use fig/canvas directly rather than pylab since
    # pylab is not thread safe.
    
    #if size=='thumb':
    #    w,h = THUMBDIMS[0]/dpi, THUMBDIMS[1]/dpi  # dims in inches
    #else:
    #    w,h = IMAGEDIMS[0]/dpi, IMAGEDIMS[1]/dpi
    #fig = Figure(figsize=(w,h),dpi=dpi)
    #return fig
    if (line.pixels > 1 and line.instrument not in ['BT1', 'NG2', 'NG4']):  return copy.deepcopy(plottable_data_2d) 
    else: return copy.deepcopy(plottable_data) 


def export_figure(fig,filename):
    with open(filename, 'w') as outfile:
        #outfile.write('if (!("liveData" in window)) { liveData = {}; };\n') 
        #outfile.write('liveData["' + fig['metadata']['instrument'] + '"]=')
        simplejson.dump([fig], outfile)

def layout_figure(fig,stream,dataid,scale=None):
    """Plot layout routine."""
    line = stream.data[dataid]
    fig['metadata'] = {'instrument': line.instrument}
    fig['title'] = line.runid
    fig['options']['axes']['xaxis']['label'] = line.primary
    #force_legend = False
    legend = []
    #linestyle = LINESTYLE.get(stream.instrument,'o')
    #limits = Limits()
    if line.instrument=='BT1' \
        and 'A04' in line.columns \
        and not numpy.isscalar(line.columns['DATA'][0]):
        bt1plot(fig, line, scale)
    #elif line.instrument in ['NG2']: # HFBS
    elif False:
        hfbs = stream.hfbs
        x = numpy.array(hfbs['xval'])
        y = numpy.array(hfbs['yval'])
        yerr = sqrt(y)
        
        """
        data = []
            if scale == 'log':
                yerr = [getLogPoissonUncertainty(yy) for yy in y]
            else:
                yerr = [getPoissonUncertainty(yy) for yy in y]
            if line.instrument in ERRORBARS:
                for xx,yy,yyerr in zip(x, y, yerr):
                    data.append([xx,yy,yerr])
            else:
                for xx,yy in zip(x,y):
                    data.append([xx,yy])
            fig['data'].append(data)
            fig['options']['series'].append({'label':line.instrument})
        if len(keys) > 1:
            fig['options']['legend']['show'] = True
        if line.instrument in ['NG7']:
            fig['options']['axes']['yaxis']['label'] = 'Counts/Monitor'
        """
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
        fig['data'] = []
        for id in keys:
            line_i = stream.data[id]
            x = line_i.columns[line_i.primary]
            y = line_i.columns['DATA']
            data = []
            if line.instrument in ERRORBARS:
                for xx,yy in zip(x, y):
                    if scale == 'log': 
                        yyerr = getLogPoissonUncertainty(yy)
                    else:
                        yyerr = getPoissonUncertainty(yy)
                    yyerr['xupper'] = yyerr['xlower'] = xx
                    data.append([xx,yy,yyerr])
            else:
                for xx,yy in zip(x,y):
                    data.append([xx,yy])
            fig['data'].append(data)
            fig['options']['series'].append({'label':id})
        if len(keys) > 1:
            fig['options']['legend']['show'] = True
        if line.instrument in ['NG7']:
            fig['options']['axes']['yaxis']['label'] = 'Counts/Monitor'
        

    elif line.pixels > 1 and line.instrument in ['NG2','NG4']:
        dcs_hfbs_plot(fig, line, scale)
  
    elif line.pixels > 1:
        # Keep life easy for now: only plot one 2-D image
        xc = numpy.array(line.columns['PT'])
        primary_col = 'PT'
        for colname in line.independent:
            newxc = numpy.array(line.columns[colname])
            newdx = numpy.diff(newxc)
            if abs(newdx.max()) > 0:
                xc = newxc
                primary_col = colname
                break
        if len(xc) == 1:
            x = numpy.array([xc[0]-0.5,xc[0]+0.5])
            delta_x = 1.0
        else:
            dx = numpy.diff(xc)
            x0 = xc[0]-dx[0]/2.0
            xend = xc[-1]+dx[-1]/2.0
            x = numpy.hstack([x0,x0+numpy.cumsum(dx),xend])
            delta_x = (xc[-1] - xc[0]) / (len(xc) - 1)
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
        #fig = copy.deepcopy(plottable_data_2d)
        fig['metadata'] = {'instrument': line.instrument}
        fig['title'] = line.runid
        fig['options']['axes']['xaxis']['label'] = primary_col
        fig['options']['axes']['yaxis']['label'] = 'Pixel'
        fig['z'] = [v.T.tolist()]
        fig['dims'] = {
            'xdim': v.shape[0],
            'ydim': v.shape[1],
            'xmin': x.min(),
            'xmax': x.max(),
            'dx': abs(delta_x),
            'ymin': y.min(),
            'ymax': y.max(),
            'zmin': v.min(),
            'zmax': v.max()
        }
        fig['options']['fixedAspect'] = {'fixAspect': False, 'aspectRatio': 1.0}
        fig['type'] = '2d'
        #ax.pcolorfast(x, y, v.T)
        #ax.set_ylabel('Pixel')
        #limits.add(x,y)
        #scale = None  # Suppress scale

    if line.peak:
        # Annotate plot with peak parameters
        xlo,xhi=line.columns[line.primary][0],line.columns[line.primary][-1]
        x = numpy.linspace(xlo,xhi,200)
        y = line.peak(x)
        #logging.info('peak:\n'+str(x)+'\n'+str(y))
        fitdata = []
        for xx,yy in zip(x,y):
            fitdata.append([xx,yy])
        fig['data'].insert(0, fitdata)
        fig['options']['series'].insert(0, {'label': 'fit', 'showLine': True, 'showMarker': False, 'rendererOptions': {'errorBar': False}})
        fig['options']['legend']['show'] = True
        if hasattr(line.peak, '_vars') and hasattr(line.peak._vars, 'values'):
            for key in line.peak._vars.values():
                fig['metadata']['peak.' +key] = getattr(line.peak, key) 
        #fig['metadata']['peak'] = str(line.peak)
        
    else:
        # Annotate plot with environment variables
        keys = line.environment.keys()
        for k,v in line.environment.items():
            if not numpy.isfinite(v):
                line.environment[k] = None
        fig['metadata'].update(line.environment)

    measured = len(line.columns['DATA'])
    logging.debug(measured)
    
    eta = line.eta()
    fig['metadata']['eta'] = eta
    
    point_time = line.timestamp("%m/%d %H:%M")
    fig['metadata']['point_time'] = point_time
    fig['metadata']['numPoints'] = line.points
    fig['metadata']['measured'] = measured

def bt1plot(fig, data, scale, max_lines=MAX_BT1_LINES):

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
    fig['data'] = []
    
    if max_lines is not None:
        for i in range(max_lines):
            fig['data'].append([])
    
    for i in range(len(data.columns['DATA'][0])):
        x = a04 + 5*i - BT1_zeros[i]
        y = counts[:,i]
        yerr = [getPoissonUncertainty(yy) for yy in y]
        #limits.add(x,y)
        data = []
        if 'BT1' in ERRORBARS:
            #if False and scale == 'log': yerr[y-yerr<=0] = 0
            for xx,yy,yyerr in zip(x, y, yerr):
                data.append([xx,yy,yerr])
        else:
            for xx,yy in zip(x, y):
                data.append([xx,yy])
        if max_lines is not None:
            series = numpy.mod(i, max_lines)
            fig['data'][series].extend(data)
            fig['data'][series].extend([[xx, None]])
        else:
            fig['data'].append(data)
            fig['options']['series'].append({'label': str(i+1)})    
        
    fig['options']['legend'] = {"show": False}
    fig['options'].update({"seriesDefaults": {
            "markerOptions": {"size": 4 },
            "lineWidth": 1}});

def dcs_hfbs_plot(fig, line, scale):
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

    data = []
    yerr = [getPoissonUncertainty(yy) for yy in y]
    if line.instrument in ERRORBARS:
        for xx,yy,yyerr in zip(x, y, yerr):
            if numpy.isnan(yy):
                yy = None
                yyerr = None
            data.append([xx,yy,yyerr])
    else:
        for xx,yy in zip(x,y):
            yy = None if numpy.isnan(yy) else yy
            data.append([xx,yy])
    fig['data'] = [data]
    fig['options']['series'].append({'label':line.instrument})
    fig['options']['axes']['xaxis']['label'] = 'bin'

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

