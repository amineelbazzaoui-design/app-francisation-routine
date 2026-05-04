const sentences = [
  "Je me réveille à six heures.",
  "Je prends un bon petit déjeuner.",
  "Je vais à l'école en autobus.",
  "À midi, je mange avec mes amis.",
  "Après l'école, je fais mes devoirs.",
  "Le soir, je me couche à neuf heures."
];

const target = document.getElementById("target");
const wordBank = document.getElementById("word-bank");
const verifyBtn = document.getElementById("verify-btn");
const resetBtn = document.getElementById("reset-btn");
const nextBtn = document.getElementById("next-btn");
const feedback = document.getElementById("feedback");
const currentNumber = document.getElementById("current-number");
const totalNumber = document.getElementById("total-number");

let sentenceIndex = 0;
let selectedWords = [];
let availableWords = [];

totalNumber.textContent = sentences.length;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalize(text) {
  return text.replace(/\s+/g, " ").trim();
}

function tokenize(sentence) {
  return sentence.match(/[\wÀ-ÿ']+|[.,!?;:]/g) || [];
}

function render() {
  target.innerHTML = "";
  wordBank.innerHTML = "";

  selectedWords.forEach((word, idx) => {
    const button = document.createElement("button");
    button.className = "btn word";
    button.textContent = word;
    button.addEventListener("click", () => {
      selectedWords.splice(idx, 1);
      availableWords.push(word);
      render();
    });
    target.appendChild(button);
  });

  availableWords.forEach((word, idx) => {
    const button = document.createElement("button");
    button.className = "btn word";
    button.textContent = word;
    button.addEventListener("click", () => {
      availableWords.splice(idx, 1);
      selectedWords.push(word);
      render();
    });
    wordBank.appendChild(button);
  });
}

function loadSentence() {
  const sentence = sentences[sentenceIndex];
  const tokens = tokenize(sentence);
  selectedWords = [];
  availableWords = shuffle(tokens);

  currentNumber.textContent = sentenceIndex + 1;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextBtn.disabled = true;

  render();
}

function checkAnswer() {
  const studentSentence = normalize(selectedWords.join(" "))
    .replace(/\s+([.,!?;:])/g, "$1");
  const correctSentence = normalize(sentences[sentenceIndex]);

  if (studentSentence === correctSentence) {
    feedback.textContent = "Bravo ! C'est la bonne phrase.";
    feedback.className = "feedback success";
    nextBtn.disabled = sentenceIndex === sentences.length - 1;
  } else {
    feedback.textContent = "Essaie encore.";
    feedback.className = "feedback error";
  }
}

verifyBtn.addEventListener("click", checkAnswer);
resetBtn.addEventListener("click", loadSentence);
nextBtn.addEventListener("click", () => {
  if (sentenceIndex < sentences.length - 1) {
    sentenceIndex += 1;
    loadSentence();
  }
});

loadSentence();
