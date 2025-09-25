import { Work } from "@/types/work";

function normalizeValue(value: string | null | undefined): string {
  if (!value) {
    return "";
  }
  return value
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function hasMatch(list: string[] | null | undefined, term: string): boolean {
  if (!list || list.length === 0) {
    return false;
  }
  const normalizedTerm = normalizeValue(term);
  return list.some((item) => normalizeValue(item) === normalizedTerm);
}

function textContains(text: string | null | undefined, term: string): boolean {
  if (!text) {
    return false;
  }
  const normalizedText = normalizeValue(text);
  const normalizedTerm = normalizeValue(term);
  return normalizedTerm !== "" && normalizedText.includes(normalizedTerm);
}

export function scoreWork(work: Work, pos: string[], anti: string[]): number {
  let score = 0;

  pos.forEach((term) => {
    if (hasMatch(work.genres, term)) {
      score += 3;
    }
    if (hasMatch(work.themes, term)) {
      score += 2;
    }
    if (normalizeValue(work.demographic) === normalizeValue(term)) {
      score += 1;
    }
    if (textContains(work.title, term) || textContains(work.synopsis, term)) {
      score += 1;
    }
  });

  anti.forEach((term) => {
    if (
      hasMatch(work.genres, term) ||
      hasMatch(work.themes, term) ||
      normalizeValue(work.demographic) === normalizeValue(term) ||
      textContains(work.title, term) ||
      textContains(work.synopsis, term)
    ) {
      score -= 2;
    }
  });

  if (work.year && work.year >= 2015) {
    score += 0.2;
  }

  return score;
}

export function rankWorks(
  works: Work[],
  pos: string[],
  anti: string[],
  type: "anime" | "manga" | null,
  limit = 8
): Array<Work & { score: number }> {
  const filtered = type ? works.filter((work) => work.type === type) : works;

  const ranked = filtered
    .map((work) => ({
      work,
      score: scoreWork(work, pos, anti)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ work, score }) => ({
      ...work,
      score: Number(score.toFixed(2))
    }));

  return ranked;
}
