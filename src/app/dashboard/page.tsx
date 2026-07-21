import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleDot,
  FileText,
  Globe2,
  Plus,
  Sparkles,
  Target,
  WandSparkles,
  Zap,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { GlobalCommand } from "@/components/navigation/GlobalCommand";
import {
  dashboardMetrics,
  demoRestaurants,
} from "@/data/demo-restaurants";

function euro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function scoreStyle(score: number): string {
  if (score < 50) {
    return "from-rose-500 to-orange-400";
  }

  if (score < 70) {
    return "from-amber-400 to-yellow-300";
  }

  return "from-emerald-400 to-cyan-400";
}

export default function DashboardPage() {
  const priorityProject = demoRestaurants[0];
  const recentProjects = demoRestaurants.slice(1, 5);

  return (
    <main className="workspace-page min-h-screen">
      <AppSidebar />

      <section className="relative px-4 pb-28 pt-6 lg:ml-[112px] lg:px-8 xl:px-12">
        <div className="pointer-events-none absolute right-0 top-0 size-[42rem] rounded-full bg-violet-500/[0.08] blur-[150px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 size-[32rem] rounded-full bg-cyan-500/[0.05] blur-[140px]" />

        <div className="relative mx-auto max-w-[1540px]">
          <header className="flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.05] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-emerald-200/75">
                  <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                  Intelligence online
                </span>

                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[8px] uppercase tracking-[0.16em] text-white/30">
                  Workspace dimostrativo
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.055em] text-white md:text-6xl">
                Buonasera, Brian.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Il tuo centro operativo per analisi, strategie, demo e
                opportunità commerciali.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <GlobalCommand />

              <Link
                href="/projects/new"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-6 py-3.5 text-xs font-semibold text-white shadow-[0_20px_60px_rgba(105,85,255,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_75px_rgba(105,85,255,0.42)]"
              >
                <Plus size={16} />
                Nuovo progetto
                <ArrowUpRight
                  size={15}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </header>

          <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Pipeline commerciale"
              value={euro(dashboardMetrics.opportunityValue)}
              detail="Valore opportunità attive"
              icon={BarChart3}
              gradient="from-cyan-400 to-blue-500"
            />

            <Metric
              label="Progetti attivi"
              value={String(dashboardMetrics.activeProjects)}
              detail="Analisi e proposte aperte"
              icon={BriefcaseBusiness}
              gradient="from-blue-500 to-violet-500"
            />

            <Metric
              label="Report disponibili"
              value={String(dashboardMetrics.generatedReports)}
              detail="Documenti già generati"
              icon={FileText}
              gradient="from-violet-500 to-fuchsia-500"
            />

            <Metric
              label="Digital score medio"
              value={`${dashboardMetrics.averageScore}/100`}
              detail="Media dei progetti analizzati"
              icon={Target}
              gradient="from-fuchsia-500 to-pink-500"
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.38fr_0.62fr]">
            <article className="workspace-panel relative overflow-hidden rounded-[30px] p-6 md:p-8">
              <div className="absolute -right-28 -top-28 size-80 rounded-full bg-violet-500/[0.09] blur-3xl" />
              <div className="absolute -bottom-36 left-1/4 size-80 rounded-full bg-cyan-500/[0.05] blur-3xl" />

              <div className="relative">
                <div className="flex flex-col justify-between gap-7 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.17em] text-violet-200">
                        Progetto prioritario
                      </span>

                      <span className="text-[8px] uppercase tracking-[0.18em] text-white/25">
                        {priorityProject.projectCode}
                      </span>
                    </div>

                    <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                      {priorityProject.name}
                    </h2>

                    <p className="mt-3 text-sm text-slate-400">
                      {priorityProject.category} · {priorityProject.city}
                    </p>
                  </div>

                  <ScoreRing score={priorityProject.score} />
                </div>

                <div className="mt-9 grid gap-3 md:grid-cols-3">
                  <ProjectDatum
                    label="Stato"
                    value={priorityProject.status}
                    icon={CircleDot}
                  />

                  <ProjectDatum
                    label="Priorità"
                    value={priorityProject.primaryNeed}
                    icon={Target}
                  />

                  <ProjectDatum
                    label="Valore progetto"
                    value={euro(priorityProject.opportunityValue)}
                    icon={BarChart3}
                  />
                </div>

                <div className="mt-8 rounded-[22px] border border-white/[0.06] bg-black/10 p-5">
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.16em]">
                    <span className="text-white/30">
                      Avanzamento intelligence
                    </span>

                    <span className="text-cyan-300">
                      {priorityProject.progress}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_20px_rgba(79,124,255,0.45)]"
                      style={{
                        width: `${priorityProject.progress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/audits/analysis"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-6 py-3.5 text-xs font-semibold text-white"
                  >
                    Apri intelligence
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>

                  <SecondaryAction
                    href="/demo-generator"
                    icon={Globe2}
                    label="Apri demo"
                  />

                  <SecondaryAction
                    href="/growth-plan"
                    icon={Target}
                    label="Crea proposta"
                  />
                </div>
              </div>
            </article>

            <aside className="workspace-panel rounded-[30px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                    AI Command
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                    Azioni rapide
                  </h2>
                </div>

                <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-fuchsia-500/20 text-violet-200">
                  <Sparkles size={18} />
                </span>
              </div>

              <div className="mt-7 space-y-3">
                <QuickAction
                  href="/projects/new"
                  title="Nuova intelligence"
                  detail="Avvia discovery e analisi"
                  icon={Plus}
                  gradient="from-cyan-400 to-blue-500"
                />

                <QuickAction
                  href="/reports"
                  title="Consulta report"
                  detail="Apri documenti generati"
                  icon={FileText}
                  gradient="from-blue-500 to-violet-500"
                />

                <QuickAction
                  href="/demo-generator"
                  title="Genera una demo"
                  detail="Crea esperienza personalizzata"
                  icon={WandSparkles}
                  gradient="from-violet-500 to-fuchsia-500"
                />

                <QuickAction
                  href="/growth-plan"
                  title="Configura strategia"
                  detail="Servizi, roadmap e investimento"
                  icon={Target}
                  gradient="from-fuchsia-500 to-pink-500"
                />
              </div>

              <div className="mt-7 rounded-[24px] border border-cyan-300/10 bg-gradient-to-br from-cyan-400/[0.055] via-blue-500/[0.035] to-violet-500/[0.05] p-5">
                <div className="flex items-center gap-3">
                  <CalendarDays size={17} className="text-cyan-300" />

                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                    Prossima attività
                  </p>
                </div>

                <p className="mt-4 text-sm font-medium text-white/80">
                  Presentazione concept
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Completa il report e prepara la proposta commerciale.
                </p>
              </div>
            </aside>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <article className="workspace-panel rounded-[30px] p-6 md:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] pb-6 md:flex-row md:items-end">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.22em] text-white/30">
                    Attività recente
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                    Progetti in lavorazione
                  </h2>
                </div>

                <Link
                  href="/audits"
                  className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-300 transition hover:text-white"
                >
                  Tutti i progetti
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-3 divide-y divide-white/[0.05]">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href="/audits/analysis"
                    className="group grid gap-4 py-5 transition hover:translate-x-1 md:grid-cols-[1.2fr_0.65fr_0.45fr_auto] md:items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-white/75">
                        {project.name}
                      </p>

                      <p className="mt-1 text-[9px] text-slate-500">
                        {project.category} · {project.city}
                      </p>
                    </div>

                    <span className="text-[9px] text-slate-400">
                      {project.status}
                    </span>

                    <span
                      className={`inline-flex w-fit rounded-full bg-gradient-to-r ${scoreStyle(
                        project.score,
                      )} px-3 py-1.5 text-[8px] font-bold text-[#090b13]`}
                    >
                      {project.score}/100
                    </span>

                    <ChevronRight
                      size={15}
                      className="text-white/20 transition group-hover:text-white"
                    />
                  </Link>
                ))}
              </div>
            </article>

            <article className="workspace-panel rounded-[30px] p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.22em] text-white/30">
                    Agent network
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    Stato sistema
                  </h2>
                </div>

                <Zap size={18} className="text-cyan-300" />
              </div>

              <div className="mt-7 space-y-3">
                <AgentStatus
                  name="Research Agent"
                  detail="Browser e raccolta evidenze"
                  icon={Globe2}
                />

                <AgentStatus
                  name="Vision Agent"
                  detail="UX, UI e percezione"
                  icon={Sparkles}
                />

                <AgentStatus
                  name="Strategy Agent"
                  detail="Diagnosi e opportunità"
                  icon={BrainCircuit}
                />

                <AgentStatus
                  name="Creative Agent"
                  detail="Demo e trasformazione"
                  icon={WandSparkles}
                />
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof BarChart3;
  gradient: string;
}) {
  return (
    <article className="workspace-panel group relative overflow-hidden rounded-[26px] p-5">
      <div
        className={`absolute -right-12 -top-12 size-32 rounded-full bg-gradient-to-br ${gradient} opacity-[0.09] blur-3xl transition group-hover:opacity-[0.16]`}
      />

      <span
        className={`relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
      >
        <Icon size={17} strokeWidth={1.6} />
      </span>

      <p className="relative mt-6 text-[8px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="relative mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
        {value}
      </p>

      <p className="relative mt-2 text-[9px] text-slate-500">
        {detail}
      </p>
    </article>
  );
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="relative flex size-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 p-[2px]">
      <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#101522]">
        <span className="text-3xl font-semibold tracking-[-0.05em]">
          {score}
        </span>

        <span className="mt-1 text-[7px] uppercase tracking-[0.16em] text-slate-500">
          Score
        </span>
      </div>
    </div>
  );
}

function ProjectDatum({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Target;
}) {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.025] p-4">
      <Icon size={15} className="text-cyan-300" />

      <p className="mt-4 text-[7px] uppercase tracking-[0.17em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xs font-medium text-white/75">
        {value}
      </p>
    </div>
  );
}

function SecondaryAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Globe2;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 text-xs text-slate-400 transition hover:border-violet-300/20 hover:bg-white/[0.055] hover:text-white"
    >
      <Icon size={15} />
      {label}
    </Link>
  );
}

function QuickAction({
  href,
  title,
  detail,
  icon: Icon,
  gradient,
}: {
  href: string;
  title: string;
  detail: string;
  icon: typeof Plus;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[20px] border border-white/[0.06] bg-white/[0.022] p-4 transition hover:border-violet-300/20 hover:bg-white/[0.045]"
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white`}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-white/70">
          {title}
        </p>

        <p className="mt-1 text-[8px] text-slate-500">
          {detail}
        </p>
      </div>

      <ChevronRight
        size={14}
        className="text-white/20 transition group-hover:translate-x-1 group-hover:text-white"
      />
    </Link>
  );
}

function AgentStatus({
  name,
  detail,
  icon: Icon,
}: {
  name: string;
  detail: string;
  icon: typeof BrainCircuit;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-white/[0.06] bg-white/[0.022] p-4">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-fuchsia-500/20 text-violet-200">
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-white/70">
          {name}
        </p>

        <p className="mt-1 text-[8px] text-slate-500">
          {detail}
        </p>
      </div>

      <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.75)]" />
    </div>
  );
}
