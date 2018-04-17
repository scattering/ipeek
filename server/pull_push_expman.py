import glob
import os
import sys
sys.path.append('/var/www/')
sys.path.append('/home/bbm/')
import paramiko
import urllib2, ftplib
import time
import StringIO
import json

DEBUG = False
RETRIEVE_METHOD = "ssh" # or "ftp" or "urllib"
MAX_FTP_RETRIES = 5
HOST_PORT = 22
DEFAULT_PATH = "/usr/local/nice/server_data/experiments/manifest/experiment_manifest.backup"

sources = [
     {"name": "NSE", 
      "host_name": "echo.ncnr.nist.gov"},
     {"name": "MAGIK",
      "host_name": "magik.ncnr.nist.gov"},
     {"name": "NG7",
      "host_name": "ng7refl.ncnr.nist.gov"},
     {"name": "PBR",
      "host_name": "pbr.ncnr.nist.gov"},
     {"name": "NGBSANS",
      "host_name": "ngbsans.ncnr.nist.gov"},
     {"name": "NGB30SANS",
      "host_name": "ngb30sans.ncnr.nist.gov"},
     {"name": "NG7SANS",
      "host_name": "ng7sans.ncnr.nist.gov"},
     {"name": "PHADES",
      "host_name": "cts.ncnr.nist.gov"},
     {"name": "VSANS",
      "host_name": "vsans.ncnr.nist.gov"},
]
output = {}
output_filelike = {}

#local_path = "/home/bbm/.livedata/DCS/"

dest_host = "webster.ncnr.nist.gov"                    #hard-coded
dest_port = 22

# I have a different key for pushing to webster.
dest_pkey = paramiko.RSAKey(filename='/home/bbm/.ssh/datapushkey')
dest_username = "bbm"

def retrieve_ftp(source_host, source_port, file_path, output_buffer, username):
    ftp = ftplib.FTP(source_host)
    ftp.login('anonymous')
    live_datapath = os.path.dirname(file_path)
    live_dataname = os.path.basename(file_path)
    ftp.cwd(live_datapath)
    ftp.retrbinary("RETR " + live_dataname, output_buffer.write)
    ftp.close()
    
def retrieve_ssh(source_host, source_port, file_path, output_buffer, username):
    source_transport = paramiko.Transport((source_host, source_port))
    source_transport.window_size = 2147483647
    source_transport.use_compression(True)
    source_pkey = paramiko.RSAKey(filename="/home/bbm/.ssh/datapullkey")
    source_username = username
    source_transport.connect(username=source_username, pkey = source_pkey)
    source_sftp = paramiko.SFTPClient.from_transport(source_transport)
    if DEBUG:
        print("starting read:", name, os.path.basename(file_path))
    f = source_sftp.open(file_path)
    response = f.read()
    f.close()
    if DEBUG:
        print("ending read:", name, os.path.basename(file_path))
    output_buffer.write(response)
    if DEBUG:
        print("ending stringIO:", name, os.path.basename(file_path))
        
def retrieve_urllib(source_host, source_port, file_path, output_buffer, username):
    req_addr = os.path.join("ftp://" + source_host, live_datapath, live_dataname)
    #req = urllib2.Request(req_addr)
    response = None
    retries = 0
    while retries < MAX_FTP_RETRIES:
        try:
            response = urllib2.urlopen(req_addr)
            break
        except:
            print("failed attempt %d to retrieve %s: trying again" % (retries, req_addr))
        retries += 1
            
    if response is None: return
    if DEBUG:
        print("retrieved %s" % (req_addr))
    output_buffer.write(response.read())
    

retrievers = {
    "ssh": retrieve_ssh,
    "urllib": retrieve_urllib,
    "ftp": retrieve_ftp
}
    
def strip_header(manifest):
    json_start = manifest.find('[')
    return manifest[json_start:]

def strip_emails(manifest):
    manifest_obj = json.loads(manifest)
    for expt in manifest_obj:
        expt['value']['value'].pop('emails', None)
    return json.dumps(manifest_obj)

def strip_emails_and_proprietary(manifest):
    manifest_obj = json.loads(manifest)
    for i, expt in enumerate(manifest_obj):
        if expt['value']['value'].get('publish', '') != 'NORMAL':
            manifest_obj.pop(i)
        else:
            expt['value']['value'].pop('emails', None)
    return json.dumps(manifest_obj)
        
filters = [strip_header, strip_emails_and_proprietary]

for source in sources:
    retrieve_method = source.get('retrieve_method', RETRIEVE_METHOD)
    name = source['name']
    username = source.get('username', 'ncnr')
    source_host = source['host_name']
    source_port = source.get('host_port', HOST_PORT)
    live_datapath = source.get('manifest_path', DEFAULT_PATH)
    try:
        live_data = StringIO.StringIO()
        retriever = retrievers.get(retrieve_method, lambda *args: None)
        retriever(source_host, source_port, live_datapath, live_data, username)
        live_data.seek(0) # move back to the beginning of file
        output.setdefault(name, {})
        filename = os.path.basename(live_datapath)
        result = live_data.read()
        for f in filters:
            result = f(result)
        output[name][filename] = result
            
    except Exception as e:
        if DEBUG:
            print "could not connect to %s because of %s\n" % (name,str(e))

# Now initialize the transfer to the destination:    
dest_transport = paramiko.Transport((dest_host, dest_port))
dest_transport.connect(username = dest_username, pkey = dest_pkey)
dest_transport.window_size = 2147483647
dest_transport.use_compression(True)
dest_sftp = paramiko.SFTPClient.from_transport(dest_transport)

for name in output:   
    #name = source['name']
    
    for json_filename in output[name].keys():    
        # now I push that file outside the firewall to webster:
        remote_tmp = os.path.join('ipeek_html', 'data', name, json_filename + ".tmp")
        remotedir  = os.path.join('ipeek_html', 'data', name)
        remotepath = os.path.join('ipeek_html', 'data', name, json_filename)
        if DEBUG:
                print "starting write:", name,  json_filename
        f = dest_sftp.open(remote_tmp, 'w')
        f.write(output[name][json_filename])
        f.close()
        if json_filename in dest_sftp.listdir(remotedir):
            dest_sftp.unlink(remotepath)
        dest_sftp.rename(remote_tmp, remotepath)
        if DEBUG:
                print "ending write:", name,  json_filename

dest_sftp.close()
dest_transport.close()
#print 'Upload done.'
