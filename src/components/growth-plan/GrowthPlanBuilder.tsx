"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  FileText,
  Layers3,
  Minus,
  Plus,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";
import type {
  QuickAuditResult,
  RecommendedService,
} from "@/types/quick-audit";

const RESULT_KEY = "uare-quick-audit-result";

type EditableService = RecommendedService & {
  price: number;
};

function euro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function priorityLabel(priority: number): string {
  if (priority === 5) return "Immediata";
  if (priority === 4) return "Alta";
  if (priority === 3) return "Strategica";
  if (priority === 2) return "Secondaria";
  return "Opzionale";
}

export function GrowthPlanBuilder() {
  const [result, setResult] = useState<QuickAuditResult | null>(null);
  const [services, setServices] = useState<EditableService[]>([]);
  const [discount, setDiscount] = useState(0);
  const [missingResult, setMissingResult] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(RESULT_KEY);

    if (!stored) {
      setMissingResult(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as QuickAuditResult;

      setResult(parsed);
      setServices(
        parsed.services.map((service) => ({
          ...service,
          price: service.priceFrom,
        })),
      );
    } catch {
      setMissingResult(true);
    }
  }, []);

  const selectedServices = useMemo(
    () => services.filter((service) => service.selected),
    [services],
  );

  const subtotal = useMemo(
    () =>
      selectedServices.reduce(
        (total, service) => total + service.price,
        0,
      ),
    [selectedServices],
  );

  const discountAmount = Math.round(subtotal * (discount / 100));
  const total = subtotal - discountAmount;
  const deposit = Math.round(total * 0.4);
  const balance = total - deposit;

  function toggleService(id: string) {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? { ...service, selected: !service.selected }
          : service,
      ),
    );
  }

  function updatePrice(id: string, variation: number) {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? {
              ...service,
              price: Math.max(100, service.price + variation),
            }
          : service,
      ),
    );
  }

  if (missingResult) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5">
        <section className="panel max-w-xl rounded-[32px] p-10 text-center">
          <Target className="mx-auto text-[#d3ae68]" size={28} />

          <h1 className="font-display mt-6 text-4xl text-[#f4eee5]">
            Nessun audit disponibile
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/35">
            Prima di costruire il piano di crescita devi completare
            un’analisi digitale.
          </p>

          <Link
            href="/audits/new"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#d1aa62] px-6 py-3 text-xs font-medium text-[#171008]"
          >
            Avvia un audit
            <ChevronRight size={15} />
          </Link>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505]">
        <p className="text-xs uppercase tracking-[0.25em] text-white/25">
          Caricamento piano…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 md:px-10">
      <div className="noise" />

      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-6 border-b border-white/[0.055] pb-8 lg:flex-row lg:items-end">
          <div>
            <Link
              href="/audits/analysis"
              className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/25 transition hover:text-white/65"
            >
              <ArrowLeft size={14} />
              Torna al report
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#caa563]/16 bg-[#caa563]/[0.05] px-3 py-1 text-[8px] uppercase tracking-[0.2em] text-[#caa563]">
                Growth Plan
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-white/23">
                {result.auditCode}
              </span>
            </div>

            <h1 className="font-display mt-5 text-4xl leading-tight text-[#f4eee5] md:text-6xl">
              Piano di crescita digitale
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/36">
              {result.input.restaurantName}
              {result.input.city ? ` · ${result.input.city}` : ""}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#caa563]/15 bg-[#caa563]/[0.045] px-6 py-4">
            <p className="text-[8px] uppercase tracking-[0.2em] text-white/25">
              Digital Experience Score
            </p>

            <p className="font-display mt-2 text-3xl text-[#e5c47f]">
              {result.overallScore}/100
            </p>
          </div>
        </header>

        <section className="mt-7 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <section className="panel rounded-[34px] p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#caa563]/15 bg-[#caa563]/[0.055] text-[#d8b671]">
                  <Layers3 size={20} strokeWidth={1.4} />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-[#caa563]">
                    Interventi prioritari
                  </p>

                  <h2 className="font-display mt-2 text-3xl text-[#f3eee5]">
                    Configura la proposta
                  </h2>

                  <p className="mt-3 max-w-2xl text-xs leading-6 text-white/33">
                    Seleziona gli interventi da inserire nel progetto e
                    modifica l’investimento in base alla complessità reale.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {services.map((service, index) => (
                  <article
                    key={service.id}
                    className={`rounded-[26px] border p-5 transition ${
                      service.selected
                        ? "border-[#caa563]/22 bg-[#caa563]/[0.035]"
                        : "border-white/[0.055] bg-white/[0.012]"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                      <button
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className="flex flex-1 items-start gap-4 text-left"
                      >
                        <span
                          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border ${
                            service.selected
                              ? "border-[#d4b16b]/30 bg-[#d4b16b]/10 text-[#e0c17e]"
                              : "border-white/10 text-white/20"
                          }`}
                        >
                          {service.selected ? (
                            <Check size={13} />
                          ) : (
                            <Circle size={7} fill="currentColor" />
                          )}
                        </span>

                        <span>
                          <span className="text-[8px] uppercase tracking-[0.2em] text-[#caa563]/75">
                            Intervento {String(index + 1).padStart(2, "0")} ·{" "}
                            {priorityLabel(service.priority)}
                          </span>

                          <span className="mt-2 block text-sm font-medium text-white/78">
                            {service.name}
                          </span>

                          <span className="mt-3 block max-w-2xl text-xs leading-5 text-white/32">
                            {service.description}
                          </span>
                        </span>
                      </button>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updatePrice(service.id, -100)}
                          className="flex size-8 items-center justify-center rounded-full border border-white/[0.08] text-white/32 transition hover:text-white"
                        >
                          <Minus size={13} />
                        </button>

                        <span className="min-w-[104px] text-center font-display text-xl text-[#e0c17d]">
                          {euro(service.price)}
                        </span>

                        <button
                          type="button"
                          onClick={() => updatePrice(service.id, 100)}
                          className="flex size-8 items-center justify-center rounded-full border border-white/[0.08] text-white/32 transition hover:text-white"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel rounded-[34px] p-6 md:p-8">
              <div className="flex items-center gap-3">
                <Sparkles
                  size={19}
                  strokeWidth={1.4}
                  className="text-[#d8b671]"
                />

                <div>
                  <p className="text-[9px] uppercase tracking-[0.26em] text-[#caa563]">
                    Roadmap
                  </p>

                  <h2 className="font-display mt-1 text-2xl text-[#f3eee5]">
                    Percorso operativo
                  </h2>
                </div>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {[
                  {
                    phase: "Fase 01",
                    title: "Impostazione strategica",
                    text: "Raccolta materiali, obiettivi, posizionamento e architettura del progetto.",
                  },
                  {
                    phase: "Fase 02",
                    title: "Produzione e sviluppo",
                    text: "Realizzazione degli asset, delle piattaforme e dei contenuti previsti.",
                  },
                  {
                    phase: "Fase 03",
                    title: "Pubblicazione e lancio",
                    text: "Configurazione, controllo qualità, messa online e attivazione dei canali.",
                  },
                  {
                    phase: "Fase 04",
                    title: "Misurazione e crescita",
                    text: "Analisi delle performance, ottimizzazione continua e sviluppo commerciale.",
                  },
                ].map((item) => (
                  <article
                    key={item.phase}
                    className="rounded-[24px] border border-white/[0.055] bg-white/[0.015] p-5"
                  >
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#caa563]">
                      {item.phase}
                    </p>

                    <h3 className="mt-3 text-sm font-medium text-white/72">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-xs leading-5 text-white/31">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="panel sticky top-6 rounded-[34px] p-6">
              <div className="flex items-center gap-3">
                <WalletCards
                  size={19}
                  strokeWidth={1.4}
                  className="text-[#d8b671]"
                />

                <div>
                  <p className="text-[9px] uppercase tracking-[0.26em] text-[#caa563]">
                    Proposta economica
                  </p>

                  <h2 className="font-display mt-1 text-2xl text-[#f3eee5]">
                    Riepilogo
                  </h2>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {selectedServices.length > 0 ? (
                  selectedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-start justify-between gap-4 border-b border-white/[0.045] pb-3"
                    >
                      <p className="text-xs leading-5 text-white/40">
                        {service.name}
                      </p>

                      <p className="shrink-0 text-xs text-white/58">
                        {euro(service.price)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/[0.055] p-4 text-xs leading-5 text-white/30">
                    Seleziona almeno un intervento.
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label className="flex items-center justify-between gap-4">
                  <span className="text-xs text-white/38">
                    Sconto commerciale
                  </span>

                  <select
                    value={discount}
                    onChange={(event) =>
                      setDiscount(Number(event.target.value))
                    }
                    className="rounded-xl border border-white/[0.08] bg-[#090909] px-3 py-2 text-xs text-white/60 outline-none"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={10}>10%</option>
                    <option value={15}>15%</option>
                  </select>
                </label>
              </div>

              <div className="my-6 h-px bg-white/[0.055]" />

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-white/35">
                  <span>Subtotale</span>
                  <span>{euro(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-300/65">
                    <span>Sconto {discount}%</span>
                    <span>- {euro(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-end justify-between gap-4 pt-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/28">
                    Totale progetto
                  </span>

                  <span className="font-display text-4xl text-[#f0d18c]">
                    {euro(total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-[#caa563]/15 bg-[#caa563]/[0.04] p-5">
                <div className="flex justify-between gap-4 text-xs">
                  <span className="text-white/35">Acconto 40%</span>
                  <span className="text-[#dfbe79]">{euro(deposit)}</span>
                </div>

                <div className="mt-3 flex justify-between gap-4 text-xs">
                  <span className="text-white/35">Saldo 60%</span>
                  <span className="text-white/58">{euro(balance)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={selectedServices.length === 0}
                className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#d1aa62] px-5 py-4 text-xs font-medium text-[#171008] transition hover:bg-[#e4c47d] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FileText size={15} />
                Genera proposta commerciale
              </button>

              <div className="mt-5 space-y-3">
                {[
                  "Validità proposta: 15 giorni",
                  "Tempi definiti dopo conferma",
                  "Importi IVA esclusa, ove applicabile",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-[10px] leading-4 text-white/25"
                  >
                    <CheckCircle2
                      size={12}
                      className="mt-0.5 shrink-0 text-emerald-300/55"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
