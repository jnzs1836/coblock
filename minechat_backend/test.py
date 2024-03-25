import json

with open("./data.json", 'r') as fp:
    data = json.load(fp)
    print("Success!")