#!/usr/bin/env python
"""
Parse and summarize HFBS data files.

Usage::

    ./hfbs.py [filename|url]

URLs are of the form::

    ftp://ftp-i.ncnr.nist.gov/pub/ncnrdata/hfbs/YYYYMM/<datafile>"

If no file or url is specified, fetch the most recently measured datafile.

As a library, get the data using one of::

    import hfbs
    data = hfbs.load(filename)
    data, filename = hfbs.fetch_current()
    data, filename = hfbs.fetch(url)

Reduce the data and print a summary::

    dataset = hfbs.reduce(data, filename)
    hfbs.summary(dataset)
"""

from __future__ import division # force a/b to be floating point
from __future__ import with_statement

import os
import re
import urllib
from math import sqrt

def meanstdv(x):
    """
    Compute mean and standard deviation
    """
    n, mean, std = len(x), 0, 0
    for a in x:
        mean = mean + a
    mean = mean / n
    for a in x:
        std = std + (a - mean)**2
    std = sqrt(std / (n-1)) if n>1 else 0
    return mean, std


def fetch(dataurl):
    """
    Retrieve a remote hfbs file given url

    Returns data, filename

    hfbs example:

        >>> NCNR = "ftp://ftp-i.ncnr.nist.gov/pub/ncnrdata/"
        >>> url = NCNR+"hfbs/201011/20101118_05.hfbs"
        >>> data, filename = fetch(url)
        >>> dataset = reduce(data, filename)
        >>> summary(dataset) # doctest: +ELLIPSIS, +NORMALIZE_WHITESPACE
        20101118_05.hfbs  17 ueV
        tbm: 884074.75 stdv: 1938.28
        Energy (ueV)  Rate(counts/min)
        -17.29  0.88
        -17.19  0.88
        -17.09  0.88
          ...
        16.89  0.99
        16.99  0.98
        17.09  0.96
        17.19  0.92

    hscn example:

        >>> NCNR = "ftp://ftp-i.ncnr.nist.gov/pub/ncnrdata/"
        >>> url = NCNR+"hfbs/201011/20101118_01.hscn"
        >>> data, filename = fetch(url)
        >>> dataset = reduce(data, filename)
        >>> summary(dataset) # doctest: +ELLIPSIS, +NORMALIZE_WHITESPACE
        20101118_01.hscn  elastic
        tbm: 169250.32 stdv: 1291.83
        Temperature (K)  Intensity (arb.units)
        466.17  1.41
        467.23  1.41
        468.40  1.41
           ...
        546.37  0.48
        547.41  0.48
        548.42  0.48
        549.46  0.47
    """
    #print "fetching",dataurl
    filename = os.path.basename(dataurl)
    fid = urllib.urlopen(dataurl)
    data = fid.read()
    fid.close()
    #print "data",data
    return data,filename

def fetch_current():
    """
    Get the most recent data set from charlotte.
    """
    URL = "http://www-i.ncnr.nist.gov/ncnrdata/recent.php?action=1&instr=hfbs"
    fid = urllib.urlopen(URL)
    content = fid.read()
    fid.close()
    start = content.find("ftp:")
    end = content.find("\"", start)
    dataurl = content[start:end]
    # temporary hack: the table hrefs on the above link are missing the
    # final directory separator
    #dataurl = dataurl[:-16]+"/"+dataurl[-16:]
    return fetch(dataurl)

def fetch_from_instrument(path):
    """
    Fetch directly from instrument.

        >>> path = "/usr/local/hfbs/data/201011/20101118_01.hscn"
        >>> data, filename = fetch_from_instrument(path)
        >>> dataset = reduce(data, filename)
        >>> summary(dataset) # doctest: +ELLIPSIS, +NORMALIZE_WHITESPACE
        20101118_01.hscn  elastic
        tbm: 169250.32 stdv: 1291.83
        Temperature (K)  Intensity (arb.units)
        466.17  1.41
        467.23  1.41
        468.40  1.41
           ...
        546.37  0.48
        547.41  0.48
        548.42  0.48
        549.46  0.47
    """
    opts = dict(key="~/.ssh/livedatakey",
                computer="ncnr@ng2.ncnr.nist.gov",
                remote=path,
                local="/tmp/hfbs")
    command = "scp -q -i %(key)s %(computer)s:%(remote)s %(local)s"%opts
    if os.system(command) != 0:
       raise RuntimeError("command failed: "+command)
    with open(opts['local']) as fid:
        data = fid.read()
    return data, os.path.basename(path)

def load(filename):
    """
    Load data from filename
    """
    fid = open(filename,'r')
    data = fild.read()
    fid.close()
    return data

def hfbs_reduce(data,filename):
    """
    spit out a pv normalized plot energy/(counts/min)

    Data format for HFBS file
    Detector 0 Monitor
    Detector 1-16  = Q values 0.25 - 1.75 A-1
    Detector 17 Energy (from -200ueV to 200ueV)
    Detector 18 P(v) for the beam monitor
    Detector 19 P(v) for the detectors
    """
    xmlfile ={}
    xmlfile['filename']= filename
    xmlfile['xlabel']='Energy (ueV)'
    xmlfile['ylabel']='Rate(counts/min)'
    byline = re.split("\n+|\r",data)
    xmlfile['numcycle']= re.split(":+\s",byline[5])[1]
    xmlfile['cycletime']= re.split(":+\s",byline[6])[1]

    numcycle = int(xmlfile['numcycle'])
    cycletime = int(xmlfile['cycletime'])

    # calculate the energy range
    idx = byline.index("#Log Doppler Freq  :")+1
    vals = [float(x) for x in byline[idx:idx+numcycle]]
    energy_range = int(round(sum(vals)/numcycle*cycletime/100))
    xmlfile['energyrange']= str(energy_range) + ' ueV'

    # calculate the average tbm
    idx = byline.index("#Log Trans beam    :")+1
    vals = [float(x) for x in byline[idx:idx+numcycle]]
    xmlfile['tbm']= meanstdv(vals)

    # calculate the sample temp
    idx = byline.index("#Log Sample temp   :")+1
    vals = [float(x) for x in byline[idx:idx+numcycle]]
    xmlfile['avgsamp']= "%.2f"%(sum(vals)/numcycle)

    #Now setup a run to extract out the detectors as an array 16x?
    start = byline.index("# Detector 0")+1
    end = byline.index("# Detector 1")-1
    count = []
    for j in range (start,end):
        line = re.split("\s+",byline[j])
        if len(line) == 3:
            if line[2] != '0.00':
                count.append(j)
        elif len(line) == 2:
            if line[1]!= '0.00':
                count.append(j)
    startchannel = int(byline[count[1]][:4])
    endchannel = int(byline[count[len(count)-1]][:4])
    detector = {}
    for i in range(0,17)+range(18,20):
        det = []
        start = byline.index("# Detector "+str(i))+1+startchannel
        end = start+(endchannel-startchannel)+1
        for j in range(start,end):
            det.append(float(byline[j][4:]))
        detector['det'+str(i)] = det
    #detector 17 is a special case
    det = []
    start = byline.index("# Detector 17")+1+startchannel
    end = start+(endchannel-startchannel)+1
    detector['deteng'] = [round(float(v[4:]),2) for v in byline[start:end]]
    #xmlfile['detectors']= detector  #This is the expression to add all detectors to xml file
    yvals=[]
    for i in range(len(detector['det0'])):
        yvals.append(detector['det4'][i]/detector['det19'][i]*833.33)
        for j in range(5,17):  # yes this is sum of detectors from 4-16. Prime the list with lowest detector
            yvals[i]=yvals[i]+detector['det'+str(j)][i]/detector['det19'][i]*833.33
    xmlfile['yval']=yvals
    xmlfile['xval']=detector['deteng']
    return xmlfile

def hscn_reduce(data, filename):
    """
    spit out a monitor/time normalized plot of sample temp/ intensity
    """
    xmlfile ={}
    xmlfile['filename']= filename
    xmlfile['xlabel']='Temperature (K)'
    xmlfile['ylabel']='Intensity (arb.units)'
    xmlfile['energyrange']= 'elastic'
    byline = re.split("\n+|\r",data)
    xmlfile['cycletime']=int(re.split(":+\s", byline[4])[1])
    xmlfile['numcycle']= len(byline)-8
    xvals = []
    yvals = []
    tbmtotal = []
    for i in range(xmlfile['numcycle']):
        # Parse line
        values = byline[6+i].split()  # automatically takes care of white space
        values = [float(v) for v in values]
        live, wbm, tbm, setpt, ctemp, stemp, atemp = values[1:8]
        total = sum(values[8:24])
        monit = values[24]
        # Accumulate line
        #yvals.append(total/(live/cycletime)/(monit/(live/cycletime)))
        yvals.append(total/monit) # live/cycletime cancels
        xvals.append(stemp)
        tbmtotal.append(tbm)
    xmlfile['xval']=xvals
    xmlfile['yval']=yvals
    xmlfile['tbm']= meanstdv(tbmtotal)
    return xmlfile

def reduce(data, filename):
    """
    Reduce the data given by the data string and the filename.
    """
    #first decide what file type this is.
    ext = filename.split(".")[1]
    if ext == 'hfbs':
        ret = hfbs_reduce(data,filename)
    elif ext =='hscn':
        ret = hscn_reduce(data,filename)
    else:
        raise ValueError("Unknown file extension '%s'"%ext)
    return ret

def summary(dataset):
    """
    Print a dataset summary.
    """
    print "%s  %s"%(dataset['filename'], dataset['energyrange'])
    print "tbm: %.2f stdv: %.2f"%dataset['tbm']
    print "%s  %s"%(dataset['xlabel'],dataset['ylabel'])
    for x,y in zip(dataset['xval'],dataset['yval']):
        print "%.2f  %.2f"%(x,y)

def main():
    """
    Run from the command line to produce a summary.
    """
    import sys
    if len(sys.argv) == 1:
        data, filename = fetch_current()
    elif sys.argv[1].startswith('ftp:'):
        data, filename = fetch(filename)
    else:
        filename = sys.argv[1]
        data = load(filename)
    dataset = reduce(data, filename)
    summary(dataset)

if __name__ == "__main__": main()
