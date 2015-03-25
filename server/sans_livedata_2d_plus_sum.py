import glob
import os
import sys
sys.path.append('/var/www/')
sys.path.append('/home/bbm/')
import paramiko
import urllib2, ftplib
import time
import StringIO

RETRIEVE_METHOD = "ssh" # or "ftp" or "urllib"
MAX_FTP_RETRIES = 5

source_host = "charlotte.ncnr.nist.gov"                  #hard-coded
source_path_to_ftp = "/var/ftp"
source_port = 22

sources = [
    {"name": "NG7SANS", 
     "root_dir": "/var/ftp/pub/ncnrdata/ng7sans/",
     "live_datapath":"pub/sansdata/NG7Current/",
     "live_dataname": "live001.sa3_ice_a001"},
    {"name": "NGB30SANS", 
     "root_dir": "/var/ftp/pub/ncnrdata/ng3sans/",
     "live_datapath":"pub/sansdata/NGB30Current/",
     "live_dataname": "live001.sa3_ice_a001"},
    {"name": "NGBSANS", 
     "root_dir": "/var/ftp/pub/ncnrdata/ngbsans/",
     "live_datapath":"pub/sansdata/NGBCurrent/",
     "live_dataname": "live001.sa3_ice_a001"},
]

output = {}
output_filelike = {}

if RETRIEVE_METHOD == "ssh":
    source_host = "charlotte.ncnr.nist.gov"
    source_port = 22
    source_transport = paramiko.Transport((source_host, source_port))
    source_pkey = paramiko.RSAKey(filename="/home/bbm/.ssh/datapullkey")
    source_username = "bbm"
    source_transport.connect(username=source_username, pkey = source_pkey)
    source_sftp = paramiko.SFTPClient.from_transport(source_transport)
    
for source in sources:
    live_dataname = source['live_dataname']
    live_datapath = source['live_datapath']
    root_dir = source['root_dir']
    name = source['name']
    #print "live data modified:", source_sftp.file(live_dataname).stat().st_mtime
    
    live_data = StringIO.StringIO()
    if RETRIEVE_METHOD == "urllib":       
        req_addr = os.path.join("ftp://" + source_host, live_datapath, live_dataname)
        #req = urllib2.Request(req_addr)
        response = None
        retries = 0
        while retries < MAX_FTP_RETRIES:
            try:
                response = urllib2.urlopen(req_addr)
                break
            except:
                print "failed attempt %d to retrieve %s: trying again" % (retries, req_addr)
            retries += 1
        
                
        if response is None: continue
        print "retrieved %s" % (req_addr)
        live_data.write(response.read())
    
    elif RETRIEVE_METHOD == "ftp":
        ftp = ftplib.FTP(source_host)
        ftp.login('anonymous')
        ftp.cwd(live_datapath)
        ftp.retrbinary("RETR " + live_dataname, live_data.write)
        ftp.close()
        
    elif RETRIEVE_METHOD == "ssh":
        f = source_sftp.open(os.path.join('/var/ftp', live_datapath, live_dataname))
        response = f.read()
        f.close()
        live_data.write(response)
        
    else:
        print "no valid RETRIEVE_METHOD"
      
    live_data.seek(0) # move back to the beginning of file
    
    files = [live_dataname,]

    # here I import the library that reads in SANS files:
    from dataflow.reduction.sans import filters
    plottables =  []
    sansdata = filters.read_sample(live_dataname, file_obj=live_data)
    plottables.append(sansdata.get_plottable())
    if sansdata.metadata['resolution.lmda'] == 0: sansdata.metadata['resolution.lmda'] = 1.0;
    sans_q = filters.convert_q(sansdata)
    annular_data = filters.annular_av(sans_q)
    plottables.append(annular_data.get_plottable())
    
    #for fn in files:
    #    file_obj = source_sftp.file(fn)
    #    sansdata = filters.read_sample(fn, file_obj=file_obj)
    #    #sans_q = filters.convert_q(sansdata)
    #    #annular_data = filters.annular_av(sans_q)
    #    #plottables.append(annular_data.get_plottable())
    #    plottables.append(sansdata.get_plottable())
    json_data = '[' + ','.join(plottables) + ']'
    output[name] = json_data

dest_host = "webster.ncnr.nist.gov"                    #hard-coded
dest_port = 22
dest_transport = paramiko.Transport((dest_host, dest_port))

# I have a different key for pushing to webster.
dest_pkey = paramiko.RSAKey(filename='/home/bbm/.ssh/datapushkey')
dest_username = "bbm"
dest_transport.connect(username = dest_username, pkey = dest_pkey)
dest_sftp = paramiko.SFTPClient.from_transport(dest_transport)

# writing a list of the last file in Javascript format to a file
json_filename = 'live_data.json'

for source in sources:
    name = source['name']

    # now I push that file outside the firewall to webster:
    remotepath = os.path.join('ipeek_html', 'data', name, json_filename)

    f = dest_sftp.open(remotepath, 'w')
    f.write(output[name])
    f.close()

dest_sftp.close()
dest_transport.close()
#print 'Upload done.'
