"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Megaphone,
  Sparkles,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";

type SectorId =
  | "restaurant"
  | "hotel"
  | "healthcare"
  | "fitness"
  | "automotive"
  | "industry"
  | "professional";

type ObjectiveId =
  | "lead"
  | "content"
  | "automation"
  | "growth";

const sectors: Array<{
  id: SectorId;
  label: string;
}> = [
  {
    id: "restaurant",
    label: "Ristorazione",
  },
  {
    id: "hotel",
    label: "Hospitality",
  },
  {
    id: "healthcare",
    label: "Sanità e benessere",
  },
  {
    id: "fitness",
    label: "Fitness e sport",
  },
  {
    id: "automotive",
    label: "Automotive",
  },
  {
    id: "industry",
    label: "Industria e B2B",
  },
  {
    id: "professional",
    label: "Professionisti",
  },
];

const objectives: Array<{
  id: ObjectiveId;
  label: string;
  description: string;
  icon: typeof Target;
}> = [
  {
    id: "lead",
    label: "Più contatti",
    description: "Lead, richieste e appuntamenti.",
    icon: Users,
  },
  {
    id: "content",
    label: "Più contenuti",
    description: "Post, reel e campagne.",
    icon: Megaphone,
  },
  {
    id: "automation",
    label: "Più automazioni",
    description: "CRM, WhatsApp ed email.",
    icon: Workflow,
  },
  {
    id: "growth",
    label: "Crescita completa",
    description: "Reparto marketing integrato.",
    icon: BarChart3,
  },
];

const recommendations: Record<
  ObjectiveId,
  {
    title: string;
    description: string;
    modules: string[];
    result: string;
  }
> = {
  lead: {
    title: "Acquisition Department",
    description:
      "Un sistema orientato alla generazione e gestione continuativa delle opportunità commerciali.",
    modules: [
      "Landing e funnel",
      "CRM e pipeline",
      "Follow-up automatici",
      "Analytics conversioni",
    ],
    result: "Acquisizione e gestione lead",
  },
  content: {
    title: "Content Department",
    description:
      "Un motore operativo per produrre, adattare e programmare contenuti multicanale.",
    modules: [
      "Piano editoriale",
      "Copy e creatività",
      "Reel e short video",
      "Pubblicazione multicanale",
    ],
    result: "Produzione contenuti continua",
  },
  automation: {
    title: "Automation Department",
    description:
      "Workflow intelligenti per ridurre attività manuali e seguire automaticamente clienti e lead.",
    modules: [
      "WhatsApp automation",
      "Email automation",
      "CRM intelligente",
      "Reminder e recensioni",
    ],
    result: "Processi commerciali automatici",
  },
  growth: {
    title: "UVIQ Growth Department",
    description:
      "Il reparto completo che integra strategia, produzione, acquisizione, CRM e automazioni.",
    modules: [
      "Business Intelligence",
      "Content Factory",
      "CRM e Automation",
      "Performance Analytics",
    ],
    result: "Marketing operativo completo",
  },
};

export function HomeConversionConfigurator() {
  const [sector, setSector] =
    useState<SectorId>("restaurant");

  const [objective, setObjective] =
    useState<ObjectiveId>("growth");

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const selectedSector = useMemo(
    () =>
      sectors.find((item) => item.id === sector) ??
      sectors[0],
    [sector],
  );

  const recommendation =
    recommendations[objective];

  const projectHref =
    `/projects/new/${sector}` +
    `?objective=${objective}`;

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/[0.11] bg-[#0B1628] shadow-[0_40px_100px_rgba(0,0,0,.42)]">
      <div className="pointer-events-none absolute -right-24 -top-32 size-72 rounded-full bg-[#FF6B1A]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-36 -left-20 size-72 rounded-full bg-[#2492E8]/10 blur-[110px]" />

      <header className="relative flex items-center justify-between border-b border-white/[0.08] px-5 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[12px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
            <Sparkles size={17} />
          </span>

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#79C6F5]">
              UVIQ Smart Configurator
            </p>

            <p className="mt-1 text-[9px] text-[#C7D3E1]">
              Configurazione in meno di un minuto
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-[#24D27C]/18 bg-[#24D27C]/[0.06] px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em] text-[#8AF0BA]">
          <span className="size-1.5 rounded-full bg-[#24D27C]" />
          Live
        </span>
      </header>

      <div className="relative px-5 py-6 md:px-7 md:py-7">
        <div className="grid grid-cols-3 gap-2">
          <StepIndicator
            number="01"
            label="Settore"
            active={step === 1}
            completed={step > 1}
          />

          <StepIndicator
            number="02"
            label="Obiettivo"
            active={step === 2}
            completed={step > 2}
          />

          <StepIndicator
            number="03"
            label="Configurazione"
            active={step === 3}
            completed={false}
          />
        </div>

        {step === 1 && (
          <div className="mt-8">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9FB0C4]">
              Che tipo di attività vuoi far crescere?
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
              Seleziona il settore.
            </h2>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {sectors.map((item) => {
                const selected =
                  item.id === sector;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSector(item.id)
                    }
                    className={`flex min-h-13 items-center justify-between rounded-[13px] border px-4 text-left text-[10px] font-semibold transition ${
                      selected
                        ? "border-[#2492E8]/55 bg-[#2492E8]/12 text-white"
                        : "border-white/[0.08] bg-[#07111F]/55 text-[#C7D3E1] hover:border-white/[0.16] hover:bg-[#101D31]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Building2
                        size={15}
                        className={
                          selected
                            ? "text-[#79C6F5]"
                            : "text-[#71839B]"
                        }
                      />

                      {item.label}
                    </span>

                    <span
                      className={`flex size-5 items-center justify-center rounded-full border ${
                        selected
                          ? "border-[#2492E8] bg-[#2492E8] text-white"
                          : "border-white/[0.13]"
                      }`}
                    >
                      {selected && <Check size={11} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-6 text-xs font-bold text-white shadow-[0_15px_38px_rgba(255,107,26,.24)] transition hover:bg-[#FF7D34]"
            >
              Continua
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[9px] font-semibold text-[#9FB0C4] transition hover:text-white"
            >
              ← Modifica settore
            </button>

            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#9FB0C4]">
              Qual è la priorità principale?
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
              Definisci l’obiettivo.
            </h2>

            <div className="mt-6 space-y-2">
              {objectives.map((item) => {
                const Icon = item.icon;
                const selected =
                  item.id === objective;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setObjective(item.id)
                    }
                    className={`flex w-full items-center gap-4 rounded-[14px] border p-4 text-left transition ${
                      selected
                        ? "border-[#FF6B1A]/50 bg-[#FF6B1A]/10"
                        : "border-white/[0.08] bg-[#07111F]/55 hover:border-white/[0.16] hover:bg-[#101D31]"
                    }`}
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] ${
                        selected
                          ? "bg-[#FF6B1A] text-white"
                          : "bg-white/[0.045] text-[#8FA2B9]"
                      }`}
                    >
                      <Icon size={17} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-white">
                        {item.label}
                      </span>

                      <span className="mt-1 block text-[9px] text-[#9FB0C4]">
                        {item.description}
                      </span>
                    </span>

                    <ChevronRight
                      size={15}
                      className={
                        selected
                          ? "text-[#FF8A4A]"
                          : "text-[#53657B]"
                      }
                    />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-6 text-xs font-bold text-white shadow-[0_15px_38px_rgba(255,107,26,.24)] transition hover:bg-[#FF7D34]"
            >
              Genera configurazione
              <Sparkles size={15} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#24D27C]/20 bg-[#24D27C]/10 text-[#8AF0BA]">
                <CheckCircle2 size={19} />
              </span>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#8AF0BA]">
                  Configurazione pronta
                </p>

                <p className="mt-1 text-[9px] text-[#9FB0C4]">
                  {selectedSector.label}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[17px] border border-[#2492E8]/20 bg-[#07111F]/65 p-5">
              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#79C6F5]">
                Reparto consigliato
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                {recommendation.title}
              </h2>

              <p className="mt-3 text-[10px] leading-6 text-[#B9C7D8]">
                {recommendation.description}
              </p>

              <div className="mt-5 space-y-3">
                {recommendation.modules.map(
                  (module) => (
                    <div
                      key={module}
                      className="flex items-center gap-3 text-[10px] text-[#D7E1EC]"
                    >
                      <span className="flex size-5 items-center justify-center rounded-full bg-[#24D27C]/10 text-[#8AF0BA]">
                        <Check size={11} />
                      </span>

                      {module}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[14px] border border-white/[0.08] bg-[#101B2E] p-4">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-[#8FA2B9]">
                  Risultato prioritario
                </p>

                <p className="mt-2 text-xs font-semibold text-white">
                  {recommendation.result}
                </p>
              </div>

              <Bot size={19} className="text-[#79C6F5]" />
            </div>

            <Link
              href={projectHref}
              className="group mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-[14px] bg-[#FF6B1A] px-6 text-xs font-bold text-white shadow-[0_16px_42px_rgba(255,107,26,.28)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
            >
              Avvia questa configurazione
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-[9px] font-semibold text-[#9FB0C4] transition hover:text-white"
            >
              Ricomincia configurazione
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: string;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div
      className={`rounded-[12px] border px-3 py-3 transition ${
        active
          ? "border-[#2492E8]/40 bg-[#2492E8]/10"
          : completed
            ? "border-[#24D27C]/20 bg-[#24D27C]/[0.055]"
            : "border-white/[0.07] bg-[#07111F]/45"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex size-5 items-center justify-center rounded-full text-[7px] font-bold ${
            active
              ? "bg-[#2492E8] text-white"
              : completed
                ? "bg-[#24D27C] text-[#07111F]"
                : "border border-white/[0.12] text-[#71839B]"
          }`}
        >
          {completed ? (
            <Check size={10} />
          ) : (
            number
          )}
        </span>

        <span
          className={`text-[7px] font-bold uppercase tracking-[0.1em] ${
            active || completed
              ? "text-white"
              : "text-[#71839B]"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
