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

source_host = "solo.ncnr.nist.gov"                  #hard-coded
source_path = "/var/ftp"
source_port = 22

sources = [
    {"name": "DCS", 
     "root_dir": "/home/NIST/ncnr/",
     "live_datapath":"livedata",
     "live_dataname": "livedata.dcs.gz"},
]

output = {}
output_filelike = {}

local_path = "~/.livedata/DCS/"

dest_host = "webster.ncnr.nist.gov"                    #hard-coded
dest_port = 22

# I have a different key for pushing to webster.
dest_pkey = paramiko.RSAKey(filename='/home/bbm/.ssh/datapushkey')
dest_username = "bbm"


# writing a list of the last file in Javascript format to a file
json_filename = 'live_data.json'

if RETRIEVE_METHOD == "ssh":
    source_transport = paramiko.Transport((source_host, source_port))
    source_pkey = paramiko.RSAKey(filename="/home/bbm/.ssh/datapullkey")
    source_username = "ncnr"
    source_transport.connect(username=source_username, pkey = source_pkey)
    source_sftp = paramiko.SFTPClient.from_transport(source_transport)
    
for source in sources:
    live_dataname = source['live_dataname']
    live_datapath = source['live_datapath']
    root_dir = source['root_dir']
    name = source['name']
    #print "live data modified:", source_sftp.file(live_dataname).stat().st_mtime
    
    #live_data = StringIO.StringIO()
    live_data = open(os.path.join(local_path, live_dataname), 'wb')
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
        f = source_sftp.open(os.path.join(root_dir, live_datapath, live_dataname))
        response = f.read()
        f.close()
        live_data.write(response)
        
    else:
        print "no valid RETRIEVE_METHOD"
      
    #live_data.seek(0) # move back to the beginning of file
    live_data.close()
    
    files = [live_dataname,]

    # here I import the library that reads in SANS files:
    from plot_dcs import process_raw_dcs
    json_data = process_raw_dcs(local_path)
    
    output[name] = json_data
    
    dest_transport = paramiko.Transport((dest_host, dest_port))
    dest_transport.connect(username = dest_username, pkey = dest_pkey)
    dest_sftp = paramiko.SFTPClient.from_transport(dest_transport)
   
    name = source['name']

    # now I push that file outside the firewall to webster:
    remotepath = os.path.join('ipeek', 'data', name, json_filename)

    f = dest_sftp.open(remotepath, 'w')
    f.write(output[name])
    f.close()

    dest_sftp.close()
    dest_transport.close()
#print 'Upload done.'
