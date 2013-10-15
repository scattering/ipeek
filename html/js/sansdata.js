// requires jspack.js

// readNCNRSensitivity: to be converted to JS another day...
/*
def readNCNRSensitivity(inputfile):
    
    if hasattr(inputfile, 'read'):
        data = inputfile.read()
    else:
        data = open(inputfile, 'rb').read()
    
    //skip the fake header and just read the data
    //data is 32bit VAX floats
    dataformatstring = '<65600s'
    //print len(data[516:])
    (rawdatastring,) = struct.unpack(dataformatstring,data[516:])
    
    detdata = numpy.empty(16384)
    
    a = 0
    offset = 0
    for ii in range(16):
        for jj in range(511):
            if jj == 0:
                print rawdatastring[offset:offset+4]
            detdata[a] = vaxutils.R4toFloat(rawdatastring[offset:offset+4])
            a += 1
            offset += 4
        
        offset += 2
        
        for kk in range(510):
	        detdata[a] = vaxutils.R4toFloat(rawdatastring[offset:offset+4])
	        a += 1
	        offset += 4
        
        offset += 2
    
    for ii in range(48):
        detdata[a] = vaxutils.R4toFloat(rawdatastring[offset:offset+4])
        a += 1
        offset += 4
    
    detdata.resize(128,128)
    
    return detdata
*/

function readNCNRData(data, filename){
    
    var metadata = {};
    metadata['run.filename'] = (filename == null) ? "" : filename;
    
    //filename
    var dat = exports.jspack.Unpack('<21s', data, 2) // [2:23]
    //filename = dat[0].replace(' ','')
    
    //metadata
    var reals = {}
    
    var formatstring = '<4i4s4s4s4s20s3s11s1s8s' //run
    formatstring += '60s4s4s4s4s3i4s4s2i6s6s' //sample
    formatstring += '6s4s4s4s4s4s4s2i4s4s4s4s4s4s4s' //det
    formatstring += '4s4s4s4s4s4s' //resolution
    formatstring += 'L2i' //tslice
    formatstring += 'L4s4s4s2i' //temp
    formatstring += '2L4s4s4s4s4s' //magnet
    formatstring += '4s4s' //bmstp
    formatstring += '3i4s4s4s4s42s' //params
    formatstring += 'L4s4si' //voltage
    formatstring += '2L4s4s' //polarization
    formatstring += '4i4s4s4s4s4s' //analysis
    
    //print struct.calcsize(formatstring)
    var metadata_order = [
      [metadata, 'run.npre'],
      [metadata, 'run.ctime'],
      [metadata, 'run.rtime'],
      [metadata, 'run.numruns'],
      [reals, 'run.moncnt'],
      [reals, 'run.savmon'],
      [reals, 'run.detcnt'],
      [reals, 'run.atten'],
      [metadata, 'run.datetime'],
      [metadata, 'run.type'],
      [metadata, 'run.defdir'],
      [metadata, 'run.mode'],
      [metadata, 'run.reserve'],
      [metadata, 'sample.labl'],
      [reals, 'sample.trns'],
      [reals, 'sample.thk'],
      [reals, 'sample.position'],
      [reals, 'sample.rotang'],
      [metadata, 'sample.table'],
      [metadata, 'sample.holder'],
      [metadata, 'sample.blank'],
      [reals, 'sample.temp'],
      [reals, 'sample.field'],
      [metadata, 'sample.tctrlr'],
      [metadata, 'sample.magnet'],
      [metadata, 'sample.tunits'],
      [metadata, 'sample.funits'],
      [metadata, 'det.typ'],
      [reals, 'det.calx1'],
      [reals, 'det.calx2'],
      [reals, 'det.calx3'],
      [reals, 'det.caly1'],
      [reals, 'det.caly2'],
      [reals, 'det.caly3'],
      [metadata, 'det.num'],
      [metadata, 'det.spacer'],
      [reals, 'det.beamx'],
      [reals, 'det.beamy'],
      [reals, 'det.dis'],
      [reals, 'det.ang'],
      [reals, 'det.siz'],
      [reals, 'det.bstop'],
      [reals, 'det.blank'],
      [reals, 'resolution.ap1'],
      [reals, 'resolution.ap2'],
      [reals, 'resolution.ap12dis'],
      [reals, 'resolution.lmda'],
      [reals, 'resolution.dlmda'],
      [reals, 'resolution.save'],
      [metadata, 'tslice.slicing'],
      [metadata, 'tslice.multfact'],
      [metadata, 'tslice.ltslice'],
      [metadata, 'temp.printemp'],
      [reals, 'temp.hold'],
      [reals, 'temp.err'],
      [reals, 'temp.blank'],
      [metadata, 'temp.extra'],
      [metadata, 'temp.reserve'],
      [metadata, 'magnet.printmag'],
      [metadata, 'magnet.sensor'],
      [reals, 'magnet.current'],
      [reals, 'magnet.conv'],
      [reals, 'magnet.fieldlast'],
      [reals, 'magnet.blank'],
      [reals, 'magnet.spacer'],
      [reals, 'bmstp.xpos'],
      [reals, 'bmstp.ypos'],
      [metadata, 'params.blank1'],
      [metadata, 'params.blank2'],
      [metadata, 'params.blank3'],
      [reals, 'params.trsncnt'],
      [reals, 'params.extra1'],
      [reals, 'params.extra2'],
      [reals, 'params.extra3'],
      [metadata, 'params.reserve'],
      [metadata, 'voltage.printvolt'],
      [reals, 'voltage.volts'],
      [reals, 'voltage.blank'],
      [metadata, 'voltage.spacer'],
      [metadata, 'polarization.printpol'],
      [metadata, 'polarization.flipper'],
      [reals, 'polarization.horiz'],
      [reals, 'polarization.vert'],
      [metadata, 'analysis.rows1'],
      [metadata, 'analysis.rows2'],
      [metadata, 'analysis.cols1'],
      [metadata, 'analysis.cols2'],
      [reals, 'analysis.factor'],
      [reals, 'analysis.qmin'],
      [reals, 'analysis.qmax'],
      [reals, 'analysis.imin'],
      [reals, 'analysis.imax'] // = struct.unpack(formatstring,data[23:514])
    ];
    var raw_metadata = exports.jspack.Unpack(formatstring, data, 23);
    
    var obj, key;
    for (var i=0; i<metadata_order.length; i++) {
        obj = metadata_order[i][0];
        key = metadata_order[i][1];
        obj[key] = raw_metadata[i];
    }

    
    //Process reals into metadata
    for (k in reals) {
        metadata[k] = R4toFloat(reals[k]);
    }
    
    var dataformatstring = '<16401h';
    rawdata = exports.jspack.Unpack(dataformatstring, data, 514);
    
    //detdata = numpy.empty(16384) // don't need to initialize javascript arrays
    var detdata = [];
    var ii=0;
    var skip=0;
    while(ii < 16384) {
        if(((ii+skip) %1022)==0) {
            skip+=1;
        }
        //detdata[ii] = I2Decompress(rawdata[ii+skip]);
        detdata.push(I2Decompress(rawdata[ii+skip]));
        ii+=1;
    }
    
    // detdata.resize(128,128)
    
    return [detdata, metadata, rawdata]
}

function I2Decompress(val) {
    // Take a 'compressed' I*2 value and convert to I*4.
    //   
    // Code taken from IGOR Pro macros by SRK. VAX Fortran code is ultimate source (RW_DATAFILE.FOR)"""
    
    var ib=10
    var nd=4
    var ipw = Math.pow(ib,nd)
    if (val <= -ipw) {
        var npw = trunc(-val/ipw);
        var val = (-val % ipw)*(Math.pow(ib,npw));
        return val
    } else {
        return val
    }
}

function arrayI2Decompress(datarray) {
    // Apply the I2 to I4 decompression routine to a whole array 
    for (var i=0; i<datarray.length; i++) {
        datarray[i] = I2Decompress(datarray[i])
    }
    return datarray
}

function trunc(val) {
    // Return the integer closest to the supplied value in the direction of zero
    
    if (val < 0) {
        return Math.ceil(val);
    } else if (val > 0) {
        return Math.floor(val);
    } else {
        return val
    }
}

function R4toFloat(vaxasstring) {
    //  Takes a 4 character string represention of a VAX REAL*4 from struct.unpack
    //       and returns a float	
    var ieeeasbytes;
    if (vaxasstring.charCodeAt(1) == 0) {
        ieeeasbytes = [vaxasstring.charCodeAt(2), vaxasstring.charCodeAt(3), vaxasstring.charCodeAt(0), vaxasstring.charCodeAt(1)];
    } else {
        ieeeasbytes = [vaxasstring.charCodeAt(2), vaxasstring.charCodeAt(3), vaxasstring.charCodeAt(0), vaxasstring.charCodeAt(1)-1];
    }
    return exports.jspack.Unpack('<f',ieeeasbytes)[0]
}

function get_plottable(data_metadata) { 
    var data = data_metadata[0];
    var zmin = Math.min.apply(Math, data);
    var zmax = Math.max.apply(Math, data),
    data = reshape(data, 128, 128);
    var metadata = data_metadata[1];
    
    //zmin = self.data.x[self.data.x > 1e-10].min()
    var plottable_data = {
        'type': '2d',
        'z':  [data],
        'title': metadata['run.filename']+': ' + metadata['sample.labl'],
        'metadata': metadata,
        'options': {
            'fixedAspect': {
                'fixAspect': true,
                'aspectRatio': 1.0
            }
        },
        'dims': {
            'xmax': 128,
            'xmin': 0.0, 
            'ymin': 0.0, 
            'ymax': 128,
            'xdim': 128,
            'ydim': 128,
            'zmin': zmin,
            'zmax': zmax,
            },
        'xlabel': 'X',
        'ylabel': 'Y',
        'zlabel': 'Intensity (I)',
        };
    //out = simplejson.dumps(plottable_data,sort_keys=True)
    return plottable_data;
}

function reshape(data, dim0, dim1) {
    var l = data.length;
    var m=0;
    var row, out=[];
    var d0, d1;
    for (m=0; m < l; m+=dim1) {
        out.push(data.slice(m, m+dim1));
    }
    return out;
}

