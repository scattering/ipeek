"""
This is an XPEEK listener that forwards messages to the NICE 
SocketIO repeater on the data stream

This program requires sioclient and websocket packages to run.
"""

PROXY_PORT = 8001

#import threading
#import types
#import json
#import traceback

import sys
sys.path.append('../server/')
import numpy

import sioclient
import xpeek
import Queue
import signal

#SIO_HOST = '129.6.123.195'
SIO_HOST = 'drneutron.org'
SIO_PORT = 8001 + 2 # publish on port + 2

INSTRUMENT = "CGD"
#INSTRUMENTS = ['BT1','BT4','BT5','BT7','BT8','BT9','CGD','NGD','NG2','NG5','NSE','NG7']
INSTRUMENTS = ['CGD', 'NGD']

#repeater = sioclient.SocketIO(SIO_HOST, SIO_PORT)
#data_channel = repeater.connect('/CGD/data')
#data_channel.emit('data', {"command": "Configure"})
 
class QueuedDataChannel(sioclient.Channel):
    def emit(self, *args, **kw):
        self.socket.EmitQueue.put({'args': args, 'kw': kw})
        
class QueuedSocketIO(sioclient.SocketIO):
    def connect(self, channel, handler=None, query=None):
        """
        Connect to a channel in the socketIO server.

        Returns a connection with emit/send methods for communicating with the
        server.
        """
        self.channels[channel] = QueuedDataChannel(self, channel, handler)
        self.connection.send('1::'+channel+('?'+urlencode(query) if query else ""))
        return self.channels[channel]


class KeepAliveSIO(sioclient.SocketIO):
    def _send_heartbeat(self):
        try:
            self.connection.send('2::')
        except:
            #print 'error sending heartbeat, trying reconnect'
            self._connect()

class XPeekToSIO(xpeek.XPeek):
    """
    Queue data notifications and plot when the plotting engine
    becomes available.
    """
    #queue = Queue.Queue()
    polarized_ids = ['A', 'B', 'C', 'D']
    def __init__(self, instrument, sio_host=SIO_HOST, sio_port=SIO_PORT, debug=True, **kwargs):
        xpeek.XPeek.__init__(self, instrument, **kwargs)
        self.repeater = KeepAliveSIO(sio_host, sio_port)
        self.debug = debug
        #self.repeater = sioclient.SocketIO(sio_host, sio_port)
        #self.repeater = AutoReconnectSocketIO(sio_host, sio_port)
        #self.repeater = repeater
        self.data_channel = self.repeater.connect('/%s/data' % (instrument,))
        self.previous_lineid = ''
        #self.data_channel.emit('data', {"command": "Configure"})
    
    def newdata(self, lineid, plot_opts=None, series_opts=None):
        """Start new plot"""
        #logging.debug('Processing new data for '+self.instrument)
        plot_opts = {} if plot_opts is None else plot_opts
        series_opts = {} if series_opts is None else series_opts
        self.isplottable = False
        self.current_lineid = lineid
        #self.queue.put(self)
        runid = self.data[lineid].runid
        comment = self.data[lineid].comment
        primary = self.data[lineid].primary
        prev_pol_id = self.previous_lineid[-2:-1]
        curr_pol_id = lineid[-2:-1]
        prev_pol_index = self.polarized_ids.index(prev_pol_id) if prev_pol_id in self.polarized_ids else -1
        curr_pol_index = self.polarized_ids.index(curr_pol_id) if curr_pol_id in self.polarized_ids else -1
        if prev_pol_index < 0 or curr_pol_index < 0 or curr_pol_index <= prev_pol_index:
            if self.debug: sys.stdout.write('\t'.join(["resetting: ", str(lineid)])); sys.stdout.flush()
            self.data_channel.emit('data', {"command": "Configure", "lineid": lineid, "runid": runid, "comment": comment, "primary": primary, "plot_opts": plot_opts})
        self.previous_lineid = lineid
        if self.debug: print "new data: ", lineid, self.data[lineid].columns, runid, comment, 'column length:', len(self.data[lineid].columns.keys())
        self.data_channel.emit('data', {
            "command": "newdata", 
            "lineid": lineid, 
            "runid": runid, 
            "comment": comment, 
            "primary": primary,
            "poiss_err": True,
            "series_opts": series_opts})

    def enddata(self, lineid):
        """End a plot; plot a peak"""
        #logging.debug('Processing end data for '+self.instrument)
        self.isplottable = True
        self.current_lineid = lineid
        #self.queue.put(self)
        if self.debug: sys.stdout.write('\t'.join(["end data: ", str(lineid), str(self.data[lineid].columns)])); sys.stdout.flush()
        self.data_channel.emit('data', {"command": "enddata", "lineid": lineid})
        
        line = self.data[lineid]
        if line.peak:
            runid = self.data[lineid].runid
            comment = self.data[lineid].comment
            primary = self.data[lineid].primary
            # Annotate plot with peak parameters
            xlo,xhi=line.columns[line.primary][0],line.columns[line.primary][-1]
            x = numpy.linspace(xlo,xhi,201)
            y = line.peak(x)
            new_state = [{
                "command": "newdata",
                "lineid": lineid + '_fit', 
                "runid": runid, 
                "comment": comment, 
                "primary": primary, 
                "poiss_err": False, 
                "series_opts": {"z_index": 10, "markerOptions": {"show": False}}}]
            for xx, yy in zip(x,y):
                datapoint = {line.primary: xx, 'DATA': yy}
                new_state.append({"command": "newpoint", "lineid": lineid + '_fit', "pointdata": datapoint})
            self.data_channel.emit('data', {"command": "reset", "lineid": lineid + '_fit', "records": new_state});
            
        
    def newpoint(self, lineid):
        self.isplottable = True
        self.current_lineid = lineid
        columns = self.data[lineid].columns
        column_names = list(columns.keys())
        column_names.sort()
        datapoint = {}
        for cn in column_names:
            datapoint[cn] = columns[cn][-1]
            #print cn + ': ' + str(columns[cn][-1]),
            pass
        self.data_channel.emit('data', {"command": "newpoint", "lineid": lineid, "pointdata": datapoint, "eta": self.data[lineid].eta()})
        #print

    def __repr__(self):
        return "XPeekWeb('%s')"%self.instrument

class BT1XPeekToSIO(XPeekToSIO):
    BT1_scale = numpy.array([
        2.700,  2.479,  2.827,  2.483,  2.260,  2.347,  2.011,  1.749,
        1.630,  1.360,  1.339,  1.218,  1.058,  1.000,  1.054,  0.953,
        0.941,  0.985,  1.031,  1.021,  0.982,  1.011,  0.900,  1.118,
        0.955,  1.056,  0.973,  0.974,  0.943,  0.877,  0.872,  0.820, 
    ])
    # BT1 detector zeros in hundredths of a degree
    BT1_zeros = numpy.array([
        0.00,   1.00,   1.29,  -0.48,   1.53,  -0.98,   2.03,   0.89,
        1.54,   1.28,   0.40,   0.35,   1.53,  -1.57,   0.63,   1.43,
       -0.08,  -0.01,  -0.78,   0.16,  -1.08,  -2.08,  -1.23,  -0.47,
        0.43,  -0.27,  -2.60,   0.88,  -1.34,   2.24,   3.00,   4.00,
    ]) * 0.01
    #BT1_scale = numpy.array(BT1_scl)
    #BT1_zeros = numpy.array(BT1_z_c)*0.01
    
    def newpoint(self, lineid):
        self.isplottable = True
        self.current_lineid = lineid
        #################################################
        # from ipeek.plot:
        all_counts = numpy.array(self.data[lineid].columns['DATA']) * self.BT1_scale
        #print "all_counts shape: ", all_counts.shape
        i = all_counts.shape[0] - 1
        #counts *= self.BT1_scale
        a04 = self.data[lineid].columns['A04'][-1]
        #print "A04: ", a04
        #print "A04 shape: ", numpy.array(self.data[lineid].columns['A04']).shape

        x = a04 + 5*numpy.arange(len(self.BT1_zeros)) - self.BT1_zeros
        y = all_counts[i] * self.BT1_scale
        
        #################################################
        columns = self.data[lineid].columns
        column_names = list(columns.keys())
        column_names.sort()
        datapoint = {}
        eta = self.data[lineid].eta()
        for cn in column_names:
            if cn not in ['DATA', 'A04']:
                datapoint[cn] = columns[cn][-1]
                #print cn + ': ' + str(columns[cn][-1]),
        runid = self.data[lineid].runid
        comment = self.data[lineid].comment
        primary = self.data[lineid].primary
        #self.data_channel.emit('data', {"command": "newdata", "lineid": lineid + str(i), "runid": runid, "comment": comment, "primary": primary})
        for i, (xx, yy) in enumerate(zip(x,y)):
            datapoint['DATA'] = yy
            datapoint['A04'] = xx
            self.data_channel.emit('data', {"command": "newpoint", "lineid": lineid + '_%02d' % (i,), "pointdata": datapoint, "eta": eta})
            
        #self.data_channel.emit('data', {"command": "newpoint", "lineid": lineid, "pointdata": datapoint, "eta": self.data[lineid].eta()})
        
        
    def newdata(self, lineid, plot_opts=None):
        plot_opts = {"legend": {"show": False}}
        lineids = [lineid + '_%02d' % (i,) for i in range(len(self.BT1_scale))]
        runid = self.data[lineid].runid
        comment = self.data[lineid].comment
        primary = self.data[lineid].primary
        
        print "resetting: ", lineid
        self.data_channel.emit('data', {"command": "Configure", "lineid": lineid, "runid": runid, "comment": comment, "primary": primary, "plot_opts": plot_opts})
        
        for li in lineids:
            self.data_channel.emit('data', {"command": "newdata", "lineid": li, "runid": runid, "comment": comment, "primary": primary})
    

#path='/CGD'
#repeater.connect(path+"/data"), shutdown_signal)


def shutdown(signum, frame):
    #print "shutting down", signum, frame
    sys.exit(1)

def main(debug=False):
    #xpeekpusher = XPeekToSIO(INSTRUMENT)
    #xpeekpusher.process_stream()
    import threading
    threads = []
    pushers = []
    for instrument in INSTRUMENTS:
        sys.stdout.write('trying to add' + repr(instrument) + '...\n')
        #if instrument == 'BT1':
        if 0: #disable BT1 pusher for now
            pusher = BT1XPeekToSIO(instrument)
        else:
            pusher = XPeekToSIO(instrument, debug=debug)
        pushers.append(pusher)
        new_thread = threading.Thread(target=pusher.process_stream)
        threads.append(new_thread)
        new_thread.start()
        sys.stdout.write(repr(pusher))
        sys.stdout.flush()
        
        
        
    #signal.signal(signal.SIGTERM, shutdown)
    for t in threads:
        t.join()
        
if __name__ == '__main__':
    main(debug=True)
