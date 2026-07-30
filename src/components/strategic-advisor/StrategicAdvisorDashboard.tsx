"use client";

import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Database,
  Gauge,
  Lightbulb,
  LoaderCircle,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

type Priority = {
  rank: number;
  title: string;
  reason: string;
  action: string;
  sourceType: string;
  sourceId: string | null;
  urgency: string;
  impact: string;
  requiresApproval: boolean;
};

type Alert = {
  level: string;
  title: string;
  description: string;
  sourceType: string;
  sourceId: string | null;
};

type Recommendation = {
  title: string;
  rationale: string;
  expectedOutcome: string;
  nextStep: string;
};

type MissingInformation = {
  field: string;
  reason: string;
  consequence: string;
};

type Brief = {
  id: string;
  brief_date: string;
  executive_summary: string;
  business_health_score: number;
  confidence: number;
  priorities: Priority[];
  alerts: Alert[];
  recommendations: Recommendation[];
  missing_information: MissingInformation[];

  metrics: {
    opportunitiesOpen: number;
    missionsActive: number;
    plansAwaitingApproval: number;
    approvalsPending: number;
    automationsReady: number;
    automationsCompleted: number;
    artifactsProduced: number;
    integrationsConnected: number;
    integrationsTotal: number;
    memoryEntries: number;
    knowledgeNodes: number;
    knowledgeEdges: number;
  };

  generated_at: string;
};

export function StrategicAdvisorDashboard({
  businessId,
}: {
  businessId: string;
}) {
  const [brief, setBrief] =
    useState<Brief | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadBrief = useCallback(
    async () => {
      try {
        const response = await fetch(
          `/api/core/strategic-advisor?businessId=${encodeURIComponent(
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
              "Brief non disponibile.",
          );
        }

        setBrief(payload.brief);
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
    },
    [businessId],
  );

  const generateBrief =
    useCallback(async () => {
      setGenerating(true);

      try {
        const response = await fetch(
          "/api/core/strategic-advisor",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              businessId,
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

        setBrief(payload.brief);
        setError(null);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Errore sconosciuto.",
        );
      } finally {
        setGenerating(false);
        setLoading(false);
      }
    }, [businessId]);

  useEffect(() => {
    void loadBrief();
  }, [loadBrief]);

  if (loading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-[24px] border border-white/[0.08] bg-[#0B1628]">
        <LoaderCircle className="animate-spin text-[#79C6F5]" />
      </div>
    );
  }

  if (!brief) {
    return (
      <section className="rounded-[24px] border border-white/[0.08] bg-[#0B1628] px-7 py-16 text-center">
        <BrainCircuit
          size={38}
          className="mx-auto text-[#79C6F5]"
        />

        <h2 className="mt-6 text-2xl font-semibold">
          Genera il primo brief strategico
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#B8C5D4]">
          UVIQ analizzerà lo stato operativo reale dell’azienda e individuerà le priorità di oggi.
        </p>

        {error && (
          <p className="mt-4 text-sm text-[#FF8191]">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() =>
            void generateBrief()
          }
          disabled={generating}
          className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-[12px] bg-[#FF6B1A] px-6 text-sm font-semibold text-white"
        >
          {generating ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <Sparkles size={16} />
          )}

          Genera Strategic Brief
        </button>
      </section>
    );
  }

  const confidence =
    Math.round(
      Number(brief.confidence) * 100,
    );

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Business Health"
          value={`${brief.business_health_score}/100`}
          detail="Stato operativo"
          icon={Gauge}
        />

        <MetricCard
          label="Priorità"
          value={`${brief.priorities.length}`}
          detail="Azioni consigliate"
          icon={Target}
        />

        <MetricCard
          label="Approvazioni"
          value={`${brief.metrics.approvalsPending}`}
          detail="Decisioni pendenti"
          icon={ShieldCheck}
        />

        <MetricCard
          label="Confidence"
          value={`${confidence}%`}
          detail="Qualità informativa"
          icon={Database}
        />
      </section>

      <section className="rounded-[24px] border border-white/[0.08] bg-[#0B1628] p-7 md:p-9">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#79C6F5]">
              Daily Strategic Brief
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
              Le priorità operative di oggi
            </h2>

            <p className="mt-5 max-w-4xl text-base leading-8 text-[#CBD6E2]">
              {brief.executive_summary}
            </p>

            <p className="mt-4 text-xs text-[#7F8EA3]">
              Aggiornato il{" "}
              {new Date(
                brief.generated_at,
              ).toLocaleString("it-IT")}
            </p>
          </div>

          <button
            type="button"
            disabled={generating}
            onClick={() =>
              void generateBrief()
            }
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold"
          >
            <RefreshCcw
              size={15}
              className={
                generating
                  ? "animate-spin"
                  : ""
              }
            />

            Rigenera
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-[24px] border border-white/[0.08] bg-[#0B1628] p-6 md:p-7">
          <div className="flex items-center gap-3">
            <Target className="text-[#FF6B1A]" />
            <h3 className="text-xl font-semibold">
              Priorità strategiche
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {brief.priorities.map(
              (priority) => (
                <div
                  key={`${priority.rank}-${priority.title}`}
                  className="rounded-[16px] border border-white/[0.08] bg-[#07111F]/55 p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2492E8]/10 text-sm font-semibold text-[#79C6F5]">
                      {priority.rank}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <UrgencyBadge
                          urgency={
                            priority.urgency
                          }
                        />

                        {priority.requiresApproval && (
                          <span className="rounded-full border border-[#F5A623]/20 bg-[#F5A623]/10 px-3 py-1 text-xs font-semibold text-[#F8C867]">
                            Approvazione
                          </span>
                        )}
                      </div>

                      <h4 className="mt-4 text-base font-semibold text-white">
                        {priority.title}
                      </h4>

                      <p className="mt-2 text-sm leading-7 text-[#B8C5D4]">
                        {priority.reason}
                      </p>

                      <div className="mt-4 flex items-start gap-2 text-sm font-medium text-[#79C6F5]">
                        <ArrowRight
                          size={15}
                          className="mt-1 shrink-0"
                        />
                        {priority.action}
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </article>

        <div className="space-y-5">
          <article className="rounded-[24px] border border-white/[0.08] bg-[#0B1628] p-6">
            <div className="flex items-center gap-3">
              <CircleAlert className="text-[#F5A623]" />
              <h3 className="text-lg font-semibold">
                Alert
              </h3>
            </div>

            <div className="mt-5 space-y-3">
              {brief.alerts.length ===
              0 ? (
                <div className="rounded-[14px] border border-[#24D27C]/15 bg-[#24D27C]/[0.055] p-4">
                  <div className="flex items-center gap-3 text-[#8AF0BA]">
                    <CheckCircle2 size={17} />
                    <p className="text-sm font-semibold">
                      Nessun alert critico
                    </p>
                  </div>
                </div>
              ) : (
                brief.alerts.map(
                  (alert) => (
                    <div
                      key={`${alert.level}-${alert.title}`}
                      className="rounded-[14px] border border-white/[0.08] bg-[#07111F]/55 p-4"
                    >
                      <p className="text-sm font-semibold text-white">
                        {alert.title}
                      </p>

                      <p className="mt-2 text-xs leading-6 text-[#B8C5D4]">
                        {alert.description}
                      </p>
                    </div>
                  ),
                )
              )}
            </div>
          </article>

          <article className="rounded-[24px] border border-white/[0.08] bg-[#0B1628] p-6">
            <div className="flex items-center gap-3">
              <Workflow className="text-[#6D4FD2]" />
              <h3 className="text-lg font-semibold">
                Operatività
              </h3>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <DataRow
                label="Opportunità aperte"
                value={
                  brief.metrics
                    .opportunitiesOpen
                }
              />

              <DataRow
                label="Missioni attive"
                value={
                  brief.metrics
                    .missionsActive
                }
              />

              <DataRow
                label="Piani da approvare"
                value={
                  brief.metrics
                    .plansAwaitingApproval
                }
              />

              <DataRow
                label="Automazioni pronte"
                value={
                  brief.metrics
                    .automationsReady
                }
              />

              <DataRow
                label="Artefatti prodotti"
                value={
                  brief.metrics
                    .artifactsProduced
                }
              />
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[24px] border border-white/[0.08] bg-[#0B1628] p-6 md:p-7">
          <div className="flex items-center gap-3">
            <Lightbulb className="text-[#F5A623]" />
            <h3 className="text-xl font-semibold">
              Raccomandazioni
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {brief.recommendations.map(
              (recommendation) => (
                <div
                  key={
                    recommendation.title
                  }
                  className="rounded-[15px] border border-white/[0.08] bg-[#07111F]/50 p-5"
                >
                  <h4 className="text-sm font-semibold text-white">
                    {recommendation.title}
                  </h4>

                  <p className="mt-3 text-sm leading-7 text-[#B8C5D4]">
                    {recommendation.rationale}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-[#79C6F5]">
                    Prossimo passo:{" "}
                    {recommendation.nextStep}
                  </p>
                </div>
              ),
            )}
          </div>
        </article>

        <article className="rounded-[24px] border border-white/[0.08] bg-[#0B1628] p-6 md:p-7">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-[#FF8191]" />
            <h3 className="text-xl font-semibold">
              Dati mancanti
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {brief.missing_information
              .length === 0 ? (
              <div className="rounded-[15px] border border-[#24D27C]/15 bg-[#24D27C]/[0.055] p-5">
                <p className="text-sm font-semibold text-[#8AF0BA]">
                  Il quadro informativo è completo.
                </p>
              </div>
            ) : (
              brief.missing_information.map(
                (item) => (
                  <div
                    key={item.field}
                    className="rounded-[15px] border border-white/[0.08] bg-[#07111F]/50 p-5"
                  >
                    <h4 className="text-sm font-semibold text-white">
                      {item.field}
                    </h4>

                    <p className="mt-3 text-sm leading-7 text-[#B8C5D4]">
                      {item.reason}
                    </p>

                    <p className="mt-3 text-xs text-[#FF9AAA]">
                      Impatto:{" "}
                      {item.consequence}
                    </p>
                  </div>
                ),
              )
            )}
          </div>
        </article>
      </section>

      {error && (
        <p className="text-sm text-[#FF8191]">
          {error}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Gauge;
}) {
  return (
    <article className="rounded-[19px] border border-white/[0.08] bg-[#0B1628] p-5">
      <Icon
        size={18}
        className="text-[#79C6F5]"
      />

      <p className="mt-4 text-sm text-[#B8C5D4]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#7F8EA3]">
        {detail}
      </p>
    </article>
  );
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-white/[0.07] bg-[#07111F]/50 px-4 py-3">
      <span className="text-[#B8C5D4]">
        {label}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

function UrgencyBadge({
  urgency,
}: {
  urgency: string;
}) {
  const values: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    critical: {
      label: "Critica",
      className:
        "border-[#FF5D73]/20 bg-[#FF5D73]/10 text-[#FF9AAA]",
    },

    high: {
      label: "Alta",
      className:
        "border-[#FF6B1A]/20 bg-[#FF6B1A]/10 text-[#FF9A64]",
    },

    medium: {
      label: "Media",
      className:
        "border-[#F5A623]/20 bg-[#F5A623]/10 text-[#F8C867]",
    },

    low: {
      label: "Bassa",
      className:
        "border-[#24D27C]/20 bg-[#24D27C]/10 text-[#8AF0BA]",
    },
  };

  const current =
    values[urgency] ??
    values.medium;

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}
