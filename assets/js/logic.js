// variables to keep track of quiz state
var currentQuestionIndex = 0;
//time left value here
var time = 75;
// var for timer interval
var timerId;
//time deduction
var timePenalty = 10;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");

  // un-hide questions section
  questionsEl.removeAttribute("class");

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = questions[currentQuestionIndex].title;

  // clear out any old question choices
  choicesEl.innerHTML = "";

  // loop over choices
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    console.log(choice);
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // display on the page
    choicesEl.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonEl = event.target;
  //console.log(buttonEl) see what that logs and then check against that, may need something else after the buttonEl
  console.log(buttonEl.value);
  // if the clicked element is not a choice button, do  nothing.
  if (!buttonEl.matches(".choice")) {
    return;
  }

  // check if user guessed wrong
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    console.log("testing");
    // penalize time subtracts and displays at same times
    time -= timePenalty;
    timerEl.textContent = time;
  }

  // display new time on page

  // flash right/wrong feedback on page for half a second
  // //if (buttonEl.textContent === questions.currentQuestionIndex.answer) {
  //   feedbackEl.removeAttribute("class");
  // }

  // move to next question
  currentQuestionIndex++;

  console.log(currentQuestionIndex);

  // check if we've run out of questions or if time ran out?
  if (time <= 0 || questions.length === currentQuestionIndex) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // show final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  timerEl.textContent = time;
  // decrement the variable we are using to track time
  timerEl.textContent = time--; // update out time

  // if user is out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure value wasn't empty
  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array

    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify("highscores"));

    // redirect to next page
    window.location.href = "";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user submits initials
submitBtn.onclick = saveHighscore;

// user starts quiz
startBtn.onclick = startQuiz;

// user clicks on choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
