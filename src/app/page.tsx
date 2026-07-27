import { HomeNavbar } from "@/components/home/HomeNavbar";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Car,
  Check,
  CheckCircle2,
  Dumbbell,
  Factory,
  Globe2,
  HeartPulse,
  Hotel,
  LayoutGrid,
  Megaphone,
  Network,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Utensils,
  Workflow,
} from "lucide-react";

const sectors = [
  {
    name: "Ristorazione",
    description:
      "Prenotazioni, menù digitale, recensioni, social, delivery e fidelizzazione.",
    icon: Utensils,
    color: "#FF6B1A",
  },
  {
    name: "Hospitality",
    description:
      "Prenotazione diretta, camere, offerte, reputazione e customer journey.",
    icon: Hotel,
    color: "#2492E8",
  },
  {
    name: "Sanità e benessere",
    description:
      "Acquisizione pazienti, prenotazioni, reminder e autorevolezza digitale.",
    icon: HeartPulse,
    color: "#24D27C",
  },
  {
    name: "Fitness e sport",
    description:
      "Lead, prove gratuite, abbonamenti, corsi, community e retention.",
    icon: Dumbbell,
    color: "#6D4FD2",
  },
  {
    name: "Automotive",
    description:
      "Richieste preventivo, appuntamenti, assistenza e recupero clienti.",
    icon: Car,
    color: "#FF8A4A",
  },
  {
    name: "Industria e B2B",
    description:
      "Lead qualificati, prodotti, certificazioni, rete commerciale ed export.",
    icon: Factory,
    color: "#4B8EFF",
  },
  {
    name: "Professionisti",
    description:
      "Autorevolezza, servizi, acquisizione contatti e follow-up automatici.",
    icon: BriefcaseBusiness,
    color: "#9B86EA",
  },
  {
    name: "Retail ed ecommerce",
    description:
      "Cataloghi, campagne, clienti inattivi, conversione e riacquisto.",
    icon: ShoppingBag,
    color: "#F5A623",
  },
];

const steps = [
  {
    number: "01",
    title: "Analizza",
    description:
      "UVIQ raccoglie dati da sito, Google, social, recensioni e processi commerciali.",
    icon: Search,
  },
  {
    number: "02",
    title: "Progetta",
    description:
      "Gli agenti costruiscono strategia, priorità, funnel, contenuti e roadmap.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Produce",
    description:
      "Il sistema genera post, copy, campagne, reel, email, landing e materiali.",
    icon: Megaphone,
  },
  {
    number: "04",
    title: "Automatizza",
    description:
      "CRM, follow-up, WhatsApp, email, recensioni e report lavorano in automatico.",
    icon: Workflow,
  },
];

const agents = [
  "Marketing Director",
  "SEO Specialist",
  "Content Strategist",
  "Copywriter",
  "Video Producer",
  "Meta Ads Specialist",
  "CRM Manager",
  "Automation Architect",
];

const pricing = [
  {
    name: "Starter",
    description:
      "Per piccole attività che vogliono organizzare il marketing e iniziare ad automatizzare.",
    price: "490 €",
    suffix: "/mese",
    featured: false,
    features: [
      "1 azienda",
      "Business Intelligence",
      "Piano marketing AI",
      "Piano editoriale",
      "Generazione contenuti",
      "Report mensile",
      "2 automazioni operative",
    ],
  },
  {
    name: "Growth",
    description:
      "Per aziende che vogliono un vero reparto marketing digitale continuativo.",
    price: "990 €",
    suffix: "/mese",
    featured: true,
    features: [
      "Tutto il piano Starter",
      "CRM e pipeline lead",
      "Email e WhatsApp automation",
      "Content Factory",
      "Reel e short video",
      "Meta e Google support",
      "Report e ottimizzazione continua",
    ],
  },
  {
    name: "Scale",
    description:
      "Per aziende strutturate, gruppi, reti commerciali e progetti multisede.",
    price: "Su misura",
    suffix: "",
    featured: false,
    features: [
      "Più aziende o sedi",
      "Agenti AI personalizzati",
      "Workflow avanzati",
      "Integrazioni API",
      "Dashboard dedicate",
      "Supporto prioritario",
      "Consulenza strategica",
    ],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111F] text-white">
      <Background />

      <HomeNavbar />

      <section
        id="product"
        className="relative z-10 mx-auto max-w-[1600px] scroll-mt-32 px-5 pb-20 pt-16 md:px-10 md:pt-24"
      >
        <div className="grid items-center gap-16 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#24D27C]/20 bg-[#24D27C]/[0.06] px-4 py-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#24D27C] opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-[#24D27C]" />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8AF0BA]">
                AI Marketing Department Online
              </span>
            </div>

            <h1 className="mt-8 max-w-5xl text-[clamp(4rem,7vw,8rem)] font-semibold leading-[0.87] tracking-[-0.075em]">
              Il reparto
              <br />
              marketing della
              <br />
              <span className="text-[#FF6B1A]">
                tua azienda.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#C0CDDD] md:text-lg">
              UVIQ analizza, pianifica, crea, pubblica, automatizza e
              ottimizza il marketing attraverso agenti AI specializzati,
              coordinati dal nostro team.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects/new"
                className="group inline-flex min-h-14 items-center justify-center gap-4 rounded-[14px] bg-[#FF6B1A] px-7 text-xs font-bold text-white shadow-[0_18px_48px_rgba(255,107,26,.28)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
              >
                Avvia una nuova intelligence
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[14px] border border-white/[0.13] bg-white/[0.04] px-7 text-xs font-bold text-white transition hover:border-[#2492E8]/40 hover:bg-white/[0.07]"
              >
                <LayoutGrid size={15} className="text-[#2492E8]" />
                Esplora Mission Control
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
              <HeroMetric value="12" label="Agenti AI" />
              <HeroMetric value="24/7" label="Sistema operativo" />
              <HeroMetric value="8" label="Settori attivi" />
            </div>
          </div>

          <MissionControlPreview />
        </div>
      </section>

      <section
        id="functions"
        className="relative z-10 mx-auto max-w-[1600px] scroll-mt-32 px-5 py-20 md:px-10"
      >
        <SectionHeading
          eyebrow="Metodo operativo"
          title="Dall’analisi all’esecuzione."
          description="UVIQ non si limita a suggerire cosa fare. Organizza il lavoro e trasforma la strategia in attività operative."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="relative min-h-[300px] overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#0B1628] p-6 transition hover:-translate-y-1 hover:border-[#2492E8]/30 hover:bg-[#101D31]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-[14px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#69BDF2]">
                    <Icon size={20} />
                  </span>

                  <span className="font-mono text-[10px] text-[#71839B]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-10 text-2xl font-semibold tracking-[-0.04em]">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#B6C4D6]">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="sectors"
        className="relative z-10 mx-auto max-w-[1600px] scroll-mt-32 px-5 py-20 md:px-10"
      >
        <SectionHeading
          eyebrow="Intelligence multisettore"
          title="Un modello specifico per ogni attività."
          description="Metriche, agenti, priorità e automazioni cambiano in base al settore e al modello commerciale."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sectors.map((sector) => {
            const Icon = sector.icon;

            return (
              <Link
                key={sector.name}
                href="/projects/new"
                className="group min-h-[260px] rounded-[20px] border border-white/[0.09] bg-[#0B1628] p-6 transition hover:-translate-y-1 hover:border-white/[0.16] hover:bg-[#101D31]"
              >
                <span
                  className="flex size-12 items-center justify-center rounded-[14px] border"
                  style={{
                    color: sector.color,
                    borderColor: `${sector.color}35`,
                    backgroundColor: `${sector.color}14`,
                  }}
                >
                  <Icon size={20} />
                </span>

                <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em]">
                  {sector.name}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#B6C4D6]">
                  {sector.description}
                </p>

                <span className="mt-7 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#FF8A4A]">
                  Configura settore
                  <ArrowRight
                    size={13}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section
        id="department"
        className="relative z-10 mx-auto max-w-[1600px] scroll-mt-32 px-5 py-20 md:px-10"
      >
        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <article className="rounded-[22px] border border-white/[0.09] bg-[#162D4F] p-7 md:p-10">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#69BDF2]">
              AI Marketing Department
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-6xl">
              Non un insieme
              <br />
              di strumenti.
              <span className="mt-2 block text-[#FF6B1A]">
                Un reparto coordinato.
              </span>
            </h2>

            <p className="mt-7 text-sm leading-8 text-[#C5D2E1]">
              Ogni agente svolge un ruolo specifico e collabora con gli
              altri specialisti per trasformare obiettivi e dati in azioni
              concrete.
            </p>

            <div className="mt-9 space-y-4">
              <ValuePoint
                icon={Network}
                title="Agenti coordinati"
                text="SEO, contenuti, advertising, CRM e automazioni condividono strategia e dati."
              />

              <ValuePoint
                icon={ShieldCheck}
                title="Controllo professionale"
                text="Il nostro team supervisiona strategia, qualità e decisioni sensibili."
              />

              <ValuePoint
                icon={TrendingUp}
                title="Miglioramento continuo"
                text="KPI, risultati e performance aggiornano costantemente il piano operativo."
              />
            </div>
          </article>

          <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
            <header className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#2492E8]">
                  Live department
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Specialisti disponibili
                </h3>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-[#24D27C]/20 bg-[#24D27C]/[0.06] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#8AF0BA]">
                <span className="size-1.5 rounded-full bg-[#24D27C]" />
                Online
              </span>
            </header>

            <div className="grid gap-px bg-white/[0.07] sm:grid-cols-2">
              {agents.map((agent, index) => (
                <div
                  key={agent}
                  className="flex min-h-[120px] items-center gap-4 bg-[#0B1628] p-6 transition hover:bg-[#101D31]"
                >
                  <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#69BDF2]">
                    <Bot size={18} />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      {agent}
                    </p>

                    <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#8AF0BA]">
                      {index % 3 === 0 ? "Working" : "Online"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <div className="grid gap-6 rounded-[24px] border border-white/[0.1] bg-[#0B1628] p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#2492E8]">
              Pricing UVIQ
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Scopri il piano adatto alla tua azienda.
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#C0CDDD]">
              Confronta Starter, Growth e Scale, verifica le funzioni
              incluse e configura il reparto marketing più adatto.
            </p>
          </div>

          <Link
            href="/pricing"
            className="group inline-flex min-h-14 items-center justify-center gap-4 rounded-[14px] bg-[#FF6B1A] px-7 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
          >
            Consulta il pricing
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1600px] px-5 pb-20 pt-10 md:px-10">
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#162D4F] px-7 py-12 md:px-12 md:py-16">
          <div className="pointer-events-none absolute -right-40 -top-52 size-[32rem] rounded-full bg-[#FF6B1A]/20 blur-[120px]" />

          <div className="relative flex flex-col justify-between gap-10 xl:flex-row xl:items-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#69BDF2]">
                Deploy UVIQ
              </p>

              <h2 className="mt-5 max-w-5xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-6xl">
                Porta nella tua azienda un reparto marketing sempre operativo.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#C5D2E1]">
                Parti dall’analisi e configura strategia, contenuti,
                automazioni e sviluppo commerciale.
              </p>
            </div>

            <Link
              href="/projects/new"
              className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-4 rounded-[14px] bg-[#FF6B1A] px-7 text-xs font-bold text-white shadow-[0_18px_45px_rgba(0,0,0,.25)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
            >
              Avvia il progetto
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.08] bg-[#050C16]">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 px-5 py-10 md:flex-row md:items-center md:px-10">
          <div className="flex items-center gap-4">
            <Image
              src="/uviq-logo.svg"
              alt="UVIQ"
              width={42}
              height={42}
              className="size-11 object-contain"
            />

            <div>
              <p className="text-lg font-bold tracking-[-0.04em]">
                UVIQ
              </p>

              <p className="mt-1 text-[7px] uppercase tracking-[0.2em] text-[#8192A8]">
                AI Business Operating System
              </p>
            </div>
          </div>

          <p className="text-[9px] text-[#8192A8]">
            © 2026 UVIQ · Univibe Group
          </p>
        </div>
      </footer>
    </main>
  );
}

function Background() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none fixed -left-72 -top-64 size-[48rem] rounded-full bg-[#2492E8]/[0.09] blur-[170px]" />
      <div className="pointer-events-none fixed -right-72 top-0 size-[52rem] rounded-full bg-[#6D4FD2]/[0.09] blur-[180px]" />
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#2492E8]">
        {eyebrow}
      </p>

      <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.055em] md:text-6xl">
        {title}
      </h2>

      <p className="mt-6 max-w-3xl text-sm leading-8 text-[#C0CDDD]">
        {description}
      </p>
    </div>
  );
}

function HeroMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[14px] border border-white/[0.09] bg-[#0B1628] p-4">
      <p className="text-2xl font-semibold tracking-[-0.04em]">
        {value}
      </p>

      <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#AAB9CC]">
        {label}
      </p>
    </div>
  );
}

function MissionControlPreview() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#0B1628] p-5 shadow-[0_40px_100px_rgba(0,0,0,.4)]">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex gap-2">
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </div>

        <span className="rounded-full border border-white/[0.08] bg-[#07111F] px-4 py-2 text-[8px] text-[#AAB9CC]">
          mission-control.uviq.ai
        </span>

        <Sparkles size={14} className="text-[#FF8A4A]" />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[18px] border border-white/[0.08] bg-[#101B2E] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#69BDF2]">
                CEO AI
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Marketing department
              </h3>
            </div>

            <span className="size-3 rounded-full bg-[#24D27C] shadow-[0_0_16px_rgba(36,210,124,.8)]" />
          </div>

          <div className="mt-8 flex min-h-[230px] items-center justify-center">
            <div className="relative flex size-44 items-center justify-center rounded-full border border-[#2492E8]/20">
              <div className="absolute size-32 rounded-full border border-[#6D4FD2]/25" />

              <span className="relative flex size-20 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#2492E8]/30 via-[#6D4FD2]/25 to-[#FF6B1A]/20">
                <BrainCircuit size={34} />
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <PreviewProgress
              label="Dati analizzati"
              value="128"
              progress="88%"
              color="#2492E8"
            />

            <PreviewProgress
              label="Azioni pianificate"
              value="36"
              progress="72%"
              color="#6D4FD2"
            />

            <PreviewProgress
              label="Automazioni attive"
              value="12"
              progress="58%"
              color="#FF6B1A"
            />
          </div>
        </div>

        <div className="space-y-4">
          <PreviewMetric
            icon={TrendingUp}
            label="Growth potential"
            value="€42.600"
            color="#FF6B1A"
          />

          <PreviewMetric
            icon={Bot}
            label="AI employees"
            value="12"
            color="#2492E8"
          />

          <div className="rounded-[18px] border border-white/[0.08] bg-[#101B2E] p-5">
            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#AAB9CC]">
              Department
            </p>

            <div className="mt-5 space-y-4">
              {["Research", "Strategy", "Content", "Automation"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="size-2 rounded-full bg-[#24D27C]" />
                    <span className="flex-1 text-[9px] text-white">
                      {item}
                    </span>
                    <span className="text-[7px] font-bold uppercase text-[#8AF0BA]">
                      Online
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewProgress({
  label,
  value,
  progress,
  color,
}: {
  label: string;
  value: string;
  progress: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[8px]">
        <span className="text-[#AAB9CC]">{label}</span>
        <span className="font-bold text-white">{value}</span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full"
          style={{
            width: progress,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function PreviewMetric({
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
    <div className="rounded-[18px] border border-white/[0.08] bg-[#101B2E] p-5">
      <Icon size={18} style={{ color }} />

      <p className="mt-5 text-[7px] font-bold uppercase tracking-[0.14em] text-[#AAB9CC]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ValuePoint({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Network;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[15px] border border-white/[0.1] bg-[#07111F]/40 p-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#2492E8]/10 text-[#69BDF2]">
        <Icon size={17} />
      </span>

      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-2 text-[10px] leading-6 text-[#C0CDDD]">
          {text}
        </p>
      </div>
    </div>
  );
}
