"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  FileText,
  Globe2,
  Layers3,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
  Workflow,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import type {
  QuickAuditArea,
  QuickAuditResult,
} from "@/types/quick-audit";

type Props = {
  result: QuickAuditResult;
};

const statusClasses = {
  critica:
    "border-[#F05D6C]/20 bg-[#F05D6C]/[0.06] text-[#FF9AA4]",
  prioritaria:
    "border-[#F5B942]/20 bg-[#F5B942]/[0.06] text-[#FFD078]",
  migliorabile:
    "border-[#5B7CFF]/20 bg-[#5B7CFF]/[0.07] text-[#A9B8FF]",
  solida:
    "border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.06] text-[#68E0C9]",
};

function euro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getScoreColor(score: number): string {
  if (score < 40) return "#F05D6C";
  if (score < 65) return "#F5B942";
  if (score < 80) return "#5B7CFF";
  return "#2DD4BF";
}

export function QuickAuditResultView({
  result,
}: Props) {
  const orderedAreas = [...result.areas].sort(
    (first, second) => first.score - second.score,
  );

  const selectedServices = result.services
    .filter((service) => service.selected)
    .sort(
      (first, second) =>
        second.priority - first.priority,
    );

  function restart() {
    [
      "uare-quick-audit-input",
      "uare-quick-audit-result",
      "uviq-intelligence-input",
      "uviq-business-discovery",
    ].forEach((key) =>
      window.localStorage.removeItem(key),
    );
  }

  const scoreColor = getScoreColor(
    result.overallScore,
  );

  return (
    <main className="workspace-page min-h-screen">
      <AppSidebar />

      <section className="relative px-5 pb-28 pt-6 lg:ml-[112px] lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute right-[-12rem] top-[-12rem] size-[38rem] rounded-full bg-[#5B7CFF]/[0.06] blur-[150px]" />

        <div className="relative mx-auto max-w-[1540px]">
          <header className="flex flex-col justify-between gap-7 border-b border-white/[0.07] pb-7 xl:flex-row xl:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.05] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#68E0C9]">
                  <CheckCircle2 size={12} />
                  Intelligence completata
                </span>

                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[8px] uppercase tracking-[0.15em] text-[#8A97A8]">
                  {result.auditCode}
                </span>
              </div>

              <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
                Business Twin
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.052em] text-[#F5F7FA] md:text-6xl">
                {result.input.restaurantName}
              </h1>

              <p className="mt-4 text-sm text-[#8A97A8]">
                {result.input.category}
                {result.input.city
                  ? ` · ${result.input.city}`
                  : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects/new"
                onClick={restart}
                className="inline-flex items-center gap-2 rounded-[12px] border border-white/[0.09] bg-white/[0.025] px-5 py-3 text-xs text-[#AAB4C2] transition hover:bg-white/[0.055] hover:text-white"
              >
                <RefreshCcw size={14} />
                Nuova intelligence
              </Link>

              <Link
                href="/reports"
                className="inline-flex items-center gap-2 rounded-[12px] border border-white/[0.09] bg-white/[0.025] px-5 py-3 text-xs text-[#AAB4C2] transition hover:bg-white/[0.055] hover:text-white"
              >
                <FileText size={14} />
                Salva nel report
              </Link>

              <Link
                href="/growth-plan"
                className="inline-flex items-center gap-3 rounded-[12px] bg-[#5B7CFF] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#6C8AFF]"
              >
                Crea piano operativo
                <ArrowRight size={15} />
              </Link>
            </div>
          </header>

          <section className="mt-6 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <article className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A97A8]">
                Intelligence score
              </p>

              <div className="mt-7 flex justify-center">
                <div
                  className="flex size-56 items-center justify-center rounded-full p-[3px]"
                  style={{
                    background: `conic-gradient(${scoreColor} ${result.overallScore}%, rgba(255,255,255,.06) 0)`,
                  }}
                >
                  <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#0E131B]">
                    <span
                      className="text-7xl font-semibold tracking-[-0.07em]"
                      style={{ color: scoreColor }}
                    >
                      {result.overallScore}
                    </span>

                    <span className="mt-2 text-[9px] uppercase tracking-[0.16em] text-[#5E6978]">
                      su 100
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="mt-7 text-center text-xl font-semibold text-[#F5F7FA]">
                {result.scoreLabel}
              </h2>

              <p className="mt-3 text-center text-xs leading-6 text-[#8A97A8]">
                Valutazione preliminare prodotta dal
                sistema di intelligence UVIQ.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <MiniMetric
                  label="Aree analizzate"
                  value={String(result.areas.length)}
                  icon={Layers3}
                />

                <MiniMetric
                  label="Priorità"
                  value={String(
                    selectedServices.length,
                  )}
                  icon={Target}
                />
              </div>
            </article>

            <article className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-6 md:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
                    Analysis insights
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#F5F7FA]">
                    Sintesi strategica
                  </h2>
                </div>

                <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#5B7CFF]/20 bg-[#5B7CFF]/10 text-[#9AAEFF]">
                  <BrainCircuit size={19} />
                </span>
              </div>

              <p className="mt-6 max-w-4xl text-sm leading-7 text-[#AAB4C2]">
                {result.executiveSummary}
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {result.criticalFindings.map(
                  (finding, index) => (
                    <div
                      key={finding}
                      className="rounded-[14px] border border-white/[0.06] bg-[#0E131B] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-[9px] border border-[#F5B942]/18 bg-[#F5B942]/[0.06] text-[9px] font-semibold text-[#FFD078]">
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#8A97A8]">
                          Evidenza prioritaria
                        </p>
                      </div>

                      <p className="mt-4 text-xs leading-6 text-[#C6CFD9]">
                        {finding}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </article>
          </section>

          <section className="mt-6 rounded-[18px] border border-white/[0.075] bg-[#11151C] p-6 md:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] pb-6 md:flex-row md:items-end">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
                  Business DNA
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#F5F7FA]">
                  Performance per area
                </h2>
              </div>

              <p className="text-[9px] text-[#8A97A8]">
                Ordinamento dal maggiore potenziale
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {orderedAreas.map((area) => (
                <AreaCard
                  key={area.id}
                  area={area}
                />
              ))}
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
            <article className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#F5B942]/18 bg-[#F5B942]/[0.06] text-[#FFD078]">
                  <AlertTriangle size={18} />
                </span>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A97A8]">
                    Priority stack
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-[#F5F7FA]">
                    Interventi raccomandati
                  </h2>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {selectedServices
                  .slice(0, 6)
                  .map((service, index) => (
                    <article
                      key={service.id}
                      className="rounded-[14px] border border-white/[0.06] bg-[#0E131B] p-5"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9AAEFF]">
                            Priorità{" "}
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </p>

                          <h3 className="mt-2 text-sm font-semibold text-[#F5F7FA]">
                            {service.name}
                          </h3>
                        </div>

                        <span className="rounded-full border border-[#5B7CFF]/18 bg-[#5B7CFF]/[0.07] px-3 py-1.5 text-[8px] font-semibold text-[#A9B8FF]">
                          P{service.priority}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-6 text-[#8A97A8]">
                        {service.description}
                      </p>

                      <p className="mt-4 text-[9px] text-[#5E6978]">
                        Investimento da{" "}
                        <span className="font-semibold text-[#C6CFD9]">
                          {euro(service.priceFrom)}
                        </span>
                      </p>
                    </article>
                  ))}
              </div>
            </article>

            <article className="rounded-[18px] border border-[#5B7CFF]/18 bg-[#5B7CFF]/[0.045] p-6 md:p-8">
              <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#5B7CFF]/20 bg-[#5B7CFF]/10 text-[#9AAEFF]">
                <Workflow size={19} />
              </span>

              <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9AAEFF]">
                Transformation blueprint
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#F5F7FA]">
                Piano operativo consigliato
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#AAB4C2]">
                La configurazione combina le attività con
                maggiore impatto su acquisizione,
                conversione, contenuti e automazione.
              </p>

              <div className="mt-7 rounded-[16px] border border-white/[0.07] bg-[#0E131B] p-6">
                <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#5E6978]">
                  Investimento raccomandato
                </p>

                <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#F5F7FA]">
                  {euro(
                    result.estimatedInvestment
                      .recommended,
                  )}
                </p>

                <p className="mt-3 text-[9px] text-[#8A97A8]">
                  Range:{" "}
                  {euro(
                    result.estimatedInvestment.minimum,
                  )}{" "}
                  –{" "}
                  {euro(
                    result.estimatedInvestment.maximum,
                  )}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {result.opportunities.map(
                  (opportunity) => (
                    <div
                      key={opportunity}
                      className="flex items-start gap-3 text-xs leading-6 text-[#C6CFD9]"
                    >
                      <CheckCircle2
                        size={15}
                        className="mt-1 shrink-0 text-[#2DD4BF]"
                      />
                      {opportunity}
                    </div>
                  ),
                )}
              </div>

              <Link
                href="/growth-plan"
                className="mt-8 inline-flex items-center gap-3 rounded-[12px] bg-[#5B7CFF] px-6 py-3.5 text-xs font-semibold text-white transition hover:bg-[#6C8AFF]"
              >
                Genera roadmap
                <ArrowRight size={15} />
              </Link>
            </article>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <FinalAction
              href="/demo-generator"
              icon={WandSparkles}
              title="Demo Studio"
              text="Genera una nuova esperienza visiva per il cliente."
            />

            <FinalAction
              href="/growth-plan"
              icon={Target}
              title="Strategy Blueprint"
              text="Trasforma le priorità in roadmap e offerta."
            />

            <FinalAction
              href="/reports"
              icon={FileText}
              title="Report Center"
              text="Archivia e presenta i risultati dell’intelligence."
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function MiniMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Layers3;
}) {
  return (
    <div className="rounded-[13px] border border-white/[0.06] bg-[#0E131B] p-4">
      <Icon size={14} className="text-[#9AAEFF]" />

      <p className="mt-4 text-[7px] font-semibold uppercase tracking-[0.13em] text-[#5E6978]">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-[#F5F7FA]">
        {value}
      </p>
    </div>
  );
}

function AreaCard({
  area,
}: {
  area: QuickAuditArea;
}) {
  const scoreColor = getScoreColor(area.score);

  return (
    <article className="rounded-[15px] border border-white/[0.065] bg-[#0E131B] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#5E6978]">
            {area.id}
          </p>

          <h3 className="mt-2 text-sm font-semibold text-[#F5F7FA]">
            {area.label}
          </h3>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.1em] ${
            statusClasses[area.status]
          }`}
        >
          {area.status}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <span
          className="text-3xl font-semibold tracking-[-0.045em]"
          style={{ color: scoreColor }}
        >
          {area.score}
        </span>

        <span className="text-[8px] text-[#5E6978]">
          /100
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${area.score}%`,
            backgroundColor: scoreColor,
          }}
        />
      </div>

      <p className="mt-4 text-[10px] leading-5 text-[#8A97A8]">
        {area.summary}
      </p>
    </article>
  );
}

function FinalAction({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: typeof FileText;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[16px] border border-white/[0.07] bg-[#11151C] p-5 transition hover:border-[#5B7CFF]/25 hover:bg-[#151A23]"
    >
      <span className="flex size-10 items-center justify-center rounded-[12px] border border-[#5B7CFF]/18 bg-[#5B7CFF]/[0.08] text-[#9AAEFF]">
        <Icon size={17} />
      </span>

      <h3 className="mt-5 text-sm font-semibold text-[#F5F7FA]">
        {title}
      </h3>

      <p className="mt-2 text-[10px] leading-5 text-[#8A97A8]">
        {text}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold text-[#9AAEFF]">
        Apri modulo
        <ArrowRight
          size={13}
          className="transition group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
