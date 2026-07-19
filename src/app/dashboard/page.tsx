import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  ChevronRight,
  CircleDot,
  FileChartColumn,
  Globe2,
  Plus,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { GlobalCommand } from "@/components/navigation/GlobalCommand";
import {
  dashboardMetrics,
  demoRestaurants,
  pipelineStages,
} from "@/data/demo-restaurants";

function euro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function scoreTone(score: number): string {
  if (score < 50) {
    return "text-red-300 border-red-300/15 bg-red-300/[0.05]";
  }

  if (score < 65) {
    return "text-amber-200 border-amber-200/15 bg-amber-200/[0.05]";
  }

  return "text-emerald-300 border-emerald-300/15 bg-emerald-300/[0.05]";
}

export default function DashboardPage() {
  const priorityProject = demoRestaurants[0];
  const recentProjects = demoRestaurants.slice(1, 5);

  return (
    <main className="min-h-screen bg-[#070708]">
      <div className="noise" />
      <AppSidebar />

      <section className="relative px-4 pb-20 pt-5 lg:ml-[260px] lg:px-8 xl:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[42rem] w-[42rem] bg-[radial-gradient(circle,rgba(195,148,73,0.075),transparent_65%)]"
        />

        <div className="relative mx-auto max-w-[1500px]">
          <header className="flex flex-col justify-between gap-7 border-b border-white/[0.055] pb-7 xl:flex-row xl:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[9px] uppercase tracking-[0.34em] text-[#caa563]">
                  UAE Intelligence
                </p>

                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[8px] uppercase tracking-[0.18em] text-white/28">
                  Workspace dimostrativo
                </span>
              </div>

              <h1 className="font-display mt-5 text-4xl font-medium tracking-[-0.035em] text-[#f4efe7] md:text-6xl">
                Buonasera, Brian.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/34">
                Hai una demo pronta da presentare, tre report da completare e
                una pipeline commerciale di {euro(dashboardMetrics.opportunityValue)}.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <GlobalCommand />

              <Link
                href="/audits/new"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#d1aa62] px-6 py-3.5 text-xs font-medium text-[#171008] shadow-[0_20px_55px_rgba(188,140,59,0.13)] transition hover:bg-[#e5c47e]"
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

          <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Pipeline"
              value={euro(dashboardMetrics.opportunityValue)}
              detail="Valore complessivo opportunità"
              icon={WalletCards}
            />

            <Metric
              label="Progetti attivi"
              value={String(dashboardMetrics.activeProjects)}
              detail="Audit e proposte in lavorazione"
              icon={Target}
            />

            <Metric
              label="Report pronti"
              value={String(dashboardMetrics.generatedReports)}
              detail="Documenti disponibili"
              icon={FileChartColumn}
            />

            <Metric
              label="Score medio"
              value={`${dashboardMetrics.averageScore}/100`}
              detail="Digital Experience Score"
              icon={BarChart3}
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <article className="relative overflow-hidden rounded-[34px] border border-white/[0.065] bg-[#0c0c0d] p-6 md:p-8">
              <div
                aria-hidden="true"
                className="absolute -right-28 -top-28 size-80 rounded-full bg-[#a6242c]/[0.07] blur-3xl"
              />

              <div className="relative">
                <div className="flex flex-col justify-between gap-7 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-[#caa563]/20 bg-[#caa563]/[0.06] px-3 py-1 text-[8px] uppercase tracking-[0.18em] text-[#d9b873]">
                        Progetto prioritario
                      </span>

                      <span className="text-[8px] uppercase tracking-[0.18em] text-white/22">
                        {priorityProject.projectCode}
                      </span>
                    </div>

                    <h2 className="font-display mt-5 text-4xl tracking-[-0.035em] text-[#f4efe7] md:text-5xl">
                      {priorityProject.name}
                    </h2>

                    <p className="mt-3 text-sm text-white/32">
                      {priorityProject.category} · {priorityProject.city}
                    </p>
                  </div>

                  <div
                    className={`flex size-20 shrink-0 flex-col items-center justify-center rounded-full border ${scoreTone(
                      priorityProject.score,
                    )}`}
                  >
                    <span className="font-display text-3xl">
                      {priorityProject.score}
                    </span>
                    <span className="mt-1 text-[7px] uppercase tracking-[0.14em]">
                      Score
                    </span>
                  </div>
                </div>

                <div className="mt-9 grid gap-4 md:grid-cols-3">
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
                    icon={WalletCards}
                  />
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.16em]">
                    <span className="text-white/24">Avanzamento progetto</span>
                    <span className="text-[#d5b16d]">
                      {priorityProject.progress}%
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#765020] via-[#d6b16d] to-[#efd08c]"
                      style={{ width: `${priorityProject.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/audits/analysis"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#d1aa62] px-6 py-3.5 text-xs font-medium text-[#171008] transition hover:bg-[#e5c47e]"
                  >
                    Apri intelligence report
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/demo-generator"
                    className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.025] px-6 py-3.5 text-xs text-white/50 transition hover:border-[#caa563]/20 hover:text-[#e1c07c]"
                  >
                    <Globe2 size={15} />
                    Apri concept
                  </Link>

                  <Link
                    href="/growth-plan"
                    className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.025] px-6 py-3.5 text-xs text-white/50 transition hover:border-[#caa563]/20 hover:text-[#e1c07c]"
                  >
                    <Target size={15} />
                    Configura proposta
                  </Link>
                </div>
              </div>
            </article>

            <aside className="rounded-[34px] border border-white/[0.065] bg-[#0c0c0d] p-6 md:p-7">
              <div className="flex items-center gap-3">
                <Sparkles
                  size={18}
                  strokeWidth={1.4}
                  className="text-[#d5b16d]"
                />

                <div>
                  <p className="text-[8px] uppercase tracking-[0.24em] text-[#caa563]">
                    Azioni rapide
                  </p>

                  <h2 className="font-display mt-1 text-2xl text-[#f3eee5]">
                    Cosa vuoi fare?
                  </h2>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <QuickAction
                  href="/audits/new"
                  title="Avvia nuovo progetto"
                  detail="Business discovery e analisi"
                  icon={Plus}
                />

                <QuickAction
                  href="/reports"
                  title="Consulta i report"
                  detail="Documenti e analisi completate"
                  icon={FileChartColumn}
                />

                <QuickAction
                  href="/demo-generator"
                  title="Presenta una demo"
                  detail="Apri il concept personalizzato"
                  icon={Globe2}
                />

                <QuickAction
                  href="/growth-plan"
                  title="Crea una proposta"
                  detail="Servizi, prezzi e piano"
                  icon={WalletCards}
                />
              </div>

              <div className="mt-7 rounded-[24px] border border-[#caa563]/14 bg-[#caa563]/[0.04] p-5">
                <CalendarClock size={17} className="text-[#d6b16d]" />

                <p className="mt-4 text-[8px] uppercase tracking-[0.22em] text-[#caa563]">
                  Prossima attività
                </p>

                <p className="mt-3 text-sm font-medium text-white/68">
                  Presentazione concept
                </p>

                <p className="mt-2 text-xs leading-5 text-white/29">
                  Completa il report e prepara la proposta commerciale prima
                  dell’incontro.
                </p>
              </div>
            </aside>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-[34px] border border-white/[0.065] bg-[#0c0c0d] p-6 md:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-white/[0.055] pb-6 md:flex-row md:items-end">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.26em] text-white/23">
                    Progetti recenti
                  </p>

                  <h2 className="font-display mt-2 text-3xl text-[#f3eee5]">
                    Attività in lavorazione
                  </h2>
                </div>

                <Link
                  href="/audits"
                  className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[#caa563] transition hover:text-[#efd08c]"
                >
                  Tutti i progetti
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-5 divide-y divide-white/[0.045]">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href="/audits/analysis"
                    className="group grid gap-4 py-5 transition first:pt-0 last:pb-0 md:grid-cols-[1.1fr_0.7fr_0.5fr_auto] md:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-medium text-white/68 transition group-hover:text-white">
                          {project.name}
                        </h3>

                        <span className="rounded-full border border-white/[0.06] px-2 py-1 text-[7px] uppercase tracking-[0.12em] text-white/20">
                          Demo
                        </span>
                      </div>

                      <p className="mt-2 text-[10px] text-white/23">
                        {project.city} · {project.category}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.16em] text-white/19">
                        Stato
                      </p>

                      <p className="mt-2 text-xs text-white/42">
                        {project.status}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.16em] text-white/19">
                        Valore
                      </p>

                      <p className="mt-2 text-xs text-white/50">
                        {euro(project.opportunityValue)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`flex size-10 items-center justify-center rounded-full border font-display text-lg ${scoreTone(
                          project.score,
                        )}`}
                      >
                        {project.score}
                      </span>

                      <ChevronRight
                        size={15}
                        className="text-white/16 transition group-hover:translate-x-1 group-hover:text-[#d8b671]"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </article>

            <article className="rounded-[34px] border border-white/[0.065] bg-[#0c0c0d] p-6 md:p-8">
              <p className="text-[8px] uppercase tracking-[0.26em] text-white/23">
                Conversion funnel
              </p>

              <h2 className="font-display mt-2 text-3xl text-[#f3eee5]">
                Dal contatto al progetto
              </h2>

              <div className="mt-8 space-y-6">
                {pipelineStages.map((stage, index) => (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025] text-[9px] text-white/28">
                          {index + 1}
                        </span>

                        <p className="text-xs text-white/45">{stage.label}</p>
                      </div>

                      <p className="font-display text-xl text-white/65">
                        {stage.value}
                      </p>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.045]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#765020] to-[#d9b873]"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/growth-plan"
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#caa563]/18 bg-[#caa563]/[0.05] px-5 py-3.5 text-xs text-[#dfbd78] transition hover:bg-[#caa563]/[0.09]"
              >
                Ottimizza la proposta
                <ArrowRight size={14} />
              </Link>
            </article>
          </section>

          <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-white/[0.05] pt-6 text-[8px] uppercase tracking-[0.2em] text-white/14 sm:flex-row">
            <span>UAE Intelligence Platform</span>
            <span>Univibe Group · Workspace v0.2</span>
          </footer>
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
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Target;
}) {
  return (
    <article className="rounded-[26px] border border-white/[0.06] bg-[#0c0c0d] p-5 transition hover:border-white/[0.1]">
      <div className="flex items-start justify-between">
        <div className="flex size-9 items-center justify-center rounded-2xl bg-white/[0.03] text-[#d3ae68]">
          <Icon size={16} strokeWidth={1.45} />
        </div>

        <ArrowUpRight size={14} className="text-white/13" />
      </div>

      <p className="mt-6 text-[8px] uppercase tracking-[0.2em] text-white/22">
        {label}
      </p>

      <p className="font-display mt-2 text-3xl text-[#f1ece4]">
        {value}
      </p>

      <p className="mt-2 text-[10px] leading-5 text-white/22">
        {detail}
      </p>
    </article>
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
    <div className="rounded-[22px] border border-white/[0.055] bg-white/[0.017] p-4">
      <Icon size={15} className="text-[#d5b16d]" />

      <p className="mt-4 text-[8px] uppercase tracking-[0.16em] text-white/19">
        {label}
      </p>

      <p className="mt-2 text-xs leading-5 text-white/48">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  detail,
  icon: Icon,
}: {
  href: string;
  title: string;
  detail: string;
  icon: typeof Plus;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[20px] border border-white/[0.055] bg-white/[0.015] p-4 transition hover:border-[#caa563]/18 hover:bg-[#caa563]/[0.035]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.025] text-white/30 transition group-hover:bg-[#caa563]/[0.07] group-hover:text-[#dfbd78]">
        <Icon size={16} strokeWidth={1.45} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs text-white/58 transition group-hover:text-white/78">
          {title}
        </span>

        <span className="mt-1 block truncate text-[9px] text-white/21">
          {detail}
        </span>
      </span>

      <ArrowRight
        size={14}
        className="text-white/14 transition group-hover:translate-x-1 group-hover:text-[#d7b36d]"
      />
    </Link>
  );
}
