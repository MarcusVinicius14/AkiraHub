const STOPWORDS_LIST = [
  "de",
  "da",
  "do",
  "e",
  "ou",
  "um",
  "uma",
  "para",
  "sem",
  "muito",
  "muita",
  "que",
  "com",
  "por",
  "no",
  "na",
  "nos",
  "nas",
  "os",
  "as",
  "dos",
  "das",
  "ao",
  "aos",
  "mais",
  "menos",
  "of",
  "life",
  "curto",
  "gosto",
  "quero",
  "algo",
  "nao"
];

export const STOPWORDS = new Set(STOPWORDS_LIST);

const SYNONYM_MAP: Record<string, string> = {
  slice: "slice of life",
  shonen: "shounen",
  romantico: "romance",
  romantica: "romance",
  acao: "ação",
  terror: "horror"
};

const NEGATION_WORDS = new Set(["sem", "nao", "não", "odeio", "detesto"]);

function normalizeBase(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function cleanToken(token: string): string {
  const normalized = normalizeBase(token).trim();
  if (!normalized || STOPWORDS.has(normalized)) {
    return "";
  }
  const mapped = SYNONYM_MAP[normalized] ?? normalized;
  return mapped;
}

export function tokenize(text: string): string[] {
  if (!text) {
    return [];
  }
  const normalized = normalizeBase(text);
  const rawTokens = normalized.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const filtered = rawTokens.filter((token) => !STOPWORDS.has(token));
  return filtered;
}

export function normalizeSynonyms(tokens: string[]): string[] {
  const mapped = tokens
    .map((token) => {
      const normalized = normalizeBase(token);
      if (!normalized) {
        return "";
      }
      return SYNONYM_MAP[normalized] ?? normalized;
    })
    .filter((token) => !!token);

  return Array.from(new Set(mapped));
}

export function parsePreferences(message: string): { pos: string[]; anti: string[] } {
  if (!message) {
    return { pos: [], anti: [] };
  }

  const normalized = normalizeBase(message);
  const rawTokens = normalized.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

  const positives: string[] = [];
  const negatives: string[] = [];

  let captureNegation = false;

  for (let i = 0; i < rawTokens.length; i += 1) {
    const token = rawTokens[i];
    if (!token) {
      continue;
    }

    if ((token === "nao" || token === "não") && rawTokens[i + 1] === "curto") {
      captureNegation = true;
      i += 1; // Skip "curto"
      continue;
    }

    if (NEGATION_WORDS.has(token)) {
      captureNegation = true;
      continue;
    }

    if (STOPWORDS.has(token)) {
      continue;
    }

    if (captureNegation) {
      const cleaned = cleanToken(token);
      if (cleaned) {
        negatives.push(cleaned);
      }
      captureNegation = false;
    } else {
      const cleaned = cleanToken(token);
      if (cleaned) {
        positives.push(cleaned);
      }
    }
  }

  return {
    pos: Array.from(new Set(normalizeSynonyms(positives))),
    anti: Array.from(new Set(normalizeSynonyms(negatives)))
  };
}
