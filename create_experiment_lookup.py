import os, json

ncnrdata = "/var/ftp/pub/ncnrdata/"
_, instrument_dirs, _ = os.walk(ncnrdata).next()

experiment_lookup = {}

for instrument_dir in instrument_dirs:
    instrument_lookup = {}
    experiment_lookup[instrument_dir] = instrument_lookup
    instr_path, cycles, _ = os.walk(os.path.join(ncnrdata, instrument_dir)).next()
    for cycle in cycles:
        path, experiments, _ = os.walk(os.path.join(instr_path, cycle)).next()
        for experiment in experiments:
            experiment_path = os.path.join(instrument_dir, cycle)
            if experiment in instrument_lookup:
                instrument_lookup[experiment]["paths"].append(experiment_path)
            else:
                instrument_lookup[experiment] = {"paths": [experiment_path]}
            
open('/var/www/html/ipeek/experiment_lookup.json', 'w').write(json.dumps(experiment_lookup))
    
