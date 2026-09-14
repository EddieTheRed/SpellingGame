const wordBank = [
  { clue: "A pet that says meow and purrs", answer: "cat" },
  { clue: "A tall plant with a trunk, branches, and leaves", answer: "tree" },
  { clue: "You wear this on your foot when you go outside", answer: "shoe" },
  { clue: "The bright star we see in the sky during the day", answer: "sun" },
  { clue: "You use this to eat soup or cereal", answer: "spoon" },
  { clue: "A bird that swims and says quack", answer: "duck" },
  { clue: "A building where a family can live", answer: "house" },
  { clue: "An animal that lives in water and has fins", answer: "fish" },
  { clue: "A piece of furniture made for one person to sit on", answer: "chair" },
  { clue: "Something with pages that you read", answer: "book" },
  { clue: "A pet that barks and wags its tail", answer: "dog" },
  { clue: "An animal with feathers, wings, and a beak", answer: "bird" },
  { clue: "A round toy you can throw, catch, or kick", answer: "ball" },
  { clue: "A vehicle with four wheels that drives on roads", answer: "car" },
  { clue: "Soft white flakes that fall from the sky in winter", answer: "snow" },
  { clue: "Drops of water that fall from clouds", answer: "rain" },
  { clue: "Clothing you wear over your clothes to stay warm", answer: "coat" },
  { clue: "Something that tells you what time it is", answer: "clock" },
  { clue: "The colourful part of a plant that can smell nice", answer: "flower" },
  { clue: "A small animal that hops and says ribbit", answer: "frog" },
  { clue: "A large four-legged animal that people can ride", answer: "horse" },
  { clue: "A very small animal with a long tail that squeaks", answer: "mouse" },
  { clue: "A vehicle with wings that carries people through the sky", answer: "plane" },
  { clue: "An animal with long ears that hops", answer: "rabbit" },
  { clue: "A hard piece of stone you might find on the ground", answer: "rock" },
  { clue: "A long animal with no legs that slithers", answer: "snake" },
  { clue: "The large round object that travels around Earth", answer: "moon" },
  { clue: "One of the tiny points of light you can see in the night sky", answer: "star" },
  { clue: "A vehicle that travels on railway tracks", answer: "train" },
  { clue: "A large road vehicle used to carry heavy things", answer: "truck" },
  { clue: "A round fruit that can be red, green, or yellow", answer: "apple" },
  { clue: "A sweet baked food often eaten at birthdays", answer: "cake" },
  { clue: "A farm animal that says moo and gives milk", answer: "cow" },
  { clue: "You open this to enter or leave a room", answer: "door" },
  { clue: "A vehicle that carries people across water", answer: "boat" },
  { clue: "A toy on a string that flies in the wind", answer: "kite" },
  { clue: "A flat green part that grows on a plant or tree", answer: "leaf" },
  { clue: "Something you wear on your head", answer: "hat" },
  { clue: "A piece of furniture you sleep in", answer: "bed" },
  { clue: "A small container you drink from", answer: "cup" }
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
