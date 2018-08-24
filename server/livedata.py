#!/usr/bin/env python
# This program is public domain
# Author: Paul Kienzle
"""
Read xpeek stream and convert to plot on reflectometry.org.

Usage:
    python xpeek.py [optional list of instruments]

Updates the ipeek webpage with plots of the data.
Messages are logged to $HOME/.livedata/livedata.log
Plots are generated on /tmp.
"""

import os
import sys
import stat
# CRUFT: python 2 support
try:
    import thread
    import Queue # Multithreaded queue
except ImportError:
    import _thread as thread
    import queue as Queue # Multithreaded queue
import logging
import time
import traceback
import urllib
import os
# hack for multithreading svd problem
os.environ['OMP_NUM_THREADS'] = "1"
import sys

import daemon
import xpeek
#import plot
import plot_jqplot as plot
import hfbs

# Location of the on/off test
URL='http://www.ncnr.nist.gov/ipeek/'
ACTIVEURL = URL+'ipeekon.php'
STATUSURL='ftp://ftp-i.ncnr.nist.gov/pub/ncnrstatus/'
# Data directory of the service
#WEBSPACE = 'pkienzle@webster.ncnr.nist.gov:/var/www/html/ipeek'
WEBSPACE = 'bbm@webster.ncnr.nist.gov:ipeek_html/data'
#INSTRUMENTS = ['BT1','BT4','BT5','BT7','BT8','BT9','CGD','NGD','NG2','NG5','NSE','NG7']
# Taking NG4(DCS), BT7, Magik and PBR out of the rotation (they are generating their own jqplot files now)
#INSTRUMENTS = ['CGD', 'NGD','NG7', 'NG2', 'NG4', 'BT4', 'BT5', 'BT7', 'BT1', 'NG5', 'BT8']
INSTRUMENTS = ['NG2', 'BT4', 'BT5', 'BT1', 'NG5', 'BT8']
#LOGFORMAT_INSTRUMENTS =  set(['CGD','NGD','NG7'])
LOGFORMAT_INSTRUMENTS =  set([])
STATUS_INSTRUMENTS = ['HFBS'] # 'BT7'
SANS_INSTRUMENTS = []

PLOT_INTERVAL=60
TEMPDIR = '/home/bbm/.livedata'
KEYFILE = '/home/bbm/.ssh/datapushkey'
#KEYFILE = '/home/pkienzle/.ssh/livedatakey'
# Missing image picture
MISSING_IMAGE = os.path.abspath(os.path.join(os.path.dirname(__file__),'denied.png'))
ALL_READ_MODE = stat.S_IRUSR|stat.S_IWUSR|stat.S_IRGRP|stat.S_IWGRP|stat.S_IROTH

def webupdate(file, instrument):
    """Send files across the net to WEBSPACE"""
    if WEBSPACE:
        os.chmod(file, ALL_READ_MODE)
        logging.debug('webupdate: scp '+file)
        output_path = os.path.join(WEBSPACE, instrument)
        os.system("scp -p -i %s %s %s/"
                  % (KEYFILE, file, output_path))
        #logging.debug('webupdated')
        #_web_readable(file)

def webclear(instrument):
    """Remove files from the net in WEBSPACE/pattern"""
    if WEBSPACE:
        logging.debug('webclear: ssh + 3*scp')
        os.chmod(MISSING_IMAGE, ALL_READ_MODE)
        server,path = WEBSPACE.split(':')
        os.system('ssh -i %s %s "rm %s/%s*.png"'
                  % (KEYFILE, server, path, instrument))
        os.system('scp -p -i %s %s %s/%slinear.png'
                  % (KEYFILE, MISSING_IMAGE, WEBSPACE, instrument))
        os.system('scp -p -i %s %s %s/%slog.png'
                  % (KEYFILE, MISSING_IMAGE, WEBSPACE, instrument))
        os.system('scp -p -i %s %s %s/%sthumb.png'
                  % (KEYFILE, MISSING_IMAGE, WEBSPACE, instrument))
        #_web_readable(instrument+"*.png")

def _web_readable(pattern):
    if WEBSPACE:
        logging.debug('_web_readable: ssh')
        server,path = WEBSPACE.split(':')
        base = os.path.basename(pattern)
        cmd = 'ssh -i %s %s "chmod a+r %s/%s"'%(KEYFILE, server, path, base);
        #print cmd
        os.system(cmd)

def fetch_status(instrument):
    """
    Fetch status info for an individual instrument.
    """
    #if active(instrument):
    if True:
        url = STATUSURL+'status_'+instrument.lower()+'.txt'
        msg = "status could not be retrieved"
        try:
            fid = urllib.urlopen(url)
            msg = fid.read()
            fid.close()
            msg = msg.replace('\x1b[0;32m','<font style="color: green;">')
            msg = msg.replace('\x1b[0m','</font>')
            msg = '<pre>\n'+msg+'</pre>'
        except Exception as e:
            raise IOError("received '"+str(e)+"' while retrieving "+url);       
    else:
        msg = instrument + 'remote status monitoring is off'

    statusfile = os.path.join(TEMPDIR, instrument, 'status.txt')
    fid = open(statusfile,'w')
    fid.write(msg)
    fid.close()

    if WEBSPACE:
        logging.debug('web fetch_status: scp')
        output_path = os.path.join(WEBSPACE, instrument)
        os.system("scp -p -i %s %s %s/"
                  % (KEYFILE, statusfile, output_path))

def update_status(instruments):
    """
    Instrument status thread.
    Copy status text from charlotte to web server every .
    """
    logging.info("starting status for "+", ".join(instruments))
    while True:
        for i in instruments:
            try:
                fetch_status(i)
            except KeyboardInterrupt:
                raise
            except:
                logging.error(traceback.format_exc())
        time.sleep(200)

def active(instrument):
    """check web server if we are allowed to update"""
    import database
    # If running locally then generate all graphs
    if WEBSPACE is None: return True
    try:
        dbh = database.connect()
    except:
        dbh = None

    if dbh is not None:
        instr_info = database.getInstrumentInfoFromAlias(dbh, instrument)
        if instr_info is not None:
            can_mirror = database.canMirrorTime(dbh, instr_info['instrument_ID'], datetime.datetime.now())
            if can_mirror != 'Y':
                return False

    return True

class XPeekWeb(xpeek.XPeek):
    """
    Queue data notifications and plot when the plotting engine
    becomes available.
    """
    queue = Queue.Queue()
    def newdata(self, lineid):
        """Start new plot"""
        #logging.debug('Processing new data for '+self.instrument)
        self.isplottable = False
        self.current_lineid = lineid
        self.queue.put(self)

    def enddata(self, lineid):
        """End a plot; plot a peak"""
        #logging.debug('Processing end data for '+self.instrument)
        self.isplottable = True
        self.current_lineid = lineid
        self.queue.put(self)

    def newpoint(self, lineid):
        """Queue the datapoint for later processing"""
        #logging.debug('Processing new point for '+self.instrument)
        self.isplottable = True
        self.current_lineid = lineid
        self.queue.put(self)

    def plot(self):
        """
        Prepare to plot

        Because we are multithreaded, we have to acquire a lock before
        processing data outside of the XPeek data handler.  This will
        not affect newdata/enddata/newpoint since they are already
        locked, but it will mean that the plot method needs to acquire
        self.lock to protect against the data being modified by a new
        point while self is being plotted.
        """
        #logging.debug('plot lock '+self.instrument)
        self.lock.acquire()
        try:
            #logging.debug("plotting")
            self._plot(self.current_lineid)
        except:
            raise
        finally:
            #logging.debug('plot release '+self.instrument)
            self.lock.release()

    def _plot(self, lineid):
        """Figure out which plots to make"""
        if not self.isplottable:
            return

        if self.instrument == 'NG2':
            #return # Temporarily suppress HFBS since fetch is failing
            #data, filename = hfbs.fetch_current()
            #data, filename = hfbs.fetch_from_instrument(self.data[lineid].filename)
            #self.hfbs = hfbs.reduce(data,filename)
            pass
        
        #if not os.path.exists(os.path.join(TEMPDIR, self.instrument)):
        #    os.mkdir(os.path.join(TEMPDIR, self.instrument))
        file = os.path.join(TEMPDIR, self.instrument, 'live_data.json')
        #logging.debug("create %s"%(file,))

        if not active(self.instrument):
            webupdate(file, self.instrument)
            return

        try:
            #if os.path.exists(file): os.remove(file)
            line = self.data[lineid]
            fig = plot.create_figure(line)
            logging.debug("fig: %s\n attempting layout with self=%s, lineid=%s" % (str(fig),str(self),str(lineid)))
            plot.layout_figure(fig,self,lineid)
            logging.debug("fig layout: %s" % (str(fig),))
            plot.export_figure(fig,file)
            webupdate(file, self.instrument)
        except KeyboardInterrupt:
            raise
        except:
            logging.error("plotting %s\n%s\n"
                          % (self.data[lineid].filename, self.lastline)
                          + traceback.format_exc())

    def __repr__(self):
        return "XPeekWeb('%s')"%self.instrument


def _process_queue(queue):
    time.sleep(2)
    while True:
        # Block until we have something to plot
        #logging.debug("get next plot")
        ready = [queue.get()]
        # Get all queued requests, deleting the duplicates
        try:
            while True:
                # TODO: don't know how to make this interruptible
                #logging.debug("empty queue")
                next = queue.get_nowait()
                queue.task_done()
                if next not in ready: ready.append(next)
        except KeyboardInterrupt:
            thread.interrupt_main()
        except Queue.Empty:
            pass
        # Make all the plots
        #logging.debug("plotting %d"%len(ready))
        for stream in ready: 
            logging.debug("plotting "+stream.instrument)
            stream.plot()
        # Be nice to the server --- batch plot requests every 30 seconds
        #logging.debug("sleep %s"%str(PLOT_INTERVAL))
        time.sleep(PLOT_INTERVAL)

def process_queue(queue):
    logging.info('Starting plot queue')
    while True:
        try:
            _process_queue(queue)
        except KeyboardInterrupt:
            thread.interrupt_main()
        except:
            logging.error("Queue error %s", traceback.format_exc())

def listen(instruments, echo=False):
    """
    Start all instruments
    """
    if len(instruments)==0: 
        instruments = set(INSTRUMENTS)
    # Start instruments in threads
    for name in instruments:
        logging.info("starting "+name)
        xpeek = XPeekWeb(name, echo=echo)
        thread.start_new_thread(xpeek.process_stream,())

    # One thread to process the plots
    # Note: Queue blocks KeyboardInterrupt, so process_queue is not
    # a good candidate for the main thread.
    thread.start_new_thread(process_queue,(XPeekWeb.queue,))

    # Leave status instruments in main thread since it spends most of its time asleep
    update_status(STATUS_INSTRUMENTS+SANS_INSTRUMENTS)

def main(logfile=None, logmode="w", instruments=[], 
         echo=False, loglevel=logging.INFO):
    logging.basicConfig(level = loglevel,
                        format='%(asctime)s %(levelname)-8s %(message)s',
                        datefmt = '%Y-%m-%d %H:%M:%S',
                        filename = logfile, filemode=logmode)
    logging.info("starting livedata with PID=%s"%os.getpid())
    try:
        os.nice(10)
        listen(instruments, echo=echo)
    except KeyboardInterrupt:
        raise
    except:
        logging.critical(traceback.format_exc())

def debug(instruments):
    # Debug mode
    WEBSPACE = None            # Don't update server
    TEMPDIR = './'             # plots in current directory
    PLOT_INTERVAL = 1
    main(logfile=None, logmode="w", echo=True,
         instruments=instruments, loglevel=logging.DEBUG)

if __name__ == "__main__":
    debug(sys.argv[1:])
