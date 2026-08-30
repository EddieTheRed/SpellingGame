const wordBank = [
  {
    "clue": "A popular pet that purrs",
    "answer": "cat"
  },
  {
    "clue": "I have leaves and make up forests",
    "answer": "tree"
  },
  {
    "clue": "You wear me on your foot",
    "answer": "shoe"
  },
  {
    "clue": "I shine in the sky during the day",
    "answer": "sun"
  },
  {
    "clue": "You use me to eat soup",
    "answer": "spoon"
  },
  {
    "clue": "I say quack",
    "answer": "duck"
  },
  {
    "clue": "I am a home for people",
    "answer": "house"
  },
  {
    "clue": "I swim and live in water",
    "answer": "fish"
  },
  {
    "clue": "You sit on me",
    "answer": "chair"
  },
  {
    "clue": "I have pages and you read me",
    "answer": "book"
  },
  {
    "clue": "I bark and wag my tail",
    "answer": "dog"
  },
  {
    "clue": "I fly in the sky and have feathers",
    "answer": "bird"
  },
  {
    "clue": "I am round and you can throw me",
    "answer": "ball"
  },
  {
    "clue": "I carry people on roads",
    "answer": "car"
  },
  {
    "clue": "I am cold, white, and fall in winter",
    "answer": "snow"
  },
  {
    "clue": "I come from clouds and make things wet",
    "answer": "rain"
  },
  {
    "clue": "You wear me when it is cold",
    "answer": "coat"
  },
  {
    "clue": "I tell you what time it is",
    "answer": "clock"
  },
  {
    "clue": "I grow in gardens and can smell nice",
    "answer": "flower"
  },
  {
    "clue": "I am green and can hop",
    "answer": "frog"
  },
  {
    "clue": "I am a large animal you can ride",
    "answer": "horse"
  },
  {
    "clue": "I am small, furry, and like cheese",
    "answer": "mouse"
  },
  {
    "clue": "I can fly people through the sky",
    "answer": "plane"
  },
  {
    "clue": "I have long ears and I hop",
    "answer": "rabbit"
  },
  {
    "clue": "I am a small stone",
    "answer": "rock"
  },
  {
    "clue": "I am long, have no legs, and slither",
    "answer": "snake"
  },
  {
    "clue": "I shine in the sky at night",
    "answer": "moon"
  },
  {
    "clue": "I sparkle in the night sky",
    "answer": "star"
  },
  {
    "clue": "I can carry people on tracks",
    "answer": "train"
  },
  {
    "clue": "I am a large road vehicle that carries things",
    "answer": "truck"
  },
  {
    "clue": "I grow on a tree and can be red or green",
    "answer": "apple"
  },
  {
    "clue": "I am baked and often eaten on birthdays",
    "answer": "cake"
  },
  {
    "clue": "I live on a farm and say moo",
    "answer": "cow"
  },
  {
    "clue": "You open me to enter a room",
    "answer": "door"
  },
  {
    "clue": "I float on water and carry people",
    "answer": "boat"
  },
  {
    "clue": "I fly on a string in the wind",
    "answer": "kite"
  },
  {
    "clue": "I grow on branches and can fall in autumn",
    "answer": "leaf"
  },
  {
    "clue": "You wear me on your head",
    "answer": "hat"
  },
  {
    "clue": "You sleep in me at night",
    "answer": "bed"
  },
  {
    "clue": "You drink water from me",
    "answer": "cup"
  }
];

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultsScreen = document.getElementById("results-screen");

const countButtons = document.querySelectorAll(".choice");
const startButton = document.getElementById("start-button");
const answerForm = document.getElementById("answer-form");
const answerInput = document.getElementById("answer");
const clueEl = document.getElementById("clue");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const feedbackEl = document.getElementById("feedback");
const finalScoreEl = document.getElementById("final-score");
const gaugeFillEl = document.getElementById("gauge-fill");
const gaugeMessageEl = document.getElementById("gauge-message");
const viewAnswersButton = document.getElementById("view-answers");
const answersPanel = document.getElementById("answers-panel");
const resultsListEl = document.getElementById("results-list");
const playAgainButton = document.getElementById("play-again");

let questionCount = 10;
let questions = [];
let currentIndex = 0;
let attempt = 1;
let score = 0;
let results = [];
let locked = false;

countButtons.forEach((button) => {
  button.addEventListener("click", () => {
    countButtons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    questionCount = Number(button.dataset.count);
  });
});

startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", showStartScreen);
viewAnswersButton.addEventListener("click", toggleAnswers);
answerForm.addEventListener("submit", checkAnswer);

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startGame() {
  questions = shuffle(wordBank).slice(0, questionCount);
  currentIndex = 0;
  attempt = 1;
  score = 0;
  results = [];
  locked = false;

  startScreen.classList.remove("active");
  resultsScreen.classList.remove("active");
  gameScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  const question = questions[currentIndex];
  clueEl.textContent = question.clue;
  progressEl.textContent = `${currentIndex + 1} / ${questions.length}`;
  scoreEl.textContent = `Score: ${score}`;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  answerInput.value = "";
  answerInput.disabled = false;
  locked = false;
  attempt = 1;
  answerInput.focus();
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function checkAnswer(event) {
  event.preventDefault();
  if (locked) return;

  const typed = normalize(answerInput.value);
  if (!typed) {
    feedbackEl.textContent = "Type an answer first.";
    feedbackEl.className = "feedback incorrect";
    answerInput.focus();
    return;
  }

  const question = questions[currentIndex];
  const correct = typed === question.answer.toLowerCase();

  if (correct) {
    const points = attempt === 1 ? 2 : 1;
    score += points;
    results.push({
      clue: question.clue,
      answer: question.answer,
      points,
      attempt
    });

    feedbackEl.textContent =
      attempt === 1 ? "Correct! 2 points." : "Correct! 1 point.";
    feedbackEl.className = "feedback correct";
    finishQuestion();
    return;
  }

  if (attempt === 1) {
    attempt = 2;
    feedbackEl.textContent = "Not quite. Try one more time for 1 point.";
    feedbackEl.className = "feedback incorrect";
    answerInput.select();
    return;
  }

  results.push({
    clue: question.clue,
    answer: question.answer,
    points: 0,
    attempt: 2
  });

  feedbackEl.textContent = `The answer was "${question.answer}".`;
  feedbackEl.className = "feedback incorrect";
  finishQuestion();
}

function finishQuestion() {
  locked = true;
  answerInput.disabled = true;
  scoreEl.textContent = `Score: ${score}`;

  setTimeout(() => {
    currentIndex += 1;
    if (currentIndex >= questions.length) {
      showResults();
    } else {
      showQuestion();
    }
  }, 1200);
}

function showResults() {
  gameScreen.classList.remove("active");
  resultsScreen.classList.add("active");

  const maxScore = questions.length * 2;
  const percentage = Math.round((score / maxScore) * 100);

  finalScoreEl.textContent = `${score} / ${maxScore} points (${percentage}%)`;

  gaugeFillEl.style.width = "0%";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      gaugeFillEl.style.width = `${percentage}%`;
    });
  });

  if (percentage >= 90) {
    gaugeMessageEl.textContent = "Excellent spelling!";
  } else if (percentage >= 75) {
    gaugeMessageEl.textContent = "Great job!";
  } else if (percentage >= 50) {
    gaugeMessageEl.textContent = "Good work — keep practicing!";
  } else {
    gaugeMessageEl.textContent = "Keep practicing — you’re getting there!";
  }

  answersPanel.hidden = true;
  viewAnswersButton.textContent = "View Answers";
  viewAnswersButton.setAttribute("aria-expanded", "false");

  resultsListEl.innerHTML = "";

  results.forEach((result) => {
    const row = document.createElement("div");
    row.className = "result-row";

    const details = document.createElement("div");
    const word = document.createElement("strong");
    word.textContent = result.answer;

    const clue = document.createElement("div");
    clue.className = "result-clue";
    clue.textContent = result.clue;

    details.append(word, clue);

    const points = document.createElement("div");
    points.className = "result-points";
    points.textContent = `${result.points} pt${result.points === 1 ? "" : "s"}`;

    row.append(details, points);
    resultsListEl.appendChild(row);
  });
}

function toggleAnswers() {
  const shouldShow = answersPanel.hidden;
  answersPanel.hidden = !shouldShow;
  viewAnswersButton.textContent = shouldShow ? "Hide Answers" : "View Answers";
  viewAnswersButton.setAttribute("aria-expanded", String(shouldShow));
}

function showStartScreen() {
  resultsScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  startScreen.classList.add("active");
}
