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

function BT1Parser() {
    this.linenumber = 0;
    
    this.read = function(rawstring) {
        /*
        Read header and data from file, setting the corresponding attributes the ICP object
        */
        var file = rawstring.split('\n');
        this.parseheader(file);
        this.readdata(file);
    }
    
    this.parseheader = function(contents) {
        /*
        Read and parse header information
        */
        // Determine FileType
        this.linenumber = 0;
        
        this.readbt1header(contents);
        this.readiheader(contents);
        this.readmotors(contents);
        this.readscalefactors(contents);
        this.readzeroangles(contents);
    }
    
    this.readbt1header = function(contents) {
        var patt1 = /^'([^']+)'\s+'([^']+)'\s+(\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+)\s+(\S+)\s+(\d+)\s+'(\S+)'\s+(\d+)\s+'(\S+)'/
        var tokens = contents[this.linenumber++].match(patt1);
        this.filename = tokens[1];
        //var stamp = datetime.datetime(2000, 1, 1) # need this to call strptime
        this.date = new Date(tokens[2]);
        this.scantype = 'BT1';
        this.exp_parameters = tokens[3].split(/\s+/).map(function(num) { return parseInt(num, 10); });
        this.monitor = parseFloat(tokens[4]);
        this.prefactor = parseFloat(tokens[5]);

        this.count_type = tokens[6];
        this.points = parseInt(tokens[7], 10);
        this.data_type = tokens[8];
        
        //skip over names of fields
        this.linenumber++;

        //comment
        line = contents[this.linenumber++];
        this.comment = line.trimRight();
    }
    
    this.readiheader = function(contents) {
        /*
        Read I-buffer structure, excluding motors.
        */

        // Read in fields and field names
        var tokenized = contents[this.linenumber++].match(/\S+/g);
        var fieldnames = contents[this.linenumber++]; //file.readline()

        //#Collimation    Mosaic    Wavelength   T-Start   Incr.   H-field #Det
        this.collimations = tokenized.slice(0,4).map(parseFloat);
        this.mosaic = tokenized.slice(4,7).map(parseFloat);
        this.wavelength = parseFloat(tokenized[7]);
        this.Tstart = parseFloat(tokenized[8]);
        this.Tstep = parseFloat(tokenized[9]);
        this.Hfield = parseFloat(tokenized[10]);
        if (tokenized[11]) {
            this.numDet = parseInt(tokenized[11], 10);
        } else {
            this.numDet = 32;
        }
    }
    
    this.readscalefactors = function(contents) {
        this.scale_factors = [];
        while (true) {  // read until 'Detector Relative Scalefactors' line
            var line = contents[this.linenumber++];
            if (/Detector Relative Scalefactors/.test(line)) { break; }
            var words = line.trim().split(/\s+/);
            scls = words.map(parseFloat);
            this.scale_factors = this.scale_factors.concat(scls);
        }
    }
    
    this.readzeroangles = function(contents) {
        this.zero_angles = [];
        while (true) {  // read until 'Detector Relative Scalefactors' line
            var line = contents[this.linenumber++];
            if (/Detector Relative Zero Angles/.test(line)) { break; }
            var words = line.trim().split(/\s+/);
            angles = words.map(parseFloat);
            this.zero_angles = this.zero_angles.concat(angles);
        }
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

    
    this.readdata = function(fh) {
        /*
        Read BT1 data
        */
        var row;
        var blocks = [];
        var block=[];
        this.linenumber++; // skip header line
        
        var line = fh[this.linenumber++].trimRight();
        var linenum = 1;
        while (this.linenumber < fh.length) {
            if (/^[#$]/.test(line)){
                line = fh[this.linenumber++].trimRight();
                continue;
            }
            // Process the instrument configuration line and move to the next line
            row = line.trim().replace(/,$/, '').split(',').map(parseFloat);
            block = block.concat(row);
            if (block.length >= this.numDet) {
                blocks.push(block.slice(0, this.numDet))
                block = block.slice(this.numDet);
            }
            line = fh[this.linenumber++].trimRight();
        }
        if (block.length > 0) {
            // append partial blocks
            blocks.push(block)
        }
        this.blocks = blocks
        return blocks
    }
}
