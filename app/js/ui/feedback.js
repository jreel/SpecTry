// Feedback UI Component

/**
 * Show feedback after answering a question.
 * @param {HTMLElement} container
 * @param {boolean} isCorrect
 * @param {string} explanation
 */
export function renderFeedback(container, isCorrect, explanation) {
  container.className = 'feedback ' + (isCorrect ? 'feedback-correct' : 'feedback-incorrect');
  container.innerHTML = `
    <p class="feedback-verdict">${isCorrect ? '\u2713 Correct!' : '\u2717 Not quite.'}</p>
    <p class="feedback-text">${explanation}</p>
  `;
}

/** Hide the feedback area. */
export function clearFeedback(container) {
  container.className = 'feedback hidden';
  container.innerHTML = '';
}
