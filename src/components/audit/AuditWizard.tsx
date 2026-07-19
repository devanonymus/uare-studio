"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Save,
} from "lucide-react";
import { auditSections } from "@/lib/audit-sections";
import { calculateSectionScore } from "@/lib/audit-score";
import { AuditProgress } from "@/components/audit/AuditProgress";
import { AuditSummary } from "@/components/audit/AuditSummary";
import { ScoreSelector } from "@/components/audit/ScoreSelector";
import type {
  AuditAnswers,
  RestaurantData,
} from "@/types/audit";

const initialRestaurantData: RestaurantData = {
  restaurantName: "",
  projectName: "",
  city: "",
  contactPerson: "",
  website: "",
  googleBusiness: "",
  instagram: "",
  category: "Sushi e cucina giapponese",
};

const STORAGE_KEY = "uare-restaurant-audit-draft";

export function AuditWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [restaurant, setRestaurant] = useState<RestaurantData>(
    initialRestaurantData,
  );
  const [answers, setAnswers] = useState<AuditAnswers>({});
  const [showSummary, setShowSummary] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const totalSteps = auditSections.length + 1;
  const isRestaurantStep = currentStep === 0;
  const currentSection = isRestaurantStep
    ? null
    : auditSections[currentStep - 1];

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(STORAGE_KEY);

    if (!savedDraft) return;

    try {
      const parsed = JSON.parse(savedDraft) as {
        restaurant?: RestaurantData;
        answers?: AuditAnswers;
        currentStep?: number;
      };

      if (parsed.restaurant) {
        setRestaurant(parsed.restaurant);
      }

      if (parsed.answers) {
        setAnswers(parsed.answers);
      }

      if (
        typeof parsed.currentStep === "number" &&
        parsed.currentStep >= 0 &&
        parsed.currentStep < totalSteps
      ) {
        setCurrentStep(parsed.currentStep);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [totalSteps]);

  const currentSectionScore = useMemo(() => {
    if (!currentSection) return null;
    return calculateSectionScore(currentSection, answers);
  }, [answers, currentSection]);

  function updateRestaurant(
    field: keyof RestaurantData,
    value: string,
  ) {
    setRestaurant((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateScore(questionId: string, score: number) {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        score,
        note: current[questionId]?.note ?? "",
      },
    }));
  }

  function updateNote(questionId: string, note: string) {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        score: current[questionId]?.score ?? 0,
        note,
      },
    }));
  }

  function saveDraft() {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        restaurant,
        answers,
        currentStep,
      }),
    );

    setSavedMessage(true);

    window.setTimeout(() => {
      setSavedMessage(false);
    }, 1800);
  }

  function goNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((step) => step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    saveDraft();
    setShowSummary(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function restartAudit() {
    const confirmed = window.confirm(
      "Vuoi cancellare l’audit corrente e ricominciare?",
    );

    if (!confirmed) return;

    window.localStorage.removeItem(STORAGE_KEY);
    setRestaurant(initialRestaurantData);
    setAnswers({});
    setCurrentStep(0);
    setShowSummary(false);
  }

  if (showSummary) {
    return (
      <AuditSummary
        restaurant={restaurant}
        answers={answers}
        onBack={() => setShowSummary(false)}
        onRestart={restartAudit}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AuditProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        label={
          isRestaurantStep
            ? "Informazioni del ristorante"
            : currentSection?.title ?? ""
        }
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="panel h-fit rounded-[28px] p-4">
          <p className="px-3 pb-4 pt-2 text-[9px] uppercase tracking-[0.27em] text-white/26">
            Sezioni audit
          </p>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setCurrentStep(0)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                currentStep === 0
                  ? "border-[#caa563]/25 bg-[#caa563]/10 text-[#e4c47e]"
                  : "border-transparent text-white/37 hover:bg-white/[0.03] hover:text-white/75"
              }`}
            >
              <span className="flex size-7 items-center justify-center rounded-full border border-current/20 text-[10px]">
                01
              </span>
              <span className="text-xs">Ristorante</span>
            </button>

            {auditSections.map((section, index) => {
              const step = index + 1;
              const active = currentStep === step;
              const score = calculateSectionScore(section, answers);
              const hasAnswers = section.questions.some(
                (question) =>
                  typeof answers[question.id]?.score === "number",
              );

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-[#caa563]/25 bg-[#caa563]/10 text-[#e4c47e]"
                      : "border-transparent text-white/37 hover:bg-white/[0.03] hover:text-white/75"
                  }`}
                >
                  <span className="flex size-7 items-center justify-center rounded-full border border-current/20 text-[10px]">
                    {String(step + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-xs">
                    {section.shortTitle}
                  </span>

                  {hasAnswers && (
                    <span className="text-[9px] text-white/27">
                      {score}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="panel rounded-[30px] p-6 md:p-9">
          {isRestaurantStep ? (
            <>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-[#caa563]/18 bg-[#caa563]/8 text-[#d5b16b]">
                <Building2 size={21} strokeWidth={1.4} />
              </div>

              <p className="mt-8 text-[9px] uppercase tracking-[0.32em] text-[#caa563]">
                Anagrafica progetto
              </p>

              <h1 className="font-display mt-3 text-4xl text-[#f5efe6]">
                Informazioni del ristorante
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/36">
                Inserisci i riferimenti principali. Questi dati saranno
                utilizzati nella copertina del report e nella proposta
                commerciale.
              </p>

              <div className="mt-9 grid gap-6 md:grid-cols-2">
                {[
                  {
                    field: "restaurantName" as const,
                    label: "Nome del ristorante",
                    placeholder: "Yammy Ristorante Giapponese",
                  },
                  {
                    field: "projectName" as const,
                    label: "Nome del progetto",
                    placeholder: "Progetto Sakura",
                  },
                  {
                    field: "city" as const,
                    label: "Città",
                    placeholder: "Martina Franca",
                  },
                  {
                    field: "contactPerson" as const,
                    label: "Referente",
                    placeholder: "Titolare o responsabile",
                  },
                  {
                    field: "website" as const,
                    label: "Sito web attuale",
                    placeholder: "https://",
                  },
                  {
                    field: "googleBusiness" as const,
                    label: "Google Business",
                    placeholder: "https://",
                  },
                  {
                    field: "instagram" as const,
                    label: "Profilo Instagram",
                    placeholder: "@ristorante",
                  },
                ].map((input) => (
                  <label key={input.field} className="block">
                    <span className="text-[10px] uppercase tracking-[0.17em] text-white/38">
                      {input.label}
                    </span>

                    <input
                      type="text"
                      value={restaurant[input.field]}
                      placeholder={input.placeholder}
                      onChange={(event) =>
                        updateRestaurant(
                          input.field,
                          event.target.value,
                        )
                      }
                      className="mt-3 w-full rounded-2xl border border-white/[0.075] bg-white/[0.025] px-4 py-3.5 text-sm text-white/82 outline-none transition placeholder:text-white/17 focus:border-[#caa563]/45"
                    />
                  </label>
                ))}

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.17em] text-white/38">
                    Categoria
                  </span>

                  <select
                    value={restaurant.category}
                    onChange={(event) =>
                      updateRestaurant("category", event.target.value)
                    }
                    className="mt-3 w-full rounded-2xl border border-white/[0.075] bg-[#0a0a0b] px-4 py-3.5 text-sm text-white/82 outline-none transition focus:border-[#caa563]/45"
                  >
                    <option>Sushi e cucina giapponese</option>
                    <option>Ristorante cinese</option>
                    <option>Asian fusion</option>
                    <option>Poké</option>
                    <option>Ramen restaurant</option>
                    <option>Thai restaurant</option>
                  </select>
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col justify-between gap-5 border-b border-white/[0.055] pb-7 md:flex-row md:items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#caa563]">
                    Sezione {currentStep} di {auditSections.length}
                  </p>

                  <h1 className="font-display mt-3 text-4xl text-[#f5efe6]">
                    {currentSection?.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/36">
                    {currentSection?.description}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#caa563]/15 bg-[#caa563]/[0.045] px-4 py-3">
                  <p className="text-[8px] uppercase tracking-[0.22em] text-white/27">
                    Punteggio sezione
                  </p>
                  <p className="font-display mt-1 text-3xl text-[#e2c27e]">
                    {currentSectionScore}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                {currentSection?.questions.map((question, index) => {
                  const answer = answers[question.id] ?? {
                    score: 0,
                    note: "",
                  };

                  return (
                    <article
                      key={question.id}
                      className="rounded-[26px] border border-white/[0.06] bg-white/[0.018] p-5 md:p-6"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#caa563]/18 bg-[#caa563]/5 text-[10px] text-[#d4b06b]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <h2 className="text-sm font-medium text-white/82">
                            {question.title}
                          </h2>

                          <p className="mt-2 text-xs leading-5 text-white/31">
                            {question.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="mb-3 text-[9px] uppercase tracking-[0.22em] text-white/27">
                          Valutazione da 0 a 10
                        </p>

                        <ScoreSelector
                          value={answer.score}
                          onChange={(score) =>
                            updateScore(question.id, score)
                          }
                        />
                      </div>

                      <label className="mt-6 block">
                        <span className="text-[9px] uppercase tracking-[0.22em] text-white/27">
                          Osservazione professionale
                        </span>

                        <textarea
                          value={answer.note}
                          onChange={(event) =>
                            updateNote(
                              question.id,
                              event.target.value,
                            )
                          }
                          placeholder="Inserisci criticità, evidenze e opportunità riscontrate..."
                          rows={3}
                          className="mt-3 w-full resize-none rounded-2xl border border-white/[0.075] bg-black/20 px-4 py-3.5 text-sm leading-6 text-white/75 outline-none transition placeholder:text-white/17 focus:border-[#caa563]/40"
                        />
                      </label>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-9 flex flex-col justify-between gap-4 border-t border-white/[0.055] pt-7 sm:flex-row">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs text-white/48 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ArrowLeft size={15} />
              Indietro
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveDraft}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#caa563]/20 px-5 py-3 text-xs text-[#d6b36e] transition hover:bg-[#caa563]/7"
              >
                {savedMessage ? (
                  <>
                    <Check size={15} />
                    Salvato
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Salva bozza
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#d1aa62] px-6 py-3 text-xs font-medium text-[#171008] transition hover:bg-[#e4c47d]"
              >
                {currentStep === totalSteps - 1
                  ? "Genera report"
                  : "Continua"}
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
