import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileText,
  Globe2,
  Megaphone,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  Workflow,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

const agents = [
  {
    name: "Marketing Director",
    role: "Strategia e coordinamento",
    task: "Roadmap Q3 in elaborazione",
    status: "Working",
    progress: 82,
    icon: BrainCircuit,
  },
  {
    name: "SEO Specialist",
    role: "Search intelligence",
    task: "Analisi di 83 keyword",
    status: "Working",
    progress: 67,
    icon: Search,
  },
  {
    name: "Content Strategist",
    role: "Piano editoriale",
    task: "12 contenuti programmati",
    status: "Working",
    progress: 74,
    icon: Megaphone,
  },
  {
    name: "Video Producer",
    role: "Reel e short video",
    task: "Montaggio di 4 contenuti",
    status: "Working",
    progress: 58,
    icon: Video,
  },
  {
    name: "Automation Architect",
    role: "Workflow e CRM",
    task: "6 automazioni attive",
    status: "Running",
    progress: 91,
    icon: Workflow,
  },
  {
    name: "Data Analyst",
    role: "KPI e performance",
    task: "Monitoraggio campagne",
    status: "Online",
    progress: 100,
    icon: BarChart3,
  },
];

const events = [
  {
    time: "09:44",
    agent: "Automation Architect",
    action: "ha attivato il follow-up automatico dei nuovi lead.",
    type: "automation",
  },
  {
    time: "09:39",
    agent: "Content Strategist",
    action: "ha completato il piano editoriale delle prossime due settimane.",
    type: "content",
  },
  {
    time: "09:31",
    agent: "SEO Specialist",
    action: "ha individuato 17 opportunità ad alta intenzione commerciale.",
    type: "seo",
  },
  {
    time: "09:22",
    agent: "Marketing Director",
    action: "ha aggiornato le priorità del progetto Studio Medico Aurora.",
    type: "strategy",
  },
];

const twinAreas = [
  { label: "Brand", score: 78 },
  { label: "SEO", score: 54 },
  { label: "Social", score: 69 },
  { label: "Advertising", score: 43 },
  { label: "CRM", score: 36 },
  { label: "Automation", score: 24 },
];

const monitoredProjects = [
  {
    name: "Studio Medico Aurora",
    sector: "Sanità e benessere",
    status: "Strategy",
    score: 64,
  },
  {
    name: "Sakura Restaurant Lab",
    sector: "Ristorazione",
    status: "Research",
    score: 48,
  },
  {
    name: "Northwave Fitness",
    sector: "Fitness",
    status: "Content",
    score: 72,
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#07111F] text-[#F7FAFC]">
      <AppSidebar />

      <section className="relative overflow-hidden px-5 pb-28 pt-6 lg:ml-[112px] lg:px-8 xl:px-12">
        <div className="pointer-events-none absolute -right-48 -top-52 size-[42rem] rounded-full bg-[#FF6B1A]/[0.07] blur-[150px]" />
        <div className="pointer-events-none absolute -left-44 top-1/3 size-[34rem] rounded-full bg-[#2492E8]/[0.06] blur-[145px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 size-[30rem] rounded-full bg-[#6D4FD2]/[0.05] blur-[150px]" />

        <div className="relative mx-auto max-w-[1580px]">
          <header className="flex flex-col gap-8 border-b border-white/[0.07] pb-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-[15px] border border-white/[0.08] bg-white/[0.03] p-2">
                  <img
                    src="/uviq-logo.svg"
                    alt="UVIQ"
                    className="size-full object-contain"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2492E8]">
                    UVIQ Mission Control
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-[9px] text-[#91A4BF]">
                    <span className="size-1.5 rounded-full bg-[#24D27C] shadow-[0_0_12px_rgba(36,210,124,.75)]" />
                    AI Business Operating System online
                  </div>
                </div>
              </div>

              <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.052em] md:text-6xl xl:text-7xl">
                Il tuo reparto marketing
                <span className="block text-[#FF6B1A]">
                  è già al lavoro.
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#91A4BF] md:text-base">
                UVIQ coordina strategia, contenuti, ricerca, CRM,
                automazioni e performance in un unico centro operativo.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects/new"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[12px] bg-[#FF6B1A] px-6 text-xs font-semibold text-white shadow-[0_14px_38px_rgba(255,107,26,.22)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
              >
                <Plus size={16} />
                Avvia intelligence
                <ArrowUpRight
                  size={15}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/audits"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[12px] border border-white/[0.09] bg-white/[0.03] px-6 text-xs font-semibold text-[#D7E1EC] transition hover:border-white/[0.16] hover:bg-white/[0.055]"
              >
                <BriefcaseBusiness size={15} />
                Apri workspace
              </Link>
            </div>
          </header>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TopMetric
              label="Agenti AI online"
              value="12"
              detail="8 operativi · 4 in monitoraggio"
              icon={Bot}
              accent="#2492E8"
            />

            <TopMetric
              label="Aziende monitorate"
              value="18"
              detail="3 richiedono attenzione"
              icon={BriefcaseBusiness}
              accent="#6D4FD2"
            />

            <TopMetric
              label="Opportunità attive"
              value="27"
              detail="+9 rilevate questa settimana"
              icon={Target}
              accent="#FF6B1A"
            />

            <TopMetric
              label="Crescita stimata"
              value="€ 42.600"
              detail="Valore potenziale pipeline"
              icon={TrendingUp}
              accent="#24D27C"
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <article className="relative overflow-hidden rounded-[20px] border border-white/[0.075] bg-[#0B1628] p-6 md:p-8">
              <div className="pointer-events-none absolute right-0 top-0 size-72 rounded-full bg-[#FF6B1A]/[0.055] blur-[90px]" />

              <div className="relative">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                  <div className="flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#69BDF2]">
                      <BrainCircuit size={21} />
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2492E8]">
                          CEO AI
                        </p>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#24D27C]/15 bg-[#24D27C]/[0.055] px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#66E7A6]">
                          <span className="size-1.5 rounded-full bg-[#24D27C]" />
                          Online
                        </span>
                      </div>

                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
                        Buongiorno, Brian.
                      </h2>
                    </div>
                  </div>

                  <span className="text-[9px] text-[#607089]">
                    Aggiornato ora
                  </span>
                </div>

                <div className="mt-8 rounded-[16px] border border-white/[0.065] bg-[#07111F]/60 p-5 md:p-6">
                  <p className="text-sm leading-7 text-[#D7E1EC]">
                    Ho completato il monitoraggio dei progetti attivi.
                    La priorità principale è{" "}
                    <strong className="font-semibold text-white">
                      Studio Medico Aurora
                    </strong>
                    : il maggiore potenziale si trova in CRM,
                    automazioni WhatsApp e campagne Meta orientate
                    alla prenotazione.
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <Insight
                      label="Priorità"
                      value="Automation"
                      icon={Workflow}
                    />

                    <Insight
                      label="Opportunità"
                      value="€ 8.400"
                      icon={TrendingUp}
                    />

                    <Insight
                      label="Confidence"
                      value="91%"
                      icon={CheckCircle2}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/growth-plan"
                    className="group inline-flex items-center justify-center gap-3 rounded-[12px] bg-[#FF6B1A] px-5 py-3.5 text-xs font-semibold text-white transition hover:bg-[#FF7D34]"
                  >
                    Crea piano operativo
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/demo-generator"
                    className="inline-flex items-center justify-center gap-3 rounded-[12px] border border-white/[0.08] bg-white/[0.025] px-5 py-3.5 text-xs text-[#D7E1EC] transition hover:bg-white/[0.05]"
                  >
                    <Sparkles size={15} />
                    Genera demo
                  </Link>

                  <Link
                    href="/audits/analysis"
                    className="inline-flex items-center justify-center gap-3 rounded-[12px] border border-white/[0.08] bg-white/[0.025] px-5 py-3.5 text-xs text-[#D7E1EC] transition hover:bg-white/[0.05]"
                  >
                    <Activity size={15} />
                    Apri Business Twin
                  </Link>
                </div>
              </div>
            </article>

            <BusinessTwin />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <Timeline />
            <AIDepartment />
          </section>

          <section className="mt-6 rounded-[20px] border border-white/[0.075] bg-[#0B1628]">
            <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] px-6 py-5 md:flex-row md:items-end">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2492E8]">
                  Workspace monitorato
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                  Progetti che richiedono una decisione
                </h2>
              </div>

              <Link
                href="/audits"
                className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#FF8A4A] transition hover:text-white"
              >
                Tutti i progetti
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-white/[0.06] px-6">
              {monitoredProjects.map((project) => (
                <Link
                  key={project.name}
                  href="/audits/analysis"
                  className="group grid gap-4 py-5 transition hover:translate-x-1 md:grid-cols-[1.2fr_0.7fr_0.45fr_auto] md:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#F7FAFC]">
                      {project.name}
                    </p>

                    <p className="mt-1 text-[9px] text-[#607089]">
                      {project.sector}
                    </p>
                  </div>

                  <span className="text-[10px] text-[#91A4BF]">
                    {project.status}
                  </span>

                  <span className="inline-flex w-fit rounded-full border border-[#2492E8]/18 bg-[#2492E8]/[0.07] px-3 py-1.5 text-[8px] font-semibold text-[#69BDF2]">
                    Score {project.score}
                  </span>

                  <ArrowRight
                    size={14}
                    className="text-[#607089] transition group-hover:text-[#FF8A4A]"
                  />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function TopMetric({
  label,
  value,
  detail,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Bot;
  accent: string;
}) {
  return (
    <article className="rounded-[17px] border border-white/[0.07] bg-[#0B1628] p-5">
      <div className="flex items-start justify-between gap-4">
        <span
          className="flex size-10 items-center justify-center rounded-[12px] border"
          style={{
            color: accent,
            borderColor: `${accent}2F`,
            backgroundColor: `${accent}12`,
          }}
        >
          <Icon size={17} />
        </span>

        <span className="inline-flex items-center gap-1.5 text-[8px] text-[#607089]">
          <CircleDot size={10} />
          Live
        </span>
      </div>

      <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#607089]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold tracking-[-0.045em]">
        {value}
      </p>

      <p className="mt-2 text-[9px] text-[#91A4BF]">
        {detail}
      </p>
    </article>
  );
}

function Insight({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Workflow;
}) {
  return (
    <div className="rounded-[13px] border border-white/[0.06] bg-[#0B1628] p-4">
      <Icon size={14} className="text-[#2492E8]" />

      <p className="mt-3 text-[7px] font-semibold uppercase tracking-[0.13em] text-[#607089]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function BusinessTwin() {
  return (
    <article className="rounded-[20px] border border-white/[0.075] bg-[#0B1628] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2492E8]">
            Business Twin
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
            Stato digitale
          </h2>
        </div>

        <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#6D4FD2]/20 bg-[#6D4FD2]/10 text-[#9B86EA]">
          <Globe2 size={18} />
        </span>
      </div>

      <div className="mt-7 space-y-5">
        {twinAreas.map((area) => {
          const color =
            area.score < 40
              ? "#FF6B1A"
              : area.score < 65
                ? "#2492E8"
                : "#24D27C";

          return (
            <div key={area.label}>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-medium text-[#D7E1EC]">
                  {area.label}
                </span>

                <span
                  className="font-semibold"
                  style={{ color }}
                >
                  {area.score}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${area.score}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/audits/analysis"
        className="mt-7 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#FF8A4A]"
      >
        Apri Business Twin
        <ArrowRight size={13} />
      </Link>
    </article>
  );
}

function Timeline() {
  return (
    <article className="rounded-[20px] border border-white/[0.075] bg-[#0B1628]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2492E8]">
            Live timeline
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
            Attività del reparto
          </h2>
        </div>

        <Clock3 size={17} className="text-[#91A4BF]" />
      </div>

      <div className="px-6">
        {events.map((event, index) => (
          <div
            key={`${event.time}-${event.agent}`}
            className="relative flex gap-4 border-b border-white/[0.055] py-5 last:border-0"
          >
            <div className="flex w-12 shrink-0 flex-col items-center">
              <span className="font-mono text-[8px] text-[#607089]">
                {event.time}
              </span>

              <span
                className={`mt-3 size-2 rounded-full ${
                  index === 0
                    ? "bg-[#FF6B1A] shadow-[0_0_14px_rgba(255,107,26,.7)]"
                    : "bg-[#2492E8]"
                }`}
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#F7FAFC]">
                {event.agent}
              </p>

              <p className="mt-2 text-[10px] leading-5 text-[#91A4BF]">
                {event.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function AIDepartment() {
  return (
    <article className="rounded-[20px] border border-white/[0.075] bg-[#0B1628]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2492E8]">
            AI Department
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
            Dipendenti digitali
          </h2>
        </div>

        <Users size={17} className="text-[#91A4BF]" />
      </div>

      <div className="grid gap-px bg-white/[0.055] sm:grid-cols-2">
        {agents.map((agent) => {
          const Icon = agent.icon;

          return (
            <div
              key={agent.name}
              className="bg-[#0B1628] p-5 transition hover:bg-[#101F35]"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-[#2492E8]/18 bg-[#2492E8]/[0.07] text-[#69BDF2]">
                  <Icon size={17} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold">
                        {agent.name}
                      </p>

                      <p className="mt-1 text-[8px] text-[#607089]">
                        {agent.role}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-[#66E7A6]">
                      <span className="size-1.5 rounded-full bg-[#24D27C]" />
                      {agent.status}
                    </span>
                  </div>

                  <p className="mt-4 text-[9px] text-[#91A4BF]">
                    {agent.task}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-[#2492E8]"
                        style={{
                          width: `${agent.progress}%`,
                        }}
                      />
                    </div>

                    <span className="font-mono text-[8px] text-[#607089]">
                      {agent.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
