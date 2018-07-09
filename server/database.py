import pymysql.cursors
import datetime

import db_config as config

def connect():
    connection = pymysql.connect(
        host=config.DB_HOST, 
        user=config.DB_USER, 
        password=config.DB_PASSWORD, 
        db=config.DB_NAME, 
        charset='utf8mb4', 
        cursorclass=pymysql.cursors.DictCursor)
    
    cursor = connection.cursor()
    return cursor

def getInstrumentInfoFromAlias(dbh, alias):
    dbh.execute("SELECT * FROM `instrument` WHERE alias LIKE %s", alias)
    return dbh.fetchone()
    
def getInstrumentInfoFromHostname(dbh, hostname):
    dbh.execute("SELECT * FROM `instrument` WHERE hostname LIKE %s", hostname)
    return dbh.fetchone()
    
def findRxCycle (dbh, date=None):
    # use now if date is not defined
    if date is None:
        date = datetime.datetime.now()
    dbh.execute("SELECT rxcycle FROM rxcycle WHERE %s > startdate ORDER BY startdate DESC LIMIT 1", date)
    return dbh.fetchone()

def canMirror(dbh, experiment_id):
    mirror = 'N'
    ##### NCM: Uncomment to flip mirror behavior 7/7/2010
    # my $mirror = 'Y';
    dbh.execute("SELECT mirror FROM experiment WHERE experiment_id = %s", experiment_id)
    result = dbh.fetchall()
    if len(result) > 0:
        mirror = result[0]['mirror']
    return mirror
    
def canMirrorTime(dbh, instrument_id, startdate):
    # my $mirror = 'N';
    ##### NCM: Uncomment to flip mirror behavior 7/7/2010
    mirror = 'Y'
    dbh.execute("SELECT mirror FROM mirror WHERE instrument_id = %s and startdate < %s and enddate > %s", (instrument_id, startdate, startdate))
    result = dbh.fetchall()
    if len(result) > 0:
        mirror = result[0]['mirror']
    return mirror
    
    
def writeRunInfo (dbh, runinfo):
    """ runinfo: a dict with required keys:
        "filename", "experiment_id", "instrument_id"...
    """
    query = """INSERT file (filename,experiment_ID,rxcycle_ID,
                             instrument_ID,startdate,duration,
                             sourcedir,localdir,comments, mirror)
                VALUES (%(filename)s,%(experiment_id)s,%(rxcycle_id)s,
                        %(instrument_id)s,%(startdate)s,%(duration)s,
                        %(sourcedir)s,%(localdir)s,%(comments)s,%(mirror)s)"""
                        
    dhb.execute(query, runinfo)
