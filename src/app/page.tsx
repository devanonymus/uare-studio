import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  FileVideo2,
  Globe2,
  LayoutGrid,
  Megaphone,
  MessageSquareText,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";

const department = [
  {
    name: "Marketing Director",
    role: "Strategia e coordinamento",
    status: "Working",
    progress: 84,
    icon: BrainCircuit,
    color: "#2492E8",
  },
  {
    name: "Content Strategist",
    role: "Piano editoriale e copy",
    status: "Working",
    progress: 72,
    icon: Megaphone,
    color: "#6D4FD2",
  },
  {
    name: "Video Producer",
    role: "Reel, Shorts e creatività",
    status: "Processing",
    progress: 58,
    icon: FileVideo2,
    color: "#FF6B1A",
  },
  {
    name: "Automation Architect",
    role: "CRM, WhatsApp e workflow",
    status: "Running",
    progress: 91,
    icon: Workflow,
    color: "#24D27C",
  },
];

const capabilities = [
  {
    number: "01",
    title: "Business Intelligence",
    description:
      "Analizza sito, SEO, social, reputazione, competitor e processi commerciali.",
    icon: Search,
    color: "#2492E8",
  },
  {
    number: "02",
    title: "Marketing Department",
    description:
      "Costruisce strategia, contenuti, campagne e piani operativi su misura.",
    icon: Users,
    color: "#6D4FD2",
  },
  {
    number: "03",
    title: "Automation Engine",
    description:
      "Automatizza lead, follow-up, CRM, email, WhatsApp, recensioni e report.",
    icon: Workflow,
    color: "#FF6B1A",
  },
];

const sectors = [
  "Ristorazione",
  "Hospitality",
  "Healthcare",
  "Fitness",
  "Automotive",
  "Industria",
  "Professionisti",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111F] text-[#F7FAFC]">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="pointer-events-none fixed -left-72 -top-64 size-[48rem] rounded-full bg-[#2492E8]/[0.09] blur-[170px]" />
      <div className="pointer-events-none fixed -right-72 top-0 size-[52rem] rounded-full bg-[#6D4FD2]/[0.11] blur-[180px]" />
      <div className="pointer-events-none fixed bottom-[-26rem] left-1/3 size-[46rem] rounded-full bg-[#FF6B1A]/[0.08] blur-[180px]" />

      <header className="relative z-30 px-4 pt-5 md:px-7 md:pt-7">
        <div className="mx-auto max-w-[1600px]">
          <div className="relative overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#081425]/95 shadow-[0_24px_70px_rgba(0,0,0,.32)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-[linear-gradient(100deg,rgba(36,146,232,.18),transparent_28%,transparent_72%,rgba(255,107,26,.16))] opacity-80" />

            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-[#2492E8]/80 via-white/10 to-[#FF6B1A]/80" />

            <div className="relative flex min-h-[108px] items-center justify-between px-5 md:px-7 xl:px-9">
              <Link
                href="/"
                className="group flex shrink-0 items-center gap-4"
              >
                <span className="flex size-16 items-center justify-center rounded-[16px] border border-[#2492E8]/15 bg-[#0D1D34] p-2.5 shadow-[0_12px_30px_rgba(0,0,0,.28)] transition group-hover:border-[#2492E8]/35">
                  <Image
                    src="/uviq-logo.svg"
                    alt="UVIQ"
                    width={50}
                    height={50}
                    priority
                    className="size-full object-contain"
                  />
                </span>

                <span className="hidden sm:block">
                  <span className="flex items-center gap-3">
                    <span className="text-[28px] font-bold tracking-[-0.06em] text-white">
                      UVIQ
                    </span>

                    <span className="rounded-full bg-gradient-to-r from-[#2492E8] to-[#4B8EFF] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(36,146,232,.24)]">
                      AI OS
                    </span>
                  </span>

                  <span className="mt-1.5 block text-[7px] font-semibold uppercase tracking-[0.32em] text-[#AAB9CC]">
                    AI Business Operating System
                  </span>
                </span>
              </Link>

              <div className="mx-8 hidden h-16 w-px bg-white/[0.07] xl:block" />

              <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex xl:gap-14">
                <NavItem href="#product" label="Prodotto" active />
                <NavItem href="#department" label="Reparto AI" />
                <NavItem href="#capabilities" label="Funzioni" />
                <NavItem href="#sectors" label="Settori" />
              </nav>

              <div className="mx-8 hidden h-16 w-px bg-white/[0.07] xl:block" />

              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href="/dashboard"
                  className="hidden min-h-12 items-center gap-3 rounded-[13px] border border-white/[0.12] bg-[#091323] px-5 text-[11px] font-semibold text-white shadow-[0_10px_25px_rgba(0,0,0,.2)] transition hover:border-[#2492E8]/40 hover:bg-[#0E1C31] md:inline-flex"
                >
                  <LayoutGrid
                    size={16}
                    className="text-[#2492E8]"
                  />
                  Workspace
                </Link>

                <Link
                  href="/projects/new"
                  className="group inline-flex min-h-12 items-center gap-3 rounded-[13px] bg-[#FF6B1A] px-5 text-[11px] font-bold text-white shadow-[0_12px_34px_rgba(255,107,26,.32)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34] hover:shadow-[0_16px_42px_rgba(255,107,26,.4)] md:px-6"
                >
                  <span className="hidden sm:inline">
                    Nuovo progetto
                  </span>

                  <span className="sm:hidden">
                    Nuovo
                  </span>

                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            <nav className="relative grid grid-cols-4 border-t border-white/[0.07] bg-[#07111F]/70 lg:hidden">
              <MobileNavItem href="#product" label="Prodotto" active />
              <MobileNavItem href="#department" label="Reparto AI" />
              <MobileNavItem href="#capabilities" label="Funzioni" />
              <MobileNavItem href="#sectors" label="Settori" />
            </nav>
          </div>
        </div>
      </header>

      <section
        id="product"
        className="relative z-10 mx-auto max-w-[1600px] px-5 pb-20 pt-16 md:px-10 md:pt-24"
      >
        <div className="grid items-center gap-16 xl:grid-cols-[0.98fr_1.02fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#24D27C]/18 bg-[#24D27C]/[0.055] px-4 py-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#24D27C] opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-[#24D27C]" />
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#66E7A6]">
                Marketing Department Online
              </span>
            </div>

            <h1 className="mt-8 max-w-5xl text-[clamp(4rem,7.2vw,8.2rem)] font-semibold leading-[0.87] tracking-[-0.075em]">
              Il marketing
              <br />
              della tua azienda.
              <br />
              <span className="text-[#FF6B1A]">
                Sempre operativo.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#91A4BF] md:text-lg">
              UVIQ analizza, pianifica, produce, pubblica, automatizza e
              ottimizza il marketing attraverso agenti AI specializzati
              coordinati dal nostro team.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects/new"
                className="group inline-flex min-h-14 items-center justify-center gap-4 rounded-[14px] bg-[#FF6B1A] px-7 text-xs font-semibold text-white shadow-[0_18px_46px_rgba(255,107,26,.25)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
              >
                Costruisci il reparto marketing
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[14px] border border-white/[0.1] bg-white/[0.035] px-7 text-xs font-semibold text-[#D7E1EC] transition hover:border-white/[0.16] hover:bg-white/[0.065]"
              >
                <BarChart3 size={15} />
                Esplora Mission Control
              </Link>
            </div>

            <div id="sectors" className="mt-12 flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-white/[0.075] bg-white/[0.025] px-3 py-2 text-[8px] uppercase tracking-[0.12em] text-[#607089]"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>

          <OperatingSystemPanel />
        </div>

        <section
          id="capabilities"
          className="mt-24 grid gap-4 md:grid-cols-3"
        >
          {capabilities.map((capability) => {
            const Icon = capability.icon;

            return (
              <article
                key={capability.number}
                className="group relative min-h-[270px] overflow-hidden rounded-[20px] border border-white/[0.075] bg-[#0B1628] p-6 transition hover:border-white/[0.13] hover:bg-[#101D31]"
              >
                <div
                  className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full opacity-[0.08] blur-[70px]"
                  style={{
                    backgroundColor: capability.color,
                  }}
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span
                      className="flex size-11 items-center justify-center rounded-[13px] border"
                      style={{
                        color: capability.color,
                        borderColor: `${capability.color}30`,
                        backgroundColor: `${capability.color}12`,
                      }}
                    >
                      <Icon size={19} />
                    </span>

                    <span className="font-mono text-[9px] text-[#607089]">
                      {capability.number}
                    </span>
                  </div>

                  <h2 className="mt-10 text-2xl font-semibold tracking-[-0.035em]">
                    {capability.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-[#91A4BF]">
                    {capability.description}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#FF8A4A]">
                    Scopri il modulo
                    <ArrowUpRight
                      size={13}
                      className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        <section
          id="department"
          className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]"
        >
          <article className="rounded-[20px] border border-white/[0.075] bg-[#0B1628] p-7 md:p-9">
            <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-[#2492E8]">
              AI Marketing Department
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-5xl">
              Non un altro software.
              <span className="mt-2 block text-[#FF6B1A]">
                Un reparto operativo.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-[#91A4BF]">
              Ogni agente ha un ruolo preciso, lavora sui dati dell’azienda
              e collabora con gli altri specialisti per trasformare la
              strategia in attività concrete.
            </p>

            <div className="mt-8 space-y-4">
              <ValuePoint
                icon={ShieldCheck}
                title="Supervisione umana"
                text="Strategia e qualità restano sotto il controllo del nostro team."
              />

              <ValuePoint
                icon={Network}
                title="Agenti coordinati"
                text="SEO, contenuti, advertising, CRM e automazioni lavorano insieme."
              />

              <ValuePoint
                icon={TrendingUp}
                title="Ottimizzazione continua"
                text="Ogni attività viene misurata e migliorata attraverso KPI reali."
              />
            </div>
          </article>

          <article className="overflow-hidden rounded-[20px] border border-white/[0.075] bg-[#0B1628]">
            <header className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2492E8]">
                  Live Department
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Agenti attualmente al lavoro
                </h3>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-[#24D27C]/15 bg-[#24D27C]/[0.05] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#66E7A6]">
                <span className="size-1.5 rounded-full bg-[#24D27C]" />
                12 online
              </span>
            </header>

            <div className="grid gap-px bg-white/[0.055] sm:grid-cols-2">
              {department.map((agent) => {
                const Icon = agent.icon;

                return (
                  <div
                    key={agent.name}
                    className="bg-[#0B1628] p-6 transition hover:bg-[#101D31]"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border"
                        style={{
                          color: agent.color,
                          borderColor: `${agent.color}30`,
                          backgroundColor: `${agent.color}12`,
                        }}
                      >
                        <Icon size={18} />
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

                        <div className="mt-5 flex items-center gap-3">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${agent.progress}%`,
                                backgroundColor: agent.color,
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
        </section>

        <section className="relative mt-6 overflow-hidden rounded-[22px] border border-white/[0.075] bg-[#162D4F] px-7 py-10 md:px-10 md:py-14">
          <div className="pointer-events-none absolute -right-36 -top-48 size-[30rem] rounded-full bg-[#FF6B1A]/20 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-[-14rem] left-1/3 size-[26rem] rounded-full bg-[#2492E8]/15 blur-[120px]" />

          <div className="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#69BDF2]">
                Deploy UVIQ
              </p>

              <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-6xl">
                Costruisci oggi il reparto marketing della tua azienda.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#B7C7DA]">
                Parti da un’analisi reale e configura agenti, contenuti,
                automazioni e processi commerciali su misura.
              </p>
            </div>

            <Link
              href="/projects/new"
              className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-4 rounded-[14px] bg-[#FF6B1A] px-7 text-xs font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,.25)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
            >
              Avvia una nuova intelligence
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}


function NavItem({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className="group relative flex min-h-14 items-center justify-center px-1 text-[11px] font-semibold text-white transition hover:text-[#FF8A4A]"
    >
      {label}

      <span
        className={`absolute bottom-1 size-1.5 rounded-full transition ${
          active
            ? "bg-[#FF6B1A] shadow-[0_0_12px_rgba(255,107,26,.85)]"
            : "scale-0 bg-[#2492E8] group-hover:scale-100"
        }`}
      />
    </a>
  );
}

function MobileNavItem({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`relative flex min-h-12 items-center justify-center border-r border-white/[0.06] px-2 text-center text-[8px] font-semibold uppercase tracking-[0.08em] last:border-r-0 ${
        active
          ? "bg-[#FF6B1A]/[0.08] text-white"
          : "text-[#B8C5D6]"
      }`}
    >
      {label}

      {active && (
        <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-[#FF6B1A]" />
      )}
    </a>
  );
}

function OperatingSystemPanel() {
  return (
    <div className="relative">
      <div className="absolute inset-14 rounded-[70px] bg-[#2492E8]/10 blur-[120px]" />
      <div className="absolute inset-20 translate-x-16 rounded-[70px] bg-[#FF6B1A]/10 blur-[120px]" />

      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#0B1628] p-4 shadow-[0_40px_100px_rgba(0,0,0,.38)] md:p-5">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
          <div className="flex gap-2">
            <span className="size-2.5 rounded-full bg-[#FF5F57]" />
            <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="size-2.5 rounded-full bg-[#28C840]" />
          </div>

          <span className="rounded-full border border-white/[0.065] bg-[#07111F] px-4 py-2 text-[8px] text-[#607089]">
            app.uviq.ai/mission-control
          </span>

          <Sparkles size={14} className="text-[#FF8A4A]" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <section className="min-h-[500px] rounded-[18px] border border-white/[0.07] bg-[#101B2E] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#2492E8]">
                  CEO AI
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Autonomous department
                </h2>
              </div>

              <span className="flex size-10 items-center justify-center rounded-[12px] border border-[#24D27C]/18 bg-[#24D27C]/[0.06]">
                <span className="size-2 rounded-full bg-[#24D27C] shadow-[0_0_16px_rgba(36,210,124,.75)]" />
              </span>
            </div>

            <div className="relative mt-8 flex min-h-[250px] items-center justify-center">
              <div className="absolute size-48 rounded-full border border-[#2492E8]/15" />
              <div className="absolute size-36 rounded-full border border-[#6D4FD2]/20" />
              <div className="absolute size-24 rounded-full border border-[#FF6B1A]/18" />

              <div className="relative flex size-20 items-center justify-center rounded-[22px] border border-[#2492E8]/25 bg-gradient-to-br from-[#2492E8]/20 via-[#6D4FD2]/20 to-[#FF6B1A]/15 text-white shadow-[0_0_55px_rgba(36,146,232,.18)]">
                <BrainCircuit size={34} strokeWidth={1.3} />
              </div>

              <FloatingAgent
                position="left-0 top-2"
                label="Research"
                icon={Search}
                color="#2492E8"
              />

              <FloatingAgent
                position="right-0 top-2"
                label="Strategy"
                icon={Target}
                color="#6D4FD2"
              />

              <FloatingAgent
                position="bottom-2 left-0"
                label="Creative"
                icon={Megaphone}
                color="#FF6B1A"
              />

              <FloatingAgent
                position="bottom-2 right-0"
                label="Automation"
                icon={Workflow}
                color="#24D27C"
              />
            </div>

            <div className="mt-7 space-y-4">
              <ProgressLine
                label="Dati analizzati"
                value="128"
                progress={88}
                color="#2492E8"
              />

              <ProgressLine
                label="Azioni pianificate"
                value="36"
                progress={72}
                color="#6D4FD2"
              />

              <ProgressLine
                label="Automazioni attive"
                value="12"
                progress={58}
                color="#FF6B1A"
              />
            </div>
          </section>

          <div className="space-y-4">
            <SmallMetric
              icon={TrendingUp}
              label="Growth potential"
              value="€ 42.600"
              color="#FF6B1A"
            />

            <SmallMetric
              icon={Bot}
              label="AI Employees"
              value="12"
              color="#2492E8"
            />

            <section className="rounded-[18px] border border-white/[0.07] bg-[#101B2E] p-5">
              <p className="text-[8px] uppercase tracking-[0.16em] text-[#607089]">
                Department status
              </p>

              <div className="mt-5 space-y-4">
                {[
                  ["Research", "#2492E8"],
                  ["Strategy", "#6D4FD2"],
                  ["Content", "#FF6B1A"],
                  ["Automation", "#24D27C"],
                ].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />

                    <span className="min-w-0 flex-1 text-[9px] text-[#B7C7DA]">
                      {label}
                    </span>

                    <span className="text-[7px] font-semibold uppercase tracking-[0.1em] text-[#66E7A6]">
                      Online
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingAgent({
  position,
  label,
  icon: Icon,
  color,
}: {
  position: string;
  label: string;
  icon: typeof Search;
  color: string;
}) {
  return (
    <div
      className={`absolute ${position} rounded-[13px] border border-white/[0.075] bg-[#0B1628] p-3 shadow-xl`}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-8 items-center justify-center rounded-[10px]"
          style={{
            color,
            backgroundColor: `${color}18`,
          }}
        >
          <Icon size={14} />
        </span>

        <div>
          <p className="text-[9px] font-semibold">{label}</p>
          <p className="mt-1 text-[6px] text-[#607089]">Working</p>
        </div>
      </div>
    </div>
  );
}

function ProgressLine({
  label,
  value,
  progress,
  color,
}: {
  label: string;
  value: string;
  progress: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[8px]">
        <span className="text-[#607089]">{label}</span>
        <span className="font-semibold text-[#D7E1EC]">{value}</span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function SmallMetric({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <section className="rounded-[18px] border border-white/[0.07] bg-[#101B2E] p-5">
      <span
        className="flex size-10 items-center justify-center rounded-[12px]"
        style={{
          color,
          backgroundColor: `${color}16`,
        }}
      >
        <Icon size={17} />
      </span>

      <p className="mt-5 text-[7px] font-semibold uppercase tracking-[0.14em] text-[#607089]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
        {value}
      </p>
    </section>
  );
}

function ValuePoint({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[14px] border border-white/[0.065] bg-[#07111F]/50 p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] border border-[#2492E8]/18 bg-[#2492E8]/[0.07] text-[#69BDF2]">
        <Icon size={15} />
      </span>

      <div>
        <h3 className="text-xs font-semibold">{title}</h3>
        <p className="mt-2 text-[10px] leading-5 text-[#91A4BF]">{text}</p>
      </div>
    </div>
  );
}
