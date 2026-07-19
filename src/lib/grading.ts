import type { StoredCase } from "./store";

export function rankFor(percent: number) {
  if (percent >= 100) return "Master Detective";
  if (percent >= 85) return "Senior Detective";
  if (percent >= 65) return "Detective";
  if (percent >= 40) return "Junior Detective";
  return "Trainee";
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

export function gradeAnswers(
  stored: StoredCase,
  answers: Record<string, string>,
) {
  const qs = stored.questions ?? [];
  let correct = 0;
  const detail: { id: string; question: string; correct: boolean; expected: string; given: string }[] = [];

  for (const q of qs) {
    const given = (answers[q.id] ?? "").trim();
    const expected: string =
      typeof q.answer === "string"
        ? q.answer
        : Array.isArray(q.answer)
          ? q.answer[0]
          : "";
    const alts: string[] = Array.isArray(q.acceptedAnswers)
      ? q.acceptedAnswers
      : [];
    const pool = [expected, ...alts].filter(Boolean).map(norm);
    const ok = pool.length > 0 && pool.includes(norm(given));
    if (ok) correct++;
    detail.push({ id: q.id, question: q.question, correct: ok, expected, given });
  }

  const total = qs.length || 1;
  const percent = Math.round((correct / total) * 100);
  return { correct, total, percent, rank: rankFor(percent), detail };
}
