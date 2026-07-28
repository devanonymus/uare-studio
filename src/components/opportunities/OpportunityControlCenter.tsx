"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  FileSearch,
  Lightbulb,
  LoaderCircle,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
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

type ProposedAction = {
  order: number;
  action: string;
  ownerAgent: string;
  approvalRequired: boolean;
};

type ExpectedKpi = {
  name: string;
  target: string;
  measurementSource: string;
};

type Opportunity = {
  id: string;
  title: string;
  summary: string;
  rationale: string;
  opportunity_type: string;
  status: string;
  priority: number;
  impact: string;
  effort: string;
  risk_level: string;
  confidence: number;
  estimated_cost_min:
    | number
    | null;
  estimated_cost_max:
    | number
    | null;
  currency: string;
  estimated_time:
    | string
    | null;
  missing_data: string[];
  proposed_actions:
    ProposedAction[];
  expected_kpis:
    ExpectedKpi[];
  limitations: string[];
  created_at: string;
};

type OpportunitiesData = {
  status: string;

  business: {
    id: string;
    name: string;
    sector: string;
    city: string | null;
    primary_goal:
      | string
      | null;
  };

  opportunities:
    Opportunity[];

  runs: Array<{
    id: string;
    status: string;
    opportunity_count: number;
    created_at: string;
  }>;
};

export function OpportunityControlCenter({
  businessId,
}: {
  businessId: string;
}) {
  const [data, setData] =
    useState<OpportunitiesData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [
    generating,
    setGenerating,
  ] = useState(false);

  const [
    processingId,
    setProcessingId,
  ] = useState<string | null>(null);

  const [
    selectedId,
    setSelectedId,
  ] = useState<string | null>(null);

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [error, setError] =
    useState<string | null>(null);

  const loadData =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            `/api/core/opportunities?businessId=${encodeURIComponent(
              businessId,
            )}`,
            {
              cache:
                "no-store",
            },
          );

        const payload =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload.error ||
              "Opportunity Center non disponibile.",
          );
        }

        setData(payload);

        setSelectedId(
          (current) =>
            current ||
            payload
              .opportunities?.[0]
              ?.id ||
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
      }
    }, [businessId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function generate() {
    setGenerating(true);

    try {
      const idempotencyKey =
        `ui-opportunity-${businessId}-${Date.now()}`;

      const response =
        await fetch(
          "/api/core/opportunities/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Idempotency-Key":
                idempotencyKey,
            },

            body:
              JSON.stringify({
                businessId,
                idempotencyKey,
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Generazione fallita.",
        );
      }

      await loadData();

      window.alert(
        `${payload.opportunities?.length ?? 0} nuove opportunità generate.`,
      );
    } catch (caughtError) {
      window.alert(
        caughtError instanceof Error
          ? caughtError.message
          : "Errore sconosciuto.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function act(
    opportunityId: string,
    action:
      | "approve"
      | "reject"
      | "restore"
      | "convert_to_mission",
  ) {
    const messages = {
      approve:
        "Confermi l’approvazione di questa opportunità?",

      reject:
        "Confermi il rifiuto di questa opportunità?",

      restore:
        "Riportare l’opportunità allo stato proposto?",

      convert_to_mission:
        "Trasformare questa opportunità in una missione operativa?",
    };

    if (
      !window.confirm(
        messages[action],
      )
    ) {
      return;
    }

    setProcessingId(
      opportunityId,
    );

    try {
      const response =
        await fetch(
          `/api/core/opportunities/${opportunityId}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                action,

                actorId:
                  "brian-laddomada",

                note:
                  action ===
                  "approve"
                    ? "Opportunità approvata dal Business Opportunity Center."
                    : action ===
                        "reject"
                      ? "Opportunità rifiutata dal Business Opportunity Center."
                      : action ===
                          "convert_to_mission"
                        ? "Opportunità convertita in missione operativa."
                        : "",
              }),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Operazione non completata.",
        );
      }

      await loadData();

      if (
        action ===
          "convert_to_mission" &&
        payload.missionId
      ) {
        window.alert(
          `Missione creata: ${payload.missionId}`,
        );
      }
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

  const filtered =
    useMemo(
      () =>
        data?.opportunities.filter(
          (opportunity) =>
            statusFilter ===
              "all" ||
            opportunity.status ===
              statusFilter,
        ) ?? [],
      [data, statusFilter],
    );

  const selected =
    data?.opportunities.find(
      (opportunity) =>
        opportunity.id ===
        selectedId,
    ) ??
    filtered[0] ??
    null;

  const metrics =
    useMemo(() => {
      const opportunities =
        data?.opportunities ?? [];

      return {
        total:
          opportunities.length,

        proposed:
          opportunities.filter(
            (item) =>
              item.status ===
              "proposed",
          ).length,

        approved:
          opportunities.filter(
            (item) =>
              item.status ===
              "approved",
          ).length,

        converted:
          opportunities.filter(
            (item) =>
              item.status ===
              "converted_to_mission",
          ).length,

        highImpact:
          opportunities.filter(
            (item) =>
              [
                "high",
                "critical",
              ].includes(
                item.impact,
              ),
          ).length,
      };
    }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-[550px] items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
        <LoaderCircle
          size={28}
          className="animate-spin text-[#79C6F5]"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[550px] flex-col items-center justify-center rounded-[22px] border border-[#FF5D73]/20 bg-[#0B1628] px-6 text-center">
        <AlertTriangle
          size={28}
          className="text-[#FF8191]"
        />

        <h3 className="mt-5 text-xl font-semibold">
          Opportunity Center non disponibile
        </h3>

        <p className="mt-3 text-sm text-[#B8C5D4]">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Opportunità"
          value={`${metrics.total}`}
          detail="Proposte generate"
          icon={Lightbulb}
          color="#2492E8"
        />

        <Metric
          label="Da valutare"
          value={`${metrics.proposed}`}
          detail="Decisioni richieste"
          icon={Clock3}
          color="#F5A623"
        />

        <Metric
          label="Approvate"
          value={`${metrics.approved}`}
          detail="Pronte per missione"
          icon={CheckCircle2}
          color="#24D27C"
        />

        <Metric
          label="Missioni create"
          value={`${metrics.converted}`}
          detail="Convertite nel Core"
          icon={Workflow}
          color="#6D4FD2"
        />

        <Metric
          label="Alto impatto"
          value={`${metrics.highImpact}`}
          detail="Priorità strategiche"
          icon={Target}
          color="#FF6B1A"
        />
      </section>

      <section className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6 md:p-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
              Business Opportunity Engine
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              {data.business.name}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-[#B8C5D4]">
              {data.business.primary_goal ||
                "Obiettivo principale non configurato."}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void generate()
            }
            disabled={generating}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[12px] bg-[#FF6B1A] px-6 text-sm font-semibold text-white transition hover:bg-[#FF7D34] disabled:opacity-50"
          >
            {generating ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            ) : (
              <Sparkles size={16} />
            )}

            Trova nuove opportunità
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[390px_1fr]">
        <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
          <header className="border-b border-white/[0.08] p-5">
            <h2 className="text-xl font-semibold">
              Opportunità rilevate
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

              <option value="proposed">
                Proposte
              </option>

              <option value="approved">
                Approvate
              </option>

              <option value="rejected">
                Rifiutate
              </option>

              <option value="converted_to_mission">
                Convertite in missione
              </option>
            </select>
          </header>

          <div className="max-h-[820px] divide-y divide-white/[0.065] overflow-y-auto">
            {filtered.map(
              (opportunity) => (
                <button
                  key={opportunity.id}
                  type="button"
                  onClick={() =>
                    setSelectedId(
                      opportunity.id,
                    )
                  }
                  className={`w-full p-5 text-left transition ${
                    selected?.id ===
                    opportunity.id
                      ? "bg-[#2492E8]/[0.08]"
                      : "hover:bg-white/[0.025]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 px-3 py-1 text-xs font-semibold text-[#FF9A64]">
                      P
                      {
                        opportunity.priority
                      }
                    </span>

                    <StatusBadge
                      status={
                        opportunity.status
                      }
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold leading-6 text-white">
                    {opportunity.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#AEBCCC]">
                    {
                      opportunity.summary
                    }
                  </p>

                  <p className="mt-3 text-xs font-semibold text-[#79C6F5]">
                    {
                      opportunity.opportunity_type
                    }
                  </p>
                </button>
              ),
            )}

            {filtered.length === 0 && (
              <div className="p-10 text-center">
                <FileSearch
                  size={24}
                  className="mx-auto text-[#607089]"
                />

                <p className="mt-4 text-sm text-[#AEBCCC]">
                  Nessuna opportunità con questo filtro.
                </p>
              </div>
            )}
          </div>
        </article>

        {selected ? (
          <OpportunityDetail
            opportunity={selected}
            processing={
              processingId ===
              selected.id
            }
            act={act}
          />
        ) : (
          <article className="flex min-h-[650px] items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
            <p className="text-sm text-[#AEBCCC]">
              Genera o seleziona un’opportunità.
            </p>
          </article>
        )}
      </section>
    </div>
  );
}

function OpportunityDetail({
  opportunity,
  processing,
  act,
}: {
  opportunity: Opportunity;
  processing: boolean;

  act: (
    id: string,
    action:
      | "approve"
      | "reject"
      | "restore"
      | "convert_to_mission",
  ) => Promise<void>;
}) {
  const confidence =
    Math.round(
      opportunity.confidence *
        100,
    );

  const cost =
    formatCost(opportunity);

  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
      <header className="border-b border-white/[0.08] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#2492E8]/20 bg-[#2492E8]/10 px-3 py-1 text-xs font-semibold text-[#79C6F5]">
                {
                  opportunity.opportunity_type
                }
              </span>

              <StatusBadge
                status={
                  opportunity.status
                }
              />

              <RiskBadge
                risk={
                  opportunity.risk_level
                }
              />
            </div>

            <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white">
              {opportunity.title}
            </h2>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-[#CBD6E2]">
              {opportunity.summary}
            </p>
          </div>

          <span className="shrink-0 rounded-[13px] border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 px-4 py-3 text-sm font-semibold text-[#FF9A64]">
            Priorità P
            {opportunity.priority}
          </span>
        </div>
      </header>

      <div className="space-y-6 p-6 md:p-8">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Info
            label="Confidence"
            value={`${confidence}%`}
          />

          <Info
            label="Impatto"
            value={
              opportunity.impact
            }
          />

          <Info
            label="Impegno"
            value={
              opportunity.effort
            }
          />

          <Info
            label="Costo stimato"
            value={cost}
          />
        </section>

        <section className="rounded-[16px] border border-white/[0.08] bg-[#07111F]/55 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
            Perché UVIQ lo propone
          </p>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-[#D8E1EA]">
            {opportunity.rationale}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white">
            Piano suggerito
          </h3>

          <div className="mt-4 space-y-3">
            {opportunity.proposed_actions.map(
              (action) => (
                <div
                  key={`${opportunity.id}-${action.order}`}
                  className="flex gap-4 rounded-[14px] border border-white/[0.08] bg-[#07111F]/45 p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2492E8]/10 text-xs font-semibold text-[#79C6F5]">
                    {action.order}
                  </span>

                  <div>
                    <p className="text-sm leading-6 text-white">
                      {action.action}
                    </p>

                    <p className="mt-2 text-xs text-[#AEBCCC]">
                      Agente:{" "}
                      {
                        action.ownerAgent
                      }
                      {" · "}
                      {action.approvalRequired
                        ? "Approvazione richiesta"
                        : "Attività interna"}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white">
            KPI attesi
          </h3>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {opportunity.expected_kpis.map(
              (kpi, index) => (
                <div
                  key={`${opportunity.id}-kpi-${index}`}
                  className="rounded-[14px] border border-white/[0.08] bg-[#07111F]/45 p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {kpi.name}
                  </p>

                  <p className="mt-2 text-sm text-[#C8D4E1]">
                    {kpi.target}
                  </p>

                  <p className="mt-2 text-xs text-[#AEBCCC]">
                    Fonte:{" "}
                    {
                      kpi.measurementSource
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {opportunity.missing_data
          ?.length > 0 && (
          <section className="rounded-[16px] border border-[#F5A623]/20 bg-[#F5A623]/[0.055] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F8C867]">
              Dati ancora necessari
            </p>

            <div className="mt-4 space-y-2">
              {opportunity.missing_data.map(
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

        <div className="flex flex-wrap gap-3 border-t border-white/[0.08] pt-6">
          {opportunity.status ===
            "proposed" && (
            <>
              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void act(
                    opportunity.id,
                    "reject",
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-[#FF5D73]/25 bg-[#FF5D73]/[0.07] px-5 text-sm font-semibold text-[#FF9AAA]"
              >
                <X size={15} />
                Rifiuta
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void act(
                    opportunity.id,
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

                Approva opportunità
              </button>
            </>
          )}

          {opportunity.status ===
            "approved" && (
            <>
              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void act(
                    opportunity.id,
                    "restore",
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold"
              >
                <RotateCcw
                  size={15}
                />
                Torna a proposta
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void act(
                    opportunity.id,
                    "convert_to_mission",
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-[11px] bg-[#FF6B1A] px-5 text-sm font-semibold text-white"
              >
                {processing ? (
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Workflow
                    size={15}
                  />
                )}

                Trasforma in missione
              </button>
            </>
          )}

          {opportunity.status ===
            "rejected" && (
            <button
              type="button"
              disabled={processing}
              onClick={() =>
                void act(
                  opportunity.id,
                  "restore",
                )
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold"
            >
              <RotateCcw size={15} />
              Ripristina proposta
            </button>
          )}

          {opportunity.status ===
            "converted_to_mission" && (
            <div className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-[#24D27C]/20 bg-[#24D27C]/[0.07] px-5 text-sm font-semibold text-[#8AF0BA]">
              <CheckCircle2
                size={15}
              />
              Missione creata nel Core
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
  icon: typeof Lightbulb;
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

      <p className="mt-2 text-2xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#AEBCCC]">
        {detail}
      </p>
    </article>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[13px] border border-white/[0.08] bg-[#07111F]/55 p-4">
      <p className="text-xs text-[#AEBCCC]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
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
    proposed: {
      label: "Proposta",
      color: "#F5A623",
    },

    approved: {
      label: "Approvata",
      color: "#24D27C",
    },

    rejected: {
      label: "Rifiutata",
      color: "#FF5D73",
    },

    converted_to_mission: {
      label: "Missione creata",
      color: "#6D4FD2",
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
        color:
          current.color,

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
        borderColor:
          `${color}35`,
        backgroundColor:
          `${color}12`,
      }}
    >
      Rischio {risk}
    </span>
  );
}

function formatCost(
  opportunity: Opportunity,
) {
  const minimum =
    opportunity.estimated_cost_min;

  const maximum =
    opportunity.estimated_cost_max;

  if (
    minimum === null &&
    maximum === null
  ) {
    return "Da stimare";
  }

  const formatter =
    new Intl.NumberFormat(
      "it-IT",
      {
        style: "currency",
        currency:
          opportunity.currency ||
          "EUR",
        maximumFractionDigits: 0,
      },
    );

  if (
    minimum !== null &&
    maximum !== null
  ) {
    return `${formatter.format(
      minimum,
    )} – ${formatter.format(
      maximum,
    )}`;
  }

  return formatter.format(
    minimum ?? maximum ?? 0,
  );
}
