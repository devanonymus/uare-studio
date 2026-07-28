"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Database,
  Link2,
  LoaderCircle,
  Network,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type GraphNode = {
  id: string;
  node_type: string;
  label: string;
  description: string | null;
  status: string;
  confidence: number | null;
  attributes: Record<string, unknown>;
};

type GraphEdge = {
  id: string;
  source_node_id: string;
  target_node_id: string;
  relation_type: string;
  confidence: number;
};

type GraphData = {
  status: string;

  business: {
    id: string;
    name: string;
    sector: string;
    city: string | null;
    primary_goal: string | null;
  };

  snapshot: {
    id: string;
    node_count: number;
    edge_count: number;
    source_counts: Record<string, number>;
    created_at: string;
  } | null;

  nodes: GraphNode[];
  edges: GraphEdge[];
};

export function KnowledgeGraphWorkspace({
  businessId,
}: {
  businessId: string;
}) {
  const [data, setData] =
    useState<GraphData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [building, setBuilding] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedType, setSelectedType] =
    useState("all");

  const loadData = useCallback(
    async () => {
      try {
        const response = await fetch(
          `/api/core/knowledge-graph?businessId=${encodeURIComponent(
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
              "Knowledge Graph non disponibile.",
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
      }
    },
    [businessId],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function rebuildGraph() {
    setBuilding(true);

    try {
      const response = await fetch(
        "/api/core/knowledge-graph",
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
            "Ricostruzione fallita.",
        );
      }

      await loadData();
    } catch (caughtError) {
      window.alert(
        caughtError instanceof Error
          ? caughtError.message
          : "Errore sconosciuto.",
      );
    } finally {
      setBuilding(false);
    }
  }

  const nodeTypes = useMemo(
    () =>
      Array.from(
        new Set(
          data?.nodes.map(
            (node) =>
              node.node_type,
          ) ?? [],
        ),
      ).sort(),
    [data],
  );

  const filteredNodes = useMemo(
    () =>
      data?.nodes.filter(
        (node) =>
          selectedType === "all" ||
          node.node_type ===
            selectedType,
      ) ?? [],
    [data, selectedType],
  );

  const verifiedNodes =
    data?.nodes.filter(
      (node) =>
        node.status === "verified",
    ).length ?? 0;

  const inferredNodes =
    data?.nodes.filter(
      (node) =>
        node.status === "inferred",
    ).length ?? 0;

  if (loading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
        <LoaderCircle
          size={28}
          className="animate-spin text-[#79C6F5]"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[22px] border border-[#FF5D73]/20 bg-[#0B1628] px-6 text-center">
        <AlertTriangle
          size={28}
          className="text-[#FF8191]"
        />

        <h3 className="mt-5 text-xl font-semibold">
          Knowledge Graph non disponibile
        </h3>

        <p className="mt-3 text-sm text-[#B8C5D4]">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Nodi"
          value={`${data.nodes.length}`}
          detail="Entità aziendali"
          icon={CircleDot}
          color="#2492E8"
        />

        <Metric
          label="Relazioni"
          value={`${data.edges.length}`}
          detail="Collegamenti registrati"
          icon={Link2}
          color="#6D4FD2"
        />

        <Metric
          label="Verificati"
          value={`${verifiedNodes}`}
          detail="Dati confermati"
          icon={CheckCircle2}
          color="#24D27C"
        />

        <Metric
          label="Inferenze"
          value={`${inferredNodes}`}
          detail="Da mantenere distinte"
          icon={ShieldCheck}
          color="#F5A623"
        />
      </section>

      <section className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
              Enterprise Knowledge Layer
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              {data.business.name}
            </h2>

            <p className="mt-2 text-sm text-[#B8C5D4]">
              {data.business.sector}
              {data.business.city
                ? ` · ${data.business.city}`
                : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void rebuildGraph()
            }
            disabled={building}
            className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] bg-[#FF6B1A] px-5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {building ? (
              <LoaderCircle
                size={15}
                className="animate-spin"
              />
            ) : (
              <RefreshCcw size={15} />
            )}

            Ricostruisci grafo
          </button>
        </div>

        {data.snapshot && (
          <div className="mt-6 rounded-[14px] border border-white/[0.08] bg-[#07111F]/55 p-4">
            <p className="text-xs text-[#AEBCCC]">
              Ultimo snapshot
            </p>

            <p className="mt-2 text-sm font-semibold">
              {new Date(
                data.snapshot.created_at,
              ).toLocaleString("it-IT")}
            </p>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
        <header className="flex flex-col justify-between gap-4 border-b border-white/[0.08] p-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              Registro dei nodi
            </h2>

            <p className="mt-2 text-sm text-[#B8C5D4]">
              Ogni elemento conserva origine, stato e affidabilità.
            </p>
          </div>

          <select
            value={selectedType}
            onChange={(event) =>
              setSelectedType(
                event.target.value,
              )
            }
            className="min-h-11 rounded-[11px] border border-white/[0.09] bg-[#07111F] px-4 text-sm"
          >
            <option value="all">
              Tutti i tipi
            </option>

            {nodeTypes.map(
              (type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ),
            )}
          </select>
        </header>

        <div className="divide-y divide-white/[0.065]">
          {filteredNodes.map(
            (node) => (
              <article
                key={node.id}
                className="p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#2492E8]/20 bg-[#2492E8]/10 px-3 py-1 text-xs font-semibold text-[#79C6F5]">
                        {node.node_type}
                      </span>

                      <span className="rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1 text-xs text-[#C8D4E1]">
                        {node.status}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-semibold">
                      {node.label}
                    </h3>

                    {node.description && (
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-[#B8C5D4]">
                        {node.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 rounded-[12px] border border-white/[0.08] bg-[#07111F]/55 px-4 py-3">
                    <p className="text-xs text-[#AEBCCC]">
                      Confidence
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {node.confidence === null
                        ? "N/D"
                        : `${Math.round(
                            node.confidence *
                              100,
                          )}%`}
                    </p>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      </section>
    </div>
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
  icon: typeof Network;
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
