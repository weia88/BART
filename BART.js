//// TODO:
      //when the balloon is poppd, new screen to RESET balloon image

"use strict";

(function() {
    let remainingPumps = 0;
    let exploded = false;
    let roundNum = 0;
    const roundLimit = 30;


    window.onload = function() {
      //Loading page opens first page --> participant information information
      document.getElementById("task_screen").className = "hidden";
      document.getElementById("end_screen").className = "hidden";
      document.getElementById("submit_button").onclick = start_screen;
    }


    function randomizeMaxPumps() {
      remainingPumps = Math.floor((Math.random() * 10) + 1);
      return remainingPumps;
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

      return (true);
    }


    function newRound() {
      exploded = false;
      roundNum += 1;
      remainingPumps = randomizeMaxPumps();

      document.getElementById("pump").onclick = pump;
      document.getElementById("bank").onclick = bank;

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
        remainingPumps -= 1;
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
      if (exploded) {
        let lost = document.getElementById("lost");
        let moneyLost = parseFloat(lost.innerHTML);
        lost.innerHTML = "" + (moneyLost + score).toFixed(2);
        roundScore.innerHTML = "0.00";

      } else {
        let won = document.getElementById("won");
        let moneyWon = parseFloat(won.innerHTML);
        won.innerHTML = "" + (moneyWon + score).toFixed(2);
      }

      if (roundNum < roundLimit) {
        newRound();
      } else {
        endGame(false);
      }
    }


    function checkExploded() {
      if (remainingPumps === 0) {
        document.getElementById("balloon_top").src = "balloon_exploded.png";
        remainingPumps = randomizeMaxPumps();
        exploded = true;
        bank();

        //pop sound effect
        var audio = new Audio('BalloonPop.wav');
        audio.play();

        return true;
      } else {
        exploded = false;
        return false;
      }

    }

    function endGame() {
      //display endscreen
      document.getElementById("task_screen").className = "hidden";
      document.getElementById("end_screen").className = "showing";

      let moneyWon = document.getElementById("won").innerHTML;
      document.getElementById("finalWon").innerHTML += moneyWon;

      let moneyLost = document.getElementById("lost").innerHTML;
      document.getElementById("finalLost").innerHTML += moneyLost;

    }

  } //end of main function

)();
