const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultsScreen = document.getElementById("results-screen");

const themeSelect = document.getElementById("theme-select");
const themeDescription = document.getElementById("theme-description");
const questionCountNote = document.getElementById("question-count-note");
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

let selectedThemeKey = "normal";
let questionCount = 10;
let questions = [];
let currentIndex = 0;
let attempt = 1;
let score = 0;
let results = [];
let locked = false;

initializeThemes();

countButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) return;
    countButtons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    questionCount = Number(button.dataset.count);
  });
});

themeSelect.addEventListener("change", () => {
  selectedThemeKey = themeSelect.value;
  updateThemeUI();
});

startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", showStartScreen);
viewAnswersButton.addEventListener("click", toggleAnswers);
answerForm.addEventListener("submit", checkAnswer);

function initializeThemes() {
  Object.entries(themes).forEach(([key, theme]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = theme.name;
    themeSelect.appendChild(option);
  });

  themeSelect.value = selectedThemeKey;
  updateThemeUI();
}

function updateThemeUI() {
  const theme = themes[selectedThemeKey];
  const availableQuestions = theme.questions.length;

  themeDescription.textContent = theme.description || "";

  countButtons.forEach((button) => {
    button.disabled = Number(button.dataset.count) > availableQuestions;
  });

  if (questionCount > availableQuestions) {
    const validCounts = [...countButtons]
      .map((button) => Number(button.dataset.count))
      .filter((count) => count <= availableQuestions);

    questionCount = Math.max(...validCounts);

    countButtons.forEach((button) => {
      button.classList.toggle(
        "selected",
        Number(button.dataset.count) === questionCount
      );
    });
  }

  questionCountNote.textContent =
    `${availableQuestions} questions available in this theme.`;
}

function shuffle(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function startGame() {
  const theme = themes[selectedThemeKey];

  questions = shuffle(theme.questions).slice(0, questionCount);
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
  updateThemeUI();
}
