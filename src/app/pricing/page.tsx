import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  CircleHelp,
  Crown,
  LayoutGrid,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    eyebrow: "Per iniziare",
    description:
      "Per piccole attività che vogliono organizzare il marketing, produrre contenuti e introdurre le prime automazioni.",
    monthlyPrice: "490 €",
    activationPrice: "690 €",
    featured: false,
    icon: Zap,
    color: "#2492E8",
    features: [
      "1 azienda o attività",
      "Business Intelligence iniziale",
      "Piano marketing trimestrale",
      "Piano editoriale mensile",
      "Generazione copy e contenuti",
      "Calendario pubblicazioni",
      "Report mensile",
      "2 automazioni operative",
      "Supporto standard",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    eyebrow: "Più scelto",
    description:
      "Per aziende che vogliono un vero reparto marketing digitale continuativo, coordinato e orientato alla crescita.",
    monthlyPrice: "990 €",
    activationPrice: "1.490 €",
    featured: true,
    icon: BrainCircuit,
    color: "#FF6B1A",
    features: [
      "Tutto il piano Starter",
      "CRM e pipeline lead",
      "Email marketing automation",
      "WhatsApp follow-up",
      "Content Factory",
      "Reel e short video",
      "Supporto Meta e Google Ads",
      "Ottimizzazione continua",
      "Report strategico mensile",
      "Supporto prioritario",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    eyebrow: "Enterprise",
    description:
      "Per aziende strutturate, gruppi, reti commerciali, franchising e progetti con più sedi o mercati.",
    monthlyPrice: "Su misura",
    activationPrice: "Su progetto",
    featured: false,
    icon: Crown,
    color: "#6D4FD2",
    features: [
      "Più aziende, brand o sedi",
      "Agenti AI personalizzati",
      "Dashboard dedicate",
      "Workflow avanzati",
      "Integrazioni API",
      "Ruoli e autorizzazioni",
      "Business Intelligence continua",
      "Supporto prioritario",
      "Consulenza strategica",
      "SLA personalizzato",
    ],
  },
];

const comparisonRows = [
  {
    label: "Business Intelligence",
    starter: true,
    growth: true,
    scale: true,
  },
  {
    label: "Piano marketing",
    starter: "Trimestrale",
    growth: "Continuativo",
    scale: "Personalizzato",
  },
  {
    label: "Generazione contenuti",
    starter: true,
    growth: true,
    scale: true,
  },
  {
    label: "Calendario social",
    starter: true,
    growth: true,
    scale: true,
  },
  {
    label: "Pubblicazione automatica",
    starter: false,
    growth: true,
    scale: true,
  },
  {
    label: "CRM e pipeline",
    starter: false,
    growth: true,
    scale: true,
  },
  {
    label: "Email automation",
    starter: false,
    growth: true,
    scale: true,
  },
  {
    label: "WhatsApp automation",
    starter: "2 flussi",
    growth: "Flussi avanzati",
    scale: "Personalizzati",
  },
  {
    label: "Content Factory video",
    starter: false,
    growth: true,
    scale: true,
  },
  {
    label: "Meta e Google Ads",
    starter: "Analisi",
    growth: "Supporto operativo",
    scale: "Gestione avanzata",
  },
  {
    label: "Integrazioni API",
    starter: false,
    growth: "Limitate",
    scale: true,
  },
  {
    label: "Numero aziende",
    starter: "1",
    growth: "1",
    scale: "Illimitato su progetto",
  },
];

const optionalModules = [
  {
    title: "Content Factory Plus",
    description:
      "Produzione aggiuntiva di reel, short video, caroselli, creatività ADV e contenuti multiformato.",
    price: "da 290 €/mese",
    icon: Sparkles,
  },
  {
    title: "Automation Advanced",
    description:
      "Workflow complessi, segmentazioni, lead nurturing, recupero clienti e processi commerciali.",
    price: "da 390 €/mese",
    icon: Workflow,
  },
  {
    title: "AI Sales Department",
    description:
      "Prospecting, analisi aziende, preparazione demo, preventivi e follow-up commerciale.",
    price: "da 490 €/mese",
    icon: Bot,
  },
  {
    title: "Custom Integrations",
    description:
      "Collegamenti con software, gestionali, CRM, ecommerce e sistemi aziendali esistenti.",
    price: "su preventivo",
    icon: Network,
  },
];

const faqs = [
  {
    question: "Il costo include anche la gestione del marketing?",
    answer:
      "Sì. UVIQ non viene proposto come semplice accesso a un software. I piani includono il sistema e il livello di supervisione operativa indicato nel progetto.",
  },
  {
    question: "Il piano può essere personalizzato?",
    answer:
      "Sì. Settore, quantità di contenuti, campagne, automazioni e integrazioni possono modificare la configurazione finale.",
  },
  {
    question: "Esiste un costo di attivazione?",
    answer:
      "Sì. L’attivazione copre onboarding, analisi iniziale, configurazione del Business Twin, setup degli agenti e dei primi workflow.",
  },
  {
    question: "UVIQ sostituisce completamente un’agenzia?",
    answer:
      "UVIQ può sostituire molte attività operative tipiche di un’agenzia tradizionale. Le decisioni strategiche e la qualità finale restano supervisionate dal team.",
  },
  {
    question: "È possibile iniziare con Starter e passare a Growth?",
    answer:
      "Sì. Il sistema è modulare e il piano può evolvere quando aumentano attività, automazioni o necessità commerciali.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111F] text-white">
      <PricingBackground />

      <PricingNavbar />

      <section className="relative z-10 mx-auto max-w-[1600px] px-5 pb-16 pt-20 text-center md:px-10 md:pt-28">
        <div className="mx-auto max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2492E8]/20 bg-[#2492E8]/[0.07] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#79C6F5]">
            <Sparkles size={13} />
            Pricing UVIQ
          </span>

          <h1 className="mt-7 text-5xl font-semibold leading-[0.94] tracking-[-0.06em] md:text-7xl xl:text-8xl">
            Il tuo reparto marketing,
            <span className="block text-[#FF6B1A]">
              configurato sulla crescita.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#C2CFDE] md:text-lg">
            Scegli il livello operativo più adatto alla tua azienda.
            Analisi, contenuti, CRM, automazioni e supervisione in un unico
            ecosistema.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <TrustBadge
            icon={ShieldCheck}
            label="Supervisione professionale"
          />

          <TrustBadge
            icon={CheckCircle2}
            label="Configurazione personalizzata"
          />

          <TrustBadge
            icon={Workflow}
            label="Automazioni modulari"
          />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1600px] px-5 py-12 md:px-10">
        <div className="grid gap-5 xl:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <article
                key={plan.id}
                className={`relative flex min-h-[720px] flex-col overflow-hidden rounded-[24px] border p-7 md:p-8 ${
                  plan.featured
                    ? "border-[#FF6B1A]/55 bg-[#13243A] shadow-[0_30px_90px_rgba(255,107,26,.16)]"
                    : "border-white/[0.1] bg-[#0B1628]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-0 top-0 rounded-bl-[18px] bg-[#FF6B1A] px-5 py-2.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white">
                    Più scelto
                  </div>
                )}

                <div className="flex items-start justify-between gap-5">
                  <span
                    className="flex size-12 items-center justify-center rounded-[14px] border"
                    style={{
                      color: plan.color,
                      borderColor: `${plan.color}38`,
                      backgroundColor: `${plan.color}15`,
                    }}
                  >
                    <Icon size={21} />
                  </span>

                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: plan.color }}
                  >
                    {plan.eyebrow}
                  </span>
                </div>

                <h2 className="mt-8 text-3xl font-semibold tracking-[-0.045em]">
                  {plan.name}
                </h2>

                <p className="mt-4 min-h-[112px] text-sm leading-7 text-[#B9C7D8]">
                  {plan.description}
                </p>

                <div className="mt-7 rounded-[17px] border border-white/[0.08] bg-[#07111F]/55 p-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#8FA2B9]">
                    Canone operativo
                  </p>

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-5xl font-semibold tracking-[-0.055em]">
                      {plan.monthlyPrice}
                    </span>

                    {plan.monthlyPrice !== "Su misura" && (
                      <span className="pb-1 text-sm text-[#B9C7D8]">
                        /mese
                      </span>
                    )}
                  </div>

                  <div className="mt-5 border-t border-white/[0.08] pt-4">
                    <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#8FA2B9]">
                      Attivazione iniziale
                    </p>

                    <p className="mt-2 text-base font-semibold">
                      {plan.activationPrice}
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-[#D7E1EC]"
                    >
                      <span
                        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                        style={{
                          color: plan.color,
                          backgroundColor: `${plan.color}16`,
                        }}
                      >
                        <Check size={12} />
                      </span>

                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  href="/projects/new"
                  className={`mt-auto inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-[14px] text-xs font-bold transition ${
                    plan.featured
                      ? "bg-[#FF6B1A] text-white shadow-[0_15px_38px_rgba(255,107,26,.25)] hover:bg-[#FF7D34]"
                      : "border border-white/[0.13] bg-white/[0.04] text-white hover:border-[#2492E8]/35 hover:bg-white/[0.08]"
                  }`}
                >
                  Configura {plan.name}
                  <ArrowRight size={15} />
                </Link>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[10px] leading-6 text-[#8FA2B9]">
          I prezzi sono indicativi e al netto di eventuali budget
          pubblicitari, servizi esterni, API premium e produzioni
          straordinarie.
        </p>
      </section>

      <section className="relative z-10 mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <SectionHeader
          eyebrow="Confronto"
          title="Confronta i piani."
          description="Una panoramica delle principali funzioni previste nei diversi livelli operativi."
        />

        <div className="mt-10 overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#0B1628]">
          <div className="grid grid-cols-[1.4fr_repeat(3,0.7fr)] border-b border-white/[0.08] bg-[#0E1B2E]">
            <div className="p-5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#8FA2B9]">
              Funzionalità
            </div>

            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border-l border-white/[0.07] p-5 text-center text-xs font-bold"
              >
                {plan.name}
              </div>
            ))}
          </div>

          {comparisonRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1.4fr_repeat(3,0.7fr)] border-b border-white/[0.06] last:border-0"
            >
              <div className="p-5 text-xs font-medium text-[#D7E1EC]">
                {row.label}
              </div>

              <ComparisonCell value={row.starter} />
              <ComparisonCell value={row.growth} />
              <ComparisonCell value={row.scale} />
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <SectionHeader
          eyebrow="Moduli aggiuntivi"
          title="Estendi il reparto quando serve."
          description="Aggiungi capacità operative senza dover cambiare completamente il piano."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {optionalModules.map((module) => {
            const Icon = module.icon;

            return (
              <article
                key={module.title}
                className="rounded-[20px] border border-white/[0.09] bg-[#0B1628] p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                  <Icon size={19} />
                </span>

                <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em]">
                  {module.title}
                </h3>

                <p className="mt-4 min-h-[112px] text-sm leading-7 text-[#B9C7D8]">
                  {module.description}
                </p>

                <p className="mt-6 text-sm font-bold text-[#FF8A4A]">
                  {module.price}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1100px] px-5 py-20 md:px-10">
        <SectionHeader
          eyebrow="FAQ"
          title="Domande frequenti."
          description="Le informazioni essenziali prima di configurare UVIQ."
        />

        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[17px] border border-white/[0.09] bg-[#0B1628] p-5 open:border-[#2492E8]/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold">
                <span className="flex items-center gap-3">
                  <CircleHelp
                    size={17}
                    className="shrink-0 text-[#2492E8]"
                  />

                  {faq.question}
                </span>

                <span className="text-xl font-light text-[#8FA2B9] transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-5 border-t border-white/[0.07] pt-5 text-sm leading-7 text-[#B9C7D8]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1600px] px-5 pb-20 pt-10 md:px-10">
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#162D4F] px-7 py-12 md:px-12 md:py-16">
          <div className="pointer-events-none absolute -right-40 -top-52 size-[32rem] rounded-full bg-[#FF6B1A]/20 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-[-14rem] left-1/3 size-[28rem] rounded-full bg-[#2492E8]/15 blur-[120px]" />

          <div className="relative flex flex-col justify-between gap-10 xl:flex-row xl:items-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#79C6F5]">
                Configurazione personalizzata
              </p>

              <h2 className="mt-5 max-w-5xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-6xl">
                Troviamo insieme il piano adatto alla tua azienda.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#C8D5E4]">
                Analizziamo settore, obiettivi, struttura e processi prima
                di definire il reparto marketing più efficace.
              </p>
            </div>

            <Link
              href="/projects/new"
              className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-4 rounded-[14px] bg-[#FF6B1A] px-7 text-xs font-bold text-white shadow-[0_18px_45px_rgba(0,0,0,.25)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
            >
              Richiedi configurazione
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

              <p className="mt-1 text-[7px] uppercase tracking-[0.2em] text-[#8FA2B9]">
                AI Business Operating System
              </p>
            </div>
          </div>

          <p className="text-[9px] text-[#8FA2B9]">
            © 2026 UVIQ · Univibe Group
          </p>
        </div>
      </footer>
    </main>
  );
}

function PricingNavbar() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-7">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[20px] border border-white/[0.1] bg-[#081425]/95 shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur-2xl">
        <div className="flex min-h-[88px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex size-11 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C8D5E4] transition hover:bg-white/[0.07] hover:text-white"
              aria-label="Torna alla home"
            >
              <ArrowLeft size={17} />
            </Link>

            <Link href="/" className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-[14px] border border-[#2492E8]/20 bg-[#0D1D34] p-2">
                <Image
                  src="/uviq-logo.svg"
                  alt="UVIQ"
                  width={44}
                  height={44}
                  priority
                  className="size-full object-contain"
                />
              </span>

              <span className="hidden sm:block">
                <span className="flex items-center gap-3">
                  <span className="text-2xl font-bold tracking-[-0.06em]">
                    UVIQ
                  </span>

                  <span className="rounded-full bg-[#2492E8] px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em]">
                    Pricing
                  </span>
                </span>

                <span className="mt-1 block text-[7px] font-semibold uppercase tracking-[0.28em] text-[#C8D5E4]">
                  AI Business Operating System
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden min-h-12 items-center gap-3 rounded-[13px] border border-white/[0.13] bg-[#091323] px-5 text-[10px] font-bold text-white transition hover:border-[#2492E8]/40 hover:bg-[#0E1C31] md:inline-flex"
            >
              <LayoutGrid size={15} className="text-[#2492E8]" />
              Workspace
            </Link>

            <Link
              href="/projects/new"
              className="inline-flex min-h-12 items-center gap-3 rounded-[13px] bg-[#FF6B1A] px-5 text-[10px] font-bold text-white shadow-[0_12px_34px_rgba(255,107,26,.3)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
            >
              Configura UVIQ
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function PricingBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none fixed -left-72 -top-64 size-[48rem] rounded-full bg-[#2492E8]/[0.08] blur-[170px]" />
      <div className="pointer-events-none fixed -right-72 top-0 size-[52rem] rounded-full bg-[#6D4FD2]/[0.08] blur-[180px]" />
    </>
  );
}

function TrustBadge({
  icon: Icon,
  label,
}: {
  icon: typeof ShieldCheck;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-[#0B1628] px-4 py-2 text-[9px] font-semibold text-[#D7E1EC]">
      <Icon size={13} className="text-[#2492E8]" />
      {label}
    </span>
  );
}

function SectionHeader({
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

      <p className="mt-6 max-w-3xl text-sm leading-8 text-[#C2CFDE]">
        {description}
      </p>
    </div>
  );
}

function ComparisonCell({
  value,
}: {
  value: boolean | string;
}) {
  return (
    <div className="flex items-center justify-center border-l border-white/[0.06] p-5 text-center text-[10px] text-[#D7E1EC]">
      {value === true && (
        <span className="flex size-6 items-center justify-center rounded-full bg-[#24D27C]/10 text-[#8AF0BA]">
          <Check size={13} />
        </span>
      )}

      {value === false && (
        <span className="flex size-6 items-center justify-center rounded-full bg-white/[0.04] text-[#677A92]">
          <X size={12} />
        </span>
      )}

      {typeof value === "string" && value}
    </div>
  );
}
