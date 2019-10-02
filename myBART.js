// Note: session refers to the number of the latest therapy session attended by the user,
// and has nothing to do with the web-related session concept.
// Recall this is an app to be used by patients undergoing therapy (e.g., for anxiety,
// so that we can monitor their risk-taking proneness).

"use strict";

(function() {
  let inRound;
  let remainingPumps = 0;
  let probabilityArray = Array(12).fill(0);
  let exploded = false;
  let roundNum = 0;
  const roundLimit = 30;


  window.onload = function() {
    //on window open  --> defaults shows consent until submit_form = true
    //then switch to game screen
    document.getElementById("game").className = "hidden";
    document.getElementById("ending").className = "hidden";
    document.getElementById("submit_button").onclick = goToGame;
  };

  //set each phase at a randomized number of max pumps allowed
  function randomizeMaxPumps(){
      remainingPumps = Math.floor((Math.random() * 128) + 1); //max pump a balloon can have
  }

  //start experiement
  function goToGame() {
    let inputOk = checkInput(); //checks to ensure input fits criteria
    if (inputOk) {

      //dictates the game plays and first screen is hidden
      document.getElementById("game").className = "showing";
      document.getElementById("personal_info").className = "hidden";
      document.getElementById("form").className = "showing";

      //hud top right
      //add dollar sign
      document.getElementById("won").innerHTML = "0.00";
      document.getElementById("lost").innerHTML = "0.00";
      document.getElementById("score").innerHTML = "0.00";

      startTask();

    } else {
      //error message without proper participant data
      //by use of admin only? --> change text to display and verify information
      console.log("not submitted");
      document.getElementById("submission_status").innerHTML = "You need to type the clinic \
      name and ID as given to you!";
    }
  }

  //ensure proper participant information matches the criteria
  //Future: implement database to check if participant already exists
  function checkInput() {
    let pin = document.getElementById("Participant").value;
    let session = document.getElementById("Session").value;
    //currently no requirements
    let pinPattern = /^[a-zA-Z\s]{0,}[0-9]{0,}$/;
    let sessionIdPattern = /^[a-zA-Z\s]{0,}[0-9]{0,}$/;

    let pinSuccess = pinPattern.test(pin);
    let sessionIdSuccess = sessionIdPattern.test(session);

    return (true); //pinSuccess && sessionIdPattern
  }

  //Loads a new balloon and task/
  //no need for yes button click that leads to new task
  function startTask() {

    let temp = randomizeMaxPumps(); //syntax, does this work?
    let roundDiv = document.createElement('div');
    roundDiv.setAttribute("id", "another_round");

    let roundP = document.createElement('p');
    roundP.innerHTML = "Ready?";

    roundNum += 1;

    roundP.classList.add("round_paragraph");
    roundDiv.appendChild(roundP);

    let buttons = document.createElement("div");

    let yes = document.createElement("button");
    yes.classList.add("round_button");
    yes.innerHTML = "Yes";

    buttons.appendChild(yes);
    buttons.classList.add("buttonsDiv");

    roundP.appendChild(buttons);
    document.body.appendChild(roundDiv);

    yes.onclick = newTask;
  }

  //setups the experiment, called with startTask()
  //creating balloon and HUD
  function newTask() {
    exploded = false;
    inRound = true;
    //how to get png to display
    //nothing is showing ...

    document.getElementById("pump").onclick = pump
    document.getElementById("stop").onclick = stop;

    let balloonTop = document.getElementById("balloon_top");
    balloonTop.src="balloon_top.png";

    balloonTop.style.height = "75px";
    balloonTop.style.width = "75px";

    let roundDiv = document.getElementById("another_round");
    document.body.removeChild(roundDiv);
    document.getElementById("score").innerHTML = "0.00"; //reset money amount

    let scoreTag = document.getElementById("scoreMessage");
    scoreTag.innerHTML = "Current score:";
  }

  //upon pump buttom press, checks to see if pump attemppt is allowed
  //If allowed, increased balloon png size and increments money earned in HUD
  //If not calls checkExploded
  function pump() {
    if (inRound) {
        checkExploded();

      if (!exploded) {
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
  }

  //if reached 0, total pumps has been reached and resets remainingPumps (not here?)
  // calls stop() to display end of round screen
  function checkExploded() {
    if (remainingPumps === 0) {
      document.getElementById("balloon_top").src="balloon_exploded.png";
      remainingPumps = randomizeMaxPumps();
      exploded = true;
      stop();
    } else {
      exploded = false;
    }
  }

  //displays previous round stats and total stats in HUD
  function stop() {
    if (inRound) {
      let scoreP = document.getElementById("score");
      let score = parseFloat(scoreP.innerHTML);
      document.getElementById("scoreMessage").innerHTML = "Your final score for this round was:";

      if (exploded) {
        let lost = document.getElementById("lost");
        let pointsLost = parseFloat(lost.innerHTML);
        lost.innerHTML = "" + (pointsLost + score).toFixed(2);
        scoreP.innerHTML = "0.00";

      } else {
        let won = document.getElementById("won");
        let pointsWon = parseFloat(won.innerHTML);
        won.innerHTML = "" + (pointsWon + score).toFixed(2);
      }


      if (roundNum < roundLimit) {
        startTask();
      } else {
        endGame(false);
      }
    }

    inRound = false;
  }

  //End of all rounds, displays total experiment endscreen and screen cannot be left
  function endGame() {
      //display endscreen
      document.getElementById("game").className = "hidden";
      document.getElementById("ending").className = "showing";

      let wonPoints = document.getElementById("won").innerHTML;
      document.getElementById("finalWon").innerHTML += wonPoints;

      let lostPoints = document.getElementById("lost").innerHTML;
      document.getElementById("finalLost").innerHTML += lostPoints;

      if (document.getElementById("another_round") !== null) {
        document.getElementById("another_round").className = "hidden";
    }

    }
  }

  //Implement function that will export data, from endGame (perhaps in that function)
  //To csv/excel file format
)();
