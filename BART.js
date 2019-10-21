//// TODO:
//1. Add more detailed csv file tags --> custom file name, participant ID over three sheets, experimentor name?

//1a. separate sheets or 90 rows of data? --> csv sheet implementation

//2. ParticipantId and Session incorporatoin

//3. should the game repeat three times, should the game be refreshed 3 times or
//have a move next session button, never needing to be refreshed only minimized

//4..clean up let vs var initilizations

"use strict";

(function() {
    let maxPump = 0;
    let nPumps = 0;
    let exploded = false;
    let roundNum = 0;
    const roundLimit = 3;

    var infoJSON = [];


    window.onload = function() {
      //Loading page opens first page --> participant information information
      document.getElementById("task_screen").className = "hidden";
      document.getElementById("end_screen").className = "hidden";
      document.getElementById("admin_screen").className = "hidden";
      document.getElementById("submit_button").onclick = start_screen;
    }


    function setMaxPumps() {
      maxPump = Math.floor((Math.random() * 10) + 1);
      return maxPump;
    }


    function start_screen() {
      let inputOk = checkInput();
      if (inputOk) {
        //dictates the game plays and first screen is hidden
        document.getElementById("form").className = "showing"; // neccessary?
        document.getElementById("task_screen").className = "showing";
        document.getElementById("participant_info").className = "hidden";


        //hud top right
        //add dollar sign
        document.getElementById("won").innerHTML = "0.00";
        document.getElementById("lost").innerHTML = "0.00";
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


    function checkInput() {
      let pin = document.getElementById("Participant").value;
      let session = document.getElementById("Session").value;
      //currently no requirements
      let pinPattern = /^[a-zA-Z\s]{0,}[0-9]{0,}$/;
      let sessionIdPattern = /^[a-zA-Z\s]{0,}[0-9]{0,}$/;

      let pinSuccess = pinPattern.test(pin);
      let sessionIdSuccess = sessionIdPattern.test(session);
      
      return (true); //DONT FORGET TO SET TO ACTUALLY RETURN T or F
    }


    function newRound() {
      exploded = false;
      roundNum += 1;
      setMaxPumps();

      document.getElementById("pump").onclick = pump; //include space button
      document.getElementById("bank").onclick = bank; //include enter button

      //retrieve image
      let balloonTop = document.getElementById("balloon_top");
      balloonTop.src = "balloon_top.png";

      //default size
      balloonTop.style.height = "75px";
      balloonTop.style.width = "75px";

      document.getElementById("score").innerHTML = "0.00"; // resets monetary amount

      let scoreTag = document.getElementById("scoreMessage");
      scoreTag.innerHTML = "Current Money Accumulated:";

    }

    function pump() {
      if (!checkExploded()) {
        nPumps += 1;
        let balloonTop = document.getElementById("balloon_top");
        let prevHeight = parseInt(window.getComputedStyle(balloonTop).height);

        let increment;

        if (prevHeight < 100) {
          increment = 7;
        } else if (prevHeight < 120) {
          increment = 6;
        } else {
          increment = 5;
        }

        balloonTop.style.height = "" + (prevHeight + increment) + "px";
        balloonTop.style.width = "" + (prevHeight + increment) + "px";

        let score = parseFloat(document.getElementById("score").innerHTML);
        document.getElementById("score").innerHTML = "" + (score + 0.01).toFixed(2);
      }
    }


    function bank() {
      let roundScore = document.getElementById("score");
      let score = parseFloat(roundScore.innerHTML);
      if (exploded) { //true = popped, false = not popped
        let lost = document.getElementById("lost");
        let moneyLost = parseFloat(lost.innerHTML);
        lost.innerHTML = "" + (moneyLost + score).toFixed(2);
        roundScore.innerHTML = "0.00";


        //append score to infoJSON
        storeInfo(-score * 100, moneyLost, exploded, maxPump, nPumps);


      } else {
        let won = document.getElementById("won");
        let moneyWon = parseFloat(won.innerHTML);
        won.innerHTML = "" + (moneyWon + score).toFixed(2);

        //append score to infoJSON
        storeInfo(score * 100, moneyWon, exploded, maxPump, nPumps);
      }
      nPumps = 0;
      if (roundNum < roundLimit) {
        newRound();
      } else {
        endGame(); //contain false?
      }
    }


    function checkExploded() {
      if (nPumps === maxPump) {
        document.getElementById("balloon_top").src = "balloon_exploded.png";
        exploded = true;
        bank();
        setMaxPumps();

        //pop sound effect
        var audio = new Audio('BalloonPop.wav');
        audio.play();

        return true;
      } else {
        exploded = false;
        return false;
      }

    }

    function storeInfo(w, monetary, x, y, z) {
      //saving the parameters to global
      var objJSON = {
        "score": w,
        "monetary": monetary,
        "explosion": x,
        "maxPumps": y,
        "nPumps": z
      };
      infoJSON.push(objJSON);
    }

    function endGame() {
      //display endscreen
      document.getElementById("task_screen").className = "hidden";
      document.getElementById("end_screen").className = "showing";

      let moneyWon = document.getElementById("won").innerHTML;
      document.getElementById("finalWon").innerHTML += moneyWon;

      let moneyLost = document.getElementById("lost").innerHTML;
      document.getElementById("finalLost").innerHTML += moneyLost;


      //move to adminUse
      document.getElementById("goToAdmin").onclick = adminUse;
    }

    function download(content, fileName, contentType) {
      //always will need to be downloaded --> download folder, browser security
      //**add another screen to require a button to initiate download

      document.getElementById("testJSON").innerHTML = content;

      //create Blob obj, then download on click
      var a = document.createElement("a");
      var file = new Blob([content], {
        type: contentType
      });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }

    function adminUse() {
      document.getElementById("end_screen").className = "hidden";
      document.getElementById("admin_screen").className = "showing";

      var myJSON = JSON.stringify(infoJSON, null, 2);
      //onclick perform download
      document.getElementById("downloadJSON").onclick = function() {
        download(myJSON, 'json.txt', 'text/plain'); // button to download
      }
    }

  } //end of main function

)();
