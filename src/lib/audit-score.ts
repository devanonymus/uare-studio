import { auditSections } from "@/lib/audit-sections";
import type {
  AuditAnswers,
  AuditPriority,
  AuditSection,
} from "@/types/audit";

export function calculateSectionScore(
  section: AuditSection,
  answers: AuditAnswers,
): number {
  const totals = section.questions.reduce(
    (result, question) => {
      const answer = answers[question.id];
      const score = answer?.score ?? 0;

      return {
        value: result.value + score * question.weight,
        weight: result.weight + question.weight,
      };
    },
    { value: 0, weight: 0 },
  );

  if (totals.weight === 0) {
    return 0;
  }

  return Math.round((totals.value / (totals.weight * 10)) * 100);
}

export function calculateTotalScore(answers: AuditAnswers): number {
  const sectionScores = auditSections.map((section) =>
    calculateSectionScore(section, answers),
  );

  if (sectionScores.length === 0) {
    return 0;
  }

  return Math.round(
    sectionScores.reduce((total, score) => total + score, 0) /
      sectionScores.length,
  );
}

export function getPriority(score: number): AuditPriority {
  if (score <= 30) return "critica";
  if (score <= 50) return "alta";
  if (score <= 70) return "media";
  return "bassa";
}

export function getScoreLabel(score: number): string {
  if (score <= 30) return "Presenza digitale critica";
  if (score <= 50) return "Presenza digitale debole";
  if (score <= 70) return "Presenza digitale migliorabile";
  if (score <= 85) return "Presenza digitale solida";
  return "Esperienza digitale di eccellenza";
}
