import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  ClipboardCheck,
  FileChartColumn,
  Plus,
  Search,
  Target,
  WalletCards,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { IntelligenceMetric } from "@/components/intelligence/IntelligenceMetric";
import { DemoAuditTable } from "@/components/intelligence/DemoAuditTable";
import { OpportunityCard } from "@/components/intelligence/OpportunityCard";
import { PipelineCard } from "@/components/intelligence/PipelineCard";
import { dashboardMetrics } from "@/data/demo-restaurants";

function euro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <div className="noise" />
      <AppSidebar />

      <section className="relative px-5 pb-16 pt-6 lg:ml-[276px] lg:px-10 xl:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[36rem] w-[36rem] bg-[radial-gradient(circle,rgba(190,145,64,0.09),transparent_67%)]"
        />

        <header className="relative border-b border-white/[0.055] pb-7">
          <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[9px] uppercase tracking-[0.38em] text-[#caa563]">
                  Intelligence Center
                </p>

                <span className="rounded-full border border-[#caa563]/15 bg-[#caa563]/[0.04] px-3 py-1 text-[8px] uppercase tracking-[0.18em] text-[#caa563]/70">
                  Ambiente dimostrativo
                </span>
              </div>

              <h1 className="font-display mt-4 text-4xl font-medium tracking-[-0.03em] text-[#f5f0e7] md:text-5xl">
                Buongiorno, Brian.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/36">
                Ogni analisi può diventare un’opportunità concreta per
                trasformare la presenza digitale di un ristorante asiatico.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-between gap-5 rounded-full border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-xs text-white/35 transition hover:border-white/15 hover:text-white/65 sm:min-w-[230px]"
              >
                <span className="inline-flex items-center gap-2">
                  <Search size={15} />
                  Cerca nella piattaforma
                </span>

                <span className="text-[9px] text-white/20">⌘ K</span>
              </button>

              <Link
                href="/audits/new"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#d1aa62] px-6 py-3 text-xs font-medium text-[#171008] shadow-[0_18px_50px_rgba(183,137,62,0.12)] transition hover:bg-[#e4c47d]"
              >
                <Plus size={16} />
                Nuovo audit
                <ArrowUpRight
                  size={15}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </header>

        <div className="relative mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <IntelligenceMetric
            label="Audit completati"
            value={String(dashboardMetrics.completedAudits).padStart(2, "0")}
            detail="Analisi digitali completate nell’ambiente demo"
            icon={ClipboardCheck}
            trend="+4 questo mese"
          />

          <IntelligenceMetric
            label="Report generati"
            value={String(dashboardMetrics.generatedReports).padStart(2, "0")}
            detail="Report strategici pronti per la presentazione"
            icon={FileChartColumn}
            trend="89% degli audit"
          />

          <IntelligenceMetric
            label="Valore opportunità"
            value={euro(dashboardMetrics.opportunityValue)}
            detail="Valore dimostrativo degli interventi individuati"
            icon={WalletCards}
            trend="+18,6%"
          />

          <IntelligenceMetric
            label="Score medio"
            value={`${dashboardMetrics.averageScore}/100`}
            detail="Media del Digital Experience Score"
            icon={Target}
          />
        </div>

        <section className="panel relative mt-6 overflow-hidden rounded-[32px] p-6 md:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-28 size-80 rounded-full bg-[#9f1f27]/[0.075] blur-3xl"
          />

          <div className="relative flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
            <div className="max-w-2xl">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-[#caa563]/16 bg-[#caa563]/[0.055] text-[#d7b36d]">
                <Bot size={20} strokeWidth={1.4} />
              </div>

              <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#caa563]">
                Nuova valutazione strategica
              </p>

              <h2 className="font-display mt-3 text-3xl leading-tight text-[#f3eee5] md:text-4xl">
                Analizza un ristorante e costruisci il suo piano di
                trasformazione.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
                Valuta sito, brand, menù, reputazione, social e conversione.
                La piattaforma individuerà priorità, opportunità e soluzioni
                commerciali coerenti.
              </p>
            </div>

            <Link
              href="/audits/new"
              className="group inline-flex w-fit items-center gap-4 rounded-full border border-[#d1aa62]/25 bg-[#d1aa62]/[0.07] px-6 py-4 text-xs text-[#e2c17d] transition hover:bg-[#d1aa62]/[0.13]"
            >
              Avvia una nuova analisi
              <ArrowUpRight
                size={16}
                className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>

        <div className="relative mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.75fr]">
          <DemoAuditTable />

          <div className="space-y-6">
            <PipelineCard />
            <OpportunityCard />
          </div>
        </div>

        <footer className="relative mt-10 flex flex-col justify-between gap-3 border-t border-white/[0.05] pt-6 text-[9px] uppercase tracking-[0.22em] text-white/20 sm:flex-row">
          <span>UARE Intelligence Platform</span>
          <span>Powered by Univibe Group · v0.1</span>
        </footer>
      </section>
    </main>
  );
}
