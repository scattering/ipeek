#!/usr/bin/env python

import datetime
import sys
import numpy
import math
import os
import matplotlib
import matplotlib.pyplot as plt
from matplotlib import cm
from matplotlib.colors import LogNorm

import data

KEYFILE = os.path.expanduser('~/.ssh/livedatakey')
WEBSPACE = 'pkienzle@webster.ncnr.nist.gov:/var/www/html/ipeek'
WORKDIR="/tmp/"


def getLiveData(datafile):
    path = "/net/charlotte/var/ftp/pub/sansdata/"+datafile
    sansfile="pkienzle@sparkle.ncnr.nist.gov:%s"%path
    workfile=WORKDIR+"livedata."+datafile[:3].lower()
    cmd = ("scp -p -i %s %s %s"
               % (KEYFILE, sansfile, workfile))
    #print cmd
    os.system(cmd)
    return workfile

def putLiveData(imgname,htmlname,rawdata=None):
    files = [WORKDIR+f for f in (imgname, htmlname)]
    if rawdata is not None: files.append(rawdata)
    # assuming no spaces in filenames
    cmd = "scp -p -i %s %s %s"% (KEYFILE, " ".join(files), WEBSPACE)
    #print cmd
    os.system(cmd)

def createLiveHTML(metadata,imgname,htmlname):

    collen=16.258
    if (metadata['sample.table'] == '1'):
        offset=0.55
    else:
        offset=0

    dataimage = imgname
    outfile = open(htmlname,"w")

    print >> outfile, """
<?
include("/var/www/include/utility.inc")
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>%s status</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta http-equiv="refresh" content="30" />
<link rel="stylesheet" href="http://www.ncnr.nist.gov/programs/sans/scripts/style.css" type="text/css">
<script src="http://www.ncnr.nist.gov/programs/sans/scripts/java_scripts.js" type="text/javascript"></script>
</head>

<body>

<div class="bannerback">
<div class="bannerleft"><a href="http://www.ncnr.nist.gov/"><img src="/images/ncnr_banner_title_2.gif" alt="NIST Center for Neutron Research Logo"></a></div>
<div class="bannerright"><a href="http://www.nist.gov/"><img src="/images/ncnr_banner_nist_name.gif" alt="NIST Logo"></a></div>
</div>

<div class="nav">
  <ul>
    <li><a href="http://www.ncnr.nist.gov/index.html">NCNR Home</a></li>
    <li><a href="http://www.ncnr.nist.gov/instruments/index.html">Instruments</a></li>
    <li><a href="http://www.ncnr.nist.gov/programs/index.html">Science</a></li>
    <li><a href="http://www.ncnr.nist.gov/experiments.html">Experiments</a></li>
    <li><a href="http://www.ncnr.nist.gov/sitemap.html">Sitemap</a></li>
  </ul>
</div>

<div class="container">

<div align='center'><font size='Large'>%s : %s</font></div>
<div align='center'><img src="%s" alt="SANS pattern"></div>
<table align='center' border=0>
<tr valign='top'><td>
<table border=1>
<tr><td width='100px'>Date/Time</td><td>%s</td>
<tr><td>Count Time</td><td>%s s</td>
<tr><td>Elapsed Count Time</td><td>%s s</td>
<tr><td>Monitor Counts</td><td>%d</td>
<tr><td>Detector Counts</td><td>%d</td>
</table>
</td><td>
<table border=1>
<tr><td>Guides</td><td>%d</td>
<tr><td>SDD</td><td>%.1f m</td>
<tr><td>Lambda</td><td>%.1f A</td>
<tr><td>Source Aperture</td><td>%.1f cm</td>
<tr><td>Sample Aperture</td><td>%.1f cm</td>
</table>
</td><td>
<table border=1>
<tr><td>Sample Position</td><td>%.1f</td>
<tr><td>Sample Temperature</td><td>%.1f C</td>
</table>
</td></tr>
</table>
<div align='center'>The data is updated every 5 minutes and this page will refresh every 30s</div>
<div align='center'>Last data update: %s</div>
<div align='center'>Last page refresh:
<script type="text/javascript" language="JavaScript">
var date = new Date();
document.write(date.toString())
</script>
</div>
<?
include("/var/www/html/programs/sans/SANS_bottom1.inc");
?> """ % (imgname[:3],
          metadata['run.defdir'],
          metadata['sample.labl'],
          dataimage,
          metadata['run.datetime'],
          metadata['run.ctime']*metadata['run.npre'],
          metadata['run.rtime'],
          metadata['run.moncnt'],
          metadata['run.detcnt'],
          round((collen-metadata['resolution.ap12dis']-offset)/1.55),
          metadata['det.dis'],
          metadata['resolution.lmda'],
          metadata['resolution.ap1'],
          metadata['resolution.ap2'],
          metadata['sample.position'],
          metadata['sample.temp'],
          datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    outfile.close()

def generateDataImage(data,metadata,imgname):
    fig = plt.figure(figsize=(8,4))
    ax = fig.add_subplot(121)
    ax.imshow(data,origin='lower',cmap=cm.jet)
    ax2 = fig.add_subplot(122)
    vmax = data.max()
    if vmax < 1: vmax=1
    ax2.imshow(data,origin='lower',cmap=cm.jet,norm=LogNorm(vmin=1, vmax=vmax))
    #plt.colorbar(data,ax=ax2,norm=LogNorm(vmin=1))
    fig.savefig(imgname)


def run_update(inst=None):

    imgname = inst+"_livedata.png"
    htmlname = inst+"_livedata.html"
    datafile = inst[:3]+"Current/live001.sa3_ice_a001"

    localfile = getLiveData(datafile)
    detdata,metadata = data.readNCNRData(localfile)
    generateDataImage(detdata,metadata,WORKDIR+imgname)
    createLiveHTML(metadata,imgname,WORKDIR+htmlname)
    putLiveData(imgname,htmlname,rawdata=localfile)


if __name__ == "__main__":
    inst = sys.argv[1] if len(sys.argv) == 2 else None
    run_update(inst)
