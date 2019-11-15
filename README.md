# BART
BART Designed for UW CAPS 2019-2020

How to Run the BART:
  1. In the folder, use ___ to run BART.py
      a. This executes the file as python, and creates a local site.
  2. Open up Chrome or Firefox, and go to localhost:5000 (Same as 127.0.0.1:5000)
      a. If the page is not found, see How to Restart.
  3. Once the loading page shows up, the BART is ready and does not need to be closed.
  4. See Data Collection.
  5. Once all three runs of the BART are completed, you may kill the application
      a. All runs will be completed if a file shows in the data folder
          i. Check /data folder, before killing the application
      a. to kill, type either localhost:5000/kill or 127.0.0.1:5000/kill

Minor details of the BART
  1. There are 30 rounds to each run, with a randomized explosion between 1 and 128
  2. The "End Task" button will save the data, writing to file after three rounds
  3. Attempt to keep the page open at all times, minimizing is fine.
      a. In the event the page was closed, ensure that
          Participant ID remains the same and session is increased by one


Restarting:
  1. In the event of a crash or any issues, type /kill in the browser bar
      a.  It should be either: localhost:5000/kill or 127.0.0.1:5000/kill
  2. Reopen the BART.py file with ____.
  3. Any problems, please note them and/or take pictures.


Collecting Data:
  1. After three runs of the BART, a csv file should appear in the /data folder
  2. The file name will be the Participant's ID
  3. emergency_backup.p is created incase the data use not properly stored into csv
      a. If the csv file contains 90 rows, emergency_backup.p may be deleted
      b. If no csv or data inside, save the emergency_backup.p --> pickle file




Credits to https://github.com/heitorbffi & Dan :)
