"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  Circle,
  Database,
  Eye,
  FileSearch,
  Globe2,
  LoaderCircle,
  Radar,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { QuickAuditResultView } from "@/components/quick-audit/QuickAuditResultView";
import { generateQuickAudit } from "@/lib/quick-audit-engine";
import type {
  QuickAuditInput,
  QuickAuditResult,
} from "@/types/quick-audit";

const LEGACY_INPUT_KEY = "uare-quick-audit-input";
const INTELLIGENCE_INPUT_KEY = "uviq-intelligence-input";
const DISCOVERY_KEY = "uviq-business-discovery";
const RESULT_KEY = "uare-quick-audit-result";

type AgentStatus =
  | "waiting"
  | "working"
  | "completed";

type IntelligenceProfile = {
  businessName?: string;
  city?: string;
  sectorName?: string;
  sectorId?: string;
  website?: string;
  target?: string;
  objective?: string;
  modules?: string[];
};

type AgentDefinition = {
  id: string;
  name: string;
  role: string;
  activity: string;
  output: string;
  icon: typeof Globe2;
};

const agents: AgentDefinition[] = [
  {
    id: "research",
    name: "Research Agent",
    role: "Data acquisition",
    activity: "Raccolta delle evidenze e delle fonti aziendali",
    output: "Fonti digitali acquisite",
    icon: Globe2,
  },
  {
    id: "vision",
    name: "Vision Agent",
    role: "Experience intelligence",
    activity: "Analisi dell’esperienza, del design e della comunicazione",
    output: "Pattern visivi identificati",
    icon: Eye,
  },
  {
    id: "seo",
    name: "Search Agent",
    role: "Search intelligence",
    activity: "Valutazione SEO, territorio e domanda di mercato",
    output: "Opportunità organiche rilevate",
    icon: Search,
  },
  {
    id: "brand",
    name: "Brand Agent",
    role: "Positioning intelligence",
    activity: "Interpretazione di identità, offerta e posizionamento",
    output: "Business DNA elaborato",
    icon: Sparkles,
  },
  {
    id: "social",
    name: "Social Agent",
    role: "Channel intelligence",
    activity: "Analisi dei canali, dei contenuti e della frequenza",
    output: "Gap editoriali individuati",
    icon: Share2,
  },
  {
    id: "strategy",
    name: "Strategy Agent",
    role: "Decision intelligence",
    activity: "Definizione delle priorità e della roadmap commerciale",
    output: "Strategia preliminare generata",
    icon: Target,
  },
  {
    id: "automation",
    name: "Automation Agent",
    role: "Workflow architecture",
    activity: "Progettazione di CRM, follow-up e automazioni",
    output: "Workflow operativi configurati",
    icon: Workflow,
  },
  {
    id: "analytics",
    name: "Analytics Agent",
    role: "Performance intelligence",
    activity: "Elaborazione score, KPI e indicatori di opportunità",
    output: "Digital score calcolato",
    icon: BarChart3,
  },
];

const events = [
  "Profilo aziendale acquisito",
  "Blueprint settoriale caricato",
  "Fonti digitali collegate",
  "Struttura del sito rilevata",
  "Segnali commerciali classificati",
  "Pattern UX e comunicativi identificati",
  "Opportunità SEO elaborate",
  "Posizionamento competitivo interpretato",
  "Moduli marketing configurati",
  "Workflow CRM e automation predisposti",
  "KPI e score calcolati",
  "Strategia preliminare completata",
];

export function AnalysisExperience() {
  const [legacyInput, setLegacyInput] =
    useState<QuickAuditInput | null>(null);

  const [profile, setProfile] =
    useState<IntelligenceProfile | null>(null);

  const [result, setResult] =
    useState<QuickAuditResult | null>(null);

  const [agentIndex, setAgentIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [missingInput, setMissingInput] = useState(false);

  useEffect(() => {
    const storedResult =
      window.localStorage.getItem(RESULT_KEY);

    if (storedResult) {
      try {
        const parsedResult =
          JSON.parse(storedResult) as QuickAuditResult;

        setLegacyInput(parsedResult.input);
        setResult(parsedResult);
        setCompleted(true);
        return;
      } catch {
        window.localStorage.removeItem(RESULT_KEY);
      }
    }

    const legacyRaw =
      window.localStorage.getItem(LEGACY_INPUT_KEY);

    const intelligenceRaw =
      window.localStorage.getItem(
        INTELLIGENCE_INPUT_KEY,
      );

    const discoveryRaw =
      window.localStorage.getItem(DISCOVERY_KEY);

    if (!legacyRaw) {
      setMissingInput(true);
      return;
    }

    try {
      const parsedLegacy =
        JSON.parse(legacyRaw) as QuickAuditInput;

      setLegacyInput(parsedLegacy);

      if (intelligenceRaw) {
        try {
          setProfile(
            JSON.parse(
              intelligenceRaw,
            ) as IntelligenceProfile,
          );
        } catch {
          setProfile(null);
        }
      } else if (discoveryRaw) {
        try {
          setProfile(
            JSON.parse(
              discoveryRaw,
            ) as IntelligenceProfile,
          );
        } catch {
          setProfile(null);
        }
      }

      const agentTimers = agents.map((_, index) =>
        window.setTimeout(() => {
          setAgentIndex(index);
        }, index * 1450),
      );

      const eventTimers = events.map((_, index) =>
        window.setTimeout(() => {
          setEventIndex(index);
        }, index * 850),
      );

      const completionTimer =
        window.setTimeout(async () => {
          let generatedResult: QuickAuditResult;

          try {
            const response = await fetch(
              "/api/intelligence/analyze",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedLegacy),
              },
            );

            const payload =
              (await response.json()) as {
                result?: QuickAuditResult;
                error?: string;
              };

            if (!response.ok || !payload.result) {
              throw new Error(
                payload.error ||
                  "Analisi AI non disponibile.",
              );
            }

            generatedResult = payload.result;
          } catch (error) {
            console.error(
              "Fallback intelligence locale:",
              error,
            );

            generatedResult =
              generateQuickAudit(parsedLegacy);
          }

          window.localStorage.setItem(
            RESULT_KEY,
            JSON.stringify(generatedResult),
          );

          setAgentIndex(agents.length);
          setEventIndex(events.length - 1);
          setResult(generatedResult);

          window.setTimeout(() => {
            setCompleted(true);
          }, 900);
        }, agents.length * 1450 + 900);

      return () => {
        agentTimers.forEach((timer) =>
          window.clearTimeout(timer),
        );

        eventTimers.forEach((timer) =>
          window.clearTimeout(timer),
        );

        window.clearTimeout(completionTimer);
      };
    } catch {
      setMissingInput(true);
    }
  }, []);

  const progress = useMemo(() => {
    if (agentIndex >= agents.length) {
      return 100;
    }

    return Math.max(
      6,
      Math.round(
        ((agentIndex + 0.55) / agents.length) * 100,
      ),
    );
  }, [agentIndex]);

  const completedAgents = Math.min(
    agentIndex,
    agents.length,
  );

  const businessName =
    profile?.businessName ||
    legacyInput?.restaurantName ||
    "Nuovo progetto";

  const city =
    profile?.city ||
    legacyInput?.city ||
    "";

  const sector =
    profile?.sectorName ||
    "Business Intelligence";

  const enabledModules =
    profile?.modules?.length
      ? profile.modules
      : [
          "website",
          "seo",
          "brand",
          "social",
          "automation",
          "analytics",
        ];

  if (missingInput) {
    return (
      <main className="workspace-page min-h-screen">
        <AppSidebar />

        <section className="flex min-h-screen items-center justify-center px-6 lg:ml-[112px]">
          <div className="w-full max-w-xl rounded-[18px] border border-white/[0.075] bg-[#11151C] p-9 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-[14px] border border-[#5B7CFF]/20 bg-[#5B7CFF]/10 text-[#9AAEFF]">
              <FileSearch size={20} />
            </span>

            <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
              Nessun progetto configurato
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#F5F7FA]">
              Avvia prima una nuova intelligence.
            </h1>

            <p className="mt-4 text-sm leading-7 text-[#8A97A8]">
              UVIQ ha bisogno del profilo aziendale e delle
              fonti digitali da analizzare.
            </p>

            <Link
              href="/projects/new"
              className="mt-7 inline-flex items-center gap-3 rounded-[12px] bg-[#5B7CFF] px-6 py-3.5 text-xs font-semibold text-white hover:bg-[#6C8AFF]"
            >
              Nuovo progetto
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (completed && result) {
    return <QuickAuditResultView result={result} />;
  }

  return (
    <main className="workspace-page min-h-screen">
      <AppSidebar />

      <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-6 lg:ml-[112px] lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute right-[-12rem] top-[-12rem] size-[38rem] rounded-full bg-[#5B7CFF]/[0.07] blur-[150px]" />
        <div className="pointer-events-none absolute bottom-[-15rem] left-1/3 size-[34rem] rounded-full bg-[#4FD1FF]/[0.04] blur-[150px]" />

        <div className="relative mx-auto max-w-[1540px]">
          <header className="flex flex-col gap-6 border-b border-white/[0.07] pb-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <Link
                href="/audits/new"
                className="inline-flex items-center gap-2 text-[10px] font-medium text-[#8A97A8] transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Interrompi intelligence
              </Link>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.05] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#68E0C9]">
                  <span className="size-1.5 animate-pulse rounded-full bg-[#2DD4BF]" />
                  War Room live
                </span>

                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[8px] uppercase tracking-[0.14em] text-[#8A97A8]">
                  {sector}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-[#F5F7FA] md:text-6xl">
                Research Intelligence
              </h1>

              <p className="mt-4 text-sm text-[#8A97A8]">
                {businessName}
                {city ? ` · ${city}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <HeaderMetric
                label="Avanzamento"
                value={`${progress}%`}
              />

              <HeaderMetric
                label="Agenti attivi"
                value={`${Math.min(
                  agentIndex + 1,
                  agents.length,
                )}/${agents.length}`}
              />

              <HeaderMetric
                label="Eventi"
                value={`${Math.min(
                  eventIndex + 1,
                  events.length,
                )}`}
              />
            </div>
          </header>

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <article className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-6 md:p-8">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
                      Intelligence processing
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#F5F7FA]">
                      Agenti in esecuzione
                    </h2>

                    <p className="mt-2 text-xs leading-6 text-[#8A97A8]">
                      Ogni agente elabora una parte del
                      Business Twin e trasferisce i risultati
                      allo Strategy Core.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#5B7CFF]/20 bg-[#5B7CFF]/10 text-[#9AAEFF]">
                      <BrainCircuit
                        size={19}
                        className="animate-pulse"
                      />
                    </span>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.14em] text-[#5E6978]">
                        Current process
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#C6CFD9]">
                        {agents[
                          Math.min(
                            agentIndex,
                            agents.length - 1,
                          )
                        ].name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{
                      duration: 0.55,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-[#5B7CFF]"
                  />
                </div>

                <div className="mt-8 grid gap-3 md:grid-cols-2">
                  {agents.map((agent, index) => {
                    const status: AgentStatus =
                      index < agentIndex
                        ? "completed"
                        : index === agentIndex
                          ? "working"
                          : "waiting";

                    return (
                      <AgentCard
                        key={agent.id}
                        agent={agent}
                        status={status}
                        order={index + 1}
                      />
                    );
                  })}
                </div>
              </article>

              <article className="rounded-[18px] border border-white/[0.075] bg-[#11151C]">
                <header className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
                      Live activity
                    </p>

                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#F5F7FA]">
                      Intelligence event stream
                    </h2>
                  </div>

                  <Activity
                    size={17}
                    className="text-[#68E0C9]"
                  />
                </header>

                <div className="max-h-[310px] overflow-hidden px-6 py-3">
                  <AnimatePresence initial={false}>
                    {events
                      .slice(
                        Math.max(0, eventIndex - 5),
                        eventIndex + 1,
                      )
                      .reverse()
                      .map((event, index) => (
                        <motion.div
                          key={`${event}-${eventIndex}`}
                          initial={{
                            opacity: 0,
                            y: -8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-4 border-b border-white/[0.05] py-4 last:border-0"
                        >
                          <span
                            className={`flex size-7 items-center justify-center rounded-full border ${
                              index === 0
                                ? "border-[#5B7CFF]/30 bg-[#5B7CFF]/10 text-[#9AAEFF]"
                                : "border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.05] text-[#68E0C9]"
                            }`}
                          >
                            {index === 0 ? (
                              <LoaderCircle
                                size={12}
                                className="animate-spin"
                              />
                            ) : (
                              <Check size={12} />
                            )}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-medium text-[#C6CFD9]">
                              {event}
                            </p>

                            <p className="mt-1 text-[8px] text-[#5E6978]">
                              UVIQ Intelligence Core
                            </p>
                          </div>

                          <span className="font-mono text-[8px] text-[#5E6978]">
                            {index === 0
                              ? "LIVE"
                              : "DONE"}
                          </span>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </article>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
              <section className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot
                      size={16}
                      className="text-[#9AAEFF]"
                    />

                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A9B8FF]">
                      Strategy Core
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.05] px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#68E0C9]">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#2DD4BF]" />
                    Online
                  </span>
                </div>

                <div className="mt-5 rounded-[14px] border border-white/[0.06] bg-[#0E131B] p-4">
                  <p className="text-xs font-semibold text-[#F5F7FA]">
                    {progress < 100
                      ? "Sto costruendo il Business Twin."
                      : "Intelligence completata."}
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-[#8A97A8]">
                    I risultati degli agenti vengono
                    normalizzati e trasformati in decisioni
                    operative.
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <SideMetric
                    label="Agenti conclusi"
                    value={`${completedAgents}`}
                    icon={Check}
                  />

                  <SideMetric
                    label="Confidence"
                    value={`${Math.min(
                      96,
                      64 + completedAgents * 4,
                    )}%`}
                    icon={ShieldCheck}
                  />
                </div>
              </section>

              <section className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A97A8]">
                  Moduli operativi
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {enabledModules.map((module) => (
                    <span
                      key={module}
                      className="rounded-[8px] border border-white/[0.07] bg-[#0E131B] px-2.5 py-2 text-[8px] capitalize text-[#AAB4C2]"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-[18px] border border-[#5B7CFF]/18 bg-[#5B7CFF]/[0.05] p-5">
                <Radar
                  size={18}
                  className="text-[#9AAEFF]"
                />

                <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9AAEFF]">
                  Next stage
                </p>

                <h3 className="mt-2 text-lg font-semibold text-[#F5F7FA]">
                  Analysis Insights
                </h3>

                <p className="mt-3 text-[10px] leading-5 text-[#8A97A8]">
                  Al termine verranno visualizzati score,
                  criticità, opportunità e piano operativo.
                </p>
              </section>

              <p className="text-center text-[8px] uppercase tracking-[0.16em] text-[#5E6978]">
                Analisi preliminare · Supervisione consulente
              </p>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}

function HeaderMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-[108px] rounded-[13px] border border-white/[0.07] bg-[#11151C] px-4 py-3">
      <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#5E6978]">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#F5F7FA]">
        {value}
      </p>
    </div>
  );
}

function AgentCard({
  agent,
  status,
  order,
}: {
  agent: AgentDefinition;
  status: AgentStatus;
  order: number;
}) {
  const Icon = agent.icon;

  const progress =
    status === "completed"
      ? 100
      : status === "working"
        ? 58
        : 0;

  return (
    <article
      className={`rounded-[14px] border p-4 transition ${
        status === "working"
          ? "border-[#5B7CFF]/35 bg-[#5B7CFF]/[0.07]"
          : status === "completed"
            ? "border-[#2DD4BF]/14 bg-[#2DD4BF]/[0.035]"
            : "border-white/[0.06] bg-[#0E131B]"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] border ${
            status === "working"
              ? "border-[#5B7CFF]/25 bg-[#5B7CFF]/15 text-[#A9B8FF]"
              : status === "completed"
                ? "border-[#2DD4BF]/18 bg-[#2DD4BF]/[0.06] text-[#68E0C9]"
                : "border-white/[0.07] bg-[#141B24] text-[#5E6978]"
          }`}
        >
          <Icon size={17} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={`text-xs font-semibold ${
                  status === "waiting"
                    ? "text-[#667181]"
                    : "text-[#F5F7FA]"
                }`}
              >
                {agent.name}
              </p>

              <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-[#5E6978]">
                {agent.role}
              </p>
            </div>

            <span className="font-mono text-[8px] text-[#5E6978]">
              {String(order).padStart(2, "0")}
            </span>
          </div>

          <p
            className={`mt-3 text-[10px] leading-5 ${
              status === "waiting"
                ? "text-[#4C5664]"
                : "text-[#8A97A8]"
            }`}
          >
            {status === "completed"
              ? agent.output
              : agent.activity}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.055]">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7 }}
                className={`h-full rounded-full ${
                  status === "completed"
                    ? "bg-[#2DD4BF]"
                    : "bg-[#5B7CFF]"
                }`}
              />
            </div>

            <span
              className={`min-w-[52px] text-right text-[8px] font-semibold ${
                status === "working"
                  ? "text-[#A9B8FF]"
                  : status === "completed"
                    ? "text-[#68E0C9]"
                    : "text-[#5E6978]"
              }`}
            >
              {status === "working"
                ? "WORKING"
                : status === "completed"
                  ? "DONE"
                  : "WAITING"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function SideMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Check;
}) {
  return (
    <div className="rounded-[13px] border border-white/[0.06] bg-[#0E131B] p-4">
      <Icon
        size={14}
        className="text-[#9AAEFF]"
      />

      <p className="mt-4 text-[7px] font-semibold uppercase tracking-[0.13em] text-[#5E6978]">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold tracking-[-0.035em] text-[#F5F7FA]">
        {value}
      </p>
    </div>
  );
}
