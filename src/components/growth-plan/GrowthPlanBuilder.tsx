"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  FileText,
  Flag,
  LayoutGrid,
  Minus,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WalletCards,
  Workflow,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  QuickAuditResult,
  RecommendedService,
} from "@/types/quick-audit";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

const RESULT_KEY = "uare-quick-audit-result";
const PLAN_KEY = "uviq:growth-plan";

type PlanStatus =
  | "draft"
  | "review"
  | "approved";

type EditableService = RecommendedService & {
  price: number;
  owner: string;
  phase: "0-30" | "31-60" | "61-90";
  approved: boolean;
};

const phaseMeta = {
  "0-30": {
    title: "Fondamenta",
    period: "0–30 giorni",
    description:
      "Correzioni urgenti, misurazione e preparazione dei processi.",
    color: "#FF6B1A",
  },
  "31-60": {
    title: "Attivazione",
    period: "31–60 giorni",
    description:
      "Contenuti, funnel, CRM e prime automazioni operative.",
    color: "#2492E8",
  },
  "61-90": {
    title: "Ottimizzazione",
    period: "61–90 giorni",
    description:
      "Campagne, miglioramento KPI e crescita continuativa.",
    color: "#24D27C",
  },
};

const ownerOptions = [
  "UVIQ Strategy",
  "Content Team",
  "Development Team",
  "Automation Team",
  "Advertising Team",
  "Cliente",
];

function euro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function priorityLabel(priority: number): string {
  if (priority === 5) return "Immediata";
  if (priority === 4) return "Alta";
  if (priority === 3) return "Strategica";
  if (priority === 2) return "Secondaria";
  return "Opzionale";
}

function phaseFromPriority(
  priority: number,
): EditableService["phase"] {
  if (priority >= 4) return "0-30";
  if (priority === 3) return "31-60";
  return "61-90";
}

function defaultOwner(
  service: RecommendedService,
): string {
  const text =
    `${service.name} ${service.description}`.toLowerCase();

  if (
    text.includes("sito") ||
    text.includes("landing") ||
    text.includes("menu")
  ) {
    return "Development Team";
  }

  if (
    text.includes("social") ||
    text.includes("contenut") ||
    text.includes("video")
  ) {
    return "Content Team";
  }

  if (
    text.includes("crm") ||
    text.includes("automat") ||
    text.includes("whatsapp")
  ) {
    return "Automation Team";
  }

  if (
    text.includes("ads") ||
    text.includes("campagn")
  ) {
    return "Advertising Team";
  }

  return "UVIQ Strategy";
}

export function GrowthPlanBuilder() {
  const [result, setResult] =
    useState<QuickAuditResult | null>(null);

  const [services, setServices] =
    useState<EditableService[]>([]);

  const [discount, setDiscount] =
    useState(0);

  const [planStatus, setPlanStatus] =
    useState<PlanStatus>("draft");

  const [savedAt, setSavedAt] =
    useState<string | null>(null);

  const [missingResult, setMissingResult] =
    useState(false);

  useEffect(() => {
    const stored =
      window.localStorage.getItem(RESULT_KEY);

    if (!stored) {
      setMissingResult(true);
      return;
    }

    try {
      const parsed =
        JSON.parse(stored) as QuickAuditResult;

      setResult(parsed);

      const storedPlan =
        window.localStorage.getItem(PLAN_KEY);

      if (storedPlan) {
        const parsedPlan = JSON.parse(
          storedPlan,
        ) as {
          services?: EditableService[];
          discount?: number;
          status?: PlanStatus;
        };

        if (parsedPlan.services?.length) {
          setServices(parsedPlan.services);
          setDiscount(
            parsedPlan.discount ?? 0,
          );
          setPlanStatus(
            parsedPlan.status ?? "draft",
          );
          return;
        }
      }

      setServices(
        parsed.services.map((service) => ({
          ...service,
          price: service.priceFrom,
          phase: phaseFromPriority(
            service.priority,
          ),
          owner: defaultOwner(service),
          approved: false,
        })),
      );
    } catch {
      setMissingResult(true);
    }
  }, []);

  useEffect(() => {
    if (!result || services.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      window.localStorage.setItem(
        PLAN_KEY,
        JSON.stringify({
          services,
          discount,
          status: planStatus,
          updatedAt: new Date().toISOString(),
        }),
      );

      setSavedAt(
        new Intl.DateTimeFormat("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    }, 450);

    return () =>
      window.clearTimeout(timer);
  }, [
    discount,
    planStatus,
    result,
    services,
  ]);

  const selectedServices = useMemo(
    () =>
      services.filter(
        (service) => service.selected,
      ),
    [services],
  );

  const approvedServices = useMemo(
    () =>
      selectedServices.filter(
        (service) => service.approved,
      ),
    [selectedServices],
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

  const discountAmount = Math.round(
    subtotal * (discount / 100),
  );

  const total =
    subtotal - discountAmount;

  const deposit = Math.round(
    total * 0.4,
  );

  const balance = total - deposit;

  const approvalProgress =
    selectedServices.length > 0
      ? Math.round(
          (approvedServices.length /
            selectedServices.length) *
            100,
        )
      : 0;

  function updateService(
    id: string,
    patch: Partial<EditableService>,
  ) {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? {
              ...service,
              ...patch,
            }
          : service,
      ),
    );
  }

  function toggleService(id: string) {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? {
              ...service,
              selected: !service.selected,
              approved: service.selected
                ? false
                : service.approved,
            }
          : service,
      ),
    );
  }

  function updatePrice(
    id: string,
    variation: number,
  ) {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? {
              ...service,
              price: Math.max(
                100,
                service.price + variation,
              ),
            }
          : service,
      ),
    );
  }

  if (missingResult) {
    return <MissingAudit />;
  }

  if (!result) {
    return <GrowthPlanLoading />;
  }

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/audits/analysis"
                className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C3CEDB] transition hover:border-[#2492E8]/35 hover:bg-white/[0.06] hover:text-white"
                aria-label="Torna al Business Twin"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 text-[#FF9A64]">
                <TrendingUp size={18} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em]">
                    Growth Plan
                  </h1>

                  <PlanStatusBadge
                    status={planStatus}
                  />
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Roadmap, responsabilità e investimento.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="inline-flex items-center gap-2 text-sm text-[#B8C5D4]">
                <Save
                  size={14}
                  className="text-[#24D27C]"
                />
                {savedAt
                  ? `Salvato alle ${savedAt}`
                  : "Salvataggio automatico"}
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
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#FF6B1A]/[0.05] blur-[160px]" />
          <div className="pointer-events-none absolute bottom-[-20rem] left-1/4 size-[38rem] rounded-full bg-[#2492E8]/[0.04] blur-[170px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-[#F5A623]/20 bg-[#F5A623]/[0.07] px-3 py-1.5 text-xs font-semibold text-[#F8C867]">
                    Piano da validare
                  </span>

                  <span className="text-sm text-[#AEBCCC]">
                    Basato sull’audit dimostrativo {result.auditCode}
                  </span>
                </div>

                <h2 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] md:text-5xl">
                  Dalla diagnosi
                  <span className="block text-[#FF6B1A]">
                    a un piano eseguibile.
                  </span>
                </h2>

                <p className="mt-5 max-w-4xl text-base leading-8 text-[#CBD6E2]">
                  Seleziona gli interventi, assegna responsabilità,
                  definisci tempi e approva soltanto le attività
                  coerenti con obiettivi e budget reali.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-4">
                  <HeroMetric
                    label="Score audit"
                    value={`${result.overallScore}/100`}
                    color="#F5A623"
                    icon={BarChart3}
                  />

                  <HeroMetric
                    label="Interventi"
                    value={`${selectedServices.length}`}
                    color="#2492E8"
                    icon={Workflow}
                  />

                  <HeroMetric
                    label="Approvati"
                    value={`${approvedServices.length}`}
                    color="#24D27C"
                    icon={CheckCircle2}
                  />

                  <HeroMetric
                    label="Investimento"
                    value={euro(total)}
                    color="#FF6B1A"
                    icon={WalletCards}
                  />
                </div>
              </article>

              <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                  Piano di approvazione
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  Stato operativo
                </h2>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#B8C5D4]">
                      Interventi approvati
                    </span>

                    <span className="font-semibold">
                      {approvalProgress}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#24D27C] transition-all"
                      style={{
                        width: `${approvalProgress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <StatusOption
                    active={
                      planStatus === "draft"
                    }
                    label="Bozza"
                    description="Il piano è ancora modificabile."
                    onClick={() =>
                      setPlanStatus("draft")
                    }
                  />

                  <StatusOption
                    active={
                      planStatus === "review"
                    }
                    label="In revisione"
                    description="Il piano è pronto per il confronto."
                    onClick={() =>
                      setPlanStatus("review")
                    }
                  />

                  <StatusOption
                    active={
                      planStatus === "approved"
                    }
                    label="Approvato"
                    description="Le attività possono passare alla proposta."
                    onClick={() =>
                      setPlanStatus("approved")
                    }
                  />
                </div>

                <Link
                  href="/reports"
                  className={`group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[13px] px-5 text-sm font-semibold transition ${
                    planStatus === "approved"
                      ? "bg-[#FF6B1A] text-white hover:bg-[#FF7D34]"
                      : "pointer-events-none bg-[#56301F] text-[#AEBCCC]"
                  }`}
                >
                  Prepara la proposta
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </article>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_390px]">
              <div className="space-y-5">
                {(
                  [
                    "0-30",
                    "31-60",
                    "61-90",
                  ] as const
                ).map((phase) => (
                  <RoadmapPhase
                    key={phase}
                    phase={phase}
                    services={services.filter(
                      (service) =>
                        service.phase === phase,
                    )}
                    toggleService={toggleService}
                    updatePrice={updatePrice}
                    updateService={updateService}
                  />
                ))}
              </div>

              <aside className="space-y-4 xl:sticky xl:top-[108px] xl:self-start">
                <InvestmentPanel
                  subtotal={subtotal}
                  discount={discount}
                  setDiscount={setDiscount}
                  discountAmount={discountAmount}
                  total={total}
                  deposit={deposit}
                  balance={balance}
                />

                <article className="rounded-[18px] border border-[#2492E8]/18 bg-[#2492E8]/[0.045] p-5">
                  <div className="flex items-start gap-4">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-[#79C6F5]"
                    />

                    <div>
                      <h3 className="text-sm font-semibold">
                        Controllo del piano
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#C8D4E1]">
                        Prezzi, tempi e attività sono indicativi
                        finché non vengono verificati con il cliente
                        e con il team operativo.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-[18px] border border-white/[0.08] bg-[#0B1628] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    KPI suggeriti
                  </p>

                  <div className="mt-4 space-y-3">
                    <KpiRow
                      label="Lead qualificati"
                      target="Da definire"
                    />

                    <KpiRow
                      label="Conversion rate"
                      target="Da misurare"
                    />

                    <KpiRow
                      label="Costo acquisizione"
                      target="Da validare"
                    />

                    <KpiRow
                      label="Clienti ricorrenti"
                      target="Da collegare"
                    />
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

function RoadmapPhase({
  phase,
  services,
  toggleService,
  updatePrice,
  updateService,
}: {
  phase: EditableService["phase"];
  services: EditableService[];
  toggleService: (id: string) => void;
  updatePrice: (
    id: string,
    variation: number,
  ) => void;
  updateService: (
    id: string,
    patch: Partial<EditableService>,
  ) => void;
}) {
  const meta = phaseMeta[phase];

  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
      <header className="flex flex-col justify-between gap-5 border-b border-white/[0.08] px-6 py-6 md:flex-row md:items-end">
        <div className="flex items-start gap-4">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border"
            style={{
              color: meta.color,
              borderColor: `${meta.color}35`,
              backgroundColor: `${meta.color}12`,
            }}
          >
            <CalendarDays size={18} />
          </span>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.1em]"
              style={{
                color: meta.color,
              }}
            >
              {meta.period}
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              {meta.title}
            </h2>

            <p className="mt-2 text-sm text-[#B8C5D4]">
              {meta.description}
            </p>
          </div>
        </div>

        <span className="text-sm font-semibold text-[#AEBCCC]">
          {services.length} interventi
        </span>
      </header>

      {services.length > 0 ? (
        <div className="divide-y divide-white/[0.065]">
          {services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              toggleService={toggleService}
              updatePrice={updatePrice}
              updateService={updateService}
              color={meta.color}
            />
          ))}
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <Clock3
            size={24}
            className="mx-auto text-[#607089]"
          />

          <p className="mt-4 text-sm font-semibold">
            Nessun intervento in questa fase
          </p>

          <p className="mt-2 text-sm text-[#AEBCCC]">
            Puoi spostare qui un’attività dalle altre fasi.
          </p>
        </div>
      )}
    </article>
  );
}

function ServiceRow({
  service,
  toggleService,
  updatePrice,
  updateService,
  color,
}: {
  service: EditableService;
  toggleService: (id: string) => void;
  updatePrice: (
    id: string,
    variation: number,
  ) => void;
  updateService: (
    id: string,
    patch: Partial<EditableService>,
  ) => void;
  color: string;
}) {
  return (
    <article
      className={`p-6 transition ${
        service.selected
          ? "bg-white/[0.018]"
          : "opacity-55"
      }`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() =>
              toggleService(service.id)
            }
            className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border ${
              service.selected
                ? "border-[#24D27C] bg-[#24D27C] text-[#07111F]"
                : "border-white/[0.14] text-transparent"
            }`}
            aria-label={
              service.selected
                ? "Rimuovi intervento"
                : "Seleziona intervento"
            }
          >
            <Check size={14} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{
                      color,
                      borderColor: `${color}35`,
                      backgroundColor: `${color}12`,
                    }}
                  >
                    {priorityLabel(
                      service.priority,
                    )}
                  </span>

                  {service.approved && (
                    <span className="rounded-full border border-[#24D27C]/20 bg-[#24D27C]/10 px-3 py-1 text-xs font-semibold text-[#8AF0BA]">
                      Approvato
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-base font-semibold">
                  {service.name}
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-[#C8D4E1]">
                  {service.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updatePrice(
                      service.id,
                      -100,
                    )
                  }
                  disabled={!service.selected}
                  className="flex size-9 items-center justify-center rounded-[10px] border border-white/[0.09] bg-white/[0.035] transition hover:bg-white/[0.07] disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>

                <span className="min-w-[100px] text-center text-sm font-semibold">
                  {euro(service.price)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    updatePrice(
                      service.id,
                      100,
                    )
                  }
                  disabled={!service.selected}
                  className="flex size-9 items-center justify-center rounded-[10px] border border-white/[0.09] bg-white/[0.035] transition hover:bg-white/[0.07] disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <label>
                <span className="mb-2 block text-xs font-semibold text-[#AEBCCC]">
                  Responsabile
                </span>

                <select
                  value={service.owner}
                  disabled={!service.selected}
                  onChange={(event) =>
                    updateService(
                      service.id,
                      {
                        owner:
                          event.target.value,
                      },
                    )
                  }
                  className="min-h-11 w-full rounded-[11px] border border-white/[0.09] bg-[#07111F]/65 px-3 text-sm outline-none disabled:opacity-40"
                >
                  {ownerOptions.map((owner) => (
                    <option
                      key={owner}
                      value={owner}
                    >
                      {owner}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-semibold text-[#AEBCCC]">
                  Fase
                </span>

                <select
                  value={service.phase}
                  disabled={!service.selected}
                  onChange={(event) =>
                    updateService(
                      service.id,
                      {
                        phase:
                          event.target
                            .value as EditableService["phase"],
                      },
                    )
                  }
                  className="min-h-11 w-full rounded-[11px] border border-white/[0.09] bg-[#07111F]/65 px-3 text-sm outline-none disabled:opacity-40"
                >
                  <option value="0-30">
                    0–30 giorni
                  </option>

                  <option value="31-60">
                    31–60 giorni
                  </option>

                  <option value="61-90">
                    61–90 giorni
                  </option>
                </select>
              </label>

              <button
                type="button"
                disabled={!service.selected}
                onClick={() =>
                  updateService(
                    service.id,
                    {
                      approved:
                        !service.approved,
                    },
                  )
                }
                className={`mt-auto min-h-11 rounded-[11px] border px-4 text-sm font-semibold transition disabled:opacity-35 ${
                  service.approved
                    ? "border-[#24D27C]/25 bg-[#24D27C]/10 text-[#8AF0BA]"
                    : "border-white/[0.09] bg-white/[0.035] text-white hover:bg-white/[0.07]"
                }`}
              >
                {service.approved
                  ? "Intervento approvato"
                  : "Approva intervento"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function InvestmentPanel({
  subtotal,
  discount,
  setDiscount,
  discountAmount,
  total,
  deposit,
  balance,
}: {
  subtotal: number;
  discount: number;
  setDiscount: (value: number) => void;
  discountAmount: number;
  total: number;
  deposit: number;
  balance: number;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#0B1628]">
      <header className="border-b border-white/[0.08] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
              Investment
            </p>

            <h2 className="mt-3 text-xl font-semibold">
              Riepilogo economico
            </h2>
          </div>

          <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 text-[#FF9A64]">
            <WalletCards size={18} />
          </span>
        </div>
      </header>

      <div className="p-6">
        <div className="space-y-3">
          <MoneyRow
            label="Subtotale"
            value={euro(subtotal)}
          />

          <div className="flex items-center justify-between gap-5 rounded-[12px] border border-white/[0.07] bg-[#07111F]/45 px-4 py-3">
            <span className="text-sm text-[#B8C5D4]">
              Sconto
            </span>

            <select
              value={discount}
              onChange={(event) =>
                setDiscount(
                  Number(event.target.value),
                )
              }
              className="min-h-9 rounded-[9px] border border-white/[0.09] bg-[#0B1628] px-3 text-sm font-semibold outline-none"
            >
              <option value={0}>0%</option>
              <option value={5}>5%</option>
              <option value={10}>10%</option>
              <option value={15}>15%</option>
              <option value={20}>20%</option>
            </select>
          </div>

          {discountAmount > 0 && (
            <MoneyRow
              label="Riduzione"
              value={`− ${euro(
                discountAmount,
              )}`}
              color="#24D27C"
            />
          )}
        </div>

        <div className="mt-5 rounded-[16px] border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.07] p-5">
          <p className="text-xs text-[#FFB38B]">
            Investimento complessivo
          </p>

          <p className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
            {euro(total)}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniMoney
            label="Acconto 40%"
            value={euro(deposit)}
          />

          <MiniMoney
            label="Saldo"
            value={euro(balance)}
          />
        </div>

        <p className="mt-5 text-xs leading-5 text-[#AEBCCC]">
          Importi indicativi al netto di eventuali
          budget pubblicitari, licenze, API e servizi
          di terze parti.
        </p>
      </div>
    </article>
  );
}

function HeroMetric({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: typeof BarChart3;
}) {
  return (
    <div className="rounded-[15px] border border-white/[0.08] bg-[#07111F]/55 p-4">
      <Icon size={16} style={{ color }} />

      <p className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#B8C5D4]">
        {label}
      </p>
    </div>
  );
}

function StatusOption({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-[13px] border p-4 text-left transition ${
        active
          ? "border-[#2492E8]/35 bg-[#2492E8]/10"
          : "border-white/[0.07] bg-[#07111F]/45 hover:border-white/[0.14]"
      }`}
    >
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
          active
            ? "border-[#2492E8] bg-[#2492E8] text-white"
            : "border-white/[0.14]"
        }`}
      >
        {active && <Check size={11} />}
      </span>

      <span>
        <span className="block text-sm font-semibold">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-[#AEBCCC]">
          {description}
        </span>
      </span>
    </button>
  );
}

function PlanStatusBadge({
  status,
}: {
  status: PlanStatus;
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

function MoneyRow({
  label,
  value,
  color = "#FFFFFF",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-[12px] border border-white/[0.07] bg-[#07111F]/45 px-4 py-3">
      <span className="text-sm text-[#B8C5D4]">
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

function MiniMoney({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[12px] border border-white/[0.07] bg-[#07111F]/45 p-4">
      <p className="text-xs text-[#AEBCCC]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function KpiRow({
  label,
  target,
}: {
  label: string;
  target: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[11px] border border-white/[0.07] bg-[#07111F]/45 px-3 py-3">
      <span className="text-sm text-[#C8D4E1]">
        {label}
      </span>

      <span className="text-xs font-semibold text-[#F8C867]">
        {target}
      </span>
    </div>
  );
}

function MissingAudit() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111F] px-5 text-white">
      <section className="max-w-xl rounded-[24px] border border-white/[0.09] bg-[#0B1628] p-8 text-center md:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-[16px] border border-[#F5A623]/20 bg-[#F5A623]/10 text-[#F8C867]">
          <AlertTriangle size={23} />
        </span>

        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
          Nessun audit disponibile
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#B8C5D4]">
          Prima di costruire un Growth Plan devi
          completare un audit o generare un risultato
          dimostrativo.
        </p>

        <Link
          href="/audits/new"
          className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-[13px] bg-[#FF6B1A] px-6 text-sm font-semibold transition hover:bg-[#FF7D34]"
        >
          Avvia un audit
          <ArrowRight size={15} />
        </Link>
      </section>
    </main>
  );
}

function GrowthPlanLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111F] text-white">
      <div className="text-center">
        <Workflow
          size={25}
          className="mx-auto animate-pulse text-[#79C6F5]"
        />

        <p className="mt-4 text-sm text-[#B8C5D4]">
          Caricamento del Growth Plan…
        </p>
      </div>
    </main>
  );
}
