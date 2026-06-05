// Multiple Choice UI Component

/**
 * Render MC choices into a container.
 * @param {HTMLElement} container
 * @param {Array} choices - [{ id, letter, text, correct }]
 * @param {Function} onSelect - callback(choiceId)
 */
export function renderChoices(container, choices, onSelect) {
  container.innerHTML = '';
  container.classList.remove('answered');

  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'mc-choice';
    btn.dataset.id = choice.id;
    btn.innerHTML = `<span class="mc-letter">${choice.letter}</span><span class="mc-text">${choice.text}</span>`;
    btn.addEventListener('click', () => onSelect(choice.id), { once: true });
    container.appendChild(btn);
  });
}

/**
 * Visually mark the selected and correct choices after answering.
 * @param {HTMLElement} container
 * @param {string} selectedId
 * @param {string} correctId
 */
export function revealChoices(container, selectedId, correctId) {
  container.classList.add('answered');
  container.querySelectorAll('.mc-choice').forEach(btn => {
    btn.disabled = true;
    const id = btn.dataset.id;
    if (id === correctId) btn.classList.add('correct');
    if (id === selectedId && id !== correctId) btn.classList.add('incorrect');
  });
}
