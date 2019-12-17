  //// TODO:
  // Balloon explosion image
  // More Balloon sound effects
  //5..clean up let vs var initilizations

  "use strict";

  (function() {
      let maxPump = 0;
      let nPumps = 0;
      let exploded = false;
      let roundNum = 0;
      const roundLimit = 30;

      var infoJSON = [];

      window.onload = function() {

        document.getElementById("task_screen").className = "hidden";
        document.getElementById("end_screen").className = "hidden";
        document.getElementById("refresh_screen").className = "hidden";
        document.getElementById("submit_button").onclick = start_screen;
        var pinField = document.getElementById("Participant");
        var sidField = document.getElementById("Session");
        var oldPin = findGetParameter("pin");
        var oldSession = findGetParameter("session");
        if (oldPin !== null && oldSession != null) {
          pinField.value = oldPin;
          sidField.value = oldSession;
        }
      }

      //Method: Randomizes the max allowed pumps
      function setMaxPumps() {
        maxPump = Math.floor((Math.random() * 128) + 1);
        return maxPump;
      }

      // Method: Displays start screen and sets score variables
      function start_screen() {
        let inputOk = checkInput();
        if (inputOk) {
          //dictates the game plays and first screen is hidden
          document.getElementById("form").className = "showing";
          document.getElementById("task_screen").className = "showing";
          document.getElementById("participant_info").className = "hidden";

          document.getElementById("won").innerHTML = "0.00";
          document.getElementById("lost").innerHTML = "0.00"; // remove
          document.getElementById("score").innerHTML = "0.00";


          newRound();


        } else {
          //error message without proper participant data
          //by use of admin only? --> change text to display and verify information
          console.log("not submitted");
          document.getElementById("submission_status").innerHTML = "You need to type the clinic \
    name and ID as given to you!"; //double check this call works
        }
      }

      //Method: Verify Participant ID (PID) and Session ID (SID) are valid
      //Currently any input works
      function checkInput() {
        let pin = document.getElementById("Participant").value;
        let session = document.getElementById("Session").value;
        //currently no requirements
        let pinPattern = /^[a-zA-Z\s]{0,}[0-9]{0,}$/;
        let sessionIdPattern = /^[a-zA-Z\s]{0,}[0-9]{0,}$/;

        let pinSuccess = pinPattern.test(pin);
        let sessionIdSuccess = sessionIdPattern.test(session);

        return (true); //DONT FORGET TO SET TO ACTUALLY RETURN T or F
        //will always return true (no restriction on input)
      }

      //Method: Reset variables and images, displays HUD
      function newRound() {
        exploded = false;
        roundNum += 1;
        setMaxPumps();

        document.getElementById("pump").onclick = pump;
        document.getElementById("bank").onclick = bank;

        //retrieve image
        let balloonTop = document.getElementById("balloon_top");
        balloonTop.src = "static/images/balloon_top.png";

        //default size
        balloonTop.style.height = "75px";
        balloonTop.style.width = "75px";

        document.getElementById("score").innerHTML = "0.00"; // resets monetary amount

        let scoreTag = document.getElementById("scoreMessage");
        scoreTag.innerHTML = "Current Money Accumulated:";

      }
      //Method: If balloon is not at max, increases balloon size
      //Increase score accordingly
      function pump() {
        if (!checkExploded()) {
          nPumps += 1;
          let balloonTop = document.getElementById("balloon_top");
          let prevHeight = parseInt(window.getComputedStyle(balloonTop).height);

          let increment;

          if (prevHeight < 100) {
            increment = 5;
          } else if (prevHeight < 120) {
            increment = 4;
          } else {
            increment = 3;
          }

          balloonTop.style.height = "" + (prevHeight + increment) + "px";
          balloonTop.style.width = "" + (prevHeight + increment) + "px";

          let score = parseFloat(document.getElementById("score").innerHTML);
          document.getElementById("score").innerHTML = "" + (score + 0.01).toFixed(2);
        }
      }

      //Method: Banks the current amount in the permanent score,
      //according to exploded
      function bank() {
        let roundScore = document.getElementById("score");
        let score = parseFloat(roundScore.innerHTML);
        if (exploded) {
          let lost = document.getElementById("lost");
          let moneyLost = parseFloat(lost.innerHTML);
          lost.innerHTML = "" + (moneyLost + score).toFixed(2);
          roundScore.innerHTML = "0.00";

          storeInfo(Math.round(score * 100), exploded, maxPump, nPumps);

        } else {
          let won = document.getElementById("won");
          let moneyWon = parseFloat(won.innerHTML);
          won.innerHTML = "" + (moneyWon + score).toFixed(2);

          //append score to infoJSON
          storeInfo(Math.round(score * 100), exploded, maxPump, nPumps);
        }
        nPumps = 0;
        if (roundNum < roundLimit) {
          newRound();
        } else {
          endGame();
        }
      }

      //Method: Verifies pump attempts does not exceed max balloon pumps
      //Plays audio clip if exceeded (add exploded balloon image)
      function checkExploded() {
        if (nPumps >= maxPump) {
          document.getElementById("balloon_top").src = "static/images/balloon_exploded.png";
          exploded = true;
          bank();
          setMaxPumps();

          //pop sound effect
          var audio = new Audio("static/BalloonPop.wav");
          audio.volume = 0.7; // adjust volume
          audio.play();


          return true;
        } else {
          exploded = false;
          return false;
        }

      }

      function storeInfo(a, x, y, z) {
        //saving the parameters to global
        var objJSON = {
          "PID": document.getElementById("Participant").value,
          "SID": document.getElementById("Session").value,
          "score": a,
          "explosion": x,
          "maxPumps": y,
          "nPumps": z
        };

        infoJSON.push(objJSON);
      }
      //Method: Displays endscreen for participant
      function endGame() {
        document.getElementById("task_screen").className = "hidden";
        document.getElementById("end_screen").className = "showing";

        let moneyWon = document.getElementById("won").innerHTML;
        document.getElementById("finalWon").innerHTML += moneyWon;

        let moneyLost = document.getElementById("lost").innerHTML;
        document.getElementById("finalLost").innerHTML += moneyLost;

        //button onclick to adminUse()
        document.getElementById("saveData").onclick = adminUse;
      }

      //Method to request data be sent to python and saved to JSON
      function adminUse() {
        document.getElementById("end_screen").className = "hidden";
        var pin = document.getElementById("Participant").value;
        var session = document.getElementById("Session").value;
        var refreshButton = document.getElementById("refresh_screen");
        refreshButton.onclick = function() {
          window.location.search = "?pin=" + pin + "&session=" + (parseInt(session) + 1);
        }
        refreshButton.className = "showing";

        var myJSON = JSON.stringify({
          data: infoJSON
        });

        //Send data to pythoon script, with flask, to save file
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(myJSON);
      }

    function findGetParameter(parameterName) {
      var result = null,
      tmp = [];
      location.search
          .substr(1)
          .split("&")
          .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
          });
      return result;
    }

    } //end of main function

  )();
