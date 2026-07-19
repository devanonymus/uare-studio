"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileDown,
  RotateCcw,
} from "lucide-react";
import { auditSections } from "@/lib/audit-sections";
import {
  calculateSectionScore,
  calculateTotalScore,
  getPriority,
  getScoreLabel,
} from "@/lib/audit-score";
import type {
  AuditAnswers,
  RestaurantData,
} from "@/types/audit";

type AuditSummaryProps = {
  restaurant: RestaurantData;
  answers: AuditAnswers;
  onBack: () => void;
  onRestart: () => void;
};

const priorityStyles = {
  critica: "border-red-500/25 bg-red-500/8 text-red-300",
  alta: "border-orange-500/25 bg-orange-500/8 text-orange-300",
  media: "border-amber-400/25 bg-amber-400/8 text-amber-200",
  bassa: "border-emerald-400/25 bg-emerald-400/8 text-emerald-300",
};

export function AuditSummary({
  restaurant,
  answers,
  onBack,
  onRestart,
}: AuditSummaryProps) {
  const totalScore = calculateTotalScore(answers);
  const totalPriority = getPriority(totalScore);

  const weakestSections = auditSections
    .map((section) => ({
      section,
      score: calculateSectionScore(section, answers),
    }))
    .sort((first, second) => first.score - second.score);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-6 border-b border-white/[0.06] pb-8 md:flex-row md:items-end">
        <div>
          <p className="text-[9px] uppercase tracking-[0.36em] text-[#caa563]">
            Report preliminare
          </p>

          <h1 className="font-display mt-3 text-4xl text-[#f4eee5] md:text-5xl">
            {restaurant.restaurantName || "Ristorante analizzato"}
          </h1>

          <p className="mt-3 text-sm text-white/36">
            {restaurant.projectName || "Audit digitale"} ·{" "}
            {restaurant.city || "Località non indicata"}
          </p>
        </div>

        <div
          className={`w-fit rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] ${priorityStyles[totalPriority]}`}
        >
          Priorità complessiva: {totalPriority}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="panel flex min-h-[350px] flex-col items-center justify-center rounded-[32px] p-8 text-center">
          <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">
            Digital Experience Score
          </p>

          <div className="relative mt-8 flex size-52 items-center justify-center rounded-full border border-[#caa563]/20 bg-[#caa563]/[0.035]">
            <div className="absolute inset-3 rounded-full border border-white/[0.04]" />
            <div>
              <p className="font-display text-7xl leading-none text-[#f0d18c]">
                {totalScore}
              </p>
              <p className="mt-2 text-xs text-white/30">su 100</p>
            </div>
          </div>

          <h2 className="font-display mt-7 text-2xl text-[#f3eee5]">
            {getScoreLabel(totalScore)}
          </h2>
        </section>

        <section className="panel rounded-[32px] p-6 md:p-8">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">
            Valutazione per area
          </p>

          <div className="mt-6 space-y-5">
            {auditSections.map((section) => {
              const score = calculateSectionScore(section, answers);
              const priority = getPriority(score);

              return (
                <div key={section.id}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-white/68">
                      {section.shortTitle}
                    </p>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[8px] uppercase tracking-[0.16em] ${priorityStyles[priority]}`}
                      >
                        {priority}
                      </span>
                      <span className="w-9 text-right text-xs text-white/44">
                        {score}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7c5523] to-[#dfbd78]"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="panel mt-6 rounded-[32px] p-6 md:p-8">
        <div className="flex items-center gap-3">
          <AlertTriangle
            size={18}
            strokeWidth={1.5}
            className="text-[#d7b36d]"
          />
          <div>
            <p className="text-[9px] uppercase tracking-[0.27em] text-white/28">
              Aree prioritarie
            </p>
            <h2 className="font-display mt-1 text-2xl text-[#f3eee5]">
              Dove intervenire per prima
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {weakestSections.slice(0, 3).map(({ section, score }, index) => (
            <article
              key={section.id}
              className="rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#caa563]">
                  Priorità {index + 1}
                </span>
                <span className="font-display text-2xl text-white/70">
                  {score}
                </span>
              </div>

              <h3 className="mt-5 text-sm font-medium text-white/80">
                {section.title}
              </h3>

              <p className="mt-3 text-xs leading-5 text-white/34">
                {section.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel mt-6 rounded-[32px] p-6 md:p-8">
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={18}
            strokeWidth={1.5}
            className="text-emerald-300"
          />
          <div>
            <p className="text-[9px] uppercase tracking-[0.27em] text-white/28">
              Passaggio successivo
            </p>
            <h2 className="font-display mt-1 text-2xl text-[#f3eee5]">
              Costruzione del piano di trasformazione
            </h2>
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-6 text-white/38">
          Nella prossima fase la piattaforma trasformerà automaticamente
          criticità, note e punteggi in raccomandazioni operative, pacchetti
          commerciali e report PDF professionale.
        </p>
      </section>

      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs text-white/52 transition hover:border-white/20 hover:text-white"
        >
          <ArrowLeft size={15} />
          Torna all’audit
        </button>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs text-white/52 transition hover:border-white/20 hover:text-white"
          >
            <RotateCcw size={15} />
            Nuovo audit
          </button>

          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#d1aa62]/45 px-5 py-3 text-xs text-[#171008]/65"
          >
            <FileDown size={15} />
            Esporta PDF
          </button>
        </div>
      </div>
    </div>
  );
}
