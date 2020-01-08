# BART
BART Designed for UW CAPS 2019-2020
Any questions/concerns/suggestions, have the Supervisor contact me (Weia88)
Before starting and upon finishing the task, please ensure there is no "emergency_backup.p" file located within the BART file.

How to Run the BART:
  1. In the folder, double click BART.py
      a. This executes the file as python, and creates a local site.
          i. You may also use the python terminal and type python BART.py (same as above)
  2. Open up Chrome or Firefox, and go to localhost:5000 (Same as 127.0.0.1:5000)
      a. If the page is not found, see Restarting.
  3. Once the loading page shows up, the BART is ready and will not need to be closed throughout the study.
      a. (Note: While the page can be closed, please don't close the window until the end)
  4. Once all three runs of the BART are completed, you must kill the application.
      a. Ensure you are on the ("Do not refresh page") AFTER the third run*
          i. There is no warning or indicator for the last/third run.
      b. To kill, type either localhost:5000/kill or 127.0.0.1:5000/kill in the address bar
          i. Remove anything in the address bar that looks as such (e.g., ?pin=X&session=X)
  5. See Data Collection.

Restarting:
  1. In the event of a crash or any issues, type /kill in the browser bar
      a.  It should be either: localhost:5000/kill or 127.0.0.1:5000/kill
  2. Close the terminal, it may info you a process is running - click yes to end process.
  3. Any problems, please note them and/or take pictures.


Data Collection:
  1. After three runs of the BART, a csv file will appear in the /data folder
  2. The file name will be the Participant's ID
  3. An emergency_backup.p file will be created in the event the data was not properly stored in the csv
      a. If the csv file contains 90 rows, emergency_backup.p may be deleted
      b. If there are any problems with the csv file, feel free to execute read_backup.py
          i. This will create a readable csv of the backup pickle file within /data
          ii. You may also run python read_backup.py to save the emergency_backup within /data

Technical details of the BART
  1. There are 30 rounds to each run, with a randomized explosion between 1 and 128
  2. The "End Task" button will save the data, writing to file after three rounds
  3. Attempt to keep the page open at all times, minimizing is fine.
      a. In the event the page was closed, ensure that
          Participant ID remains the same and session has increased by one



Written by: Weia88
Credits to https://github.com/heitorbffi & Dan :)
