import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  ChartNoAxesCombined,
  Eye,
  Layers3,
  ScanSearch,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

const agents = [
  {
    name: "Research",
    description: "Raccoglie evidenze reali",
    icon: ScanSearch,
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    name: "Vision",
    description: "Analizza UX e percezione",
    icon: Eye,
    gradient: "from-blue-500 to-violet-500",
  },
  {
    name: "Strategy",
    description: "Individua opportunità",
    icon: BrainCircuit,
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    name: "Creative",
    description: "Genera demo personalizzate",
    icon: WandSparkles,
    gradient: "from-fuchsia-500 to-pink-500",
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
    <main className="startup-home min-h-screen overflow-hidden text-white">
      <div className="startup-grid-bg pointer-events-none fixed inset-0" />
      <div className="startup-glow startup-glow-one" />
      <div className="startup-glow startup-glow-two" />
      <div className="startup-glow startup-glow-three" />

      <header className="relative z-20 mx-auto flex max-w-[1580px] items-center justify-between px-5 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="startup-logo">
            <span>U</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-[-0.055em]">
                UVIQ
              </span>

              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                AI
              </span>
            </div>

            <p className="mt-1 text-[6px] uppercase tracking-[0.24em] text-white/30">
              Business Intelligence OS
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {["Prodotto", "Agenti AI", "Settori", "Demo Studio"].map(
            (item) => (
              <span
                key={item}
                className="text-[10px] font-medium text-white/40 transition hover:text-white"
              >
                {item}
              </span>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-[10px] font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white sm:block"
          >
            Workspace
          </Link>

          <Link
            href="/projects/new"
            className="startup-header-button inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-semibold"
          >
            Nuovo progetto
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1580px] px-5 pb-20 pt-14 md:px-10 md:pt-20">
        <div className="grid items-center gap-16 xl:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-4 py-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-100/80">
                Intelligence Core Online
              </span>
            </div>

            <h1 className="mt-8 max-w-5xl text-[clamp(4rem,7.5vw,8.6rem)] font-semibold leading-[0.86] tracking-[-0.078em]">
              See the
              <br />
              invisible.
              <br />
              <span className="startup-gradient-title">
                Build the next.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-slate-400 md:text-lg md:leading-8">
              UVIQ analizza qualsiasi azienda, interpreta dati reali e
              trasforma automaticamente criticità digitali in strategie,
              esperienze e opportunità commerciali.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects/new"
                className="startup-main-button group inline-flex items-center justify-center gap-4 px-7 py-4 text-xs font-semibold"
              >
                Avvia una nuova intelligence

                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-xs font-medium text-white/65 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white"
              >
                <ChartNoAxesCombined size={15} />
                Esplora il workspace
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[8px] uppercase tracking-[0.13em] text-white/35"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-10 rounded-[60px] bg-gradient-to-r from-blue-500/25 via-violet-500/25 to-fuchsia-500/25 blur-[110px]" />

            <div className="startup-app-window relative overflow-hidden rounded-[34px] p-4 md:p-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex gap-2">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </div>

                <div className="rounded-full border border-white/[0.07] bg-black/20 px-4 py-2 text-[8px] text-white/30">
                  app.uviq.ai/core
                </div>

                <Zap size={14} className="text-cyan-300" />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                <section className="startup-ui-card min-h-[500px] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                        Live Intelligence
                      </p>

                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                        Autonomous analysis
                      </h2>
                    </div>

                    <div className="flex size-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07]">
                      <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,.8)]" />
                    </div>
                  </div>

                  <div className="relative mt-9 flex min-h-[285px] items-center justify-center">
                    <div className="startup-orbit startup-orbit-one" />
                    <div className="startup-orbit startup-orbit-two" />

                    <div className="startup-brain">
                      <BrainCircuit size={38} strokeWidth={1.3} />
                    </div>

                    {agents.map((agent, index) => {
                      const Icon = agent.icon;
                      const positions = [
                        "left-0 top-1",
                        "right-0 top-1",
                        "bottom-1 left-0",
                        "bottom-1 right-0",
                      ];

                      return (
                        <div
                          key={agent.name}
                          className={`absolute ${positions[index]} rounded-2xl border border-white/[0.08] bg-[#131a2c]/95 p-3 shadow-xl backdrop-blur-xl`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex size-8 items-center justify-center rounded-xl bg-gradient-to-br ${agent.gradient}`}
                            >
                              <Icon size={14} />
                            </span>

                            <div>
                              <p className="text-[9px] font-medium text-white/75">
                                {agent.name}
                              </p>

                              <p className="mt-1 text-[6px] text-white/30">
                                Thinking…
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-7 space-y-4">
                    <Progress
                      label="Evidenze raccolte"
                      value="128"
                      percentage="88%"
                      gradient="from-cyan-400 to-blue-500"
                    />

                    <Progress
                      label="Pattern identificati"
                      value="36"
                      percentage="72%"
                      gradient="from-blue-500 to-violet-500"
                    />

                    <Progress
                      label="Opportunità"
                      value="12"
                      percentage="58%"
                      gradient="from-violet-500 to-fuchsia-500"
                    />
                  </div>
                </section>

                <div className="space-y-4">
                  <MetricCard
                    icon={ChartNoAxesCombined}
                    label="Digital score"
                    value="78"
                    suffix="/100"
                    gradient="from-cyan-400 to-blue-500"
                  />

                  <MetricCard
                    icon={Layers3}
                    label="Settori"
                    value="9"
                    suffix="moduli"
                    gradient="from-blue-500 to-violet-500"
                  />

                  <section className="startup-ui-card p-5">
                    <p className="text-[8px] uppercase tracking-[0.18em] text-white/30">
                      Agent network
                    </p>

                    <div className="mt-5 space-y-4">
                      {agents.map((agent) => {
                        const Icon = agent.icon;

                        return (
                          <div
                            key={agent.name}
                            className="flex items-center gap-3"
                          >
                            <span
                              className={`flex size-8 items-center justify-center rounded-xl bg-gradient-to-br ${agent.gradient}`}
                            >
                              <Icon size={13} />
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] text-white/65">
                                {agent.name}
                              </p>

                              <p className="mt-1 truncate text-[7px] text-white/25">
                                {agent.description}
                              </p>
                            </div>

                            <span className="size-1.5 rounded-full bg-emerald-300" />
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-20 grid gap-4 md:grid-cols-3">
          <FeatureCard
            number="01"
            icon={ScanSearch}
            title="Evidence engine"
            text="Raccoglie automaticamente sito, immagini, struttura, performance e segnali commerciali."
            gradient="from-cyan-400 to-blue-500"
          />

          <FeatureCard
            number="02"
            icon={BrainCircuit}
            title="Sector intelligence"
            text="Interpreta ogni attività attraverso modelli specializzati per il settore scelto."
            gradient="from-blue-500 to-violet-500"
          />

          <FeatureCard
            number="03"
            icon={Sparkles}
            title="Creative transformation"
            text="Genera strategia, demo personalizzata e proposta partendo dalle evidenze."
            gradient="from-violet-500 to-fuchsia-500"
          />
        </section>
      </section>
    </main>
  );
}

function Progress({
  label,
  value,
  percentage,
  gradient,
}: {
  label: string;
  value: string;
  percentage: string;
  gradient: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[8px]">
        <span className="text-white/30">{label}</span>
        <span className="font-medium text-white/65">{value}</span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          style={{ width: percentage }}
        />
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  suffix,
  gradient,
}: {
  icon: typeof Layers3;
  label: string;
  value: string;
  suffix: string;
  gradient: string;
}) {
  return (
    <section className="startup-ui-card p-5">
      <span
        className={`flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}`}
      >
        <Icon size={15} />
      </span>

      <p className="mt-5 text-[8px] uppercase tracking-[0.17em] text-white/28">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-semibold tracking-[-0.05em]">
          {value}
        </span>

        <span className="pb-1 text-[8px] text-white/25">
          {suffix}
        </span>
      </div>
    </section>
  );
}

function FeatureCard({
  number,
  icon: Icon,
  title,
  text,
  gradient,
}: {
  number: string;
  icon: typeof Sparkles;
  title: string;
  text: string;
  gradient: string;
}) {
  return (
    <article className="startup-ui-card group relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1">
      <div
        className={`absolute -right-16 -top-16 size-44 rounded-full bg-gradient-to-br ${gradient} opacity-[0.1] blur-3xl`}
      />

      <div className="relative flex justify-between">
        <span
          className={`flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}`}
        >
          <Icon size={17} />
        </span>

        <span className="text-[9px] text-white/20">{number}</span>
      </div>

      <h2 className="relative mt-8 text-lg font-semibold">
        {title}
      </h2>

      <p className="relative mt-3 text-xs leading-6 text-slate-500">
        {text}
      </p>
    </article>
  );
}
