// Question Type: IR Identify Peak (#9a)
// "What functional group is responsible for the absorption near X cm⁻¹?"
//
// DESIGN: The correct answer comes directly from the compound JSON's
// assignment text. The DISTRACTOR_POOL provides plausible wrong answers
// and wavenumber range data for feedback.

// --- Category inference ---
// Ordered by specificity: check "acid chloride" before "acid", etc.
const CATEGORY_MAP = [
  { cat: 'acid_chloride', kw: ['acid chloride', 'acyl chloride'] },
  { cat: 'anhydride',     kw: ['anhydride'] },
  { cat: 'acid',          kw: ['carboxylic acid', 'carboxylic'] },
  { cat: 'amide',         kw: ['amide'] },
  { cat: 'ester',         kw: ['ester', 'lactone'] },
  { cat: 'aldehyde',      kw: ['aldehyde'] },
  { cat: 'ketone',        kw: ['ketone'] },
  { cat: 'alcohol',       kw: ['alcohol', 'phenol'] },
  { cat: 'amine',         kw: ['amine'] },
  { cat: 'nitrile',       kw: ['nitrile'] },
  { cat: 'nitro',         kw: ['nitro'] },
  { cat: 'alkyne',        kw: ['alkyne'] },
  { cat: 'alkene',        kw: ['alkene', 'vinyl'] },
  { cat: 'aromatic',      kw: ['aromatic', 'arene'] },
  { cat: 'ether',         kw: ['ether'] },
  { cat: 'alkane',        kw: ['alkane', 'alkyl', 'aliphatic', 'sp3', 'sp\u00b3'] },
  { cat: 'halide',        kw: ['halide', 'chloro', 'bromo', 'fluoro'] },
  { cat: 'carbonyl',      kw: ['carbonyl'] },
];

// When the correct category is generic, also exclude its specific subtypes
// from distractors (e.g., "C=O stretch (carbonyl)" should not have
// "C=O stretch (ester)" as a distractor).
const RELATED_CATEGORIES = {
  carbonyl: ['ester', 'ketone', 'aldehyde', 'acid', 'amide', 'acid_chloride', 'anhydride'],
};

function inferCategory(assignment) {
  const text = assignment.toLowerCase();
  for (const { cat, kw } of CATEGORY_MAP) {
    if (kw.some(k => text.includes(k))) return cat;
  }
  return null;
}

// --- Distractor pool ---
// Labels formatted in the same style as JSON assignments so MC choices
// look consistent. Range data is used for feedback.
const DISTRACTOR_POOL = [
  // High-frequency stretch region
  { label: 'O-H stretch (alcohol)',            cat: 'alcohol',       range: [3200, 3550], center: 3375 },
  { label: 'O-H stretch (carboxylic acid)',    cat: 'acid',          range: [2500, 3300], center: 2900 },
  { label: 'N-H stretch (amine)',              cat: 'amine',         range: [3300, 3500], center: 3400 },
  { label: 'N-H stretch (amide)',              cat: 'amide',         range: [3180, 3500], center: 3340 },
  { label: '\u2261C-H stretch (alkyne)',       cat: 'alkyne',        range: [3260, 3330], center: 3295 },
  { label: '=C-H stretch (alkene/aromatic)',   cat: 'alkene',        range: [3000, 3100], center: 3050 },
  { label: 'C-H stretch (alkyl)',              cat: 'alkane',        range: [2840, 3000], center: 2920 },
  { label: 'C-H stretch (aldehyde)',           cat: 'aldehyde',      range: [2700, 2830], center: 2765 },
  // Triple bond region
  { label: 'C\u2261N stretch (nitrile)',       cat: 'nitrile',       range: [2200, 2260], center: 2230 },
  { label: 'C\u2261C stretch (alkyne)',        cat: 'alkyne',        range: [2100, 2260], center: 2150 },
  // Carbonyl / double bond region
  { label: 'C=O stretch (acid chloride)',      cat: 'acid_chloride', range: [1770, 1815], center: 1800 },
  { label: 'C=O stretch (anhydride)',          cat: 'anhydride',     range: [1800, 1850], center: 1820 },
  { label: 'C=O stretch (ester)',              cat: 'ester',         range: [1735, 1750], center: 1742 },
  { label: 'C=O stretch (aldehyde)',           cat: 'aldehyde',      range: [1720, 1740], center: 1730 },
  { label: 'C=O stretch (carboxylic acid)',    cat: 'acid',          range: [1700, 1725], center: 1712 },
  { label: 'C=O stretch (ketone)',             cat: 'ketone',        range: [1705, 1725], center: 1715 },
  { label: 'C=O stretch (amide)',              cat: 'amide',         range: [1630, 1690], center: 1660 },
  { label: 'C=C stretch (alkene)',             cat: 'alkene',        range: [1630, 1680], center: 1655 },
  { label: 'C=C stretch (aromatic)',           cat: 'aromatic',      range: [1450, 1625], center: 1537 },
  { label: 'N=O stretch (nitro, asym.)',       cat: 'nitro',         range: [1515, 1560], center: 1537 },
  // Fingerprint region
  { label: 'C-O stretch (ester)',              cat: 'ester',         range: [1150, 1300], center: 1225 },
  { label: 'C-O stretch (carboxylic acid)',    cat: 'acid',          range: [1200, 1315], center: 1260 },
  { label: 'C-O stretch (alcohol)',            cat: 'alcohol',       range: [1000, 1150], center: 1075 },
  { label: 'C-O-C stretch (ether)',            cat: 'ether',         range: [1050, 1150], center: 1100 },
  { label: 'C-X stretch (alkyl halide)',       cat: 'halide',        range: [500, 850],   center: 675 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Generate distractor choices by difficulty, excluding the correct category. */
function generateDistractors(correctCat, wavenumber, difficulty, count = 3) {
  const related = RELATED_CATEGORIES[correctCat] || [];
  const excludeCats = new Set([correctCat, ...related]);
  const candidates = DISTRACTOR_POOL.filter(d => !excludeCats.has(d.cat));
  candidates.forEach(c => { c._dist = Math.abs(c.center - wavenumber); });

  let pool;
  if (difficulty === 'easy') {
    pool = candidates.filter(c => c._dist > 400);
  } else if (difficulty === 'hard') {
    pool = candidates.filter(c => c._dist < 350);
  } else {
    const close = candidates.filter(c => c._dist < 350);
    const far = candidates.filter(c => c._dist > 400);
    if (close.length >= 1 && far.length >= 2) {
      return [shuffle(close)[0], ...shuffle(far).slice(0, 2)];
    }
    pool = candidates;
  }

  if (pool.length < count) pool = candidates;
  return shuffle(pool).slice(0, count);
}

/** Find a DISTRACTOR_POOL entry matching category + wavenumber (for feedback ranges). */
function findPoolEntry(category, wavenumber) {
  const matches = DISTRACTOR_POOL.filter(d =>
    d.cat === category && wavenumber >= d.range[0] - 50 && wavenumber <= d.range[1] + 50
  );
  if (matches.length === 0) return null;
  return matches.find(d => wavenumber >= d.range[0] && wavenumber <= d.range[1]) || matches[0];
}

/** Check for structural elements missing from the compound's formula. */
function getMissingElement(distractor, formula) {
  if (!formula) return null;
  const cat = distractor.cat;
  if (['amine', 'amide', 'nitrile', 'nitro'].includes(cat) && !formula.includes('N'))
    return 'nitrogen';
  if (['alcohol', 'ester', 'acid', 'ketone', 'aldehyde', 'ether',
       'anhydride', 'acid_chloride', 'amide', 'carbonyl'].includes(cat) && !formula.includes('O'))
    return 'oxygen';
  if ((cat === 'halide' || cat === 'acid_chloride') && !/Cl|Br|F[^e]|I/.test(formula))
    return 'halogens';
  return null;
}

// Signals above this wavenumber are always question-worthy.
// Below it (fingerprint region), only C-O, C-X, and aromatic stretches are fair game.
const FINGERPRINT_BOUNDARY = 1500;
const FINGERPRINT_ALLOWED = new Set(['alcohol', 'ester', 'acid', 'ether', 'halide', 'aromatic']);

/** Check if a signal is suitable for a question. */
function isQuestionWorthy(signal) {
  if (!signal.assignment) return false;
  if (!signal.assignment.toLowerCase().includes('stretch')) return false;
  const cat = inferCategory(signal.assignment);
  if (!cat) return false;
  if (signal.wavenumber < FINGERPRINT_BOUNDARY && !FINGERPRINT_ALLOWED.has(cat)) return false;
  return true;
}

// --- Public API ---

/** Check if a compound can produce this question type. */
export function canGenerate(compound) {
  const ir = compound.IR;
  if (!ir?.curve?.length || !ir?.signal_labels) return false;
  return Object.values(ir.signal_labels).some(s => isQuestionWorthy(s));
}

/** Generate a question. Correct answer = JSON assignment text. */
export function generate(compound, difficulty = 'medium') {
  const ir = compound.IR;
  if (!ir?.curve?.length || !ir?.signal_labels) return null;

  const labels = Object.entries(ir.signal_labels);
  if (labels.length === 0) return null;

  for (const [key, signal] of shuffle(labels)) {
    if (!isQuestionWorthy(signal)) continue;

    const category = inferCategory(signal.assignment);
    if (!category) continue;

    const distractors = generateDistractors(category, signal.wavenumber, difficulty);
    if (distractors.length < 3) continue;

    // Correct answer uses JSON assignment text directly
    const poolEntry = findPoolEntry(category, signal.wavenumber);
    const correctAbsorption = poolEntry
      || { label: signal.assignment, cat: category, range: null, center: signal.wavenumber };

    const choices = [
      { text: signal.assignment, correct: true, absorption: correctAbsorption },
      ...distractors.slice(0, 3).map(d => ({
        text: d.label, correct: false, absorption: d
      }))
    ];

    const shuffledChoices = shuffle(choices);
    shuffledChoices.forEach((c, i) => {
      c.letter = String.fromCharCode(65 + i);
      c.id = c.letter;
    });

    const intensityText = signal.intensity ? `${signal.intensity} ` : '';
    return {
      type: 'ir-identify-peak',
      compound,
      prompt: `What functional group is responsible for the ${intensityText}absorption near ${signal.wavenumber} cm\u207B\u00B9?`,
      targetSignal: { key, ...signal },
      correctAbsorption,
      choices: shuffledChoices,
      difficulty,
      highlightWavenumber: signal.wavenumber,
    };
  }

  return null;
}

/** Generate feedback text. */
export function explain(question, selectedChoice) {
  const wn = question.targetSignal.wavenumber;
  const correctText = question.targetSignal.assignment;
  const correctRange = question.correctAbsorption.range;
  const formula = question.compound.formula || '';

  if (selectedChoice.correct) {
    let text = `The absorption at ${wn} cm\u207B\u00B9 is ${correctText.toLowerCase()}`;
    if (correctRange) text += ` (typically ${correctRange[0]}\u2013${correctRange[1]} cm\u207B\u00B9)`;
    text += '.';
    if (question.correctAbsorption.notes) text += ' ' + question.correctAbsorption.notes;
    return text;
  }

  const wrong = selectedChoice.absorption;
  const wrongRange = wrong.range;
  const wnInWrongRange = wrongRange && wn >= wrongRange[0] && wn <= wrongRange[1];
  const missingEl = getMissingElement(wrong, formula);

  let text;
  if (wnInWrongRange && missingEl) {
    text = `While ${wn} cm\u207B\u00B9 does fall within the range for ${wrong.label} (${wrongRange[0]}\u2013${wrongRange[1]} cm\u207B\u00B9), this compound\u2019s molecular formula (${formula}) contains no ${missingEl}, ruling out that assignment.`;
  } else if (wnInWrongRange) {
    text = `While ${wn} cm\u207B\u00B9 does fall within the range for ${wrong.label} (${wrongRange[0]}\u2013${wrongRange[1]} cm\u207B\u00B9), the compound\u2019s structure indicates this is ${correctText.toLowerCase()}.`;
  } else if (wrongRange && missingEl) {
    text = `${wrong.label} typically appears at ${wrongRange[0]}\u2013${wrongRange[1]} cm\u207B\u00B9, which doesn\u2019t match ${wn} cm\u207B\u00B9. Additionally, this compound\u2019s formula (${formula}) contains no ${missingEl}.`;
  } else if (wrongRange) {
    text = `${wrong.label} typically appears at ${wrongRange[0]}\u2013${wrongRange[1]} cm\u207B\u00B9, which doesn\u2019t match the observed ${wn} cm\u207B\u00B9.`;
  } else {
    text = `The observed absorption doesn\u2019t match ${selectedChoice.text}.`;
  }

  text += ` The correct answer is ${correctText.toLowerCase()}`;
  if (correctRange) text += ` (${correctRange[0]}\u2013${correctRange[1]} cm\u207B\u00B9)`;
  text += '.';
  if (question.correctAbsorption.notes) text += ' ' + question.correctAbsorption.notes;
  return text;
}
