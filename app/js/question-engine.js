// Question Engine
// Loads compounds, selects questions, delegates to question type modules.

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class QuestionEngine {
  constructor(dataPath = '../data') {
    this.dataPath = dataPath;
    this.manifest = [];
    this.types = {};
    this.cache = {};
  }

  /** Register a question type module. */
  registerType(name, mod) {
    this.types[name] = mod;
  }

  /** Load the compound manifest. */
  async loadManifest() {
    const resp = await fetch(`${this.dataPath}/compounds.json`);
    if (!resp.ok) throw new Error('Could not load compound manifest');
    this.manifest = await resp.json();
  }

  /** Load a single compound by ID (cached). */
  async loadCompound(id) {
    if (this.cache[id]) return this.cache[id];
    const resp = await fetch(`${this.dataPath}/${id}.json`);
    if (!resp.ok) throw new Error(`Could not load ${id}.json`);
    const data = await resp.json();
    this.cache[id] = data;
    return data;
  }

  /**
   * Generate a question of the given type and difficulty.
   * Tries random compounds until one works.
   * @returns {{ question, compound }} or null
   */
  async generateQuestion(typeName, difficulty = 'medium') {
    const type = this.types[typeName];
    if (!type) throw new Error(`Unknown question type: ${typeName}`);

    const order = shuffle(this.manifest);

    for (const entry of order) {
      try {
        const compound = await this.loadCompound(entry.id);
        if (type.canGenerate && !type.canGenerate(compound)) continue;
        const question = type.generate(compound, difficulty);
        if (question) return question;
      } catch (e) {
        console.warn(`Skipping ${entry.id}:`, e.message);
      }
    }

    return null;
  }

  /** Get list of registered type names. */
  getTypeNames() {
    return Object.keys(this.types);
  }
}
