// IR Reference Table: CHM 251 Scope
// Source: Instructor-curated shortlist (IR_vibrations_list_subset.xlsx)
// Cross-referenced with Pavia, Silverstein, and CHM 251 teaching materials
// 37 entries: ~15 "must-know" (>1500 cm-1), remainder for labeling/study mode
//
// Used by: spectroscopy-converter.html, question app
//
// The `requires` field gates suggestions by molecular formula context.
// It is used by the converter for dropdown filtering and sidebar filtering.
// The question app may ignore it.

/**
 * Build a display label from a reference table entry.
 * Example output: "O-H stretch (alcohol or phenol, H-bonded)"
 */
function buildIRLabel(entry) {
  return entry.bond + ' ' + entry.mode + ' (' + entry.assignment + ')';
}

// Shorthand helpers for requires functions
const _hasO  = ctx => (ctx.O || 0) > 0;
const _hasN  = ctx => (ctx.N || 0) > 0;
const _hasF  = ctx => (ctx.F || 0) > 0;
const _hasCl = ctx => (ctx.Cl || 0) > 0;
const _hasBr = ctx => (ctx.Br || 0) > 0;
const _hasI  = ctx => (ctx.I || 0) > 0;
const _hasHalogen = ctx => _hasF(ctx) || _hasCl(ctx) || _hasBr(ctx) || _hasI(ctx);
const _hasDoubleBond = ctx => (ctx.ihd || 0) >= 1;
const _hasTripleBond = ctx => (ctx.ihd || 0) >= 2;
const _couldBeAromatic = ctx => (ctx.ihd || 0) >= 4 && (ctx.C || 0) >= 6;

const IR_REFERENCE_TABLE = [

  // ===== Zone 1: 3700-3200 cm-1 (O-H, N-H, sp C-H) =====

  { bond: 'O-H',
    mode: 'stretch',
    assignment: 'alcohol or phenol, non-H-bonded',
    range: [3580, 3700],
    intensity: 'w',
    shape: 'sharp',
    notes: 'dilute solutions',
    requires: _hasO },

  { bond: 'O-H',
    mode: 'stretch',
    assignment: 'alcohol or phenol, H-bonded',
    range: [3200, 3550],
    intensity: 's',
    shape: 'very broad',
    notes: 'very broad smooth hump',
    requires: _hasO },

  { bond: 'N-H',
    mode: 'stretch',
    assignment: 'amine or amide',
    range: [3100, 3500],
    intensity: 'v',
    shape: 'broad',
    notes: 'one or two peaks; stronger for amides and aromatic amines',
    requires: _hasN },

  { bond: 'O-H',
    mode: 'stretch',
    assignment: 'carboxylic acid',
    range: [2400, 3400],
    intensity: 'm',
    shape: 'very broad',
    notes: 'very broad jagged band; overlaps alkyl C-H stretches',
    requires: ctx => _hasDoubleBond(ctx) && (ctx.O || 0) >= 2 },

  { bond: '\u2261C-H',
    mode: 'stretch',
    assignment: 'alkyne, terminal',
    range: [3250, 3350],
    intensity: 's',
    shape: 'sharp',
    notes: '',
    requires: _hasTripleBond },

  // ===== Zone 2: 3200-2700 cm-1 (C-H stretches) =====

  { bond: '=C-H',
    mode: 'stretch',
    assignment: 'alkene or aromatic',
    range: [3000, 3100],
    intensity: 'm',
    shape: '',
    notes: '',
    requires: _hasDoubleBond },

  { bond: '-C-H',
    mode: 'stretch',
    assignment: 'alkyl',
    range: [2840, 3010],
    intensity: 's-m',
    shape: '',
    notes: '',
    requires: null },

  { bond: 'O=C-H',
    mode: 'stretch',
    assignment: 'aldehyde',
    range: [2700, 2850],
    intensity: 'm-w',
    shape: '',
    notes: 'two peaks in this region; higher-frequency peak may overlap alkyl C-H stretches',
    requires: ctx => _hasO(ctx) && _hasDoubleBond(ctx) },

  // ===== Zone 3: 2300-2100 cm-1 (triple bonds) =====

  { bond: 'C\u2261N',
    mode: 'stretch',
    assignment: 'nitrile',
    range: [2210, 2260],
    intensity: 's-m',
    shape: 'sharp',
    notes: '',
    requires: ctx => _hasN(ctx) && _hasTripleBond(ctx) },

  { bond: 'C\u2261C',
    mode: 'stretch',
    assignment: 'alkyne',
    range: [2100, 2260],
    intensity: 'w',
    shape: 'sharp',
    notes: '',
    requires: _hasTripleBond },

  // ===== Aromatic overtones =====

  { bond: 'C=C-H',
    mode: 'overtone',
    assignment: 'aromatic',
    range: [1650, 2000],
    intensity: 'w',
    shape: 'group',
    notes: 'closely spaced group of one to four small peaks',
    requires: _couldBeAromatic },

  // ===== Zone 4: 1850-1600 cm-1 (carbonyl, double bonds) =====

  { bond: 'C=O',
    mode: 'stretch',
    assignment: 'carbonyl',
    range: [1630, 1850],
    intensity: 's',
    shape: '',
    notes: 'anhydrides and acid chlorides at higher frequencies; amides at lower frequencies',
    requires: ctx => _hasO(ctx) && _hasDoubleBond(ctx) },

  { bond: '=C-H',
    mode: 'bend',
    assignment: 'alkene, vinyl or vinylidene',
    range: [1750, 1860],
    intensity: 'm',
    shape: '',
    notes: 'vinyl at higher frequency',
    requires: _hasDoubleBond },

  { bond: 'C=C',
    mode: 'stretch',
    assignment: 'alkene',
    range: [1600, 1680],
    intensity: 'm-w',
    shape: 'sharp',
    notes: 'conjugated alkenes at lower frequencies',
    requires: _hasDoubleBond },

  // ===== Zone 5: 1680-1400 cm-1 (bends, aromatic C=C) =====

  { bond: 'N-H',
    mode: 'bend',
    assignment: 'amine or amide',
    range: [1490, 1640],
    intensity: 'v',
    shape: '',
    notes: 'may be broad; stronger for amides; primary at higher frequency',
    requires: _hasN },

  { bond: 'C=C',
    mode: 'stretch',
    assignment: 'aromatic ring',
    range: [1440, 1625],
    intensity: 'v',
    shape: '',
    notes: 'one to four peaks in this region',
    requires: _couldBeAromatic },

  { bond: 'C-H',
    mode: 'bend',
    assignment: 'methyl, methylene, vinyl, or vinylidene',
    range: [1410, 1485],
    intensity: 'm',
    shape: '',
    notes: 'alkenes at lower frequencies',
    requires: null },

  { bond: 'O-H',
    mode: 'bend',
    assignment: 'alcohol, phenol, or carboxylic acid',
    range: [1260, 1440],
    intensity: 'm',
    shape: '',
    notes: '',
    requires: _hasO },

  // ===== Zone 6: Near fingerprint region (1400-1000 cm-1) =====

  { bond: 'C-C',
    mode: 'stretch',
    assignment: 'alkyl',
    range: [800, 1500],
    intensity: 'w',
    shape: '',
    notes: 'isopropyl and t-butyl between 1080-1280; t-butyl at higher frequency',
    requires: null },

  { bond: 'C-F',
    mode: 'stretch',
    assignment: 'alkyl fluoride or aryl fluoride',
    range: [1000, 1400],
    intensity: 's',
    shape: '',
    notes: '',
    requires: _hasF },

  { bond: 'C-H',
    mode: 'bend',
    assignment: 'methyl, acetyl, methine, or aldehyde O=C-H',
    range: [1335, 1400],
    intensity: 's-m',
    shape: '',
    notes: 'two peaks for isopropyl or t-butyl',
    requires: null },

  { bond: 'C-N',
    mode: 'stretch',
    assignment: 'amine or amide',
    range: [1020, 1360],
    intensity: 'v',
    shape: '',
    notes: 'generally stronger for amines; higher frequency for aromatic and tertiary amines',
    requires: _hasN },

  { bond: 'C-O',
    mode: 'stretch',
    assignment: 'ether, ester, alcohol, carboxylic acid, or anhydride',
    range: [900, 1350],
    intensity: 's-m',
    shape: '',
    notes: 'often broad',
    requires: _hasO },

  { bond: 'C-CO-C',
    mode: 'bend',
    assignment: 'ketone',
    range: [1100, 1300],
    intensity: 's-m',
    shape: 'sharp',
    notes: '',
    requires: ctx => _hasO(ctx) && _hasDoubleBond(ctx) },

  { bond: 'X-C-H',
    mode: 'wag',
    assignment: 'haloalkane',
    range: [1150, 1300],
    intensity: 'm',
    shape: '',
    notes: '',
    requires: _hasHalogen },

  { bond: 'C-Cl',
    mode: 'stretch',
    assignment: 'aryl chloride',
    range: [1050, 1100],
    intensity: 's',
    shape: '',
    notes: '',
    requires: ctx => _hasCl(ctx) && _couldBeAromatic(ctx) },

  { bond: 'C-Br',
    mode: 'stretch',
    assignment: 'aryl bromide',
    range: [1030, 1075],
    intensity: 's',
    shape: '',
    notes: '',
    requires: ctx => _hasBr(ctx) && _couldBeAromatic(ctx) },

  // ===== Zone 7: Far fingerprint region (1000-500 cm-1) =====

  { bond: '=C-H',
    mode: 'oop',
    assignment: 'alkene',
    range: [660, 1000],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad',
    requires: _hasDoubleBond },

  { bond: 'O-H',
    mode: 'oop',
    assignment: 'carboxylic acid',
    range: [910, 950],
    intensity: 'm-w',
    shape: 'broad',
    notes: '',
    requires: ctx => _hasDoubleBond(ctx) && (ctx.O || 0) >= 2 },

  { bond: 'N-H',
    mode: 'oop',
    assignment: 'amine or amide',
    range: [600, 910],
    intensity: 'm',
    shape: 'broad',
    notes: '',
    requires: _hasN },

  { bond: 'O-H',
    mode: 'oop',
    assignment: 'alcohol or phenol',
    range: [650, 770],
    intensity: 'm-w',
    shape: 'broad',
    notes: '',
    requires: _hasO },

  { bond: 'C=C-H',
    mode: 'oop',
    assignment: 'aromatic',
    range: [650, 910],
    intensity: 's',
    shape: '',
    notes: 'more substitution moves to lower frequencies',
    requires: _couldBeAromatic },

  { bond: 'C-Cl',
    mode: 'stretch',
    assignment: 'alkyl chloride or acid chloride',
    range: [550, 850],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad; may have multiple peaks',
    requires: _hasCl },

  { bond: 'C-H',
    mode: 'rock',
    assignment: 'alkyl, long-chain',
    range: [715, 725],
    intensity: 'm',
    shape: '',
    notes: '',
    requires: null },

  { bond: '\u2261C-H',
    mode: 'bend',
    assignment: 'alkyne, terminal',
    range: [610, 700],
    intensity: 's',
    shape: 'broad',
    notes: '',
    requires: _hasTripleBond },

  { bond: 'C-Br',
    mode: 'stretch',
    assignment: 'alkyl bromide',
    range: [510, 650],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad; may have multiple peaks',
    requires: _hasBr },

  { bond: 'C-I',
    mode: 'stretch',
    assignment: 'alkyl iodide',
    range: [485, 600],
    intensity: 's',
    shape: '',
    notes: 'may be sharp or broad; may have multiple peaks',
    requires: _hasI },

];
