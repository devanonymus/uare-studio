"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Globe2,
  RefreshCcw,
  Sparkles,
  Star,
} from "lucide-react";
import type {
  QuickAuditArea,
  QuickAuditResult,
} from "@/types/quick-audit";

type Props = {
  result: QuickAuditResult;
};

const statusClasses = {
  critica: "border-red-400/20 bg-red-400/[0.06] text-red-300",
  prioritaria:
    "border-orange-400/20 bg-orange-400/[0.06] text-orange-300",
  migliorabile:
    "border-amber-300/20 bg-amber-300/[0.06] text-amber-200",
  solida:
    "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-300",
};

function euro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function QuickAuditResultView({ result }: Props) {
  function restart() {
    window.localStorage.removeItem("uare-quick-audit-input");
    window.localStorage.removeItem("uare-quick-audit-result");
  }

  const orderedAreas = [...result.areas].sort(
    (first, second) => first.score - second.score,
  );

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 md:px-10">
      <div className="noise" />

      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-6 border-b border-white/[0.055] pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#caa563]/16 bg-[#caa563]/[0.05] px-3 py-1 text-[8px] uppercase tracking-[0.2em] text-[#caa563]">
                Report preliminare
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-white/24">
                {result.auditCode}
              </span>
            </div>

            <h1 className="font-display mt-5 text-4xl text-[#f4eee5] md:text-6xl">
              {result.input.restaurantName}
            </h1>

            <p className="mt-3 text-sm text-white/34">
              {result.input.category}
              {result.input.city ? ` · ${result.input.city}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/audits/new"
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] px-5 py-3 text-xs text-white/48 transition hover:text-white"
            >
              <RefreshCcw size={14} />
              Nuova analisi
            </Link>

            <button
              type="button"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-[#caa563]/18 bg-[#caa563]/[0.06] px-5 py-3 text-xs text-[#d9b873]/55"
            >
              <FileText size={14} />
              Genera report PDF
            </button>
          </div>
        </header>

        <div className="mt-7 grid gap-6 xl:grid-cols-[0.76fr_1.24fr]">
          <section className="panel flex min-h-[410px] flex-col items-center justify-center rounded-[34px] p-8 text-center">
            <p className="text-[9px] uppercase tracking-[0.32em] text-white/27">
              Digital Experience Score
            </p>

            <div className="relative mt-8 flex size-60 items-center justify-center rounded-full border border-[#caa563]/22 bg-[#caa563]/[0.035]">
              <div className="absolute inset-4 rounded-full border border-white/[0.045]" />
              <div className="absolute inset-9 rounded-full border border-white/[0.025]" />

              <div>
                <p className="font-display text-8xl leading-none text-[#f0d18c]">
                  {result.overallScore}
                </p>
                <p className="mt-3 text-xs text-white/28">su 100</p>
              </div>
            </div>

            <h2 className="font-display mt-7 text-2xl text-[#f3eee5]">
              {result.scoreLabel}
            </h2>

            <p className="mt-4 max-w-sm text-xs leading-6 text-white/34">
              Valutazione preliminare elaborata secondo il Metodo UAE.
            </p>
          </section>

          <section className="panel rounded-[34px] p-6 md:p-8">
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#caa563]">
              Sintesi strategica
            </p>

            <h2 className="font-display mt-3 text-3xl text-[#f3eee5]">
              Quadro generale dell’esperienza digitale
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/42">
              {result.executiveSummary}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {result.criticalFindings.map((finding, index) => (
                <div
                  key={finding}
                  className="rounded-[22px] border border-white/[0.055] bg-white/[0.018] p-4"
                >
                  <p className="text-[8px] uppercase tracking-[0.2em] text-[#caa563]">
                    Evidenza {String(index + 1).padStart(2, "0")}
                  </p>

                  <p className="mt-3 text-xs leading-5 text-white/46">
                    {finding}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="panel mt-6 rounded-[34px] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.055] pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/26">
                Valutazione per area
              </p>

              <h2 className="font-display mt-2 text-3xl text-[#f3eee5]">
                Dove si trova il maggiore potenziale
              </h2>
            </div>

            <p className="text-[10px] text-white/25">
              Ordinamento dalle aree più critiche
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {orderedAreas.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="panel rounded-[34px] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <AlertTriangle
                size={19}
                strokeWidth={1.4}
                className="text-[#d9b773]"
              />

              <div>
                <p className="text-[9px] uppercase tracking-[0.27em] text-white/26">
                  Priorità
                </p>

                <h2 className="font-display mt-1 text-2xl text-[#f3eee5]">
                  Interventi da avviare
                </h2>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {result.services
                .filter((service) => service.selected)
                .slice(0, 5)
                .map((service, index) => (
                  <article
                    key={service.id}
                    className="rounded-[24px] border border-white/[0.055] bg-white/[0.018] p-5"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-[#caa563]">
                          Intervento {String(index + 1).padStart(2, "0")}
                        </p>

                        <h3 className="mt-3 text-sm font-medium text-white/78">
                          {service.name}
                        </h3>
                      </div>

                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, star) => (
                          <Star
                            key={star}
                            size={10}
                            fill={
                              star < service.priority
                                ? "currentColor"
                                : "none"
                            }
                            className={
                              star < service.priority
                                ? "text-[#d5b16d]"
                                : "text-white/12"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-white/34">
                      {service.description}
                    </p>

                    <p className="mt-4 text-[10px] text-white/25">
                      Investimento indicativo da{" "}
                      <span className="text-[#d7b570]">
                        {euro(service.priceFrom)}
                      </span>
                    </p>
                  </article>
                ))}
            </div>
          </section>

          <section className="panel relative overflow-hidden rounded-[34px] p-6 md:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 size-72 rounded-full bg-[#9f1f27]/[0.07] blur-3xl"
            />

            <div className="relative">
              <Sparkles
                size={21}
                strokeWidth={1.4}
                className="text-[#d7b36d]"
              />

              <p className="mt-7 text-[9px] uppercase tracking-[0.3em] text-[#caa563]">
                Piano di trasformazione
              </p>

              <h2 className="font-display mt-3 text-3xl text-[#f3eee5]">
                Investimento preliminare consigliato
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/37">
                La stima combina gli interventi ritenuti prioritari. Il
                progetto definitivo verrà costruito dopo la validazione
                tecnica e commerciale dell’audit.
              </p>

              <div className="mt-8 rounded-[28px] border border-[#caa563]/17 bg-[#caa563]/[0.045] p-6">
                <p className="text-[8px] uppercase tracking-[0.24em] text-white/25">
                  Configurazione raccomandata
                </p>

                <p className="font-display mt-3 text-5xl text-[#f0d18c]">
                  {euro(result.estimatedInvestment.recommended)}
                </p>

                <p className="mt-3 text-[10px] text-white/27">
                  Intervallo stimato:{" "}
                  {euro(result.estimatedInvestment.minimum)} –{" "}
                  {euro(result.estimatedInvestment.maximum)}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {result.opportunities.map((opportunity) => (
                  <div
                    key={opportunity}
                    className="flex items-start gap-3 text-xs leading-5 text-white/42"
                  >
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-300/70"
                    />
                    {opportunity}
                  </div>
                ))}
              </div>

              <Link
                href="/growth-plan"
                className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#d1aa62] px-6 py-4 text-xs font-medium text-[#171008] transition hover:bg-[#e4c47d]"
              >
                Genera piano di crescita
                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>
          </section>
        </div>

        <section className="panel mt-6 flex flex-col justify-between gap-7 rounded-[34px] p-6 md:flex-row md:items-center md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <Globe2
                size={19}
                strokeWidth={1.4}
                className="text-[#d7b36d]"
              />

              <p className="text-[9px] uppercase tracking-[0.28em] text-[#caa563]">
                Concept Experience
              </p>
            </div>

            <h2 className="font-display mt-4 text-3xl text-[#f3eee5]">
              Mostra come potrebbe diventare il ristorante.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/34">
              Dopo l’analisi, presenta una demo visuale progettata
              appositamente per il locale e trasforma le criticità in una
              visione concreta.
            </p>
          </div>

          <Link
            href="/audits/sakura"
            className="group inline-flex shrink-0 items-center gap-4 rounded-full border border-[#caa563]/25 bg-[#caa563]/[0.06] px-6 py-4 text-xs text-[#e0c17e] transition hover:bg-[#caa563]/[0.12]"
          >
            Apri Concept Sakura
            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </section>

        <p className="mt-7 text-center text-[8px] uppercase tracking-[0.22em] text-white/18">
          Analisi automatica preliminare dimostrativa · Validazione finale
          Univibe richiesta
        </p>
      </div>
    </main>
  );
}

function AreaCard({ area }: { area: QuickAuditArea }) {
  return (
    <article className="rounded-[25px] border border-white/[0.055] bg-white/[0.018] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`rounded-full border px-2.5 py-1 text-[8px] uppercase tracking-[0.16em] ${statusClasses[area.status]}`}
          >
            {area.status}
          </span>

          <h3 className="mt-4 text-sm font-medium text-white/76">
            {area.label}
          </h3>
        </div>

        <span className="font-display text-3xl text-[#e2c17d]">
          {area.score}
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#795020] to-[#d9b873]"
          style={{ width: `${area.score}%` }}
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-white/31">
        {area.summary}
      </p>
    </article>
  );
}
