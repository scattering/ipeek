import requests
import json
import urllib

json_headers = {"Accept": "application/vnd.citationstyles.csl+json"}
bibtex_headers = {"Accept": "application/x-bibtex"}

keys_to_import = [
    "title",
    "author",
    "container-title-short",
    "container-title",
    "volume",
    "page",
    "article-number",
    "issued",
    "DOI",
    "URL",
    "is-referenced-by-count"
]

def make_pubdb(doi_list, add_bibtex=False):
    output = []
    for i, doi in enumerate(doi_list):
        escaped_doi = urllib.parse.quote(doi)
        print(i, escaped_doi)
        rj = requests.get("https://data.crossref.org/%s" % (escaped_doi,), headers = json_headers)
        #rj = requests.get("https://doi.org/%s" % (doi,), headers = json_headers)
        entry = {}
        try: 
            content = rj.json()
            entry.update(dict([(k, content.get(k, None)) for k in keys_to_import]))
            if add_bibtex:
                rb = requests.get("https://doi.org/%s" % (doi,), headers = bibtex_headers)
                entry["__bibtex"] = rb.text
            output.append(entry)
        except Exception:
            print("not processing %s because of error: text" % (doi,))
        
    return output
    
if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        input_filename = sys.argv[1]
        doi_list = json.loads(open(input_filename, "r").read())
        result = json.dumps(make_pubdb(doi_list))
        if len(sys.argv) > 2:
            open(sys.argv[2], "w").write(result)
        else:
            print(result)
            
            
