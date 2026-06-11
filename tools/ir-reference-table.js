// IR Reference Table: CHM 251 Scope
// Source: Instructor-curated shortlist (IR_vibrations_list_subset.xlsx)
// Cross-referenced with Pavia, Silverstein, and CHM 251 teaching materials
// 35 entries: ~15 "must-know" (>1500 cm-1), remainder for labeling/study mode
//
// Used by: spectroscopy-converter.html, question app

/**
 * Build a display label from a reference table entry.
 * Example output: "O-H stretch (alcohol or phenol, H-bonded)"
 */
function buildIRLabel(entry) {
  return entry.bond + ' ' + entry.mode + ' (' + entry.assignment + ')';
}

const IR_REFERENCE_TABLE = [

  // ===== Zone 1: 3700-3200 cm-1 (O-H, N-H, sp C-H) =====

  { bond: 'O-H',
    mode: 'stretch',
    assignment: 'alcohol or phenol, non-H-bonded',
    range: [3600, 3650],
    intensity: 'w',
    shape: 'sharp',
    notes: 'dilute solutions' },

  { bond: 'O-H',
    mode: 'stretch',
    assignment: 'alcohol or phenol, H-bonded',
    range: [3200, 3400],
    intensity: 's',
    shape: 'very broad',
    notes: 'very broad smooth hump' },

  { bond: 'N-H',
    mode: 'stretch',
    assignment: 'amine or amide',
    range: [3100, 3500],
    intensity: 'v',
    shape: 'broad',
    notes: 'one or two peaks; stronger for amides and aromatic amines' },

  { bond: 'O-H',
    mode: 'stretch',
    assignment: 'carboxylic acid',
    range: [2400, 3400],
    intensity: 'm',
    shape: 'very broad',
    notes: 'very broad jagged band; overlaps alkyl C-H stretches' },

  { bond: '\u2261C-H',
    mode: 'stretch',
    assignment: 'alkyne, terminal',
    range: [3250, 3350],
    intensity: 's',
    shape: 'sharp',
    notes: '' },

  // ===== Zone 2: 3200-2700 cm-1 (C-H stretches) =====

  { bond: '=C-H',
    mode: 'stretch',
    assignment: 'alkene or aromatic',
    range: [3000, 3100],
    intensity: 'm',
    shape: '',
    notes: '' },

  { bond: '-C-H',
    mode: 'stretch',
    assignment: 'alkyl',
    range: [2850, 3000],
    intensity: 's-m',
    shape: '',
    notes: '' },

  { bond: 'O=C-H',
    mode: 'stretch',
    assignment: 'aldehyde',
    range: [2700, 2850],
    intensity: 'm-w',
    shape: '',
    notes: 'two peaks in this region; higher-frequency peak may overlap alkyl C-H stretches' },

  // ===== Zone 3: 2300-2100 cm-1 (triple bonds) =====

  { bond: 'C\u2261N',
    mode: 'stretch',
    assignment: 'nitrile',
    range: [2240, 2260],
    intensity: 's-m',
    shape: 'sharp',
    notes: '' },

  { bond: 'C\u2261C',
    mode: 'stretch',
    assignment: 'alkyne',
    range: [2100, 2250],
    intensity: 'w',
    shape: 'sharp',
    notes: '' },

  // ===== Aromatic overtones =====

  { bond: 'C=C',
    mode: 'overtone',
    assignment: 'aromatic',
    range: [1650, 2000],
    intensity: 'w',
    shape: 'group',
    notes: 'closely spaced group of one to four small peaks' },

  // ===== Zone 4: 1850-1600 cm-1 (carbonyl, double bonds) =====

  { bond: 'C=O',
    mode: 'stretch',
    assignment: 'carbonyl',
    range: [1630, 1830],
    intensity: 's',
    shape: '',
    notes: '' },

  { bond: 'C=C',
    mode: 'stretch',
    assignment: 'alkene',
    range: [1600, 1680],
    intensity: 'm-w',
    shape: 'sharp',
    notes: '' },

  // ===== Zone 5: 1680-1400 cm-1 (bends, aromatic C=C) =====

  { bond: 'N-H',
    mode: 'bend',
    assignment: 'amine or amide',
    range: [1500, 1650],
    intensity: 'v',
    shape: '',
    notes: 'may be broad; stronger for amides' },

  { bond: 'C=C',
    mode: 'stretch',
    assignment: 'aromatic ring',
    range: [1565, 1615],
    intensity: 's-m',
    shape: '',
    notes: 'one or two peaks in this region' },

  { bond: 'C=C',
    mode: 'stretch',
    assignment: 'aromatic ring',
    range: [1400, 1500],
    intensity: 's-m',
    shape: '',
    notes: 'one or two peaks in this region' },

  { bond: 'CH\u2082',
    mode: 'bend',
    assignment: 'alkyl, methylene',
    range: [1455, 1475],
    intensity: 'm',
    shape: '',
    notes: '' },

  { bond: 'CH\u2083',
    mode: 'bend',
    assignment: 'alkyl, methyl',
    range: [1440, 1460],
    intensity: 'm',
    shape: '',
    notes: '' },

  { bond: 'CH\u2083',
    mode: 'bend',
    assignment: 'alkyl, methyl',
    range: [1360, 1390],
    intensity: 's-m',
    shape: '',
    notes: 'two peaks for isopropyl or t-butyl' },

  // ===== Zone 6: Fingerprint region =====

  { bond: 'C-N',
    mode: 'stretch',
    assignment: 'amine or amide',
    range: [1000, 1400],
    intensity: 'v',
    shape: '',
    notes: 'generally stronger for amines' },

  { bond: 'C-O',
    mode: 'stretch',
    assignment: 'ether, ester, alcohol, or carboxylic acid',
    range: [900, 1320],
    intensity: 's-m',
    shape: '',
    notes: 'often broad' },

  { bond: 'C-F',
    mode: 'stretch',
    assignment: 'alkyl fluoride or aryl fluoride',
    range: [1000, 1400],
    intensity: 's',
    shape: '',
    notes: '' },

  { bond: 'CH\u2082X',
    mode: 'wag',
    assignment: 'haloalkane',
    range: [1150, 1300],
    intensity: 'm',
    shape: '',
    notes: '' },

  { bond: 'C-CO-C',
    mode: 'bend',
    assignment: 'ketone',
    range: [1100, 1300],
    intensity: 's-m',
    shape: 'sharp',
    notes: '' },

  { bond: 'C-Cl',
    mode: 'stretch',
    assignment: 'aryl chloride',
    range: [1050, 1100],
    intensity: 's',
    shape: '',
    notes: '' },

  { bond: 'C-Br',
    mode: 'stretch',
    assignment: 'aryl bromide',
    range: [1030, 1075],
    intensity: 's',
    shape: '',
    notes: '' },

  { bond: '=C-H',
    mode: 'oop',
    assignment: 'alkene',
    range: [650, 1000],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad' },

  { bond: '=C-H',
    mode: 'oop',
    assignment: 'aromatic',
    range: [720, 900],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad' },

  { bond: 'O-H',
    mode: 'oop',
    assignment: 'carboxylic acid',
    range: [910, 950],
    intensity: 'm-w',
    shape: 'broad',
    notes: '' },

  { bond: 'N-H',
    mode: 'oop',
    assignment: 'amine or amide',
    range: [600, 910],
    intensity: 'm',
    shape: 'broad',
    notes: '' },

  { bond: 'C-Cl',
    mode: 'stretch',
    assignment: 'alkyl chloride or acid chloride',
    range: [550, 790],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad; may have multiple peaks' },

  { bond: 'C-Br',
    mode: 'stretch',
    assignment: 'alkyl bromide',
    range: [500, 650],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad; may have multiple peaks' },

  { bond: 'C-I',
    mode: 'stretch',
    assignment: 'alkyl iodide',
    range: [485, 600],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad; may have multiple peaks' },

  { bond: 'C-H',
    mode: 'rock',
    assignment: 'alkyl, long-chain',
    range: [715, 725],
    intensity: 'm',
    shape: '',
    notes: '' },

  { bond: '\u2261C-H',
    mode: 'bend',
    assignment: 'alkyne, terminal',
    range: [610, 700],
    intensity: 's',
    shape: 'broad',
    notes: '' },

  { bond: 'C=C',
    mode: 'oop',
    assignment: 'aromatic',
    range: [660, 720],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad' },

];
