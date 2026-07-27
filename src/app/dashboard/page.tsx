import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Globe2,
  LayoutDashboard,
  Megaphone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  Workflow,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

const metrics = [
  {
    label: "Progetti nel workspace",
    value: "4",
    detail: "1 progetto reale · 3 casi dimostrativi",
    icon: BriefcaseBusiness,
    color: "#2492E8",
  },
  {
    label: "Analisi completate",
    value: "3",
    detail: "Dataset dimostrativo",
    icon: Search,
    color: "#6D4FD2",
  },
  {
    label: "Opportunità rilevate",
    value: "27",
    detail: "Segnali strategici simulati",
    icon: Target,
    color: "#FF6B1A",
  },
  {
    label: "Automazioni suggerite",
    value: "12",
    detail: "Da validare prima dell’attivazione",
    icon: Workflow,
    color: "#24D27C",
  },
];

const agents = [
  {
    name: "Marketing Director",
    role: "Strategia e coordinamento",
    task: "Roadmap trimestrale",
    progress: 84,
    status: "Working",
    icon: BrainCircuit,
    color: "#2492E8",
  },
  {
    name: "SEO Specialist",
    role: "Ricerca e posizionamento",
    task: "Analisi opportunità locali",
    progress: 67,
    status: "Working",
    icon: Search,
    color: "#2492E8",
  },
  {
    name: "Content Strategist",
    role: "Piano editoriale",
    task: "12 contenuti pianificati",
    progress: 72,
    status: "Online",
    icon: Megaphone,
    color: "#6D4FD2",
  },
  {
    name: "Video Producer",
    role: "Reel e short video",
    task: "3 contenuti in produzione",
    progress: 58,
    status: "Processing",
    icon: Video,
    color: "#FF6B1A",
  },
  {
    name: "CRM Manager",
    role: "Lead e pipeline",
    task: "Follow-up da configurare",
    progress: 46,
    status: "Ready",
    icon: Users,
    color: "#24D27C",
  },
  {
    name: "Automation Architect",
    role: "Workflow e processi",
    task: "6 flussi suggeriti",
    progress: 91,
    status: "Running",
    icon: Workflow,
    color: "#24D27C",
  },
];

const activities = [
  {
    time: "09:44",
    agent: "Automation Architect",
    action:
      "Ha preparato il flusso di follow-up per i nuovi contatti.",
    icon: Workflow,
    color: "#24D27C",
  },
  {
    time: "09:39",
    agent: "Content Strategist",
    action:
      "Ha completato il piano editoriale delle prossime due settimane.",
    icon: Megaphone,
    color: "#6D4FD2",
  },
  {
    time: "09:31",
    agent: "SEO Specialist",
    action:
      "Ha individuato opportunità ad alta intenzione commerciale.",
    icon: Search,
    color: "#2492E8",
  },
  {
    time: "09:22",
    agent: "Marketing Director",
    action:
      "Ha aggiornato le priorità strategiche del workspace.",
    icon: BrainCircuit,
    color: "#FF6B1A",
  },
];

const businessTwin = [
  {
    label: "Brand",
    score: 78,
  },
  {
    label: "SEO",
    score: 54,
  },
  {
    label: "Social",
    score: 69,
  },
  {
    label: "Advertising",
    score: 43,
  },
  {
    label: "CRM",
    score: 36,
  },
  {
    label: "Automation",
    score: 24,
  },
];

const projects = [
  {
    name: "Yammy Ristorante Giapponese",
    sector: "Ristorazione",
    type: "Prospect",
    phase: "Concept personalizzato",
    score: null,
    nextAction: "Completa discovery",
    href: "/projects/new/restaurant",
  },
  {
    name: "Studio Medico Aurora",
    sector: "Sanità e benessere",
    type: "Demo",
    phase: "Strategia",
    score: 64,
    nextAction: "Apri report",
    href: "/audits/analysis",
  },
  {
    name: "Sakura Restaurant Lab",
    sector: "Ristorazione",
    type: "Demo",
    phase: "Research",
    score: 48,
    nextAction: "Rivedi analisi",
    href: "/audits/analysis",
  },
  {
    name: "Northwave Fitness",
    sector: "Fitness",
    type: "Demo",
    phase: "Content",
    score: 72,
    nextAction: "Apri progetto",
    href: "/audits",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-6 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                <LayoutDashboard size={18} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em] text-white">
                    Mission Control
                  </h1>

                  <span className="rounded-full border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.07] px-3 py-1 text-[11px] font-semibold text-[#FF9A64]">
                    Workspace dimostrativo
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Supervisione operativa di progetti, agenti e opportunità.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                href="/audits"
                className="hidden min-h-11 items-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold text-white transition hover:border-[#2492E8]/35 hover:bg-white/[0.06] sm:inline-flex"
              >
                <BriefcaseBusiness size={15} />
                Workspace
              </Link>

              <Link
                href="/projects/new"
                className="inline-flex min-h-11 items-center gap-3 rounded-[12px] bg-[#FF6B1A] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,107,26,.22)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
              >
                <Plus size={16} />
                Nuovo progetto
              </Link>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden px-5 pb-24 pt-8 lg:px-8 xl:px-10">
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#2492E8]/[0.055] blur-[160px]" />
          <div className="pointer-events-none absolute bottom-[-20rem] left-1/4 size-[38rem] rounded-full bg-[#FF6B1A]/[0.045] blur-[170px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
              <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
                <div className="grid min-h-[330px] gap-8 p-7 md:p-9 xl:grid-cols-[1fr_auto] xl:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#24D27C]/18 bg-[#24D27C]/[0.055] px-3 py-1.5 text-[11px] font-semibold text-[#8AF0BA]">
                        <span className="size-1.5 rounded-full bg-[#24D27C] shadow-[0_0_10px_rgba(36,210,124,.7)]" />
                        Sistema operativo
                      </span>

                      <span className="text-sm text-[#AEBCCC]">
                        Aggiornato ora
                      </span>
                    </div>

                    <h2 className="mt-7 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-5xl xl:text-6xl">
                      Il reparto marketing
                      <span className="block text-[#FF6B1A]">
                        è pronto a lavorare.
                      </span>
                    </h2>

                    <p className="mt-6 max-w-3xl text-base leading-8 text-[#CBD6E2]">
                      UVIQ coordina analisi, strategia, contenuti,
                      CRM e automazioni in un unico flusso operativo.
                      Prima dell’attivazione, ogni azione viene validata
                      dal team.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/projects/new"
                        className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-6 text-sm font-semibold text-white transition hover:bg-[#FF7D34]"
                      >
                        Avvia nuova intelligence
                        <ArrowRight
                          size={15}
                          className="transition group-hover:translate-x-1"
                        />
                      </Link>

                      <Link
                        href="/growth-plan"
                        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] border border-white/[0.11] bg-white/[0.035] px-6 text-sm font-semibold text-white transition hover:border-[#2492E8]/35 hover:bg-white/[0.065]"
                      >
                        <Sparkles size={16} className="text-[#79C6F5]" />
                        Apri piano operativo
                      </Link>
                    </div>
                  </div>

                  <div className="grid min-w-[220px] grid-cols-2 gap-3">
                    <HeroStat
                      label="Agenti online"
                      value="8"
                      icon={Bot}
                      color="#2492E8"
                    />

                    <HeroStat
                      label="Task attivi"
                      value="14"
                      icon={Activity}
                      color="#FF6B1A"
                    />

                    <HeroStat
                      label="Automazioni"
                      value="6"
                      icon={Workflow}
                      color="#24D27C"
                    />

                    <HeroStat
                      label="Progetti"
                      value="4"
                      icon={Building2}
                      color="#6D4FD2"
                    />
                  </div>
                </div>
              </article>

              <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                      CEO AI
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                      Priorità del giorno
                    </h2>
                  </div>

                  <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                    <BrainCircuit size={19} />
                  </span>
                </div>

                <div className="mt-6 rounded-[16px] border border-white/[0.07] bg-[#07111F]/55 p-5">
                  <p className="text-sm leading-7 text-[#D6DFE9]">
                    Completa la discovery di{" "}
                    <strong className="font-semibold text-white">
                      Yammy Ristorante Giapponese
                    </strong>
                    . Successivamente potremo generare un Business Twin
                    e una demo realmente personalizzata.
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <PriorityRow
                    label="Discovery"
                    value="Da completare"
                    color="#FF6B1A"
                  />

                  <PriorityRow
                    label="Business Twin"
                    value="In attesa"
                    color="#2492E8"
                  />

                  <PriorityRow
                    label="Demo"
                    value="Non generata"
                    color="#6D4FD2"
                  />
                </div>

                <Link
                  href="/projects/new/restaurant"
                  className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-5 text-sm font-semibold text-white transition hover:bg-[#FF7D34]"
                >
                  Continua il progetto
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </article>
            </section>

            <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  {...metric}
                />
              ))}
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
              <BusinessTwin />
              <ActivityTimeline />
            </section>

            <section className="mt-5">
              <AIDepartment />
            </section>

            <section className="mt-5 overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
              <header className="flex flex-col justify-between gap-5 border-b border-white/[0.08] px-6 py-6 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    Workspace
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                    Progetti e prossime azioni
                  </h2>

                  <p className="mt-2 text-sm text-[#B8C5D4]">
                    I casi demo sono indicati chiaramente e non rappresentano clienti acquisiti.
                  </p>
                </div>

                <Link
                  href="/audits"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF9A64] transition hover:text-white"
                >
                  Apri tutti i progetti
                  <ArrowRight size={14} />
                </Link>
              </header>

              <div className="hidden grid-cols-[1.35fr_0.65fr_0.65fr_0.45fr_auto] border-b border-white/[0.07] bg-[#091321] px-6 py-4 text-xs font-semibold text-[#AEBCCC] md:grid">
                <span>Progetto</span>
                <span>Fase</span>
                <span>Tipologia</span>
                <span>Score</span>
                <span />
              </div>

              <div className="divide-y divide-white/[0.065]">
                {projects.map((project) => (
                  <Link
                    key={project.name}
                    href={project.href}
                    className="group grid gap-4 px-6 py-5 transition hover:bg-white/[0.025] md:grid-cols-[1.35fr_0.65fr_0.65fr_0.45fr_auto] md:items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {project.name}
                      </p>

                      <p className="mt-1 text-sm text-[#AEBCCC]">
                        {project.sector}
                      </p>
                    </div>

                    <span className="text-sm text-[#D1DBE7]">
                      {project.phase}
                    </span>

                    <span
                      className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        project.type === "Demo"
                          ? "border-[#6D4FD2]/20 bg-[#6D4FD2]/10 text-[#B9AAF4]"
                          : "border-[#FF6B1A]/20 bg-[#FF6B1A]/10 text-[#FF9A64]"
                      }`}
                    >
                      {project.type}
                    </span>

                    <span className="text-sm font-semibold text-white">
                      {project.score ?? "—"}
                    </span>

                    <span className="flex items-center gap-3 text-sm font-semibold text-[#C8D4E1] transition group-hover:text-white">
                      {project.nextAction}
                      <ChevronRight size={15} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function HeroStat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: typeof Bot;
  color: string;
}) {
  return (
    <div className="rounded-[15px] border border-white/[0.08] bg-[#07111F]/55 p-4">
      <Icon size={16} style={{ color }} />

      <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#B8C5D4]">
        {label}
      </p>
    </div>
  );
}

function PriorityRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-white/[0.07] bg-[#07111F]/45 px-4 py-3">
      <span className="text-sm text-[#D1DBE7]">
        {label}
      </span>

      <span
        className="text-sm font-semibold"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Bot;
  color: string;
}) {
  return (
    <article className="rounded-[18px] border border-white/[0.08] bg-[#0B1628] p-5">
      <div className="flex items-start justify-between gap-4">
        <span
          className="flex size-10 items-center justify-center rounded-[12px] border"
          style={{
            color,
            borderColor: `${color}35`,
            backgroundColor: `${color}12`,
          }}
        >
          <Icon size={17} />
        </span>

        <span className="text-xs font-medium text-[#AEBCCC]">
          Workspace
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-[#B8C5D4]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-[#AEBCCC]">
        {detail}
      </p>
    </article>
  );
}

function BusinessTwin() {
  return (
    <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
            Business Twin
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
            Maturità digitale
          </h2>

          <p className="mt-2 text-sm text-[#B8C5D4]">
            Punteggi dimostrativi in attesa di dati reali.
          </p>
        </div>

        <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#6D4FD2]/20 bg-[#6D4FD2]/10 text-[#B9AAF4]">
          <Globe2 size={18} />
        </span>
      </div>

      <div className="mt-7 space-y-5">
        {businessTwin.map((area) => {
          const color =
            area.score < 40
              ? "#FF6B1A"
              : area.score < 65
                ? "#2492E8"
                : "#24D27C";

          return (
            <div key={area.label}>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-[#D6DFE9]">
                  {area.label}
                </span>

                <span
                  className="text-sm font-semibold"
                  style={{ color }}
                >
                  {area.score}/100
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
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
        className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#FF9A64] transition hover:text-white"
      >
        Apri il Business Twin
        <ArrowRight size={14} />
      </Link>
    </article>
  );
}

function ActivityTimeline() {
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
      <header className="flex items-start justify-between gap-5 border-b border-white/[0.08] px-6 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
            Attività recente
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
            Timeline operativa
          </h2>
        </div>

        <Clock3 size={18} className="text-[#AEBCCC]" />
      </header>

      <div className="px-6">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={`${activity.time}-${activity.agent}`}
              className="flex gap-4 border-b border-white/[0.065] py-5 last:border-0"
            >
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-[12px]"
                style={{
                  color: activity.color,
                  backgroundColor: `${activity.color}12`,
                }}
              >
                <Icon size={16} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {activity.agent}
                  </p>

                  <span className="text-xs text-[#AEBCCC]">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-[#C8D4E1]">
                  {activity.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function AIDepartment() {
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
      <header className="flex flex-col justify-between gap-5 border-b border-white/[0.08] px-6 py-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
            AI Department
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
            Agenti e attività correnti
          </h2>

          <p className="mt-2 text-sm text-[#B8C5D4]">
            Stati dimostrativi: saranno collegati ai processi AI reali.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#24D27C]/18 bg-[#24D27C]/[0.055] px-3 py-1.5 text-xs font-semibold text-[#8AF0BA]">
          <span className="size-1.5 rounded-full bg-[#24D27C]" />
          6 agenti disponibili
        </span>
      </header>

      <div className="grid gap-px bg-white/[0.065] md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => {
          const Icon = agent.icon;

          return (
            <div
              key={agent.name}
              className="bg-[#0B1628] p-5 transition hover:bg-[#101D31]"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border"
                  style={{
                    color: agent.color,
                    borderColor: `${agent.color}35`,
                    backgroundColor: `${agent.color}12`,
                  }}
                >
                  <Icon size={18} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {agent.name}
                      </h3>

                      <p className="mt-1 text-sm text-[#AEBCCC]">
                        {agent.role}
                      </p>
                    </div>

                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: agent.color,
                      }}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <div className="mt-5 rounded-[11px] border border-white/[0.06] bg-[#07111F]/45 px-3 py-3">
                    <p className="text-xs font-medium text-[#AEBCCC]">
                      Task corrente
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#D6DFE9]">
                      {agent.task}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${agent.progress}%`,
                          backgroundColor: agent.color,
                        }}
                      />
                    </div>

                    <span className="font-mono text-xs text-[#AEBCCC]">
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
