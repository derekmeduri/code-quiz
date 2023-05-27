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
    //
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
  // if the clicked element is not a choice button, do  nothing.
  if (!buttonEl.matches(".choice")) {
    return;
  }

  // check if user guessed wrong- easier than checking if user got it right.
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    //console log to see if we get it right or wrong "testing" prints when
    console.log("testing");
    // -= penalize time subtracts and displays at same times
    time -= timePenalty;
    //show new time on page attached to timer element
    timerEl.textContent = time;
  }

  // flash right/wrong feedback on page for half a second
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    feedbackEl.removeAttribute("class");
    var createEl = document.createElement("div");
    createEl.textContent = "Sorry, that is incorrect.";
  } else {
    feedbackEl.removeAttribute("class");
    var createEl = document.createElement("div");
    createEl.textContent = "That is correct!";
  }
  feedbackEl.append(createEl);
  // move to next question
  currentQuestionIndex++;

  //log to make sure we are progessing through questions
  //console.log(currentQuestionIndex);

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

  // hide feedback
  feedbackEl.setAttribute("class", "hide");
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
//declaring highscores as empty array
var highscores = [];

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value;

  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array

    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
    };
    //logging new score to see if it wokrs.
    console.log(newScore);
    // save to localstorage - not a function in browser?
    highscores.push(newScore);
    //logging highscore
    console.log(highscores);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect to next page
    window.location.href = "highscores.html";
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
