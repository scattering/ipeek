//// from icpformat.py
/*
class ICP(object):
    def __init__(self, path):
        self.path = path

    def readheader1(self, file):
        """
        Read the tow line summary at the start of the ICP data files.
        """

        tokens = get_quoted_tokens(file)
        self.filename = tokens[0]
        stamp = datetime.datetime(2000, 1, 1) # need this to call strptime
        self.date = stamp.strptime(tokens[1], '%b %d %Y %H:%M')
        self.scantype = tokens[2]
        self.prefactor = float(tokens[3])
        self.monitor = float(tokens[4])
        self.count_type = tokens[5]
        self.points = int(tokens[6])
        self.data_type = tokens[7]

        #skip over names of fields
        file.readline()

        #comment and polarization
        line = file.readline()
        polarized_index = line.find("F1: O", 52)
        if polarized_index > 0:
            self.comment = line[:polarized_index].rstrip()
            F1 = '+' if line.find("F1: ON", 52) > 0 else '-'
            F2 = '+' if line.find("F2: ON", 52) > 0 else '-'
            self.polarization = F1 + F2
        else:
            self.comment = line.rstrip()
            self.polarization = ""


    def readiheader(self, file):
        """
        Read I-buffer structure, excluding motors.
        """

        # Read in fields and field names
        tokenized = get_tokenized_line(file)
        fieldnames = file.readline()
        #print tokenized
        #print fieldnames

        #Collimation    Mosaic    Wavelength   T-Start   Incr.   H-field #Det
        self.collimations = [float(s) for s in tokenized[0:4]]
        self.mosaic = [float(s) for s in tokenized[4:7]]
        self.wavelength = float(tokenized[7])
        self.Tstart = float(tokenized[8])
        self.Tstep = float(tokenized[9])
        self.Hfield = float(tokenized[10])

    def readrheader(self, file):
        """
        Read R-buffer structure, excluding motors.
        """
        # Read in fields and field names
        tokenized = get_tokenized_line(file)
        fieldnames = file.readline()
        #print tokenized
        #print fieldnames

        #Mon1    Exp   Dm      Wavel  T-Start  Incr. Hf(Tesla) #Det SclFac
        self.Mon1 = float(tokenized[0])
        self.Exp = float(tokenized[1])
        self.Dm = float(tokenized[2])
        self.wavelength = float(tokenized[3])
        self.Tstart = float(tokenized[4])
        self.Tstep = float(tokenized[5])
        self.Hfield = float(tokenized[6])
        self.numDet = float(tokenized[7])
        self.SclFac = float(tokenized[8])

    def readqheader(self, file):
        """
        Read Q-buffer structure (also works for T-buffer).
        """
        #experiment info
        tokenized = get_tokenized_line(file)
        self.collimations = [float(s) for s in tokenized[0:4]]
        self.mosaic = [float(s) for s in tokenized[4:7]]
        orient1 = [float(s) for s in tokenized[7:10]]
        #ignore the "angle" field
        orient2 = [float(s) for s in tokenized[11:14]]
        #skip line with field names
        file.readline()
        tokenized = get_tokenized_line(file)
        lattice = Lattice()
        lattice.a = float(tokenized[0])
        lattice.b = float(tokenized[1])
        lattice.c = float(tokenized[2])
        lattice.alpha = float(tokenized[3])
        lattice.beta = float(tokenized[4])
        lattice.gamma = float(tokenized[5])
        self.lattice = lattice
        #skip line with field names
        file.readline()
        tokenized = get_tokenized_line(file)
        self.ecenter = float(tokenized[0])
        self.deltae = float(tokenized[1])
        self.ef = float(tokenized[2])
        self.monochromator_dspacing = float(tokenized[3])
        self.analyzer_dspacing = float(tokenized[4])
        self.tstart = float(tokenized[5])
        self.tstep = float(tokenized[6])
        tokenized = get_tokenized_line(file)
        self.Efixed = tokenized[4]
        tokenized = get_tokenized_line(file)
        self.qcenter = [float(s) for s in tokenized[0:3]]
        self.qstep = [float(s) for s in tokenized[3:6]]
        self.hfield = float(tokenized[6])
        #skip line describing fields
        file.readline()

    def check_wavelength(self, default, overrides):
        """
        ICP sometimes records the incorrect wavelength in the file.  Make
        sure the right value is being used.  Be annoying about it so that
        if the wavelength was changed for a legitimate reason the user can
        override.  L is the value in the file.  dectector.wavelength should
        already be set to the default for the instrument.
        """
        dataset = self.filename[:5]
        wavelength = self.wavelength
        if dataset in overrides:
            # yuck! If already overridden for a particular file in
            # a dataset, override for all files in the dataset.
            wavelength = overrides[dataset]
            message("Using wavelength %s for %s" % (wavelength, dataset))
        elif wavelength == 0:
            # yuck! If stored value is 0, use the default
            wavelength = default
            message("Using default wavelength %s for %s"\
                    % (wavelength, self.path))
        elif abs(default - wavelength) / default > 0.01:
            # yuck! Value differs significantly from the default
            if question("ICP recorded a wavelength of %s in %s. \
    Do you want to use the default wavelength %s instead?"\
              % (wavelength, self.path, default)):
                wavelength = default
        # Regardless of how the value was obtained, use that value for
        # the entire dataset
        return wavelength


    def readmotors(self, file):
        """
        Read the 6 motor lines, returning a dictionary of
        motor names and start-step-stop values.
        E.g.,

        M = _readmotors(file)
        print M['a1'].start
        """
        self.motor = MotorSet()
        while True:  # read until 'Mot:' line
            words = get_tokenized_line(file)
            if words[0] == 'Mot:': break
            motor = Motor()
            motor.start = float(words[1])
            motor.step = float(words[2])
            motor.stop = float(words[3])
            name = words[0] if not words[0].isdigit() else 'a' + words[0]
            setattr(self.motor, name, motor)

    def readcolumnheaders(self, file):
        """
        Get a list of column names. Transform the names of certain
        columns to make our lives easier elsewhere:
              #1 COUNTS -> counts
              #2 COUNTS -> counts2
              MON -> monitor
              MIN -> time
              Q(x) -> qx, Q(y) -> qy, Q(z) -> qz
        All column names are uppercase.
        """
        line = file.readline()
        line = line.lower()
        for (old, new) in (('#1 counts', 'counts'),
                          ('#2 counts', 'counts2'),
                          (' mon ', ' monitor '),
                          (' min ', ' time '),
                          ('(', ''),
                          (')', ''),
                          ):
            line = line.replace(old, new)
        self.columnnames = line.split()


    def readcolumns(self, file):
        '''
        Read and parse ICP data columns listed in columns.  Return a dict of
        column name: vector.  If using a position sensitive detector, return
        an array of detector values x scan points.
        '''
        values, detector = readdata(file)
        self.column = ColumnSet()
        for (c, v) in zip(self.columnnames, values.T):
            setattr(self.column, c, v)
        self.detector = detector
        self.counts = detector if detector.size > 0 else self.column.counts
        self.points = len(self.column.counts)

    def genmotorcolumns(self):
        """
        Generate vectors for each of the motors if a vector is not
        already stored in the file.
        """
        if self.scantype in ['T']: return  # Skip motor generation for now for 'T'
        for (M, R) in self.motor.__dict__.iteritems():
            if not hasattr(self.column, M):
                if R.step != 0.:
                    vector = N.arange(R.start, R.step, R.stop)
                    # truncate to number of points measured
                    vector = vector[:self.points] + 0
                else:
                    vector = R.start * N.ones(self.points)
                setattr(self.column, M, vector)
        pass

    def parseheader(self, file):
        """
        Read and parse ICP header information
        """
        # Determine FileType
        self.readheader1(file)
        if self.scantype == 'I':
            self.readiheader(file)
            self.readmotors(file)
        elif self.scantype in ['Q', 'T']:
            self.readqheader(file)
        elif self.scantype == 'B':
            self.readqheader(file)
            self.readmotors(file)
        elif self.scantype == 'R':
            self.readrheader(file)
            self.readmotors(file)
        else:
            raise ValueError, "Unknown scantype %s in ICP file" % self.scantype
        self.readcolumnheaders(file)

    def summary(self):
        """
        Read header from file, setting the corresponding attributes the ICP object
        """
        file = gzopen(self.path)
        self.parseheader(file)
        data1 = file.readline()
        data2 = file.readline()
        self.PSD = (',' in data2)
        file.close()
        

    def read(self):
        """
        Read header and data from file, setting the corresponding attributes the ICP object
        """
        file = gzopen(self.path)
        self.parseheader(file)

        #read columns and detector images if available
        self.readcolumns(file)
        self.PSD = (self.detector.size > 0)

        # fill in missing motor columns
        self.genmotorcolumns()

        file.close()

    def __contains__(self, column):
        return hasattr(self.column, column)

    def counts(self):
        if self.detector.size > 1:
            return self.detector
        else:
            return self.column.counts

*/

function isspace(ch) {
    return /^\s$/.test(ch);
}

function get_quoted_tokens(line) {
    //"""
    //Build a token list from a line which can be a mix of quoted strings
    //and unquoted values separated by spaces.  Uses single quotes only.
    //Does not test for escaped single quotes.
    //"""
    var tokens = [];
    var curtoken = null;
    var inquote = false;
    var c;
    for (var i=0; i<line.length;  i++) {
        c = line[i];
        if (c == "'") {
            if (inquote) {
                tokens.push(curtoken.join(""));
                curtoken = null;
                inquote = false
            }
            else {
                curtoken = [];
                inquote = true;
            }
        }
        else if (inquote) {
            curtoken.push(c);
        }
        else if (isspace(c)) {
            if (curtoken != null) {
                tokens.push(curtoken.join(""));
                curtoken = null;
            }
        }
        else {
            if (curtoken === null) {
                curtoken = [c];
            }
            else {
                curtoken.push(c);
            }
        }
    }

    return tokens
}

function ICPParser() {
    this.linenumber = 0;
    
    this.read = function(rawstring) {
        /*
        Read header and data from file, setting the corresponding attributes the ICP object
        */
        //file = gzopen(self.path)
        var file = rawstring.split('\n');
        this.parseheader(file);

        //read columns and detector images if available
        this.readcolumns(file)
        this.PSD = (this.detector.length > 0);

        // fill in missing motor columns
        //self.genmotorcolumns()

        //file.close()
    }
    
    this.parseheader = function(contents) {
        /*
        Read and parse ICP header information
        */
        // Determine FileType
        this.linenumber = 0;
        if ( this.checkfpheader(contents) == true ) {
            // test for findpeak scan, and process as such
            return;
        }
        this.readheader1(contents);
        if (this.scantype == 'I') {
            this.readiheader(contents);
            this.readmotors(contents);
        }
        else if (['Q','T'].indexOf(this.scantype) > -1) {
            this.readqheader(contents);
        }
        else if (this.scantype == 'B') {
            this.readqheader(contents);
            this.readmotors(contents);
        }
        else if (this.scantype == 'R') {
            this.readrheader(contents);
            this.readmotors(contents);
        }
        else {
            throw "Unknown scan type: " + this.scantype;
        }
        this.readcolumnheaders(contents);
    }
    
    this.readheader1 = function(contents) {
        //"""
        //Read the two line summary at the start of the ICP data files.
        //"""
        var line = contents[this.linenumber++];
        var tokens = get_quoted_tokens(line);
        this.filename = tokens[0];
        //var stamp = datetime.datetime(2000, 1, 1) # need this to call strptime
        this.date = new Date(tokens[1]);
        this.scantype = tokens[2];
        this.prefactor = parseFloat(tokens[3]);
        this.monitor = parseFloat(tokens[4]);
        this.count_type = tokens[5];
        this.points = parseInt(tokens[6], 10);
        this.data_type = tokens[7];

        //skip over names of fields
        this.linenumber++;

        //comment and polarization
        line = contents[this.linenumber++];
        var polarized_index = line.indexOf("F1: O", 52);
        if (polarized_index > 0) {
            this.comment = line.slice(0, polarized_index).trimRight();
            var F1 = (line.indexOf("F1: ON", 52) > 0) ? '+' : '-';
            var F2 = (line.indexOf("F2: ON", 52) > 0) ? '+' : '-';
            this.polarization = F1 + F2;
        }
        else {
            this.comment = line.trimRight();
            this.polarization = "";
        }
    }
    
    this.checkfpheader = function(contents) {
        // read findpeak header
        var patt = /^\s*((?:Motor\s+no\.\s+\d+\s+)+)(Intensity)\s+(.*)/
        var line = contents[this.linenumber];
        var isFP = patt.test(line);
        if (isFP) {
            this.linenumber++; // we are going to process!
            var parts = line.match(patt);
            var motorstr = parts[1].replace(/Motor\s+no\.\s+/g, 'a'); // parts[0] is whole match
            this.columnnames = motorstr.trim().match(/\S+/g);
            this.columnnames.push("counts"); // replacing Intensity
            this.date = new Date(parts[3]);
            this.scantype = "FP";
        }
        return isFP
    }
    
    this.readiheader = function(contents) {
        /*
        Read I-buffer structure, excluding motors.
        */

        // Read in fields and field names
        var tokenized = contents[this.linenumber++].match(/\S+/g);
        var fieldnames = contents[this.linenumber++]; //file.readline()
        //print tokenized
        //print fieldnames

        //#Collimation    Mosaic    Wavelength   T-Start   Incr.   H-field #Det
        this.collimations = tokenized.slice(0,4).map(parseFloat);
        this.mosaic = tokenized.slice(4,7).map(parseFloat);
        this.wavelength = parseFloat(tokenized[7]);
        this.Tstart = parseFloat(tokenized[8]);
        this.Tstep = parseFloat(tokenized[9]);
        this.Hfield = parseFloat(tokenized[10]);
    }
    
    this.readrheader = function(contents) {
        /*
        Read R-buffer structure, excluding motors.
        */
        
        // Read in fields and field names
        var tokenized = contents[this.linenumber++].split(/\s+/);
        var fieldnames = contents[this.linenumber++]; //file.readline()
        //print tokenized
        //print fieldnames

        //#Mon1    Exp   Dm      Wavel  T-Start  Incr. Hf(Tesla) #Det SclFac
        this.Mon1 = parseFloat(tokenized[0]);
        this.Exp = parseFloat(tokenized[1]);
        this.Dm = parseFloat(tokenized[2]);
        this.wavelength = parseFloat(tokenized[3]);
        this.Tstart = parseFloat(tokenized[4]);
        this.Tstep = parseFloat(tokenized[5]);
        this.Hfield = parseFloat(tokenized[6]);
        this.numDet = parseFloat(tokenized[7]);
        this.SclFac = parseFloat(tokenized[8]);
    }
    
    this.readqheader = function(contents) {
        /*
        Read Q-buffer structure (also works for T-buffer).
        */
        
        //experiment info
        var tokenized = contents[this.linenumber++].split(/\s+/);
        this.collimations = tokenized.slice(0,4).map(parseFloat);
        this.mosaic = tokenized.slice(4,7).map(parseFloat);
        var orient1 = tokenized.slice(7,10).map(parseFloat); //[float(s) for s in tokenized[7:10]]
        //ignore the "angle" field
        var orient2 = tokenized.slice(11,14).map(parseFloat); //[float(s) for s in tokenized[11:14]]
        //skip line with field names
        this.linenumber++; //file.readline()
        tokenized = contents[this.linenumber++].split(/\s+/);
        var lattice = {}; // Lattice()
        lattice.a = parseFloat(tokenized[0]);
        lattice.b = parseFloat(tokenized[1]);
        lattice.c = parseFloat(tokenized[2]);
        lattice.alpha = parseFloat(tokenized[3]);
        lattice.beta = parseFloat(tokenized[4]);
        lattice.gamma = parseFloat(tokenized[5]);
        this.lattice = lattice;
        //skip line with field names
        this.linenumber++;
        tokenized = contents[this.linenumber++].split(/\s+/);
        this.ecenter = parseFloat(tokenized[0]);
        this.deltae = parseFloat(tokenized[1]);
        this.ef = parseFloat(tokenized[2]);
        this.monochromator_dspacing = parseFloat(tokenized[3]);
        this.analyzer_dspacing = parseFloat(tokenized[4]);
        this.tstart = parseFloat(tokenized[5]);
        this.tstep = parseFloat(tokenized[6]);
        tokenized = contents[this.linenumber++].split(/\s+/);
        this.Efixed = tokenized[4];
        tokenized = contents[this.linenumber++].split(/\s+/);
        this.qcenter = tokenized.slice(0,3).map(parseFloat); // [parseFloat(s) for s in tokenized[0:3]]
        this.qstep = tokenized.slice(3,6).map(parseFloat); //[parseFloat(s) for s in tokenized[3:6]]
        this.hfield = parseFloat(tokenized[6]);
        //skip line describing fields
        this.linenumber++;
    }
    
    this.readmotors = function(contents) {
        /*
        """
        Read the 6 motor lines, returning a dictionary of
        motor names and start-step-stop values.
        E.g.,

        M = _readmotors(file)
        print M['a1'].start
        """
        */
        this.motor = {};
        //self.motor = MotorSet()
        while (true) {  // read until 'Mot:' line
            var words = (contents[this.linenumber++]).trim().split(/\s+/);
            if (words[0] == 'Mot:') { break; }
            var motor = {};
            motor.start = parseFloat(words[1])
            motor.step = parseFloat(words[2])
            motor.stop = parseFloat(words[3])
            var name = (/^[0-9]/.test(words[0])) ? 'a' + words[0] : words[0]; // words[0] if not words[0].isdigit() else 'a' + words[0]
            // setattr(self.motor, name, motor)
            this.motor[name] = motor;
        }
    }

    this.readcolumnheaders = function(contents) {
        /*
        Get a list of column names. Transform the names of certain
        columns to make our lives easier elsewhere:
              #1 COUNTS -> counts
              #2 COUNTS -> counts2
              MON -> monitor
              MIN -> time
              Q(x) -> qx, Q(y) -> qy, Q(z) -> qz
        All column names are uppercase.
        */
        var line = contents[this.linenumber++];
        line = line.toLowerCase();
        var replacements=[['#1 counts', 'counts'],
                          ['#2 counts', 'counts2'],
                          [' mon ', ' monitor '],
                          [' min ', ' time '],
                          ['\\(', ''],
                          ['\\)', '']];
        var os, ns;
        for (var i=0; i<replacements.length; i++) {
            os = new RegExp(replacements[i][0], 'g');
            ns = replacements[i][1];
            line = line.replace(os, ns);
        }
        this.columnnames = line.trim().match(/\S+/g);
    }

    this.readcolumns = function(contents) {
        /*
        Read and parse ICP data columns listed in columns.  Return a dict of
        column name: vector.  If using a position sensitive detector, return
        an array of detector values x scan points.
        */
        var data = this.readdata(contents);
        this.column = data.columns;
        //for (c, v) in zip(self.columnnames, values.T):
        //    setattr(self.column, c, v)
        this.detector = data.blocks;
        this.counts = (this.detector.length > 0) ? this.detector : this.column.counts;
        this.points = this.column.counts.length;
        if (Array.prototype.indexOf.call(this.columnnames, 'point') == -1) {
            this.columnnames.push('point');
            this.column.point = range(this.points);
        }
    }
    
    this.readdata = function(fh) {
        /*
        Read ICP data, including PSD data if lines contain commas.
        */
        var rows = [], row;
        var columns = {}, c;
        for (c=0; c<this.columnnames.length; c++) {
            columns[this.columnnames[c]] = [];
        }
        var blocks = [];

        var line = fh[this.linenumber++].trimRight();
        var linenum = 1;
        while (this.linenumber < fh.length) {
            // While it might be easy to check for a comment mark on the beginning
            // of the line, supporting this is ill-adviced.  First, users should
            // be strongly discouraged from modifying the original data.
            // Second, sequencing against the automatically generated motor
            // columns will become more complicated.  Let's make life easier
            // and put the masking in the application rather than the data reader.

            // Process the instrument configuration line and move to the next line
            row = line.trim().split(/\s+/).map(parseFloat);
            for (c=0; c<this.columnnames.length && c<row.length; c++) {
                columns[this.columnnames[c]].push(row[c]);
            }
            rows.push(row);
            line = fh[this.linenumber++].trimRight();
            linenum += 1;

            // Build up a multiline detector block by joining all lines that
            // contain a comma
            var b = [];
            while (line.indexOf(',') >= 0) {
                b.push(line);
                line = fh[this.linenumber++];
                linenum += 1;
            }

            // If last line ended with a comma then the last number for the
            // the current block is on the current line.
            if ((b.length > 0) && (b.slice(-1)[0]).trimRight().slice(-1) == ",") {
                b.push(line);
                line = fh[this.linenumber++];
                linenum += 1;
            }
            
            if (b.length > 0) {
                // Have a detector block so add it
                var s = b.join("");
                var z;
                if (blocks.length > 0) {
                    z = parsematrix(s, blocks[0].length, linenum);
                }
                else {
                    z = parsematrix(s, null, linenum);
                }
                blocks.push(z);
            }
            else if (blocks.length > 0) {
                // Oops...missing a detector block.  Set it to zero counts
                // of the same size as the last block
                var zeros = [];
                for (var i=0; i<blocks.slice(-1)[0].length; i++, zeros.push(0)) {};
                blocks.push(zeros);
            }
            // Otherwise no detector block and don't need one
            // Note: this strategy fails to identify that the first
            // detector block is missing; those will be filled in later.
        }
        // recover from missing leading detector blocks
        if (blocks.length > 0 && blocks.length < rows.length) {
            var zeros = [];
            for (var i=0; i<blocks[0].length; i++, zeros.push(0)) {};
            //blank = N.zeros(blocks[0].shape, 'i')
            for (var j=0; j<(rows.length - blocks.length); j++) {
                blocks.splice(0, 0, zeros);
            };
            //blocks = [blank] * (len(blocks) - len(rows)) + blocks
        }
        // Convert data to arrays
        //X = N.array(rows, 'd')
        //Z = N.array(blocks)
        return {rows: rows, blocks: blocks, columns: columns}
    }
    
    this.get_plottable = function(xcol, ycol) {
        var xcol = (xcol == null) ? 'point' : xcol;
        var ycol = (ycol == null) ? 'counts' : ycol;
        var data = [];
        for (var i=0; i<this.column.counts.length; i++) {
            data.push([this.column[xcol][i], this.column[ycol][i]]);
        }
        var plottable_data = {
            'type': '1d',
            'title': this.comment,
            'metadata': {},
            'options': {
                'axes': {
                    'xaxis': {'label': xcol},
                    'yaxis': {'label': ycol},
                },
                'series': [{'label': this.filename}]
            },
            'xlabel': 'X',
            'ylabel': 'Y', 
            'data': [data]
        }; 
        
        return plottable_data 
    }

    return this;
}

function range(start, stop, step) {
    var output = [];
    if (arguments.length < 3) { 
        // step defaults to one if not specified
        var step = 1;
    }
    if (arguments.length == 1) {
        var stop = arguments[0];
        var start = 0;
    }
    
    for (var i=start; i<stop; i+=step) {
        output.push(i);
    }
    return output;
}

function parsematrix(s, shape, linenum) {
    var linenum = (linenum == null)? 0 : linenum;
    /*
    Parse a string into a matrix.  Provide a shape parameter if you
    know the expected matrix size.
    */
    var singleArgParseInt = function(x) { return parseInt(x, 10); }
    var z = s.split(/\s*[,]\s*/).map(singleArgParseInt);
    if (shape != null && shape != z.length) {
        throw "Inconsistent dims at line " + linenum.toFixed();
    }
    return z
}
