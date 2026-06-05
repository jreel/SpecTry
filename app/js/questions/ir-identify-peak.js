// Question Type: IR Identify Peak (#9a)
// "What functional group is responsible for the absorption near X cm⁻¹?"

// Curated diagnostic absorptions for CHM 251.
// Each entry represents a key absorption students should recognize.
const DIAGNOSTIC_ABSORPTIONS = [
  // --- High-frequency stretch region (>3000) ---
  { id: 'oh_alcohol', label: 'Alcohol O\u2013H stretch', cat: 'alcohol',
    range: [3200, 3550], center: 3375,
    keywords: ['alcohol', 'phenol'], vibKw: ['o-h', 'o\u2013h'] },
  { id: 'oh_acid', label: 'Carboxylic acid O\u2013H stretch', cat: 'acid',
    range: [2500, 3300], center: 2900,
    keywords: ['carboxylic', 'acid'], vibKw: ['o-h', 'o\u2013h'] },
  { id: 'nh_amine', label: 'Amine N\u2013H stretch', cat: 'amine',
    range: [3300, 3500], center: 3400,
    keywords: ['amine'], vibKw: ['n-h', 'n\u2013h'] },
  { id: 'nh_amide', label: 'Amide N\u2013H stretch', cat: 'amide',
    range: [3180, 3500], center: 3340,
    keywords: ['amide'], vibKw: ['n-h', 'n\u2013h'] },
  { id: 'ch_sp', label: 'Alkyne \u2261C\u2013H stretch', cat: 'alkyne',
    range: [3260, 3330], center: 3295,
    keywords: ['alkyne', 'terminal'], vibKw: ['\u2261c-h'] },
  { id: 'ch_sp2', label: 'Alkene/aromatic =C\u2013H stretch', cat: 'alkene',
    range: [3000, 3100], center: 3050,
    keywords: ['alkene', 'aromatic', 'vinyl', 'arene'], vibKw: ['=c-h'] },
  { id: 'ch_sp3', label: 'Alkyl C\u2013H stretch', cat: 'alkane',
    range: [2840, 3000], center: 2920,
    keywords: ['alkyl', 'aliphatic', 'methyl', 'methylene', 'methine'], vibKw: ['-c-h'] },
  { id: 'ch_aldehyde', label: 'Aldehyde C\u2013H stretch', cat: 'aldehyde',
    range: [2700, 2830], center: 2765,
    keywords: ['aldehyde'], vibKw: ['c-h stretch'] },

  // --- Triple bond region (2000-2500) ---
  { id: 'cn_nitrile', label: 'Nitrile C\u2261N stretch', cat: 'nitrile',
    range: [2200, 2260], center: 2230,
    keywords: ['nitrile'], vibKw: ['c\u2261n', 'c-n'] },
  { id: 'cc_alkyne', label: 'Alkyne C\u2261C stretch', cat: 'alkyne',
    range: [2100, 2260], center: 2150,
    keywords: ['alkyne'], vibKw: ['c\u2261c', 'c-c'] },

  // --- Carbonyl / double bond region (1600-1850) ---
  { id: 'co_acid_chloride', label: 'Acid chloride C=O stretch', cat: 'acid_chloride',
    range: [1770, 1815], center: 1800,
    keywords: ['acid chloride', 'acyl chloride'], vibKw: ['c=o'] },
  { id: 'co_anhydride', label: 'Anhydride C=O stretch', cat: 'anhydride',
    range: [1800, 1850], center: 1820,
    keywords: ['anhydride'], vibKw: ['c=o'] },
  { id: 'co_ester', label: 'Ester C=O stretch', cat: 'ester',
    range: [1735, 1750], center: 1742,
    keywords: ['ester', 'lactone'], vibKw: ['c=o'] },
  { id: 'co_aldehyde', label: 'Aldehyde C=O stretch', cat: 'aldehyde',
    range: [1720, 1740], center: 1730,
    keywords: ['aldehyde'], vibKw: ['c=o'] },
  { id: 'co_acid', label: 'Carboxylic acid C=O stretch', cat: 'acid',
    range: [1700, 1725], center: 1712,
    keywords: ['carboxylic', 'acid'], vibKw: ['c=o'] },
  { id: 'co_ketone', label: 'Ketone C=O stretch', cat: 'ketone',
    range: [1705, 1725], center: 1715,
    keywords: ['ketone'], vibKw: ['c=o'] },
  { id: 'co_amide', label: 'Amide C=O stretch (Amide I)', cat: 'amide',
    range: [1630, 1690], center: 1660,
    keywords: ['amide'], vibKw: ['c=o'] },
  { id: 'cc_alkene', label: 'Alkene C=C stretch', cat: 'alkene',
    range: [1630, 1680], center: 1655,
    keywords: ['alkene'], vibKw: ['c=c'] },
  { id: 'cc_aromatic', label: 'Aromatic C=C stretch', cat: 'aromatic',
    range: [1450, 1625], center: 1537,
    keywords: ['aromatic', 'arene', 'ring'], vibKw: ['c=c'] },
  { id: 'no_nitro', label: 'Nitro N=O stretch (asym.)', cat: 'nitro',
    range: [1515, 1560], center: 1537,
    keywords: ['nitro'], vibKw: ['n=o', 'n-o'] },

  // --- Fingerprint region ---
  { id: 'co_ester_low', label: 'Ester C\u2013O stretch', cat: 'ester',
    range: [1150, 1300], center: 1225,
    keywords: ['ester'], vibKw: ['c-o stretch', 'c\u2013o'] },
  { id: 'co_alcohol_low', label: 'Alcohol C\u2013O stretch', cat: 'alcohol',
    range: [1000, 1150], center: 1075,
    keywords: ['alcohol'], vibKw: ['c-o stretch', 'c\u2013o'] },
  { id: 'coc_ether', label: 'Ether C\u2013O\u2013C stretch', cat: 'ether',
    range: [1050, 1150], center: 1100,
    keywords: ['ether'], vibKw: ['c-o-c', 'c\u2013o'] },
  { id: 'cx_halide', label: 'Alkyl halide C\u2013X stretch', cat: 'halide',
    range: [500, 850], center: 675,
    keywords: ['halide', 'chloro', 'bromo', 'fluoro', 'c-cl', 'c-br', 'c-f'], vibKw: ['c-x', 'stretch'] },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Match a compound's IR signal_label to the best diagnostic absorption. */
function matchSignal(signal) {
  const wn = signal.wavenumber;
  const text = (signal.assignment || '').toLowerCase();

  let best = null, bestScore = 0;

  for (const abs of DIAGNOSTIC_ABSORPTIONS) {
    let score = 0;

    // Wavenumber in range
    if (wn >= abs.range[0] && wn <= abs.range[1]) score += 10;
    else if (wn >= abs.range[0] - 50 && wn <= abs.range[1] + 50) score += 2;
    else continue; // too far, skip

    // Category keyword match (strongest signal)
    for (const kw of abs.keywords) {
      if (text.includes(kw)) { score += 8; break; }
    }
    // Vibration keyword match
    for (const kw of abs.vibKw) {
      if (text.includes(kw)) { score += 3; break; }
    }

    if (score > bestScore) { bestScore = score; best = abs; }
  }

  return bestScore >= 13 ? best : null; // require wavenumber + at least one keyword match
}

/** Generate distractor choices based on difficulty. */
function generateDistractors(correct, difficulty, count = 3) {
  // Exclude same-id AND same-cat to avoid near-duplicate choices
  const candidates = DIAGNOSTIC_ABSORPTIONS.filter(
    a => a.id !== correct.id && a.cat !== correct.cat
  );

  candidates.forEach(c => {
    c._dist = Math.abs(c.center - correct.center);
  });

  let pool;
  if (difficulty === 'easy') {
    pool = candidates.filter(c => c._dist > 400);
  } else if (difficulty === 'hard') {
    pool = candidates.filter(c => c._dist < 350);
    // Hard mode: allow same-cat if there aren't enough cross-cat options
    if (pool.length < count) {
      const sameCat = DIAGNOSTIC_ABSORPTIONS.filter(
        a => a.id !== correct.id && a.cat === correct.cat
      );
      pool = [...pool, ...sameCat];
    }
  } else {
    // Medium: 1 close + 2 far
    const close = candidates.filter(c => c._dist < 350);
    const far = candidates.filter(c => c._dist > 400);
    if (close.length >= 1 && far.length >= 2) {
      return [
        shuffle(close)[0],
        ...shuffle(far).slice(0, 2)
      ];
    }
    pool = candidates;
  }

  if (pool.length < count) pool = candidates;
  return shuffle(pool).slice(0, count);
}

/** Check if a compound can produce this question type. */
export function canGenerate(compound) {
  const ir = compound.IR;
  if (!ir?.curve?.length || !ir?.signal_labels) return false;
  const labels = Object.values(ir.signal_labels);
  return labels.some(s => matchSignal(s) !== null);
}

/** Generate a question for the given compound and difficulty. */
export function generate(compound, difficulty = 'medium') {
  const ir = compound.IR;
  if (!ir?.curve?.length || !ir?.signal_labels) return null;

  const labels = Object.entries(ir.signal_labels);
  if (labels.length === 0) return null;

  const shuffled = shuffle(labels);

  for (const [key, signal] of shuffled) {
    const match = matchSignal(signal);
    if (!match) continue;

    const distractors = generateDistractors(match, difficulty);
    if (distractors.length < 3) continue;

    const choices = [
      { text: match.label, correct: true, absorption: match },
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
      correctAbsorption: match,
      choices: shuffledChoices,
      difficulty,
      highlightWavenumber: signal.wavenumber,
    };
  }

  return null;
}

/**
 * Check which required element is missing from a compound's formula
 * for a given diagnostic absorption category.
 * Returns a human-readable element name, or null if all required elements are present.
 */
function getMissingElement(absorption, formula) {
  if (!formula) return null;
  const cat = absorption.cat;
  // Nitrogen-containing groups
  if (['amine', 'amide', 'nitrile', 'nitro'].includes(cat) && !formula.includes('N')) {
    return 'nitrogen';
  }
  // Oxygen-containing groups (amide needs both N and O; N checked above)
  if (['alcohol', 'ester', 'acid', 'ketone', 'aldehyde', 'ether',
       'anhydride', 'acid_chloride', 'amide', 'carbonyl'].includes(cat) && !formula.includes('O')) {
    return 'oxygen';
  }
  // Halogen-containing groups
  if ((cat === 'halide' || cat === 'acid_chloride') && !/Cl|Br|F[^e]|I/.test(formula)) {
    return 'halogens';
  }
  return null;
}

/** Generate feedback text explaining why the answer is right or wrong. */
export function explain(question, selectedChoice) {
  const correct = question.correctAbsorption;
  const wn = question.targetSignal.wavenumber;
  const formula = question.compound.formula || '';

  if (selectedChoice.correct) {
    let text = `The absorption at ${wn} cm\u207B\u00B9 falls within the expected range for ${correct.label.toLowerCase()} (${correct.range[0]}\u2013${correct.range[1]} cm\u207B\u00B9).`;
    if (correct.notes) text += ' ' + correct.notes;
    return text;
  }

  const wrong = selectedChoice.absorption;
  const wnInWrongRange = wn >= wrong.range[0] && wn <= wrong.range[1];
  const missingEl = getMissingElement(wrong, formula);

  let text;

  if (wnInWrongRange && missingEl) {
    // Wavenumber overlaps but compound lacks required element
    text = `While ${wn} cm\u207B\u00B9 does fall within the range for ${wrong.label.toLowerCase()} (${wrong.range[0]}\u2013${wrong.range[1]} cm\u207B\u00B9), this compound\u2019s molecular formula (${formula}) contains no ${missingEl}, ruling out that assignment.`;
  } else if (wnInWrongRange) {
    // Wavenumber overlaps and elements are present; use compound context
    text = `While ${wn} cm\u207B\u00B9 does fall within the range for ${wrong.label.toLowerCase()} (${wrong.range[0]}\u2013${wrong.range[1]} cm\u207B\u00B9), the compound\u2019s structure indicates this is actually ${correct.label.toLowerCase()}.`;
  } else if (missingEl) {
    // Wavenumber out of range AND missing element
    text = `${wrong.label} typically appears at ${wrong.range[0]}\u2013${wrong.range[1]} cm\u207B\u00B9, which doesn\u2019t match ${wn} cm\u207B\u00B9. Additionally, this compound\u2019s formula (${formula}) contains no ${missingEl}.`;
  } else {
    // Wavenumber simply out of range
    text = `${wrong.label} typically appears at ${wrong.range[0]}\u2013${wrong.range[1]} cm\u207B\u00B9, which doesn\u2019t match the observed ${wn} cm\u207B\u00B9.`;
  }

  text += ` The correct answer is ${correct.label.toLowerCase()} (${correct.range[0]}\u2013${correct.range[1]} cm\u207B\u00B9).`;
  if (correct.notes) text += ' ' + correct.notes;
  return text;
}
