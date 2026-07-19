"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { generateQuickAudit } from "@/lib/quick-audit-engine";
import type {
  QuickAuditInput,
  QuickAuditResult,
} from "@/types/quick-audit";
import { QuickAuditResultView } from "@/components/quick-audit/QuickAuditResultView";

const INPUT_KEY = "uare-quick-audit-input";
const RESULT_KEY = "uare-quick-audit-result";

const phases = [
  {
    title: "Raccolta delle evidenze digitali",
    detail: "Verifica dei principali punti di contatto",
  },
  {
    title: "Analisi del sito e dell’esperienza mobile",
    detail: "Valutazione di struttura, chiarezza e conversione",
  },
  {
    title: "Analisi SEO e Google Business",
    detail: "Visibilità locale, reputazione e indicizzazione",
  },
  {
    title: "Analisi social e comunicazione food",
    detail: "Coerenza, contenuti, frequenza e capacità attrattiva",
  },
  {
    title: "Valutazione del menù digitale",
    detail: "Leggibilità, desiderabilità e orientamento alla scelta",
  },
  {
    title: "Elaborazione del Digital Experience Score",
    detail: "Applicazione del Metodo UAE e delle priorità",
  },
  {
    title: "Generazione del piano di intervento",
    detail: "Soluzioni, opportunità e investimento preliminare",
  },
];

export function AnalysisExperience() {
  const [input, setInput] = useState<QuickAuditInput | null>(null);
  const [result, setResult] = useState<QuickAuditResult | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [missingInput, setMissingInput] = useState(false);

  useEffect(() => {
    const storedResult = window.localStorage.getItem(RESULT_KEY);

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(
          storedResult,
        ) as QuickAuditResult;

        setInput(parsedResult.input);
        setResult(parsedResult);
        setCompleted(true);
        return;
      } catch {
        window.localStorage.removeItem(RESULT_KEY);
      }
    }

    const storedInput = window.localStorage.getItem(INPUT_KEY);

    if (!storedInput) {
      setMissingInput(true);
      return;
    }

    try {
      const parsedInput = JSON.parse(
        storedInput,
      ) as QuickAuditInput;

      setInput(parsedInput);

      const timers = phases.map((_, index) =>
        window.setTimeout(() => {
          setPhaseIndex(index);
        }, index * 1150),
      );

      const completionTimer = window.setTimeout(async () => {
        let generatedResult: QuickAuditResult;

        try {
          const response = await fetch(
            "/api/intelligence/analyze",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(parsedInput),
            },
          );

          const payload = (await response.json()) as {
            result?: QuickAuditResult;
            error?: string;
          };

          if (!response.ok || !payload.result) {
            throw new Error(
              payload.error ||
                "Analisi AI temporaneamente non disponibile.",
            );
          }

          generatedResult = payload.result;
        } catch (error) {
          console.error(
            "Fallback analisi locale:",
            error,
          );

          generatedResult =
            generateQuickAudit(parsedInput);
        }

        window.localStorage.setItem(
          RESULT_KEY,
          JSON.stringify(generatedResult),
        );

        setResult(generatedResult);
        setCompleted(true);
      }, phases.length * 1150 + 500);

      return () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        window.clearTimeout(completionTimer);
      };
    } catch {
      setMissingInput(true);
    }
  }, []);

  const progress = useMemo(
    () =>
      Math.min(
        100,
        Math.round(((phaseIndex + 1) / phases.length) * 100),
      ),
    [phaseIndex],
  );

  if (missingInput) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#040404] px-6">
        <section className="panel max-w-xl rounded-[32px] p-9 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#caa563]">
            Nessuna analisi disponibile
          </p>

          <h1 className="font-display mt-4 text-4xl text-[#f3eee5]">
            Avvia prima un nuovo audit.
          </h1>

          <Link
            href="/audits/new"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#d1aa62] px-6 py-3 text-xs text-[#171008]"
          >
            Nuovo audit
            <ArrowRight size={15} />
          </Link>
        </section>
      </main>
    );
  }

  if (completed && result) {
    return <QuickAuditResultView result={result} />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020202] px-6 py-12">
      <div className="noise" />

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(185,139,61,0.13),transparent_66%)] blur-3xl"
      />

      <Link
        href="/audits/new"
        className="absolute left-7 top-7 z-20 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/25 transition hover:text-white/70"
      >
        <ArrowLeft size={14} />
        Interrompi
      </Link>

      <section className="relative z-10 w-full max-w-3xl">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#caa563]/25 bg-[#caa563]/[0.055]"
          >
            <LoaderCircle
              size={27}
              strokeWidth={1.25}
              className="animate-spin text-[#dfbd78]"
            />
          </motion.div>

          <p className="mt-8 text-[9px] uppercase tracking-[0.42em] text-[#caa563]">
            UAE Intelligence
          </p>

          <h1 className="font-display mt-4 text-4xl text-[#f5f0e7] md:text-6xl">
            Analisi in corso
          </h1>

          <p className="mt-4 text-sm text-white/34">
            {input?.restaurantName}
            {input?.city ? ` · ${input.city}` : ""}
          </p>
        </div>

        <div className="panel mt-10 rounded-[30px] p-6 md:p-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.25em] text-white/24">
                Avanzamento complessivo
              </p>

              <p className="font-display mt-2 text-3xl text-[#e3c27f]">
                {progress}%
              </p>
            </div>

            <ShieldCheck
              size={20}
              strokeWidth={1.3}
              className="text-[#caa563]"
            />
          </div>

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.055]">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#795020] via-[#e2c17d] to-[#9e7134]"
            />
          </div>

          <div className="mt-8 space-y-3">
            {phases.map((phase, index) => {
              const isCompleted = index < phaseIndex;
              const isActive = index === phaseIndex;

              return (
                <div
                  key={phase.title}
                  className={`flex items-start gap-4 rounded-2xl border px-4 py-4 transition duration-500 ${
                    isActive
                      ? "border-[#caa563]/22 bg-[#caa563]/[0.055]"
                      : "border-transparent"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border ${
                      isCompleted
                        ? "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-300"
                        : isActive
                          ? "border-[#caa563]/30 text-[#dfbd78]"
                          : "border-white/[0.07] text-white/17"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={12} />
                    ) : isActive ? (
                      <LoaderCircle
                        size={12}
                        className="animate-spin"
                      />
                    ) : (
                      <Circle size={7} fill="currentColor" />
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-xs ${
                        isActive
                          ? "text-white/78"
                          : isCompleted
                            ? "text-white/45"
                            : "text-white/20"
                      }`}
                    >
                      {phase.title}
                    </p>

                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-[10px] text-white/27"
                        >
                          {phase.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-7 text-center text-[8px] uppercase tracking-[0.24em] text-white/18">
          Analisi automatica preliminare · Validazione consulente richiesta
        </p>
      </section>
    </main>
  );
}
