"use client";

import {
  AlertTriangle,
  Archive,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  FileText,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  Play,
  RefreshCcw,
  RotateCcw,
  Send,
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

type Artifact = {
  id: string;
  run_id: string;
  automation_id: string;
  artifact_key: string;
  artifact_type: string;
  title: string;
  description: string;
  content: string;
  channel: string;
  status: string;
  approval_required: boolean;
  external_execution_blocked: boolean;
  decision_note: string | null;

  automation_blueprints?: {
    id: string;
    name: string;
    objective: string;
    risk_level: string;
    status: string;
  };
};

type QueueItem = {
  id: string;
  artifact_id: string;
  target_channel: string;
  status: string;
  external_execution_allowed: boolean;
  block_reason: string | null;
};

type CenterData = {
  status: string;

  business: {
    id: string;
    name: string;
    sector: string;
    city: string | null;
    primary_goal: string | null;
  };

  runs: Array<{
    id: string;
    status: string;
    created_at: string;
    started_at: string | null;
    finished_at: string | null;
    output_payload?: {
      result?: {
        confidence?: number;
        executiveSummary?: string;
        completedInternalActions?: unknown[];
        blockedExternalActions?: unknown[];
        verificationChecks?: unknown[];
        recommendedNextSteps?: string[];
        limitations?: string[];
      };
    };

    automation_blueprints?: {
      id: string;
      name: string;
      objective: string;
      risk_level: string;
      status: string;
    };
  }>;

  artifacts: Artifact[];
  queue: QueueItem[];
};

export function AutomationControlCenter({
  businessId,
}: {
  businessId: string;
}) {
  const [data, setData] =
    useState<CenterData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedArtifactId, setSelectedArtifactId] =
    useState<string | null>(null);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [statusFilter, setStatusFilter] =
    useState("all");

  const loadData = useCallback(
    async (manual = false) => {
      if (manual) {
        setRefreshing(true);
      }

      try {
        const response = await fetch(
          `/api/core/automation-center?businessId=${encodeURIComponent(
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
              "Automation Control Center non disponibile.",
          );
        }

        setData(payload);

        setSelectedArtifactId(
          (current) =>
            current ||
            payload.artifacts?.[0]
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
        setRefreshing(false);
      }
    },
    [businessId],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function decideArtifact(
    artifactId: string,
    action:
      | "approve"
      | "reject"
      | "queue"
      | "restore",
  ) {
    const messages = {
      approve:
        "Confermi l’approvazione di questo artefatto?",
      reject:
        "Confermi il rifiuto di questo artefatto?",
      queue:
        "Inserire l’artefatto nella coda? Rimarrà bloccato finché l’integrazione esterna non sarà attiva.",
      restore:
        "Riportare l’artefatto allo stato di bozza?",
    };

    if (
      !window.confirm(messages[action])
    ) {
      return;
    }

    setProcessingId(artifactId);

    try {
      const response = await fetch(
        `/api/core/automation-artifacts/${artifactId}`,
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
                ? "Artefatto verificato e approvato."
                : action === "reject"
                  ? "Artefatto non approvato."
                  : action === "queue"
                    ? "Inserimento nella futura coda di esecuzione."
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

  const filteredArtifacts = useMemo(
    () =>
      data?.artifacts.filter(
        (artifact) =>
          statusFilter === "all" ||
          artifact.status ===
            statusFilter,
      ) ?? [],
    [data, statusFilter],
  );

  const selectedArtifact =
    data?.artifacts.find(
      (artifact) =>
        artifact.id ===
        selectedArtifactId,
    ) ??
    filteredArtifacts[0] ??
    null;

  const queueByArtifact =
    new Map(
      (data?.queue ?? []).map(
        (item) => [
          item.artifact_id,
          item,
        ],
      ),
    );

  const counters = useMemo(() => {
    const artifacts =
      data?.artifacts ?? [];

    return {
      total: artifacts.length,

      drafts: artifacts.filter(
        (artifact) =>
          artifact.status === "draft",
      ).length,

      approved: artifacts.filter(
        (artifact) =>
          artifact.status ===
          "approved",
      ).length,

      queued: artifacts.filter(
        (artifact) =>
          artifact.status ===
          "queued",
      ).length,
    };
  }, [data]);

  if (loading) {
    return (
      <LoadingState />
    );
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

  const latestRun =
    data.runs[0];

  const confidence = Math.round(
    (latestRun?.output_payload
      ?.result?.confidence ?? 0) *
      100,
  );

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Artefatti"
          value={`${counters.total}`}
          detail="Materiali persistenti"
          icon={FileText}
          color="#2492E8"
        />

        <Metric
          label="Bozze"
          value={`${counters.drafts}`}
          detail="Da revisionare"
          icon={Clock3}
          color="#F5A623"
        />

        <Metric
          label="Approvati"
          value={`${counters.approved}`}
          detail="Pronti per la coda"
          icon={CheckCircle2}
          color="#24D27C"
        />

        <Metric
          label="In coda"
          value={`${counters.queued}`}
          detail="Esecuzione bloccata"
          icon={ListChecks}
          color="#6D4FD2"
        />

        <Metric
          label="Confidence"
          value={`${confidence}%`}
          detail="Ultimo automation run"
          icon={ShieldCheck}
          color="#FF6B1A"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
          <header className="border-b border-white/[0.08] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                  Artifact workspace
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  Materiali generati
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  void loadData(true)
                }
                disabled={refreshing}
                className="flex size-10 items-center justify-center rounded-[11px] border border-white/[0.09] bg-white/[0.035] transition hover:bg-white/[0.07]"
              >
                <RefreshCcw
                  size={15}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value,
                )
              }
              className="mt-5 min-h-11 w-full rounded-[11px] border border-white/[0.09] bg-[#07111F]/65 px-3 text-sm outline-none"
            >
              <option value="all">
                Tutti gli stati
              </option>

              <option value="draft">
                Bozze
              </option>

              <option value="approved">
                Approvati
              </option>

              <option value="rejected">
                Rifiutati
              </option>

              <option value="queued">
                In coda
              </option>
            </select>
          </header>

          <div className="max-h-[760px] divide-y divide-white/[0.065] overflow-y-auto">
            {filteredArtifacts.map(
              (artifact) => (
                <button
                  key={artifact.id}
                  type="button"
                  onClick={() =>
                    setSelectedArtifactId(
                      artifact.id,
                    )
                  }
                  className={`w-full p-5 text-left transition ${
                    selectedArtifact?.id ===
                    artifact.id
                      ? "bg-[#2492E8]/[0.08]"
                      : "hover:bg-white/[0.025]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <ArtifactTypeBadge
                      type={
                        artifact.artifact_type
                      }
                    />

                    <StatusBadge
                      status={
                        artifact.status
                      }
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold leading-6">
                    {artifact.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#AEBCCC]">
                    {artifact.description}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-[#79C6F5]">
                    {artifact.channel}
                  </p>
                </button>
              ),
            )}

            {filteredArtifacts.length ===
              0 && (
              <div className="p-8 text-center">
                <Archive
                  size={22}
                  className="mx-auto text-[#607089]"
                />

                <p className="mt-4 text-sm text-[#AEBCCC]">
                  Nessun artefatto con
                  questo filtro.
                </p>
              </div>
            )}
          </div>
        </article>

        {selectedArtifact ? (
          <ArtifactDetail
            artifact={
              selectedArtifact
            }
            queueItem={queueByArtifact.get(
              selectedArtifact.id,
            )}
            processing={
              processingId ===
              selectedArtifact.id
            }
            decideArtifact={
              decideArtifact
            }
          />
        ) : (
          <article className="flex min-h-[650px] items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
            <p className="text-sm text-[#AEBCCC]">
              Seleziona un artefatto.
            </p>
          </article>
        )}
      </section>

      {latestRun && (
        <section className="grid gap-5 xl:grid-cols-[1fr_390px]">
          <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
              Ultima esecuzione
            </p>

            <h2 className="mt-3 text-xl font-semibold">
              {latestRun
                .automation_blueprints
                ?.name ||
                "Automazione UVIQ"}
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#C8D4E1]">
              {latestRun
                .output_payload
                ?.result
                ?.executiveSummary ||
                "Riepilogo non disponibile."}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#F5A623]/18 bg-[#F5A623]/[0.045] p-6">
            <div className="flex items-start gap-4">
              <LockKeyhole
                size={18}
                className="mt-0.5 shrink-0 text-[#F8C867]"
              />

              <div>
                <h3 className="text-sm font-semibold">
                  Coda protetta
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#C8D4E1]">
                  Gli artefatti approvati possono
                  entrare in coda, ma nessuna azione
                  esterna è ancora consentita.
                </p>
              </div>
            </div>
          </article>
        </section>
      )}
    </div>
  );
}

function ArtifactDetail({
  artifact,
  queueItem,
  processing,
  decideArtifact,
}: {
  artifact: Artifact;
  queueItem?: QueueItem;
  processing: boolean;

  decideArtifact: (
    artifactId: string,
    action:
      | "approve"
      | "reject"
      | "queue"
      | "restore",
  ) => Promise<void>;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
      <header className="border-b border-white/[0.08] p-6 md:p-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <ArtifactTypeBadge
                type={
                  artifact.artifact_type
                }
              />

              <StatusBadge
                status={
                  artifact.status
                }
              />

              {artifact.external_execution_blocked && (
                <span className="rounded-full border border-[#F5A623]/20 bg-[#F5A623]/10 px-3 py-1 text-xs font-semibold text-[#F8C867]">
                  Esecuzione esterna bloccata
                </span>
              )}
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
              {artifact.title}
            </h2>

            <p className="mt-3 max-w-4xl text-sm leading-7 text-[#B8C5D4]">
              {artifact.description}
            </p>
          </div>

          <span className="rounded-[12px] border border-white/[0.08] bg-[#07111F]/55 px-4 py-3 text-xs font-semibold text-[#79C6F5]">
            {artifact.channel}
          </span>
        </div>
      </header>

      <div className="p-6 md:p-7">
        <div className="rounded-[16px] border border-white/[0.08] bg-[#07111F]/55 p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
            Contenuto
          </p>

          <div className="mt-5 whitespace-pre-wrap text-sm leading-8 text-[#E1E8F0]">
            {artifact.content}
          </div>
        </div>

        {queueItem && (
          <div className="mt-5 rounded-[16px] border border-[#F5A623]/20 bg-[#F5A623]/[0.055] p-5">
            <div className="flex items-start gap-4">
              <LockKeyhole
                size={18}
                className="mt-0.5 shrink-0 text-[#F8C867]"
              />

              <div>
                <h3 className="text-sm font-semibold">
                  Presente nella coda
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#C8D4E1]">
                  Stato: {queueItem.status}.{" "}
                  {queueItem.block_reason}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {artifact.status ===
            "draft" && (
            <>
              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void decideArtifact(
                    artifact.id,
                    "reject",
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-[#FF5D73]/25 bg-[#FF5D73]/[0.07] px-5 text-sm font-semibold text-[#FF9AAA] transition hover:bg-[#FF5D73]/[0.13]"
              >
                <X size={15} />
                Rifiuta
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void decideArtifact(
                    artifact.id,
                    "approve",
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-[11px] bg-[#24D27C] px-5 text-sm font-semibold text-[#07111F] transition hover:bg-[#46DE91]"
              >
                {processing ? (
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={15} />
                )}
                Approva artefatto
              </button>
            </>
          )}

          {artifact.status ===
            "approved" && (
            <>
              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void decideArtifact(
                    artifact.id,
                    "restore",
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold transition hover:bg-white/[0.07]"
              >
                <RotateCcw size={15} />
                Torna in bozza
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void decideArtifact(
                    artifact.id,
                    "queue",
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-[11px] bg-[#FF6B1A] px-5 text-sm font-semibold transition hover:bg-[#FF7D34]"
              >
                <Send size={15} />
                Invia alla coda
              </button>
            </>
          )}

          {[
            "rejected",
            "queued",
          ].includes(
            artifact.status,
          ) && (
            <button
              type="button"
              disabled={processing}
              onClick={() =>
                void decideArtifact(
                  artifact.id,
                  "restore",
                )
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold transition hover:bg-white/[0.07]"
            >
              <RotateCcw size={15} />
              Ripristina bozza
            </button>
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
  icon: typeof FileText;
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

      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#AEBCCC]">
        {detail}
      </p>
    </article>
  );
}

function ArtifactTypeBadge({
  type,
}: {
  type: string;
}) {
  const labels: Record<
    string,
    string
  > = {
    strategy: "Strategia",
    content_brief: "Content brief",
    social_post: "Social post",
    reel_concept: "Reel",
    seo_plan: "SEO plan",
    campaign_plan: "Campagna",
    email_draft: "Email",
    whatsapp_draft: "WhatsApp",
    competitor_report:
      "Competitor report",
    task: "Task",
    checklist: "Checklist",
  };

  return (
    <span className="rounded-full border border-[#2492E8]/20 bg-[#2492E8]/10 px-3 py-1 text-xs font-semibold text-[#79C6F5]">
      {labels[type] ?? type}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const meta: Record<
    string,
    {
      label: string;
      color: string;
    }
  > = {
    draft: {
      label: "Bozza",
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
    queued: {
      label: "In coda",
      color: "#6D4FD2",
    },
  };

  const current =
    meta[status] ?? {
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

function LoadingState() {
  return (
    <div className="flex min-h-[550px] flex-col items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
      <LoaderCircle
        size={28}
        className="animate-spin text-[#79C6F5]"
      />

      <p className="mt-4 text-sm text-[#B8C5D4]">
        Caricamento Automation Control Center…
      </p>
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
    <div className="flex min-h-[550px] flex-col items-center justify-center rounded-[22px] border border-[#FF5D73]/20 bg-[#0B1628] px-6 text-center">
      <AlertTriangle
        size={28}
        className="text-[#FF8191]"
      />

      <h3 className="mt-5 text-xl font-semibold">
        Control Center non disponibile
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
