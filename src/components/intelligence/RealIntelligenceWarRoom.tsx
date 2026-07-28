"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Database,
  ExternalLink,
  FileSearch,
  Gauge,
  LoaderCircle,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
  X,
  XCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type WarRoomData = {
  status: string;

  fetchedAt: string;

  business: {
    id: string;
    organisation_id: string;
    name: string;
    sector: string;
    city: string | null;
    website_url: string | null;
    primary_goal: string | null;
  };

  run: {
    id: string;
    businessId: string;
    organisationId: string;
    status: string;
    confidence: number | null;
    missionCount: number;
    automationCount: number;
    evidenceCount: number;
    approvalCount: number;
    errorCode: string | null;
    errorMessage: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    createdAt: string;
  };

  missions: Array<{
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
    kpis: Array<{
      name: string;
      target: string;
      measurementSource?: string;
    }>;
  }>;

  automations: Array<{
    id: string;
    name: string;
    objective: string;
    status: string;
    risk_level: string;
    approval_required: boolean;
    trigger_definition: {
      event?: string;
      conditions?: string[];
    };
    action_definition: Array<{
      order?: number;
      agent?: string;
      action?: string;
      channel?: string;
    }>;
    safeguards: string[];
  }>;

  approvals: Array<{
    id: string;
    resource_type: string;
    resource_id: string;
    action: string;
    reason: string;
    risk_level: string;
    status: string;
    requested_by: string;
    assigned_role: string;
    requested_at: string;
    decision_note: string | null;
  }>;

  evidence: Array<{
    id: string;
    claim: string;
    classification: string;
    confidence: number;
    verification_note: string;
    conflict_status: string;
    verification_method: string;
  }>;

  sources: Array<{
    id: string;
    source_type: string;
    name: string;
    retrieval_status: string;
    trust_score: number;
  }>;
};

export function RealIntelligenceWarRoom({
  initialBusinessId,
}: {
  initialBusinessId?: string;
}) {
  const [data, setData] =
    useState<WarRoomData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [activeTab, setActiveTab] =
    useState<
      | "missions"
      | "automations"
      | "evidence"
      | "approvals"
    >("missions");

  const loadData = useCallback(
    async (manual = false) => {
      if (manual) {
        setRefreshing(true);
      }

      try {
        const suffix =
          initialBusinessId
            ? `?businessId=${encodeURIComponent(
                initialBusinessId,
              )}`
            : "";

        const response = await fetch(
          `/api/core/orchestrations/latest${suffix}`,
          {
            cache: "no-store",
          },
        );

        const payload =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload.error ||
              payload.message ||
              "Impossibile leggere la War Room.",
          );
        }

        setData(payload);
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
    [initialBusinessId],
  );

  useEffect(() => {
    void loadData();

    const interval =
      window.setInterval(() => {
        void loadData();
      }, 15000);

    return () =>
      window.clearInterval(interval);
  }, [loadData]);

  const pendingApprovals = useMemo(
    () =>
      data?.approvals.filter(
        (approval) =>
          approval.status ===
          "pending",
      ) ?? [],
    [data],
  );

  async function decideApproval(
    approvalId: string,
    decision:
      | "approved"
      | "rejected",
  ) {
    const confirmation =
      window.confirm(
        decision === "approved"
          ? "Confermi l’approvazione di questa azione?"
          : "Confermi il rifiuto di questa azione?",
      );

    if (!confirmation) {
      return;
    }

    setProcessingId(approvalId);

    try {
      const response = await fetch(
        `/api/core/approvals/${approvalId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            decision,
            actorId:
              "brian-laddomada",
            note:
              decision === "approved"
                ? "Approvazione effettuata dalla War Room UVIQ."
                : "Azione rifiutata dalla War Room UVIQ.",
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

  if (loading) {
    return <WarRoomLoading />;
  }

  if (error || !data) {
    return (
      <WarRoomError
        error={
          error ||
          "Nessun dato disponibile."
        }
        retry={() =>
          void loadData(true)
        }
      />
    );
  }

  const duration = calculateDuration(
    data.run.startedAt,
    data.run.finishedAt,
  );

  const confidence = Math.round(
    (data.run.confidence ?? 0) *
      100,
  );

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Stato"
          value={translateStatus(
            data.run.status,
          )}
          detail={data.run.id.slice(0, 8)}
          icon={CircleDot}
          color={statusColor(
            data.run.status,
          )}
        />

        <MetricCard
          label="Affidabilità"
          value={`${confidence}%`}
          detail="Output orchestratore"
          icon={Gauge}
          color="#2492E8"
        />

        <MetricCard
          label="Missioni"
          value={`${data.missions.length}`}
          detail="Attività operative"
          icon={Target}
          color="#FF6B1A"
        />

        <MetricCard
          label="Automazioni"
          value={`${data.automations.length}`}
          detail="Blueprint proposti"
          icon={Workflow}
          color="#6D4FD2"
        />

        <MetricCard
          label="Da approvare"
          value={`${pendingApprovals.length}`}
          detail="Decisioni pendenti"
          icon={ShieldCheck}
          color="#F5A623"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <RunStatusBadge
                  status={data.run.status}
                />

                <span className="rounded-full border border-[#24D27C]/20 bg-[#24D27C]/[0.07] px-3 py-1.5 text-xs font-semibold text-[#8AF0BA]">
                  Dati reali Supabase
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white">
                {data.business.name}
              </h2>

              <p className="mt-2 text-sm text-[#AEBCCC]">
                {data.business.sector}
                {data.business.city
                  ? ` · ${data.business.city}`
                  : ""}
              </p>

              <p className="mt-5 max-w-4xl text-sm leading-7 text-[#CBD6E2]">
                {data.business.primary_goal ||
                  "Obiettivo principale non indicato."}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void loadData(true)
              }
              disabled={refreshing}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.07] disabled:opacity-50"
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

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <RunInfo
              label="Durata"
              value={duration}
            />

            <RunInfo
              label="Evidenze"
              value={`${data.evidence.length}`}
            />

            <RunInfo
              label="Fonti"
              value={`${data.sources.length}`}
            />
          </div>

          {data.business.website_url && (
            <a
              href={
                data.business.website_url
              }
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#79C6F5] transition hover:text-white"
            >
              Apri sito analizzato
              <ExternalLink size={14} />
            </a>
          )}
        </article>

        <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
            Approval firewall
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white">
            Decisioni richieste
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#B8C5D4]">
            Nessuna azione esterna viene
            eseguita senza il livello di
            autorizzazione previsto.
          </p>

          <div className="mt-6 rounded-[16px] border border-[#F5A623]/20 bg-[#F5A623]/[0.06] p-5">
            <p className="text-xs text-[#F8C867]">
              In attesa
            </p>

            <p className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-white">
              {pendingApprovals.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveTab("approvals")
            }
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-[11px] bg-[#FF6B1A] px-5 text-sm font-semibold text-white transition hover:bg-[#FF7D34]"
          >
            Gestisci approvazioni
            <ArrowRight size={15} />
          </button>
        </article>
      </section>

      <section className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
        <header className="border-b border-white/[0.08] px-5 pt-5">
          <div className="flex flex-wrap gap-2">
            <TabButton
              active={
                activeTab === "missions"
              }
              label="Missioni"
              count={data.missions.length}
              onClick={() =>
                setActiveTab("missions")
              }
            />

            <TabButton
              active={
                activeTab ===
                "automations"
              }
              label="Automazioni"
              count={
                data.automations.length
              }
              onClick={() =>
                setActiveTab(
                  "automations",
                )
              }
            />

            <TabButton
              active={
                activeTab === "evidence"
              }
              label="Evidenze"
              count={data.evidence.length}
              onClick={() =>
                setActiveTab("evidence")
              }
            />

            <TabButton
              active={
                activeTab ===
                "approvals"
              }
              label="Approvazioni"
              count={
                pendingApprovals.length
              }
              onClick={() =>
                setActiveTab(
                  "approvals",
                )
              }
            />
          </div>
        </header>

        {activeTab === "missions" && (
          <MissionList
            missions={data.missions}
          />
        )}

        {activeTab ===
          "automations" && (
          <AutomationList
            automations={
              data.automations
            }
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceList
            evidence={data.evidence}
          />
        )}

        {activeTab ===
          "approvals" && (
          <ApprovalList
            approvals={data.approvals}
            processingId={processingId}
            decideApproval={
              decideApproval
            }
          />
        )}
      </section>
    </div>
  );
}

function MissionList({
  missions,
}: {
  missions: WarRoomData["missions"];
}) {
  if (missions.length === 0) {
    return (
      <EmptyState
        title="Nessuna missione"
        description="L’orchestratore non ha generato missioni operative."
      />
    );
  }

  return (
    <div className="divide-y divide-white/[0.065]">
      {missions.map((mission) => (
        <article
          key={mission.id}
          className="p-6"
        >
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 px-3 py-1 text-xs font-semibold text-[#FF9A64]">
                  P{mission.priority}
                </span>

                <StatusBadge
                  status={mission.status}
                />

                <RiskBadge
                  risk={
                    mission.risk_level
                  }
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                {mission.title}
              </h3>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-[#CBD6E2]">
                {mission.objective}
              </p>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-[#AEBCCC]">
                {mission.rationale}
              </p>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3 lg:w-[320px]">
              <SmallInfo
                label="Agente"
                value={
                  mission.owner_agent
                }
              />

              <SmallInfo
                label="Impatto"
                value={mission.impact}
              />

              <SmallInfo
                label="Impegno"
                value={mission.effort}
              />

              <SmallInfo
                label="Approvazione"
                value={
                  mission.approval_required
                    ? "Richiesta"
                    : "Non richiesta"
                }
              />
            </div>
          </div>

          {mission.kpis?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {mission.kpis.map(
                (kpi, index) => (
                  <span
                    key={`${mission.id}-${index}`}
                    className="rounded-[10px] border border-white/[0.08] bg-[#07111F]/55 px-3 py-2 text-xs text-[#C8D4E1]"
                  >
                    <strong className="font-semibold text-white">
                      {kpi.name}:
                    </strong>{" "}
                    {kpi.target}
                  </span>
                ),
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function AutomationList({
  automations,
}: {
  automations: WarRoomData["automations"];
}) {
  if (automations.length === 0) {
    return (
      <EmptyState
        title="Nessuna automazione"
        description="Non sono stati generati blueprint di automazione."
      />
    );
  }

  return (
    <div className="divide-y divide-white/[0.065]">
      {automations.map(
        (automation) => (
          <article
            key={automation.id}
            className="p-6"
          >
            <div className="flex flex-col justify-between gap-5 lg:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={
                      automation.status
                    }
                  />

                  <RiskBadge
                    risk={
                      automation.risk_level
                    }
                  />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  {automation.name}
                </h3>

                <p className="mt-3 max-w-4xl text-sm leading-7 text-[#CBD6E2]">
                  {automation.objective}
                </p>
              </div>

              <div className="min-w-[260px] rounded-[14px] border border-white/[0.08] bg-[#07111F]/55 p-4">
                <p className="text-xs text-[#AEBCCC]">
                  Trigger
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {automation
                    .trigger_definition
                    ?.event ||
                    "Non definito"}
                </p>

                <p className="mt-4 text-xs text-[#AEBCCC]">
                  Azioni previste
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {automation
                    .action_definition
                    ?.length ?? 0}
                </p>
              </div>
            </div>

            {automation.safeguards
              ?.length > 0 && (
              <div className="mt-5 rounded-[14px] border border-[#24D27C]/18 bg-[#24D27C]/[0.045] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8AF0BA]">
                  Salvaguardie
                </p>

                <div className="mt-3 space-y-2">
                  {automation.safeguards.map(
                    (safeguard) => (
                      <p
                        key={safeguard}
                        className="flex items-start gap-2 text-sm leading-6 text-[#C8D4E1]"
                      >
                        <Check
                          size={14}
                          className="mt-1 shrink-0 text-[#24D27C]"
                        />
                        {safeguard}
                      </p>
                    ),
                  )}
                </div>
              </div>
            )}
          </article>
        ),
      )}
    </div>
  );
}

function EvidenceList({
  evidence,
}: {
  evidence: WarRoomData["evidence"];
}) {
  if (evidence.length === 0) {
    return (
      <EmptyState
        title="Nessuna evidenza"
        description="Non sono presenti claim nel registro delle evidenze."
      />
    );
  }

  return (
    <div className="divide-y divide-white/[0.065]">
      {evidence.map((claim) => (
        <article
          key={claim.id}
          className="p-6"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div>
              <EvidenceBadge
                classification={
                  claim.classification
                }
              />

              <h3 className="mt-4 text-base font-semibold leading-7 text-white">
                {claim.claim}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#B8C5D4]">
                {claim.verification_note}
              </p>
            </div>

            <div className="grid min-w-[250px] grid-cols-2 gap-3">
              <SmallInfo
                label="Confidence"
                value={`${Math.round(
                  claim.confidence *
                    100,
                )}%`}
              />

              <SmallInfo
                label="Metodo"
                value={claim.verification_method}
              />

              <SmallInfo
                label="Conflitto"
                value={claim.conflict_status}
              />

              <SmallInfo
                label="Stato"
                value={
                  claim.classification
                }
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ApprovalList({
  approvals,
  processingId,
  decideApproval,
}: {
  approvals: WarRoomData["approvals"];
  processingId: string | null;
  decideApproval: (
    id: string,
    decision:
      | "approved"
      | "rejected",
  ) => Promise<void>;
}) {
  if (approvals.length === 0) {
    return (
      <EmptyState
        title="Nessuna approvazione"
        description="Non sono presenti decisioni da gestire."
      />
    );
  }

  return (
    <div className="divide-y divide-white/[0.065]">
      {approvals.map((approval) => {
        const pending =
          approval.status ===
          "pending";

        const processing =
          processingId === approval.id;

        return (
          <article
            key={approval.id}
            className="p-6"
          >
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={
                      approval.status
                    }
                  />

                  <RiskBadge
                    risk={
                      approval.risk_level
                    }
                  />

                  <span className="rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1 text-xs font-semibold text-[#C8D4E1]">
                    {
                      approval.resource_type
                    }
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-white">
                  {approval.action}
                </h3>

                <p className="mt-3 max-w-4xl text-sm leading-7 text-[#B8C5D4]">
                  {approval.reason}
                </p>

                <p className="mt-3 text-xs text-[#71839B]">
                  Ruolo richiesto:{" "}
                  {approval.assigned_role}
                </p>
              </div>

              {pending ? (
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() =>
                      void decideApproval(
                        approval.id,
                        "rejected",
                      )
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] border border-[#FF5D73]/25 bg-[#FF5D73]/[0.07] px-5 text-sm font-semibold text-[#FF9AAA] transition hover:bg-[#FF5D73]/[0.13] disabled:opacity-50"
                  >
                    <X size={15} />
                    Rifiuta
                  </button>

                  <button
                    type="button"
                    disabled={processing}
                    onClick={() =>
                      void decideApproval(
                        approval.id,
                        "approved",
                      )
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] bg-[#24D27C] px-5 text-sm font-semibold text-[#07111F] transition hover:bg-[#46DE91] disabled:opacity-50"
                  >
                    {processing ? (
                      <LoaderCircle
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <Check size={15} />
                    )}
                    Approva
                  </button>
                </div>
              ) : (
                <div className="shrink-0 rounded-[12px] border border-white/[0.08] bg-[#07111F]/55 px-4 py-3">
                  <p className="text-xs text-[#AEBCCC]">
                    Decisione registrata
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {translateStatus(
                      approval.status,
                    )}
                  </p>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Target;
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

      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#AEBCCC]">
        {detail}
      </p>
    </article>
  );
}

function TabButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 pb-4 pt-1 text-sm font-semibold transition ${
        active
          ? "border-[#FF6B1A] text-white"
          : "border-transparent text-[#AEBCCC] hover:text-white"
      }`}
    >
      {label}
      <span className="ml-2 rounded-full bg-white/[0.06] px-2 py-1 text-xs">
        {count}
      </span>
    </button>
  );
}

function RunInfo({
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

function SmallInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[11px] border border-white/[0.07] bg-[#07111F]/55 p-3">
      <p className="text-xs text-[#AEBCCC]">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-semibold text-white">
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
  const color =
    statusColor(status);

  return (
    <span
      className="rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        color,
        borderColor: `${color}35`,
        backgroundColor: `${color}12`,
      }}
    >
      {translateStatus(status)}
    </span>
  );
}

function RunStatusBadge({
  status,
}: {
  status: string;
}) {
  const color =
    statusColor(status);

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
      style={{
        color,
        borderColor: `${color}35`,
        backgroundColor: `${color}12`,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      {translateStatus(status)}
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

function EvidenceBadge({
  classification,
}: {
  classification: string;
}) {
  const meta =
    classification === "verified"
      ? {
          label: "Fatto verificato",
          color: "#24D27C",
        }
      : classification === "inferred"
        ? {
            label: "Inferenza",
            color: "#2492E8",
          }
        : classification === "missing"
          ? {
              label: "Dato mancante",
              color: "#FF5D73",
            }
          : {
              label: "Ipotesi",
              color: "#F5A623",
            };

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

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <FileSearch
        size={26}
        className="text-[#607089]"
      />

      <h3 className="mt-4 text-base font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[#AEBCCC]">
        {description}
      </p>
    </div>
  );
}

function WarRoomLoading() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
      <LoaderCircle
        size={28}
        className="animate-spin text-[#79C6F5]"
      />

      <p className="mt-4 text-sm text-[#B8C5D4]">
        Lettura della War Room reale…
      </p>
    </div>
  );
}

function WarRoomError({
  error,
  retry,
}: {
  error: string;
  retry: () => void;
}) {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[22px] border border-[#FF5D73]/20 bg-[#0B1628] px-6 text-center">
      <AlertTriangle
        size={28}
        className="text-[#FF8191]"
      />

      <h3 className="mt-5 text-xl font-semibold text-white">
        War Room non disponibile
      </h3>

      <p className="mt-3 max-w-xl text-sm leading-7 text-[#B8C5D4]">
        {error}
      </p>

      <button
        type="button"
        onClick={retry}
        className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-[11px] bg-[#FF6B1A] px-5 text-sm font-semibold text-white"
      >
        <RefreshCcw size={15} />
        Riprova
      </button>
    </div>
  );
}

function calculateDuration(
  startedAt: string | null,
  finishedAt: string | null,
) {
  if (!startedAt) {
    return "Non disponibile";
  }

  const start =
    new Date(startedAt).getTime();

  const end = finishedAt
    ? new Date(finishedAt).getTime()
    : Date.now();

  const seconds = Math.max(
    0,
    Math.round((end - start) / 1000),
  );

  if (seconds < 60) {
    return `${seconds} sec`;
  }

  const minutes =
    Math.floor(seconds / 60);

  const remaining =
    seconds % 60;

  return `${minutes} min ${remaining} sec`;
}

function translateStatus(
  status: string,
) {
  const labels: Record<
    string,
    string
  > = {
    queued: "In coda",
    collecting: "Raccolta dati",
    analysing: "Analisi",
    validating: "Validazione",
    persisting: "Salvataggio",
    completed: "Completata",
    failed: "Errore",
    cancelled: "Annullata",
    created: "Creata",
    ready: "Pronta",
    awaiting_approval:
      "In attesa approvazione",
    approved: "Approvata",
    rejected: "Rifiutata",
    executing: "In esecuzione",
    measuring: "Misurazione",
    optimising: "Ottimizzazione",
    pending: "In attesa",
    draft: "Bozza",
    running: "In esecuzione",
    paused: "In pausa",
    archived: "Archiviata",
  };

  return labels[status] ?? status;
}

function statusColor(status: string) {
  if (
    [
      "completed",
      "approved",
      "ready",
    ].includes(status)
  ) {
    return "#24D27C";
  }

  if (
    [
      "failed",
      "rejected",
      "cancelled",
    ].includes(status)
  ) {
    return "#FF5D73";
  }

  if (
    [
      "awaiting_approval",
      "pending",
      "queued",
    ].includes(status)
  ) {
    return "#F5A623";
  }

  return "#2492E8";
}
