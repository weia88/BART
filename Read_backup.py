import pickle
import csv

from BART import write_to_csv_file

submissions = pickle.load(open("emergency_backup.p", "rb"))

for pid in submissions:
    sessions = submissions[pid]
    all_runs = []
    for s in sessions:
        all_runs += s
    filename = "{}_emergency_backup".format(pid)
    write_to_csv_file("data", filename, all_runs)
