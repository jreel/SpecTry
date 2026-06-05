// SpecTry Question App - Entry Point

import { QuestionEngine } from './question-engine.js';
import { renderIR } from './renderers/ir-renderer.js';
import * as IRIdentifyPeak from './questions/ir-identify-peak.js';
import { renderChoices, revealChoices } from './ui/multiple-choice.js';
import { renderFeedback, clearFeedback } from './ui/feedback.js';

// --- DOM refs ---
const spectrumEl    = document.getElementById('spectrum-container');
const questionEl    = document.getElementById('question-text');
const choicesEl     = document.getElementById('choices-container');
const feedbackEl    = document.getElementById('feedback-container');
const nextBtn       = document.getElementById('next-btn');
const scoreCorrect  = document.getElementById('score-correct');
const scoreTotal    = document.getElementById('score-total');
const difficultyEl  = document.getElementById('difficulty-select');
const loadingEl     = document.getElementById('loading');

// --- State ---
const engine = new QuestionEngine('../data');
engine.registerType('ir-identify-peak', IRIdentifyPeak);

let currentQuestion = null;
let score = { correct: 0, total: 0 };

// --- Renderers by question type ---
const RENDERERS = {
  'ir-identify-peak': (compound, question) => {
    renderIR(spectrumEl, compound, {
      showName: false,
      showFormula: false,
      showMW: false,
      showSignalLabels: false,
      showTooltipLabels: false,
      highlightWavenumber: question.highlightWavenumber,
    });
  },
};

// --- Core flow ---

async function nextQuestion() {
  const difficulty = difficultyEl.value;

  // Reset UI
  clearFeedback(feedbackEl);
  nextBtn.classList.add('hidden');
  spectrumEl.innerHTML = '';
  choicesEl.innerHTML = '';
  questionEl.textContent = '';
  loadingEl.classList.remove('hidden');

  try {
    // For now, only one question type; will expand later
    const typeName = 'ir-identify-peak';
    const question = await engine.generateQuestion(typeName, difficulty);

    if (!question) {
      questionEl.textContent = 'Could not generate a question. Try a different difficulty level.';
      loadingEl.classList.add('hidden');
      return;
    }

    currentQuestion = question;

    // Render spectrum
    const renderer = RENDERERS[question.type];
    if (renderer) renderer(question.compound, question);

    // Show question
    questionEl.textContent = question.prompt;

    // Render choices
    renderChoices(choicesEl, question.choices, handleAnswer);

  } catch (e) {
    questionEl.textContent = 'Error loading question: ' + e.message;
    console.error(e);
  } finally {
    loadingEl.classList.add('hidden');
  }
}

function handleAnswer(choiceId) {
  if (!currentQuestion) return;

  const selected = currentQuestion.choices.find(c => c.id === choiceId);
  const correctChoice = currentQuestion.choices.find(c => c.correct);
  const isCorrect = selected.correct;

  // Update score
  score.total++;
  if (isCorrect) score.correct++;
  scoreCorrect.textContent = score.correct;
  scoreTotal.textContent = score.total;

  // Reveal correct/incorrect on choices
  revealChoices(choicesEl, choiceId, correctChoice.id);

  // Get the question type module for feedback
  const typeModule = engine.types[currentQuestion.type];
  const explanation = typeModule.explain(currentQuestion, selected);

  // Show feedback
  renderFeedback(feedbackEl, isCorrect, explanation);

  // Show next button
  nextBtn.classList.remove('hidden');
  nextBtn.focus();
}

// --- Event listeners ---
nextBtn.addEventListener('click', nextQuestion);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // A-D to select answers
  if (!choicesEl.classList.contains('answered') && currentQuestion) {
    const letter = e.key.toUpperCase();
    if (['A', 'B', 'C', 'D'].includes(letter)) {
      const btn = choicesEl.querySelector(`[data-id="${letter}"]`);
      if (btn && !btn.disabled) btn.click();
    }
  }
  // Enter or Space for next question
  if ((e.key === 'Enter' || e.key === ' ') && !nextBtn.classList.contains('hidden')) {
    e.preventDefault();
    nextQuestion();
  }
});

// --- Init ---
async function init() {
  try {
    await engine.loadManifest();
    nextQuestion();
  } catch (e) {
    questionEl.textContent = 'Could not load compound library: ' + e.message;
    console.error(e);
  }
}

init();
