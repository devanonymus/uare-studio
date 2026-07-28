"use client";

import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock3,
  FileSearch,
  Gauge,
  LoaderCircle,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Target,
  Workflow,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type PlanPhase = {
  order: number;
  name: string;
  objective: string;
  ownerAgent: string;
  estimatedDuration: string;
  approvalRequired: boolean;

  actions: Array<{
    order: number;
    action: string;
    actionType: string;
    externalEffect: boolean;
    requiredIntegration:
      | string
      | null;
  }>;

  deliverables: string[];
};

type PlanRisk = {
  risk: string;
  level: string;
  mitigation: string;
};

type PlanKpi = {
  name: string;
  target: string;
  source: string;
};

type Blueprint = {
  id: string;
  name: string;
  objective: string;
  status: string;
  risk_level: string;
  approval_required: boolean;
};

type MissionPlan = {
  id: string;
  mission_id: string;
  status: string;
  executive_summary: string;

  operating_model: {
    objective: string;
    executionMode: string;
    governance: string;
  };

  phases: PlanPhase[];
  required_inputs: string[];
  risks: PlanRisk[];
  verification_checks: Array<{
    check: string;
    requiredBeforeExecution: boolean;
  }>;

  expected_kpis: PlanKpi[];
  limitations: string[];
  confidence: number;
  created_at: string;

  missions: {
    id: string;
    title: string;
    objective: string;
    rationale: string;
    status: string;
    priority: number;
    impact: string;
    effort: string;
    risk_level: string;
    owner_agent: string;
    approval_required: boolean;
  };

  blueprints: Blueprint[];

  approvals: Array<{
    id: string;
    resource_type: string;
    resource_id: string;
    action: string;
    status: string;
    risk_level: string;
  }>;
};

type MissionPlansData = {
  status: string;

  business: {
    id: string;
    name: string;
    sector: string;
    city: string | null;
    primary_goal: string | null;
  };

  plans: MissionPlan[];
};

export function MissionPlanControlCenter({
  businessId,
}: {
  businessId: string;
}) {
  const [data, setData] =
    useState<MissionPlansData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [error, setError] =
    useState<string | null>(null);

  const loadData = useCallback(
    async (manual = false) => {
      if (manual) {
        setRefreshing(true);
      }

      try {
        const response = await fetch(
          `/api/core/mission-plans?businessId=${encodeURIComponent(
            businessId,
          )}`,
          {
            cache: "no-store",
          },
        );

        const payload =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload.error ||
              "Mission Plan Center non disponibile.",
          );
        }

        setData(payload);

        setSelectedId(
          (current) =>
            current ||
            payload.plans?.[0]?.id ||
            null,
        );

        setError(null);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Errore sconosciuto.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [businessId],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function decidePlan(
    planId: string,
    action:
      | "approve"
      | "reject"
      | "restore",
  ) {
    const labels = {
      approve:
        "Confermi l’approvazione del piano operativo?",
      reject:
        "Confermi il rifiuto del piano operativo?",
      restore:
        "Ripristinare il piano per una nuova revisione?",
    };

    if (!window.confirm(labels[action])) {
      return;
    }

    setProcessingId(planId);

    try {
      const response = await fetch(
        `/api/core/mission-plans/${planId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            action,
            actorId:
              "brian-laddomada",

            note:
              action === "approve"
                ? "Piano operativo verificato e approvato."
                : action === "reject"
                  ? "Piano operativo rifiutato e da revisionare."
                  : "Piano ripristinato per nuova revisione.",
          }),
        },
      );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Decisione non registrata.",
        );
      }

      await loadData(true);
    } catch (caughtError) {
      window.alert(
        caughtError instanceof Error
          ? caughtError.message
          : "Errore sconosciuto.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  const filteredPlans = useMemo(
    () =>
      data?.plans.filter(
        (plan) =>
          statusFilter === "all" ||
          plan.status === statusFilter,
      ) ?? [],
    [data, statusFilter],
  );

  const selectedPlan =
    data?.plans.find(
      (plan) =>
        plan.id === selectedId,
    ) ??
    filteredPlans[0] ??
    null;

  const metrics = useMemo(() => {
    const plans =
      data?.plans ?? [];

    return {
      total: plans.length,

      pending: plans.filter(
        (plan) =>
          plan.status ===
          "awaiting_approval",
      ).length,

      approved: plans.filter(
        (plan) =>
          plan.status === "approved",
      ).length,

      rejected: plans.filter(
        (plan) =>
          plan.status === "rejected",
      ).length,

      blueprints: plans.reduce(
        (total, plan) =>
          total +
          plan.blueprints.length,
        0,
      ),
    };
  }, [data]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return (
      <ErrorState
        message={
          error ||
          "Dati non disponibili."
        }
        retry={() =>
          void loadData(true)
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Piani"
          value={`${metrics.total}`}
          detail="Piani operativi"
          icon={Workflow}
          color="#2492E8"
        />

        <Metric
          label="Da approvare"
          value={`${metrics.pending}`}
          detail="Decisioni pendenti"
          icon={Clock3}
          color="#F5A623"
        />

        <Metric
          label="Approvati"
          value={`${metrics.approved}`}
          detail="Strategie autorizzate"
          icon={CheckCircle2}
          color="#24D27C"
        />

        <Metric
          label="Rifiutati"
          value={`${metrics.rejected}`}
          detail="Da revisionare"
          icon={X}
          color="#FF5D73"
        />

        <Metric
          label="Blueprint"
          value={`${metrics.blueprints}`}
          detail="Automazioni generate"
          icon={Target}
          color="#6D4FD2"
        />
      </section>

      <section className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6 md:p-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
              Mission governance
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              {data.business.name}
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-7 text-[#B8C5D4]">
              Revisiona struttura, fasi, rischi, KPI e blueprint prima di autorizzare il piano.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadData(true)
            }
            disabled={refreshing}
            className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold"
          >
            <RefreshCcw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Aggiorna
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[390px_1fr]">
        <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
          <header className="border-b border-white/[0.08] p-5">
            <h2 className="text-xl font-semibold">
              Piani generati
            </h2>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value,
                )
              }
              className="mt-4 min-h-11 w-full rounded-[11px] border border-white/[0.09] bg-[#07111F] px-4 text-sm"
            >
              <option value="all">
                Tutti gli stati
              </option>

              <option value="awaiting_approval">
                Da approvare
              </option>

              <option value="approved">
                Approvati
              </option>

              <option value="rejected">
                Rifiutati
              </option>
            </select>
          </header>

          <div className="max-h-[840px] divide-y divide-white/[0.065] overflow-y-auto">
            {filteredPlans.map(
              (plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() =>
                    setSelectedId(plan.id)
                  }
                  className={`w-full p-5 text-left transition ${
                    selectedPlan?.id ===
                    plan.id
                      ? "bg-[#2492E8]/[0.08]"
                      : "hover:bg-white/[0.025]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 px-3 py-1 text-xs font-semibold text-[#FF9A64]">
                      P
                      {
                        plan.missions
                          ?.priority
                      }
                    </span>

                    <StatusBadge
                      status={plan.status}
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold leading-6 text-white">
                    {plan.missions?.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#AEBCCC]">
                    {plan.executive_summary}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-[#79C6F5]">
                    {plan.phases.length} fasi ·{" "}
                    {plan.blueprints.length} blueprint
                  </p>
                </button>
              ),
            )}

            {filteredPlans.length === 0 && (
              <div className="p-10 text-center">
                <FileSearch
                  size={24}
                  className="mx-auto text-[#607089]"
                />

                <p className="mt-4 text-sm text-[#AEBCCC]">
                  Nessun piano disponibile.
                </p>
              </div>
            )}
          </div>
        </article>

        {selectedPlan ? (
          <PlanDetail
            plan={selectedPlan}
            processing={
              processingId ===
              selectedPlan.id
            }
            decidePlan={decidePlan}
          />
        ) : (
          <article className="flex min-h-[700px] items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
            <p className="text-sm text-[#AEBCCC]">
              Genera un piano da una missione approvata.
            </p>
          </article>
        )}
      </section>
    </div>
  );
}

function PlanDetail({
  plan,
  processing,
  decidePlan,
}: {
  plan: MissionPlan;
  processing: boolean;

  decidePlan: (
    planId: string,
    action:
      | "approve"
      | "reject"
      | "restore",
  ) => Promise<void>;
}) {
  const confidence = Math.round(
    plan.confidence * 100,
  );

  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
      <header className="border-b border-white/[0.08] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                status={plan.status}
              />

              <RiskBadge
                risk={
                  plan.missions
                    ?.risk_level
                }
              />

              <span className="rounded-full border border-[#2492E8]/20 bg-[#2492E8]/10 px-3 py-1 text-xs font-semibold text-[#79C6F5]">
                Sandbox first
              </span>
            </div>

            <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white">
              {plan.missions?.title}
            </h2>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-[#CBD6E2]">
              {plan.executive_summary}
            </p>
          </div>

          <div className="shrink-0 rounded-[13px] border border-white/[0.08] bg-[#07111F]/55 px-5 py-4">
            <p className="text-xs text-[#AEBCCC]">
              Confidence
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {confidence}%
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-7 p-6 md:p-8">
        <section className="rounded-[16px] border border-white/[0.08] bg-[#07111F]/55 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
            Modello operativo
          </p>

          <p className="mt-4 text-sm leading-8 text-[#D8E1EA]">
            {plan.operating_model?.objective}
          </p>

          <p className="mt-4 text-sm leading-7 text-[#B8C5D4]">
            {plan.operating_model?.governance}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold">
            Fasi operative
          </h3>

          <div className="mt-4 space-y-4">
            {plan.phases.map((phase) => (
              <article
                key={`${plan.id}-${phase.order}`}
                className="rounded-[16px] border border-white/[0.08] bg-[#07111F]/45 p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#79C6F5]">
                      Fase {phase.order}
                    </p>

                    <h4 className="mt-2 text-base font-semibold text-white">
                      {phase.name}
                    </h4>

                    <p className="mt-3 text-sm leading-7 text-[#C8D4E1]">
                      {phase.objective}
                    </p>
                  </div>

                  <div className="shrink-0 text-xs text-[#AEBCCC]">
                    <p>
                      Agente: {phase.ownerAgent}
                    </p>

                    <p className="mt-2">
                      Durata:{" "}
                      {phase.estimatedDuration}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {phase.actions.map(
                    (action) => (
                      <div
                        key={`${phase.order}-${action.order}`}
                        className="flex items-start gap-3 rounded-[11px] border border-white/[0.07] bg-[#07111F]/55 p-3"
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#2492E8]/10 text-xs font-semibold text-[#79C6F5]">
                          {action.order}
                        </span>

                        <div>
                          <p className="text-sm leading-6 text-white">
                            {action.action}
                          </p>

                          <p className="mt-1 text-xs text-[#AEBCCC]">
                            {action.actionType}
                            {" · "}
                            {action.externalEffect
                              ? "Effetto esterno"
                              : "Attività interna"}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold">
            Blueprint prodotti
          </h3>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {plan.blueprints.map(
              (blueprint) => (
                <div
                  key={blueprint.id}
                  className="rounded-[14px] border border-white/[0.08] bg-[#07111F]/45 p-4"
                >
                  <StatusBadge
                    status={
                      blueprint.status
                    }
                  />

                  <h4 className="mt-4 text-sm font-semibold text-white">
                    {blueprint.name}
                  </h4>

                  <p className="mt-2 text-xs leading-6 text-[#B8C5D4]">
                    {blueprint.objective}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {plan.required_inputs.length >
          0 && (
          <section className="rounded-[16px] border border-[#F5A623]/20 bg-[#F5A623]/[0.055] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F8C867]">
              Input richiesti
            </p>

            <div className="mt-4 space-y-2">
              {plan.required_inputs.map(
                (item) => (
                  <p
                    key={item}
                    className="text-sm leading-6 text-[#D8E1EA]"
                  >
                    • {item}
                  </p>
                ),
              )}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-lg font-semibold">
            KPI del piano
          </h3>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {plan.expected_kpis.map(
              (kpi, index) => (
                <div
                  key={`${plan.id}-kpi-${index}`}
                  className="rounded-[14px] border border-white/[0.08] bg-[#07111F]/45 p-4"
                >
                  <p className="text-sm font-semibold">
                    {kpi.name}
                  </p>

                  <p className="mt-2 text-sm text-[#C8D4E1]">
                    {kpi.target}
                  </p>

                  <p className="mt-2 text-xs text-[#AEBCCC]">
                    Fonte: {kpi.source}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-white/[0.08] pt-6">
          {plan.status ===
            "awaiting_approval" && (
            <>
              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void decidePlan(
                    plan.id,
                    "reject",
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-[#FF5D73]/25 bg-[#FF5D73]/[0.07] px-5 text-sm font-semibold text-[#FF9AAA]"
              >
                <X size={15} />
                Rifiuta piano
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void decidePlan(
                    plan.id,
                    "approve",
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-[11px] bg-[#24D27C] px-5 text-sm font-semibold text-[#07111F]"
              >
                {processing ? (
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={15} />
                )}

                Approva piano
              </button>
            </>
          )}

          {plan.status === "rejected" && (
            <button
              type="button"
              disabled={processing}
              onClick={() =>
                void decidePlan(
                  plan.id,
                  "restore",
                )
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold"
            >
              <RotateCcw size={15} />
              Ripristina piano
            </button>
          )}

          {plan.status === "approved" && (
            <div className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-[#24D27C]/20 bg-[#24D27C]/[0.07] px-5 text-sm font-semibold text-[#8AF0BA]">
              <CheckCircle2 size={15} />
              Strategia operativa approvata
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Workflow;
  color: string;
}) {
  return (
    <article className="rounded-[18px] border border-white/[0.08] bg-[#0B1628] p-5">
      <Icon
        size={17}
        style={{ color }}
      />

      <p className="mt-4 text-sm text-[#B8C5D4]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#AEBCCC]">
        {detail}
      </p>
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const values: Record<
    string,
    {
      label: string;
      color: string;
    }
  > = {
    awaiting_approval: {
      label: "Da approvare",
      color: "#F5A623",
    },

    approved: {
      label: "Approvato",
      color: "#24D27C",
    },

    rejected: {
      label: "Rifiutato",
      color: "#FF5D73",
    },

    ready: {
      label: "Pronto",
      color: "#2492E8",
    },

    draft: {
      label: "Bozza",
      color: "#AEBCCC",
    },
  };

  const current =
    values[status] ?? {
      label: status,
      color: "#AEBCCC",
    };

  return (
    <span
      className="rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        color: current.color,
        borderColor:
          `${current.color}35`,
        backgroundColor:
          `${current.color}12`,
      }}
    >
      {current.label}
    </span>
  );
}

function RiskBadge({
  risk,
}: {
  risk: string;
}) {
  const color =
    risk === "critical"
      ? "#FF5D73"
      : risk === "high"
        ? "#FF6B1A"
        : risk === "medium"
          ? "#F5A623"
          : "#24D27C";

  return (
    <span
      className="rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        color,
        borderColor: `${color}35`,
        backgroundColor: `${color}12`,
      }}
    >
      Rischio {risk}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[560px] items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
      <LoaderCircle
        size={28}
        className="animate-spin text-[#79C6F5]"
      />
    </div>
  );
}

function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[22px] border border-[#FF5D73]/20 bg-[#0B1628] px-6 text-center">
      <AlertTriangle
        size={28}
        className="text-[#FF8191]"
      />

      <h3 className="mt-5 text-xl font-semibold">
        Mission Plan Center non disponibile
      </h3>

      <p className="mt-3 max-w-xl text-sm leading-7 text-[#B8C5D4]">
        {message}
      </p>

      <button
        type="button"
        onClick={retry}
        className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-[11px] bg-[#FF6B1A] px-5 text-sm font-semibold"
      >
        <RefreshCcw size={15} />
        Riprova
      </button>
    </div>
  );
}
