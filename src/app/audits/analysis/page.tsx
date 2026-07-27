import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Database,
  FileSearch,
  Globe2,
  LayoutGrid,
  Lightbulb,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  XCircle,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

const maturityAreas = [
  {
    name: "Posizionamento",
    score: 68,
    confidence: "Media",
    status: "Da consolidare",
    evidence: "3 evidenze",
  },
  {
    name: "Sito e conversione",
    score: 46,
    confidence: "Alta",
    status: "Critico",
    evidence: "8 evidenze",
  },
  {
    name: "SEO locale",
    score: 54,
    confidence: "Media",
    status: "Migliorabile",
    evidence: "6 evidenze",
  },
  {
    name: "Social e contenuti",
    score: 61,
    confidence: "Media",
    status: "Discontinuo",
    evidence: "5 evidenze",
  },
  {
    name: "CRM e lead",
    score: 22,
    confidence: "Bassa",
    status: "Non verificato",
    evidence: "1 evidenza",
  },
  {
    name: "Automazioni",
    score: 18,
    confidence: "Bassa",
    status: "Non rilevate",
    evidence: "0 evidenze",
  },
];

const priorities = [
  {
    level: "P1",
    title: "Percorso di conversione poco chiaro",
    description:
      "Le informazioni commerciali risultano presenti, ma non organizzate in un percorso che accompagni l’utente verso prenotazione, contatto o acquisto.",
    impact: "Alto",
    confidence: "Alta",
    source: "Sito web",
  },
  {
    level: "P1",
    title: "Mancanza di gestione strutturata dei lead",
    description:
      "Non sono disponibili evidenze sufficienti di CRM, pipeline, segmentazione o follow-up commerciale.",
    impact: "Alto",
    confidence: "Bassa",
    source: "Discovery incompleta",
  },
  {
    level: "P2",
    title: "Comunicazione digitale discontinua",
    description:
      "Il posizionamento e i contenuti non sembrano coordinati da un piano editoriale e da obiettivi misurabili.",
    impact: "Medio",
    confidence: "Media",
    source: "Canali pubblici",
  },
];

const opportunities = [
  {
    title: "Funnel prenotazione e contatto",
    description:
      "Creare un percorso unico da campagne, Google e social verso una CTA misurabile.",
    horizon: "0–30 giorni",
    owner: "Growth Team",
  },
  {
    title: "Automazione follow-up",
    description:
      "Configurare risposta, qualificazione e recupero automatico dei contatti non convertiti.",
    horizon: "30–60 giorni",
    owner: "Automation Team",
  },
  {
    title: "Content operating system",
    description:
      "Collegare piano editoriale, produzione e distribuzione a obiettivi commerciali.",
    horizon: "30–90 giorni",
    owner: "Content Team",
  },
];

const evidence = [
  {
    name: "Sito web",
    type: "Fonte pubblica",
    status: "Disponibile",
    records: "8 segnali",
    confidence: "Alta",
  },
  {
    name: "Presenza organica",
    type: "Fonte pubblica",
    status: "Parziale",
    records: "6 segnali",
    confidence: "Media",
  },
  {
    name: "Social",
    type: "Fonte pubblica",
    status: "Parziale",
    records: "5 segnali",
    confidence: "Media",
  },
  {
    name: "Discovery aziendale",
    type: "Informazioni fornite",
    status: "Incompleta",
    records: "4 campi",
    confidence: "Bassa",
  },
  {
    name: "CRM e dati commerciali",
    type: "Fonte privata",
    status: "Non collegata",
    records: "0 record",
    confidence: "Assente",
  },
];

export default function BusinessTwinPage() {
  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/audits/war-room"
                aria-label="Torna alla War Room"
                className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C3CEDB] transition hover:border-[#2492E8]/35 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-[#6D4FD2]/20 bg-[#6D4FD2]/10 text-[#B9AAF4]">
                <BrainCircuit size={18} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em]">
                    Business Twin
                  </h1>

                  <span className="rounded-full border border-[#F5A623]/20 bg-[#F5A623]/[0.07] px-3 py-1 text-xs font-semibold text-[#F8C867]">
                    Anteprima strutturale
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Lettura strategica, evidenze e priorità.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="inline-flex items-center gap-2 text-sm text-[#B8C5D4]">
                <LockKeyhole size={14} className="text-[#24D27C]" />
                Nessun dato pubblicato
              </span>

              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold transition hover:border-[#2492E8]/35 hover:bg-white/[0.06]"
              >
                <LayoutGrid size={15} />
                Mission Control
              </Link>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden px-5 pb-24 pt-8 lg:px-8 xl:px-10">
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#6D4FD2]/[0.055] blur-[160px]" />
          <div className="pointer-events-none absolute bottom-[-20rem] left-1/4 size-[38rem] rounded-full bg-[#2492E8]/[0.04] blur-[170px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#F5A623]/20 bg-[#F5A623]/[0.07] px-3 py-1.5 text-xs font-semibold text-[#F8C867]">
                    <AlertTriangle size={13} />
                    Dati dimostrativi
                  </span>

                  <span className="text-sm text-[#AEBCCC]">
                    La struttura sarà alimentata dal motore AI reale
                  </span>
                </div>

                <h2 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] md:text-5xl">
                  Una fotografia operativa
                  <span className="block text-[#FF6B1A]">
                    con limiti e affidabilità visibili.
                  </span>
                </h2>

                <p className="mt-5 max-w-4xl text-base leading-8 text-[#CBD6E2]">
                  Il Business Twin non deve limitarsi a mostrare uno score.
                  Ogni conclusione deve indicare da quale fonte deriva,
                  quanto è affidabile e quali dati mancano per validarla.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <SummaryMetric
                    label="Maturità complessiva"
                    value="45/100"
                    detail="Indicativa"
                    color="#F5A623"
                    icon={BarChart3}
                  />

                  <SummaryMetric
                    label="Affidabilità analisi"
                    value="62%"
                    detail="Media"
                    color="#2492E8"
                    icon={ShieldCheck}
                  />

                  <SummaryMetric
                    label="Copertura fonti"
                    value="4/7"
                    detail="3 mancanti"
                    color="#6D4FD2"
                    icon={Database}
                  />
                </div>
              </article>

              <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                      Executive reading
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                      Sintesi direzionale
                    </h2>
                  </div>

                  <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                    <TrendingUp size={18} />
                  </span>
                </div>

                <div className="mt-6 rounded-[16px] border border-white/[0.08] bg-[#07111F]/55 p-5">
                  <p className="text-sm leading-7 text-[#D6DFE9]">
                    L’attività presenta una presenza digitale utilizzabile,
                    ma la trasformazione dei visitatori in opportunità
                    commerciali non risulta ancora strutturata.
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <ReadingRow
                    label="Punto di forza"
                    value="Presenza pubblica"
                    color="#24D27C"
                  />

                  <ReadingRow
                    label="Rischio principale"
                    value="Conversione"
                    color="#FF6B1A"
                  />

                  <ReadingRow
                    label="Dato più debole"
                    value="CRM e vendite"
                    color="#F5A623"
                  />
                </div>

                <Link
                  href="/growth-plan"
                  className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-5 text-sm font-semibold transition hover:bg-[#FF7D34]"
                >
                  Costruisci il Growth Plan
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </article>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_390px]">
              <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
                <SectionHeader
                  eyebrow="Digital maturity"
                  title="Maturità per area"
                  description="Ogni punteggio deve essere letto insieme a copertura e affidabilità."
                  icon={BarChart3}
                />

                <div className="divide-y divide-white/[0.065]">
                  {maturityAreas.map((area) => (
                    <MaturityRow key={area.name} {...area} />
                  ))}
                </div>
              </article>

              <aside className="space-y-4 xl:sticky xl:top-[108px] xl:self-start">
                <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    Confidence model
                  </p>

                  <h2 className="mt-3 text-xl font-semibold">
                    Come leggere i risultati
                  </h2>

                  <div className="mt-6 space-y-4">
                    <ConfidenceItem
                      title="Fatto verificato"
                      description="Supportato direttamente da una fonte disponibile."
                      icon={CheckCircle2}
                      color="#24D27C"
                    />

                    <ConfidenceItem
                      title="Deduzione"
                      description="Interpretazione ottenuta collegando più segnali."
                      icon={Lightbulb}
                      color="#F5A623"
                    />

                    <ConfidenceItem
                      title="Dato mancante"
                      description="Informazione necessaria ma non ancora disponibile."
                      icon={XCircle}
                      color="#FF5D73"
                    />
                  </div>
                </article>

                <article className="rounded-[18px] border border-[#2492E8]/18 bg-[#2492E8]/[0.045] p-5">
                  <div className="flex items-start gap-4">
                    <FileSearch
                      size={18}
                      className="mt-0.5 shrink-0 text-[#79C6F5]"
                    />

                    <div>
                      <h3 className="text-sm font-semibold">
                        Migliora l’affidabilità
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#C8D4E1]">
                        Collega dati CRM, campagne e risultati commerciali
                        per trasformare le ipotesi in evidenze misurabili.
                      </p>
                    </div>
                  </div>
                </article>
              </aside>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-2">
              <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
                <SectionHeader
                  eyebrow="Priority map"
                  title="Criticità prioritarie"
                  description="Ordinate per impatto, affidabilità e urgenza operativa."
                  icon={AlertTriangle}
                />

                <div className="divide-y divide-white/[0.065]">
                  {priorities.map((priority) => (
                    <PriorityCard key={priority.title} {...priority} />
                  ))}
                </div>
              </article>

              <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
                <SectionHeader
                  eyebrow="Growth opportunities"
                  title="Opportunità operative"
                  description="Iniziative che possono essere trasformate in una roadmap concreta."
                  icon={Target}
                />

                <div className="divide-y divide-white/[0.065]">
                  {opportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.title}
                      {...opportunity}
                    />
                  ))}
                </div>
              </article>
            </section>

            <section className="mt-5 overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
              <SectionHeader
                eyebrow="Evidence register"
                title="Fonti ed evidenze"
                description="Registro delle informazioni utilizzate e dei dati ancora assenti."
                icon={Database}
              />

              <div className="hidden grid-cols-[1.15fr_0.8fr_0.65fr_0.55fr_0.55fr] border-b border-white/[0.07] bg-[#091321] px-6 py-4 text-xs font-semibold text-[#AEBCCC] md:grid">
                <span>Fonte</span>
                <span>Tipologia</span>
                <span>Stato</span>
                <span>Elementi</span>
                <span>Affidabilità</span>
              </div>

              <div className="divide-y divide-white/[0.065]">
                {evidence.map((item) => (
                  <EvidenceRow key={item.name} {...item} />
                ))}
              </div>
            </section>

            <section className="mt-5 rounded-[22px] border border-white/[0.09] bg-[#162D4F] p-7 md:p-9">
              <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    Next operational step
                  </p>

                  <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                    Trasforma il Business Twin in un piano eseguibile.
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#D1DBE7]">
                    Il Growth Plan collegherà priorità, attività, responsabilità,
                    KPI, tempi e dipendenze.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/reports"
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] border border-white/[0.12] bg-white/[0.04] px-6 text-sm font-semibold transition hover:bg-white/[0.07]"
                  >
                    Apri report
                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    href="/growth-plan"
                    className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-6 text-sm font-semibold transition hover:bg-[#FF7D34]"
                  >
                    Genera Growth Plan
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof BarChart3;
}) {
  return (
    <header className="flex items-start justify-between gap-5 border-b border-white/[0.08] px-6 py-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
          {eyebrow}
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#B8C5D4]">
          {description}
        </p>
      </div>

      <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
        <Icon size={18} />
      </span>
    </header>
  );
}

function SummaryMetric({
  label,
  value,
  detail,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  color: string;
  icon: typeof BarChart3;
}) {
  return (
    <div className="rounded-[16px] border border-white/[0.08] bg-[#07111F]/55 p-5">
      <Icon size={17} style={{ color }} />

      <p className="mt-4 text-sm text-[#B8C5D4]">{label}</p>

      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold" style={{ color }}>
        {detail}
      </p>
    </div>
  );
}

function ReadingRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-[12px] border border-white/[0.07] bg-[#07111F]/45 px-4 py-3">
      <span className="text-sm text-[#B8C5D4]">{label}</span>
      <span className="text-sm font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function MaturityRow({
  name,
  score,
  confidence,
  status,
  evidence,
}: {
  name: string;
  score: number;
  confidence: string;
  status: string;
  evidence: string;
}) {
  const color =
    score < 35 ? "#FF5D73" : score < 60 ? "#F5A623" : "#24D27C";

  return (
    <div className="p-6">
      <div className="grid gap-5 md:grid-cols-[1fr_170px] md:items-center">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{name}</h3>
              <p className="mt-1 text-sm text-[#AEBCCC]">{status}</p>
            </div>

            <span className="text-xl font-semibold" style={{ color }}>
              {score}/100
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${score}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MiniInfo label="Confidenza" value={confidence} />
          <MiniInfo label="Copertura" value={evidence} />
        </div>
      </div>
    </div>
  );
}

function MiniInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[11px] border border-white/[0.07] bg-[#07111F]/45 p-3">
      <p className="text-xs text-[#AEBCCC]">{label}</p>
      <p className="mt-1 text-xs font-semibold">{value}</p>
    </div>
  );
}

function ConfidenceItem({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  icon: typeof CheckCircle2;
  color: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-[12px]"
        style={{
          color,
          backgroundColor: `${color}12`,
        }}
      >
        <Icon size={16} />
      </span>

      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#B8C5D4]">
          {description}
        </p>
      </div>
    </div>
  );
}

function PriorityCard({
  level,
  title,
  description,
  impact,
  confidence,
  source,
}: {
  level: string;
  title: string;
  description: string;
  impact: string;
  confidence: string;
  source: string;
}) {
  return (
    <article className="p-6">
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 text-sm font-semibold text-[#FF9A64]">
          {level}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold">{title}</h3>

          <p className="mt-3 text-sm leading-7 text-[#C8D4E1]">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <InfoBadge label={`Impatto: ${impact}`} color="#FF6B1A" />
            <InfoBadge label={`Confidenza: ${confidence}`} color="#2492E8" />
            <InfoBadge label={source} color="#6D4FD2" />
          </div>
        </div>
      </div>
    </article>
  );
}

function OpportunityCard({
  title,
  description,
  horizon,
  owner,
}: {
  title: string;
  description: string;
  horizon: string;
  owner: string;
}) {
  return (
    <article className="group p-6 transition hover:bg-white/[0.025]">
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-[#24D27C]/20 bg-[#24D27C]/10 text-[#8AF0BA]">
          <Lightbulb size={17} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base font-semibold">{title}</h3>
            <ChevronRight
              size={16}
              className="shrink-0 text-[#71839B] transition group-hover:translate-x-1 group-hover:text-white"
            />
          </div>

          <p className="mt-3 text-sm leading-7 text-[#C8D4E1]">
            {description}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MiniInfo label="Orizzonte" value={horizon} />
            <MiniInfo label="Responsabile" value={owner} />
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoBadge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      className="rounded-full border px-3 py-1.5 text-xs font-semibold"
      style={{
        color,
        borderColor: `${color}35`,
        backgroundColor: `${color}12`,
      }}
    >
      {label}
    </span>
  );
}

function EvidenceRow({
  name,
  type,
  status,
  records,
  confidence,
}: {
  name: string;
  type: string;
  status: string;
  records: string;
  confidence: string;
}) {
  const statusColor =
    status === "Disponibile"
      ? "#24D27C"
      : status === "Non collegata"
        ? "#FF5D73"
        : "#F5A623";

  return (
    <div className="grid gap-3 px-6 py-5 md:grid-cols-[1.15fr_0.8fr_0.65fr_0.55fr_0.55fr] md:items-center">
      <span className="text-sm font-semibold">{name}</span>
      <span className="text-sm text-[#C8D4E1]">{type}</span>

      <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: statusColor }}>
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
        {status}
      </span>

      <span className="text-sm text-[#C8D4E1]">{records}</span>
      <span className="text-sm font-semibold">{confidence}</span>
    </div>
  );
}
