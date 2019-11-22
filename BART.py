#!/usr/bin/env python3
from flask import Flask, render_template, request, make_response
import pickle
import json
import os
import csv

submissions = {}

# <DANS CODE>
def emergency():
    pickle.dump(submissions, open("emergency_backup.p", "wb"))

def cat_and_write(pid, sid):
    print(submissions[pid])
    sessions = submissions[pid]
    # all_runs = [x for x in s for s in sessions]
    all_runs = []
    for s in sessions:
        all_runs += s
    write_to_csv_file("data", pid, all_runs)

# </DANS CODE>

def write_to_json_file(path, fileName, data):
    filePathNameWExt = path + "/" + fileName + ".json"
    with open(filePathNameWExt, "w") as json_file:
        json.dump(data, json_file)

def write_to_csv_file(path, fileName, data):
    filePathNameWExt = path + "/" + fileName + ".csv"
    with open(filePathNameWExt, "w", newline = "") as csv_file:
        fieldnames = ["PID", "SID", "score", "explosion", "maxPumps", "nPumps"]
        writer = csv.DictWriter(csv_file, fieldnames = fieldnames)
        writer.writeheader()
        for d in data:
            writer.writerow(d)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("BART.html")

@app.route("/upload", methods = ["POST"])
def get_javascript_data():
    jsdata = request.json.get("data") # get data
    pid = jsdata[0]["PID"] # get PID
    sid = jsdata[0]["SID"] # get SID

    # Add new run to submissions
    if pid not in submissions:
        submissions[pid] = []
    submissions[pid].append(jsdata)

    # After 3rd run, save to file
    if len(submissions[pid]) >= 1:
        cat_and_write(pid, sid)

    return make_response("...")

@app.route("/kill")
def shutdown():
    emergency()
    request.environ.get("werkzeug.server.shutdown")()

@app.errorhandler(Exception)
def all_exception_handler(error):
    emergency()
    raise error
    return "Error", 500

if __name__ == "__main__":
    app.run(debug = True)
