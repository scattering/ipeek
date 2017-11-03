import requests
import json

json_headers = {"Accept": "application/vnd.citationstyles.csl+json"}
bibtex_headers = {"Accept": "application/x-bibtex"}

def make_pubdb(doi_list):
    output = []
    for doi in doi_list:
        rj = requests.get("https://doi.org/%s" % (doi,), headers = json_headers)
        entry = rj.json()
        rb = requests.get("https://doi.org/%s" % (doi,), headers = bibtex_headers)
        entry["__bibtex"] = rb.text
        output.append(entry)
    return output
    
if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        input_filename = sys.argv[1]
        doi_list = json.loads(open(input_filename, "r").read())
        result = json.dumps(make_pubdb(doi_list), indent=2)
        if len(sys.argv) > 2:
            open(sys.argv[2], "w").write(result)
        else:
            print(result)
            
            
