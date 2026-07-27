import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  CircleDot,
  Database,
  FileSearch,
  Globe2,
  LayoutGrid,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { QuickAuditForm } from "@/components/quick-audit/QuickAuditForm";

const setupSteps = [
  {
    number: "01",
    label: "Settore",
    value: "Configurato",
    status: "completed",
  },
  {
    number: "02",
    label: "Discovery",
    value: "Completata",
    status: "completed",
  },
  {
    number: "03",
    label: "Intelligence",
    value: "Configurazione",
    status: "active",
  },
  {
    number: "04",
    label: "Business Twin",
    value: "Non generato",
    status: "pending",
  },
];

const sources = [
  {
    title: "Sito web",
    description:
      "Struttura, contenuti, UX, conversione, performance e segnali tecnici.",
    icon: Globe2,
    availability: "Se fornito",
  },
  {
    title: "Google e ricerca locale",
    description:
      "Presenza organica, risultati indicizzati e segnali territoriali disponibili.",
    icon: Search,
    availability: "Configurabile",
  },
  {
    title: "Social e comunicazione",
    description:
      "Profili, frequenza, contenuti e coerenza del posizionamento.",
    icon: Sparkles,
    availability: "Se accessibili",
  },
  {
    title: "Materiali aziendali",
    description:
      "Menu, cataloghi, documenti, immagini e informazioni caricate nel progetto.",
    icon: Database,
    availability: "Facoltativo",
  },
];

export default function NewAuditPage() {
  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/projects/new"
                aria-label="Torna alla configurazione progetto"
                className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C3CEDB] transition hover:border-[#2492E8]/35 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                <BrainCircuit size={18} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em] text-white">
                    Intelligence Setup
                  </h1>

                  <span className="rounded-full border border-[#2492E8]/20 bg-[#2492E8]/10 px-3 py-1 text-xs font-semibold text-[#79C6F5]">
                    Step 3 di 4
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Definizione delle fonti e del perimetro di analisi.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="inline-flex items-center gap-2 text-sm text-[#B8C5D4]">
                <LockKeyhole
                  size={14}
                  className="text-[#24D27C]"
                />
                Nessuna esecuzione automatica
              </span>

              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold text-white transition hover:border-[#2492E8]/35 hover:bg-white/[0.06]"
              >
                <LayoutGrid size={15} />
                Mission Control
              </Link>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden px-5 pb-24 pt-8 lg:px-8 xl:px-10">
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#2492E8]/[0.055] blur-[160px]" />
          <div className="pointer-events-none absolute bottom-[-20rem] left-1/4 size-[38rem] rounded-full bg-[#FF6B1A]/[0.045] blur-[170px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
              <div className="grid gap-8 p-7 md:p-9 xl:grid-cols-[1fr_470px] xl:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#24D27C]/18 bg-[#24D27C]/[0.055] px-3 py-1.5 text-xs font-semibold text-[#8AF0BA]">
                      <CheckCircle2 size={13} />
                      Discovery disponibile
                    </span>

                    <span className="text-sm text-[#AEBCCC]">
                      La ricerca partirà soltanto dopo conferma
                    </span>
                  </div>

                  <h2 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-white md:text-5xl">
                    Definisci cosa UVIQ
                    <span className="block text-[#FF6B1A]">
                      può realmente analizzare.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-3xl text-base leading-8 text-[#CBD6E2]">
                    Seleziona fonti, moduli e obiettivi. Il sistema
                    distinguerà sempre dati raccolti, informazioni fornite,
                    deduzioni e aree non verificabili.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {setupSteps.map((item) => (
                    <SetupProgressItem
                      key={item.number}
                      {...item}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_390px]">
              <div className="min-w-0">
                <section className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
                  <header className="flex flex-col justify-between gap-5 border-b border-white/[0.08] px-6 py-6 md:flex-row md:items-end md:px-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                        Perimetro operativo
                      </p>

                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                        Configura la prima analisi
                      </h2>

                      <p className="mt-2 max-w-3xl text-sm leading-7 text-[#B8C5D4]">
                        Compila soltanto le informazioni disponibili.
                        I campi mancanti verranno dichiarati nel report,
                        non sostituiti con dati inventati.
                      </p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.07] px-3 py-1.5 text-xs font-semibold text-[#FF9A64]">
                      <CircleDot size={12} />
                      Non avviata
                    </span>
                  </header>

                  <div className="p-5 md:p-7">
                    <Suspense fallback={<IntelligenceSetupLoading />}>
                      <QuickAuditForm />
                    </Suspense>
                  </div>
                </section>
              </div>

              <aside className="space-y-4 xl:sticky xl:top-[108px] xl:self-start">
                <article className="overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#0B1628]">
                  <header className="border-b border-white/[0.08] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                          Fonti disponibili
                        </p>

                        <h2 className="mt-3 text-xl font-semibold text-white">
                          Cosa potrà essere verificato
                        </h2>
                      </div>

                      <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                        <FileSearch size={18} />
                      </span>
                    </div>
                  </header>

                  <div className="divide-y divide-white/[0.065]">
                    {sources.map((source) => {
                      const Icon = source.icon;

                      return (
                        <div
                          key={source.title}
                          className="p-5"
                        >
                          <div className="flex items-start gap-4">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.08] bg-[#07111F]/55 text-[#79C6F5]">
                              <Icon size={16} />
                            </span>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-sm font-semibold text-white">
                                  {source.title}
                                </h3>

                                <span className="text-xs font-medium text-[#8AF0BA]">
                                  {source.availability}
                                </span>
                              </div>

                              <p className="mt-2 text-sm leading-6 text-[#B8C5D4]">
                                {source.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article className="rounded-[18px] border border-[#24D27C]/18 bg-[#24D27C]/[0.045] p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-[#24D27C]/20 bg-[#24D27C]/10 text-[#8AF0BA]">
                      <ShieldCheck size={17} />
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Regole di affidabilità
                      </h3>

                      <div className="mt-3 space-y-3">
                        <ReliabilityItem text="Le fonti utilizzate saranno tracciate." />
                        <ReliabilityItem text="I dati non verificabili saranno segnalati." />
                        <ReliabilityItem text="Le deduzioni saranno separate dai fatti." />
                        <ReliabilityItem text="Nessuna pubblicazione partirà dal setup." />
                      </div>
                    </div>
                  </div>
                </article>

                <Link
                  href="/audits"
                  className="group flex min-h-13 items-center justify-between rounded-[16px] border border-white/[0.09] bg-[#0B1628] px-5 text-sm font-semibold text-white transition hover:border-[#2492E8]/35 hover:bg-[#101D31]"
                >
                  Visualizza archivio analisi

                  <ArrowRight
                    size={15}
                    className="text-[#79C6F5] transition group-hover:translate-x-1"
                  />
                </Link>
              </aside>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function SetupProgressItem({
  number,
  label,
  value,
  status,
}: {
  number: string;
  label: string;
  value: string;
  status: string;
}) {
  const completed = status === "completed";
  const active = status === "active";

  return (
    <div
      className={`flex min-h-[82px] items-center gap-4 rounded-[14px] border px-4 ${
        completed
          ? "border-[#24D27C]/20 bg-[#24D27C]/[0.055]"
          : active
            ? "border-[#2492E8]/35 bg-[#2492E8]/10"
            : "border-white/[0.08] bg-[#07111F]/45"
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-[11px] border text-sm font-semibold ${
          completed
            ? "border-[#24D27C] bg-[#24D27C] text-[#07111F]"
            : active
              ? "border-[#2492E8] bg-[#2492E8] text-white"
              : "border-white/[0.1] text-[#AEBCCC]"
        }`}
      >
        {completed ? <Check size={15} /> : number}
      </span>

      <div>
        <p className="text-sm font-semibold text-white">
          {label}
        </p>

        <p
          className={`mt-1 text-xs ${
            completed
              ? "text-[#8AF0BA]"
              : active
                ? "text-[#79C6F5]"
                : "text-[#AEBCCC]"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ReliabilityItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm leading-6 text-[#C8D4E1]">
      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#24D27C]/10 text-[#8AF0BA]">
        <Check size={11} />
      </span>

      {text}
    </div>
  );
}

function IntelligenceSetupLoading() {
  return (
    <div className="rounded-[18px] border border-white/[0.08] bg-[#07111F]/55 p-7">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
          <Workflow
            size={18}
            className="animate-pulse"
          />
        </span>

        <div>
          <p className="text-sm font-semibold text-white">
            Caricamento configurazione
          </p>

          <p className="mt-2 text-sm leading-6 text-[#B8C5D4]">
            UVIQ sta recuperando settore, Discovery e moduli
            disponibili. Nessuna analisi è ancora in esecuzione.
          </p>
        </div>
      </div>
    </div>
  );
}
