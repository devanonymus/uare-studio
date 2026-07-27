"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  LayoutGrid,
  Lightbulb,
  LockKeyhole,
  Mail,
  Printer,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
  Workflow,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { QuickAuditResult } from "@/types/quick-audit";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

const AUDIT_KEY = "uare-quick-audit-result";
const PLAN_KEY = "uviq:growth-plan";

type DocumentStatus =
  | "draft"
  | "review"
  | "approved";

type SavedPlan = {
  services?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    selected: boolean;
    approved: boolean;
    owner: string;
    phase: "0-30" | "31-60" | "61-90";
  }>;
  discount?: number;
  status?: DocumentStatus;
};

function euro(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ClientReportView() {
  const [audit, setAudit] =
    useState<QuickAuditResult | null>(null);

  const [plan, setPlan] =
    useState<SavedPlan | null>(null);

  const [status, setStatus] =
    useState<DocumentStatus>("draft");

  const [savedAt, setSavedAt] =
    useState<string | null>(null);

  const [missingData, setMissingData] =
    useState(false);

  useEffect(() => {
    try {
      const storedAudit =
        window.localStorage.getItem(AUDIT_KEY);

      const storedPlan =
        window.localStorage.getItem(PLAN_KEY);

      if (!storedAudit) {
        setMissingData(true);
        return;
      }

      const parsedAudit =
        JSON.parse(
          storedAudit,
        ) as QuickAuditResult;

      setAudit(parsedAudit);

      if (storedPlan) {
        const parsedPlan =
          JSON.parse(
            storedPlan,
          ) as SavedPlan;

        setPlan(parsedPlan);
        setStatus(
          parsedPlan.status ?? "draft",
        );
      }
    } catch {
      setMissingData(true);
    }
  }, []);

  useEffect(() => {
    if (!audit) {
      return;
    }

    const timer = window.setTimeout(() => {
      window.localStorage.setItem(
        "uviq:report-status",
        JSON.stringify({
          status,
          updatedAt:
            new Date().toISOString(),
        }),
      );

      setSavedAt(
        new Intl.DateTimeFormat("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    }, 350);

    return () =>
      window.clearTimeout(timer);
  }, [audit, status]);

  const approvedServices = useMemo(
    () =>
      plan?.services?.filter(
        (service) =>
          service.selected &&
          service.approved,
      ) ?? [],
    [plan],
  );

  const selectedServices = useMemo(
    () =>
      plan?.services?.filter(
        (service) =>
          service.selected,
      ) ?? [],
    [plan],
  );

  const subtotal = useMemo(
    () =>
      selectedServices.reduce(
        (total, service) =>
          total + service.price,
        0,
      ),
    [selectedServices],
  );

  const discount =
    plan?.discount ?? 0;

  const discountAmount =
    Math.round(
      subtotal *
        (discount / 100),
    );

  const total =
    subtotal - discountAmount;

  const deposit =
    Math.round(total * 0.4);

  const balance =
    total - deposit;

  function printReport() {
    window.print();
  }

  if (missingData) {
    return <MissingReportData />;
  }

  if (!audit) {
    return <ReportLoading />;
  }

  const companyName =
    audit.input.restaurantName ||
    "Azienda analizzata";

  const city =
    audit.input.city || "";

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl print:hidden">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/growth-plan"
                className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C3CEDB] transition hover:border-[#2492E8]/35 hover:bg-white/[0.06] hover:text-white"
                aria-label="Torna al Growth Plan"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                <FileText size={18} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em]">
                    Client Report
                  </h1>

                  <DocumentStatusBadge
                    status={status}
                  />
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Analisi, roadmap e proposta economica.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 text-sm text-[#B8C5D4] md:inline-flex">
                <Save
                  size={14}
                  className="text-[#24D27C]"
                />
                {savedAt
                  ? `Salvato alle ${savedAt}`
                  : "Salvataggio automatico"}
              </span>

              <button
                type="button"
                onClick={printReport}
                className="hidden min-h-11 items-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold transition hover:border-[#2492E8]/35 hover:bg-white/[0.06] sm:inline-flex"
              >
                <Printer size={15} />
                Stampa / PDF
              </button>

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

        <section className="relative overflow-hidden px-5 pb-24 pt-8 lg:px-8 xl:px-10 print:px-0 print:py-0">
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#2492E8]/[0.05] blur-[160px] print:hidden" />
          <div className="pointer-events-none absolute bottom-[-20rem] left-1/4 size-[38rem] rounded-full bg-[#FF6B1A]/[0.04] blur-[170px] print:hidden" />

          <div className="relative mx-auto max-w-[1480px]">
            <section className="grid gap-5 xl:grid-cols-[1fr_360px] print:block">
              <article className="overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#0B1628] print:border-0 print:bg-white print:text-black">
                <ReportCover
                  audit={audit}
                  companyName={companyName}
                  city={city}
                />

                <div className="space-y-6 p-7 md:p-10 print:p-8">
                  <ReportSection
                    number="01"
                    eyebrow="Executive summary"
                    title="Sintesi direzionale"
                    icon={TrendingUp}
                  >
                    <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
                      <div className="rounded-[17px] border border-white/[0.08] bg-[#07111F]/55 p-6 print:border-[#D8DEE8] print:bg-white">
                        <p className="text-base leading-8 text-[#D6DFE9] print:text-[#253247]">
                          {audit.executiveSummary}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        <ReportMetric
                          label="Score complessivo"
                          value={`${audit.overallScore}/100`}
                          color="#F5A623"
                        />

                        <ReportMetric
                          label="Analisi"
                          value={
                            audit.demoAnalysis
                              ? "Dimostrativa"
                              : "Operativa"
                          }
                          color="#2492E8"
                        />

                        <ReportMetric
                          label="Interventi selezionati"
                          value={`${selectedServices.length}`}
                          color="#24D27C"
                        />
                      </div>
                    </div>
                  </ReportSection>

                  <ReportSection
                    number="02"
                    eyebrow="Strategic diagnosis"
                    title="Criticità e opportunità"
                    icon={Target}
                  >
                    <div className="grid gap-5 lg:grid-cols-2">
                      <ReportListCard
                        title="Criticità prioritarie"
                        icon={AlertTriangle}
                        color="#FF6B1A"
                        items={
                          audit.criticalFindings
                        }
                      />

                      <ReportListCard
                        title="Opportunità rilevate"
                        icon={Lightbulb}
                        color="#24D27C"
                        items={
                          audit.opportunities
                        }
                      />
                    </div>
                  </ReportSection>

                  <ReportSection
                    number="03"
                    eyebrow="Digital maturity"
                    title="Valutazione per area"
                    icon={BarChart3}
                  >
                    <div className="space-y-4">
                      {audit.areas.map(
                        (area) => (
                          <AreaRow
                            key={area.id}
                            label={area.label}
                            score={area.score}
                            status={area.status}
                            summary={area.summary}
                          />
                        ),
                      )}
                    </div>
                  </ReportSection>

                  <ReportSection
                    number="04"
                    eyebrow="90-day roadmap"
                    title="Piano operativo"
                    icon={Workflow}
                  >
                    {selectedServices.length > 0 ? (
                      <div className="grid gap-5 lg:grid-cols-3">
                        {(
                          [
                            "0-30",
                            "31-60",
                            "61-90",
                          ] as const
                        ).map((phase) => (
                          <RoadmapColumn
                            key={phase}
                            phase={phase}
                            services={selectedServices.filter(
                              (service) =>
                                service.phase ===
                                phase,
                            )}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyReportBlock
                        title="Roadmap non disponibile"
                        description="Approva almeno un intervento nel Growth Plan per inserirlo nel documento."
                      />
                    )}
                  </ReportSection>

                  <ReportSection
                    number="05"
                    eyebrow="Investment proposal"
                    title="Proposta economica"
                    icon={WalletCards}
                  >
                    <div className="grid gap-5 xl:grid-cols-[1fr_350px]">
                      <div>
                        {approvedServices.length >
                        0 ? (
                          <div className="divide-y divide-white/[0.065] overflow-hidden rounded-[18px] border border-white/[0.08] print:border-[#D8DEE8]">
                            {approvedServices.map(
                              (service) => (
                                <div
                                  key={
                                    service.id
                                  }
                                  className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto] md:items-center"
                                >
                                  <div>
                                    <p className="text-sm font-semibold">
                                      {
                                        service.name
                                      }
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-[#B8C5D4] print:text-[#536174]">
                                      {
                                        service.description
                                      }
                                    </p>

                                    <p className="mt-2 text-xs text-[#79C6F5] print:text-[#226DA8]">
                                      {
                                        service.owner
                                      }{" "}
                                      ·{" "}
                                      {
                                        service.phase
                                      }{" "}
                                      giorni
                                    </p>
                                  </div>

                                  <p className="text-base font-semibold">
                                    {euro(
                                      service.price,
                                    )}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <EmptyReportBlock
                            title="Nessun intervento approvato"
                            description="La proposta economica definitiva richiede almeno un’attività approvata."
                          />
                        )}
                      </div>

                      <InvestmentSummary
                        subtotal={subtotal}
                        discount={discount}
                        discountAmount={discountAmount}
                        total={total}
                        deposit={deposit}
                        balance={balance}
                      />
                    </div>
                  </ReportSection>

                  <ReportSection
                    number="06"
                    eyebrow="Reliability"
                    title="Limiti e trasparenza"
                    icon={ShieldCheck}
                  >
                    <div className="grid gap-4 md:grid-cols-3">
                      <TransparencyCard
                        title="Dati verificati"
                        description="Le informazioni disponibili derivano dalle fonti e dai dati inseriti nel progetto."
                        color="#24D27C"
                      />

                      <TransparencyCard
                        title="Dati dimostrativi"
                        description="Score e alcune conclusioni restano dimostrativi finché il motore AI non è collegato."
                        color="#F5A623"
                      />

                      <TransparencyCard
                        title="Dati mancanti"
                        description="CRM, campagne e risultati commerciali non sono ancora integrati."
                        color="#FF5D73"
                      />
                    </div>
                  </ReportSection>

                  <section className="rounded-[20px] border border-white/[0.09] bg-[#162D4F] p-7 print:border-[#D8DEE8] print:bg-[#F3F6FA]">
                    <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5] print:text-[#226DA8]">
                          Decisione richiesta
                        </p>

                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                          Conferma il perimetro del progetto.
                        </h2>

                        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#D1DBE7] print:text-[#536174]">
                          Dopo l’approvazione sarà possibile trasformare
                          il documento in proposta contrattuale e avviare
                          le attività operative.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row print:hidden">
                        <button
                          type="button"
                          onClick={() =>
                            setStatus(
                              "review",
                            )
                          }
                          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] border border-white/[0.12] bg-white/[0.04] px-6 text-sm font-semibold transition hover:bg-white/[0.07]"
                        >
                          <Eye size={15} />
                          Segna in revisione
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setStatus(
                              "approved",
                            )
                          }
                          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-6 text-sm font-semibold transition hover:bg-[#FF7D34]"
                        >
                          <CheckCircle2 size={16} />
                          Approva documento
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </article>

              <aside className="space-y-4 xl:sticky xl:top-[108px] xl:self-start print:hidden">
                <ReportControlPanel
                  status={status}
                  setStatus={setStatus}
                  printReport={printReport}
                  approvedServices={
                    approvedServices.length
                  }
                />

                <article className="rounded-[18px] border border-white/[0.09] bg-[#0B1628] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    Document checklist
                  </p>

                  <div className="mt-4 space-y-3">
                    <ChecklistRow
                      label="Audit disponibile"
                      completed
                    />

                    <ChecklistRow
                      label="Growth Plan presente"
                      completed={
                        selectedServices.length >
                        0
                      }
                    />

                    <ChecklistRow
                      label="Interventi approvati"
                      completed={
                        approvedServices.length >
                        0
                      }
                    />

                    <ChecklistRow
                      label="Documento approvato"
                      completed={
                        status === "approved"
                      }
                    />
                  </div>
                </article>

                <article className="rounded-[18px] border border-[#24D27C]/18 bg-[#24D27C]/[0.045] p-5">
                  <div className="flex items-start gap-4">
                    <LockKeyhole
                      size={18}
                      className="mt-0.5 shrink-0 text-[#8AF0BA]"
                    />

                    <div>
                      <h3 className="text-sm font-semibold">
                        Documento privato
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#C8D4E1]">
                        La pagina non invia automaticamente email,
                        preventivi o contratti.
                      </p>
                    </div>
                  </div>
                </article>
              </aside>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function ReportCover({
  audit,
  companyName,
  city,
}: {
  audit: QuickAuditResult;
  companyName: string;
  city: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/[0.08] bg-[#162D4F] px-7 py-10 md:px-10 md:py-14 print:border-[#D8DEE8] print:bg-white">
      <div className="pointer-events-none absolute -right-36 -top-48 size-[30rem] rounded-full bg-[#FF6B1A]/20 blur-[110px] print:hidden" />

      <div className="relative">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#2492E8]/25 bg-[#2492E8]/10 px-3 py-1.5 text-xs font-semibold text-[#79C6F5] print:border-[#B8D9EF] print:text-[#226DA8]">
                UVIQ Client Report
              </span>

              <span className="font-mono text-xs text-[#B8C5D4] print:text-[#536174]">
                {audit.auditCode}
              </span>
            </div>

            <h1 className="mt-7 max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-6xl">
              Analisi e piano
              <span className="block text-[#FF6B1A]">
                di crescita digitale.
              </span>
            </h1>

            <p className="mt-6 text-lg font-semibold">
              {companyName}
              {city
                ? ` · ${city}`
                : ""}
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#D1DBE7] print:text-[#536174]">
              Documento strategico contenente analisi,
              criticità, opportunità, roadmap e proposta
              economica preliminare.
            </p>
          </div>

          <div className="grid min-w-[230px] gap-3">
            <CoverMeta
              label="Generato"
              value={new Intl.DateTimeFormat(
                "it-IT",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                },
              ).format(
                new Date(
                  audit.generatedAt,
                ),
              )}
            />

            <CoverMeta
              label="Modalità"
              value={
                audit.demoAnalysis
                  ? "Analisi dimostrativa"
                  : "Analisi operativa"
              }
            />

            <CoverMeta
              label="Riservatezza"
              value="Uso interno / cliente"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function ReportSection({
  number,
  eyebrow,
  title,
  icon: Icon,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-white/[0.08] bg-[#091321]/65 p-6 md:p-7 print:border-[#D8DEE8] print:bg-white">
      <header className="mb-6 flex items-start justify-between gap-5 border-b border-white/[0.07] pb-5 print:border-[#D8DEE8]">
        <div className="flex items-start gap-4">
          <span className="font-mono text-sm font-semibold text-[#FF8A4A]">
            {number}
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5] print:text-[#226DA8]">
              {eyebrow}
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              {title}
            </h2>
          </div>
        </div>

        <Icon
          size={19}
          className="shrink-0 text-[#AEBCCC]"
        />
      </header>

      {children}
    </section>
  );
}

function ReportControlPanel({
  status,
  setStatus,
  printReport,
  approvedServices,
}: {
  status: DocumentStatus;
  setStatus: (
    status: DocumentStatus,
  ) => void;
  printReport: () => void;
  approvedServices: number;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#0B1628]">
      <header className="border-b border-white/[0.08] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
          Report control
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Gestione documento
        </h2>
      </header>

      <div className="p-5">
        <div className="space-y-2">
          <ControlStatus
            label="Bozza"
            active={status === "draft"}
            onClick={() =>
              setStatus("draft")
            }
          />

          <ControlStatus
            label="In revisione"
            active={status === "review"}
            onClick={() =>
              setStatus("review")
            }
          />

          <ControlStatus
            label="Approvato"
            active={
              status === "approved"
            }
            onClick={() =>
              setStatus("approved")
            }
          />
        </div>

        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={printReport}
            className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] border border-white/[0.1] bg-white/[0.035] text-sm font-semibold transition hover:bg-white/[0.07]"
          >
            <Download size={15} />
            Esporta PDF
          </button>

          <button
            type="button"
            disabled={
              status !== "approved" ||
              approvedServices === 0
            }
            className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] bg-[#FF6B1A] text-sm font-semibold transition hover:bg-[#FF7D34] disabled:cursor-not-allowed disabled:bg-[#56301F] disabled:text-[#AEBCCC]"
          >
            <Send size={15} />
            Invia al cliente
          </button>
        </div>

        <p className="mt-4 text-xs leading-5 text-[#AEBCCC]">
          L’invio sarà collegato successivamente a email,
          CRM e firma digitale.
        </p>
      </div>
    </article>
  );
}

function AreaRow({
  label,
  score,
  status,
  summary,
}: {
  label: string;
  score: number;
  status: string;
  summary: string;
}) {
  const color =
    score < 40
      ? "#FF5D73"
      : score < 65
        ? "#F5A623"
        : "#24D27C";

  return (
    <div className="rounded-[15px] border border-white/[0.07] bg-[#07111F]/45 p-5 print:border-[#D8DEE8] print:bg-white">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-semibold">
            {label}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#B8C5D4] print:text-[#536174]">
            {summary}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p
            className="text-2xl font-semibold"
            style={{
              color,
            }}
          >
            {score}/100
          </p>

          <p className="mt-1 text-xs text-[#AEBCCC] print:text-[#536174]">
            {status}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06] print:bg-[#E7EBF0]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function RoadmapColumn({
  phase,
  services,
}: {
  phase: "0-30" | "31-60" | "61-90";
  services: Array<{
    id: string;
    name: string;
    owner: string;
    approved: boolean;
  }>;
}) {
  const meta = {
    "0-30": {
      title: "Fondamenta",
      color: "#FF6B1A",
    },
    "31-60": {
      title: "Attivazione",
      color: "#2492E8",
    },
    "61-90": {
      title: "Ottimizzazione",
      color: "#24D27C",
    },
  }[phase];

  return (
    <article className="rounded-[16px] border border-white/[0.08] bg-[#07111F]/45 p-5 print:border-[#D8DEE8] print:bg-white">
      <p
        className="text-xs font-semibold uppercase tracking-[0.1em]"
        style={{
          color: meta.color,
        }}
      >
        {phase} giorni
      </p>

      <h3 className="mt-2 text-lg font-semibold">
        {meta.title}
      </h3>

      <div className="mt-5 space-y-3">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="rounded-[11px] border border-white/[0.07] bg-white/[0.025] p-3 print:border-[#D8DEE8]"
            >
              <p className="text-sm font-semibold">
                {service.name}
              </p>

              <p className="mt-1 text-xs text-[#AEBCCC] print:text-[#536174]">
                {service.owner}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#AEBCCC] print:text-[#536174]">
            Nessuna attività prevista.
          </p>
        )}
      </div>
    </article>
  );
}

function InvestmentSummary({
  subtotal,
  discount,
  discountAmount,
  total,
  deposit,
  balance,
}: {
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  deposit: number;
  balance: number;
}) {
  return (
    <article className="rounded-[18px] border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.07] p-6 print:border-[#F2C7AE] print:bg-[#FFF7F2]">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#FF9A64]">
        Totale proposta
      </p>

      <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
        {euro(total)}
      </p>

      <div className="mt-6 space-y-3">
        <PriceRow
          label="Subtotale"
          value={euro(subtotal)}
        />

        <PriceRow
          label={`Sconto ${discount}%`}
          value={
            discountAmount > 0
              ? `− ${euro(
                  discountAmount,
                )}`
              : euro(0)
          }
        />

        <PriceRow
          label="Acconto 40%"
          value={euro(deposit)}
        />

        <PriceRow
          label="Saldo"
          value={euro(balance)}
        />
      </div>

      <p className="mt-5 text-xs leading-5 text-[#C8D4E1] print:text-[#536174]">
        Importi indicativi, al netto di budget ADV,
        licenze, API e servizi esterni.
      </p>
    </article>
  );
}

function ReportListCard({
  title,
  items,
  icon: Icon,
  color,
}: {
  title: string;
  items: string[];
  icon: typeof AlertTriangle;
  color: string;
}) {
  return (
    <article className="rounded-[17px] border border-white/[0.08] bg-[#07111F]/45 p-5 print:border-[#D8DEE8] print:bg-white">
      <div className="flex items-center gap-3">
        <Icon
          size={17}
          style={{
            color,
          }}
        />

        <h3 className="text-base font-semibold">
          {title}
        </h3>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 text-sm leading-6 text-[#D1DBE7] print:text-[#253247]"
          >
            <span
              className="mt-2 size-1.5 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  color,
              }}
            />
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}

function TransparencyCard({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) {
  return (
    <article className="rounded-[15px] border border-white/[0.08] bg-[#07111F]/45 p-5 print:border-[#D8DEE8] print:bg-white">
      <span
        className="block h-1 w-10 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      <h3 className="mt-5 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#B8C5D4] print:text-[#536174]">
        {description}
      </p>
    </article>
  );
}

function CoverMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[13px] border border-white/[0.1] bg-[#07111F]/35 px-4 py-3 print:border-[#D8DEE8] print:bg-white">
      <p className="text-xs text-[#AEBCCC] print:text-[#536174]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function ReportMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-[13px] border border-white/[0.08] bg-[#07111F]/45 p-4 print:border-[#D8DEE8] print:bg-white">
      <p className="text-xs text-[#AEBCCC] print:text-[#536174]">
        {label}
      </p>

      <p
        className="mt-2 text-lg font-semibold"
        style={{
          color,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function ControlStatus({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 w-full items-center gap-3 rounded-[11px] border px-4 text-left text-sm font-semibold transition ${
        active
          ? "border-[#2492E8]/35 bg-[#2492E8]/10"
          : "border-white/[0.07] bg-[#07111F]/45 hover:border-white/[0.14]"
      }`}
    >
      <span
        className={`flex size-5 items-center justify-center rounded-full border ${
          active
            ? "border-[#2492E8] bg-[#2492E8]"
            : "border-white/[0.14]"
        }`}
      >
        {active && (
          <Check size={11} />
        )}
      </span>

      {label}
    </button>
  );
}

function ChecklistRow({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[11px] border border-white/[0.07] bg-[#07111F]/45 px-3 py-3">
      <span
        className={`flex size-5 items-center justify-center rounded-full ${
          completed
            ? "bg-[#24D27C] text-[#07111F]"
            : "border border-white/[0.14] text-transparent"
        }`}
      >
        <Check size={11} />
      </span>

      <span className="text-sm text-[#D1DBE7]">
        {label}
      </span>
    </div>
  );
}

function PriceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/[0.08] pb-3 text-sm last:border-0 last:pb-0 print:border-[#E3D2C8]">
      <span className="text-[#C8D4E1] print:text-[#536174]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

function EmptyReportBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[16px] border border-[#F5A623]/20 bg-[#F5A623]/[0.06] p-6">
      <AlertTriangle
        size={20}
        className="text-[#F8C867]"
      />

      <h3 className="mt-4 text-base font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#C8D4E1]">
        {description}
      </p>
    </div>
  );
}

function DocumentStatusBadge({
  status,
}: {
  status: DocumentStatus;
}) {
  const meta = {
    draft: {
      label: "Bozza",
      color: "#F5A623",
    },
    review: {
      label: "In revisione",
      color: "#2492E8",
    },
    approved: {
      label: "Approvato",
      color: "#24D27C",
    },
  }[status];

  return (
    <span
      className="rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        color: meta.color,
        borderColor: `${meta.color}35`,
        backgroundColor: `${meta.color}12`,
      }}
    >
      {meta.label}
    </span>
  );
}

function MissingReportData() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111F] px-5 text-white">
      <section className="max-w-xl rounded-[24px] border border-white/[0.09] bg-[#0B1628] p-8 text-center md:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-[16px] border border-[#F5A623]/20 bg-[#F5A623]/10 text-[#F8C867]">
          <AlertTriangle size={23} />
        </span>

        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
          Dati insufficienti
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#B8C5D4]">
          Prima di preparare un report devi completare
          almeno un audit. Il Growth Plan è consigliato
          per includere roadmap e proposta economica.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/audits/new"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-6 text-sm font-semibold transition hover:bg-[#FF7D34]"
          >
            Avvia audit
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center rounded-[13px] border border-white/[0.1] bg-white/[0.035] px-6 text-sm font-semibold"
          >
            Mission Control
          </Link>
        </div>
      </section>
    </main>
  );
}

function ReportLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111F] text-white">
      <div className="text-center">
        <FileText
          size={26}
          className="mx-auto animate-pulse text-[#79C6F5]"
        />

        <p className="mt-4 text-sm text-[#B8C5D4]">
          Preparazione del report…
        </p>
      </div>
    </main>
  );
}
