"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  FileSearch,
  Filter,
  Globe2,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  QuickAuditResult,
} from "@/types/quick-audit";

const AUDIT_RESULT_KEY =
  "uare-quick-audit-result";

type AuditStatus =
  | "draft"
  | "queued"
  | "running"
  | "completed"
  | "failed";

type Confidence =
  | "Alta"
  | "Media"
  | "Bassa"
  | "Non disponibile";

type AuditRecord = {
  id: string;
  auditCode: string;
  businessName: string;
  city: string;
  sector: string;
  status: AuditStatus;
  score: number | null;
  confidence: Confidence;
  coverage: number;
  sourceCount: number;
  missingSources: number;
  updatedAt: string;
  mode: "real" | "demo" | "draft";
  nextAction: string;
  href: string;
  error?: string;
};

const demoRecords: AuditRecord[] = [
  {
    id: "demo-healthcare",
    auditCode: "UVIQ-DEMO-HEALTH-001",
    businessName: "Studio Medico Aurora",
    city: "Bari",
    sector: "Sanità e benessere",
    status: "completed",
    score: 64,
    confidence: "Media",
    coverage: 68,
    sourceCount: 4,
    missingSources: 2,
    updatedAt: "Oggi, 08:42",
    mode: "demo",
    nextAction: "Rivedi Business Twin",
    href: "/audits/analysis",
  },
  {
    id: "demo-restaurant",
    auditCode: "UVIQ-DEMO-REST-002",
    businessName: "Sakura Restaurant Lab",
    city: "Milano",
    sector: "Ristorazione",
    status: "completed",
    score: 48,
    confidence: "Media",
    coverage: 57,
    sourceCount: 3,
    missingSources: 3,
    updatedAt: "Ieri, 17:20",
    mode: "demo",
    nextAction: "Completa le fonti",
    href: "/audits/analysis",
  },
  {
    id: "demo-fitness",
    auditCode: "UVIQ-DEMO-FIT-003",
    businessName: "Northwave Fitness",
    city: "Torino",
    sector: "Fitness e sport",
    status: "running",
    score: null,
    confidence: "Non disponibile",
    coverage: 31,
    sourceCount: 2,
    missingSources: 4,
    updatedAt: "Ieri, 15:08",
    mode: "demo",
    nextAction: "Apri War Room",
    href: "/audits/war-room",
  },
  {
    id: "demo-failed",
    auditCode: "UVIQ-DEMO-B2B-004",
    businessName: "Alpine Components",
    city: "Brescia",
    sector: "Industria e B2B",
    status: "failed",
    score: null,
    confidence: "Non disponibile",
    coverage: 14,
    sourceCount: 1,
    missingSources: 5,
    updatedAt: "18 lug, 12:31",
    mode: "demo",
    nextAction: "Controlla errore",
    href: "/audits/war-room",
    error:
      "Il sito configurato non ha risposto entro il limite previsto.",
  },
];

const statusLabels: Record<
  AuditStatus,
  string
> = {
  draft: "Bozza",
  queued: "In coda",
  running: "In esecuzione",
  completed: "Completata",
  failed: "Errore",
};

const statusColors: Record<
  AuditStatus,
  string
> = {
  draft: "#AEBCCC",
  queued: "#F5A623",
  running: "#2492E8",
  completed: "#24D27C",
  failed: "#FF5D73",
};

export function AuditsArchive() {
  const [records, setRecords] =
    useState<AuditRecord[]>(demoRecords);

  const [query, setQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [sectorFilter, setSectorFilter] =
    useState("all");

  const [modeFilter, setModeFilter] =
    useState("all");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  useEffect(() => {
    const stored =
      window.localStorage.getItem(
        AUDIT_RESULT_KEY,
      );

    if (!stored) {
      return;
    }

    try {
      const audit =
        JSON.parse(
          stored,
        ) as QuickAuditResult;

      const realRecord: AuditRecord = {
        id: "current-local-audit",
        auditCode: audit.auditCode,
        businessName:
          audit.input.restaurantName ||
          "Attività senza nome",
        city:
          audit.input.city ||
          "Località non indicata",
        sector:
          audit.input.category ||
          "Ristorazione",
        status: "completed",
        score: audit.overallScore,
        confidence:
          audit.intelligence
            ?.confidence !== undefined
            ? audit.intelligence
                .confidence >= 75
              ? "Alta"
              : audit.intelligence
                    .confidence >= 50
                ? "Media"
                : "Bassa"
            : "Bassa",
        coverage:
          audit.intelligence
            ?.confidence ?? 42,
        sourceCount: 3,
        missingSources:
          audit.intelligence
            ?.limitations.length ?? 2,
        updatedAt: new Intl.DateTimeFormat(
          "it-IT",
          {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          },
        ).format(
          new Date(
            audit.generatedAt,
          ),
        ),
        mode:
          audit.demoAnalysis
            ? "demo"
            : "real",
        nextAction:
          "Apri Business Twin",
        href: "/audits/analysis",
      };

      setRecords((current) => [
        realRecord,
        ...current.filter(
          (record) =>
            record.id !==
            realRecord.id,
        ),
      ]);
    } catch {
      // Il dato locale non è valido:
      // l'archivio continua a mostrare i casi demo.
    }
  }, []);

  const sectors = useMemo(
    () =>
      Array.from(
        new Set(
          records.map(
            (record) =>
              record.sector,
          ),
        ),
      ).sort(),
    [records],
  );

  const filteredRecords = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          record.businessName,
          record.city,
          record.auditCode,
          record.sector,
        ]
          .join(" ")
          .toLowerCase()
          .includes(
            normalizedQuery,
          );

      const matchesStatus =
        statusFilter === "all" ||
        record.status ===
          statusFilter;

      const matchesSector =
        sectorFilter === "all" ||
        record.sector ===
          sectorFilter;

      const matchesMode =
        modeFilter === "all" ||
        record.mode ===
          modeFilter;

      return (
        matchesQuery &&
        matchesStatus &&
        matchesSector &&
        matchesMode
      );
    });
  }, [
    modeFilter,
    query,
    records,
    sectorFilter,
    statusFilter,
  ]);

  const completedCount =
    records.filter(
      (record) =>
        record.status ===
        "completed",
    ).length;

  const runningCount =
    records.filter(
      (record) =>
        record.status ===
          "running" ||
        record.status ===
          "queued",
    ).length;

  const failedCount =
    records.filter(
      (record) =>
        record.status ===
        "failed",
    ).length;

  const averageCoverage =
    records.length > 0
      ? Math.round(
          records.reduce(
            (total, record) =>
              total +
              record.coverage,
            0,
          ) / records.length,
        )
      : 0;

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setSectorFilter("all");
    setModeFilter("all");
  }

  function removeLocalAudit() {
    window.localStorage.removeItem(
      AUDIT_RESULT_KEY,
    );

    setRecords((current) =>
      current.filter(
        (record) =>
          record.id !==
          "current-local-audit",
      ),
    );

    setSelectedId(null);
  }

  const hasActiveFilters =
    query ||
    statusFilter !== "all" ||
    sectorFilter !== "all" ||
    modeFilter !== "all";

  return (
    <div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ArchiveMetric
          label="Analisi archiviate"
          value={`${records.length}`}
          detail="Incluse quelle dimostrative"
          icon={FileSearch}
          color="#2492E8"
        />

        <ArchiveMetric
          label="Completate"
          value={`${completedCount}`}
          detail="Con risultato disponibile"
          icon={CheckCircle2}
          color="#24D27C"
        />

        <ArchiveMetric
          label="In esecuzione"
          value={`${runningCount}`}
          detail="Sessioni attive o in coda"
          icon={Clock3}
          color="#F5A623"
        />

        <ArchiveMetric
          label="Copertura media"
          value={`${averageCoverage}%`}
          detail={`${failedCount} sessioni con errore`}
          icon={ShieldCheck}
          color="#6D4FD2"
        />
      </section>

      <section className="mt-5 overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
        <header className="border-b border-white/[0.08] px-6 py-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                Intelligence archive
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                Analisi e sessioni
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#B8C5D4]">
                Cerca, filtra e verifica lo stato
                delle analisi presenti nel workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setFiltersOpen(
                    (current) =>
                      !current,
                  )
                }
                className={`inline-flex min-h-11 items-center justify-center gap-3 rounded-[12px] border px-5 text-sm font-semibold transition ${
                  filtersOpen ||
                  hasActiveFilters
                    ? "border-[#2492E8]/35 bg-[#2492E8]/10 text-white"
                    : "border-white/[0.1] bg-white/[0.035] text-white hover:bg-white/[0.065]"
                }`}
              >
                <SlidersHorizontal size={15} />
                Filtri

                {hasActiveFilters && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#2492E8] text-xs">
                    !
                  </span>
                )}
              </button>

              <Link
                href="/audits/new"
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[12px] bg-[#FF6B1A] px-5 text-sm font-semibold text-white transition hover:bg-[#FF7D34]"
              >
                <Plus size={16} />
                Nuova analisi
              </Link>
            </div>
          </div>

          <div className="relative mt-6">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA2B9]"
            />

            <input
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value,
                )
              }
              placeholder="Cerca azienda, città, settore o codice audit"
              className="min-h-12 w-full rounded-[13px] border border-white/[0.1] bg-[#07111F]/70 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-[#8496AC] focus:border-[#2492E8]/55 focus:ring-4 focus:ring-[#2492E8]/10"
            />

            {query && (
              <button
                type="button"
                onClick={() =>
                  setQuery("")
                }
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-[9px] text-[#9EADC0] transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Cancella ricerca"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {filtersOpen && (
            <div className="mt-4 grid gap-3 rounded-[16px] border border-white/[0.08] bg-[#07111F]/55 p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <FilterField
                label="Stato"
                value={statusFilter}
                onChange={
                  setStatusFilter
                }
                options={[
                  {
                    value: "all",
                    label: "Tutti gli stati",
                  },
                  {
                    value: "draft",
                    label: "Bozza",
                  },
                  {
                    value: "queued",
                    label: "In coda",
                  },
                  {
                    value: "running",
                    label: "In esecuzione",
                  },
                  {
                    value: "completed",
                    label: "Completata",
                  },
                  {
                    value: "failed",
                    label: "Errore",
                  },
                ]}
              />

              <FilterField
                label="Settore"
                value={sectorFilter}
                onChange={
                  setSectorFilter
                }
                options={[
                  {
                    value: "all",
                    label: "Tutti i settori",
                  },
                  ...sectors.map(
                    (sector) => ({
                      value: sector,
                      label: sector,
                    }),
                  ),
                ]}
              />

              <FilterField
                label="Tipologia"
                value={modeFilter}
                onChange={
                  setModeFilter
                }
                options={[
                  {
                    value: "all",
                    label: "Tutte",
                  },
                  {
                    value: "real",
                    label: "Operative",
                  },
                  {
                    value: "demo",
                    label: "Dimostrative",
                  },
                  {
                    value: "draft",
                    label: "Bozze",
                  },
                ]}
              />

              <button
                type="button"
                onClick={clearFilters}
                disabled={
                  !hasActiveFilters
                }
                className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] border border-white/[0.09] bg-white/[0.035] px-4 text-sm font-semibold transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <RefreshCcw size={14} />
                Azzera
              </button>
            </div>
          )}
        </header>

        {filteredRecords.length >
        0 ? (
          <>
            <div className="hidden grid-cols-[1.35fr_0.68fr_0.58fr_0.55fr_0.6fr_auto] border-b border-white/[0.07] bg-[#091321] px-6 py-4 text-xs font-semibold text-[#AEBCCC] lg:grid">
              <span>Attività</span>
              <span>Stato</span>
              <span>Score</span>
              <span>Copertura</span>
              <span>Aggiornata</span>
              <span />
            </div>

            <div className="divide-y divide-white/[0.065]">
              {filteredRecords.map(
                (record) => (
                  <AuditRow
                    key={record.id}
                    record={record}
                    selected={
                      selectedId ===
                      record.id
                    }
                    onToggleMenu={() =>
                      setSelectedId(
                        selectedId ===
                          record.id
                          ? null
                          : record.id,
                      )
                    }
                    onRemove={
                      record.id ===
                      "current-local-audit"
                        ? removeLocalAudit
                        : undefined
                    }
                  />
                ),
              )}
            </div>
          </>
        ) : (
          <EmptyArchive
            hasFilters={
              Boolean(
                hasActiveFilters,
              )
            }
            clearFilters={
              clearFilters
            }
          />
        )}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_390px]">
        <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border border-[#F5A623]/20 bg-[#F5A623]/10 text-[#F8C867]">
              <AlertTriangle size={18} />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F8C867]">
                Data quality
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                Un’analisi completata non è
                necessariamente completa.
              </h2>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-[#C8D4E1]">
                Prima di utilizzare uno score
                commerciale, verifica copertura,
                affidabilità, fonti mancanti e
                modalità di analisi.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[22px] border border-[#2492E8]/18 bg-[#2492E8]/[0.045] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
            Azione consigliata
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            Completa il primo caso reale
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#C8D4E1]">
            Collega Discovery, fonti pubbliche e
            dati aziendali prima di preparare il
            documento commerciale.
          </p>

          <Link
            href="/projects/new"
            className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#FF9A64] transition hover:text-white"
          >
            Apri nuovo progetto
            <ArrowRight
              size={14}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </article>
      </section>
    </div>
  );
}

function AuditRow({
  record,
  selected,
  onToggleMenu,
  onRemove,
}: {
  record: AuditRecord;
  selected: boolean;
  onToggleMenu: () => void;
  onRemove?: () => void;
}) {
  const statusColor =
    statusColors[record.status];

  const scoreColor =
    record.score === null
      ? "#AEBCCC"
      : record.score < 40
        ? "#FF5D73"
        : record.score < 65
          ? "#F5A623"
          : "#24D27C";

  return (
    <article className="relative px-6 py-5 transition hover:bg-white/[0.02]">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.68fr_0.58fr_0.55fr_0.6fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-white">
              {record.businessName}
            </h3>

            <ModeBadge
              mode={record.mode}
            />
          </div>

          <p className="mt-1 text-sm text-[#AEBCCC]">
            {record.city} ·{" "}
            {record.sector}
          </p>

          <p className="mt-2 font-mono text-xs text-[#71839B]">
            {record.auditCode}
          </p>

          {record.error && (
            <div className="mt-3 flex max-w-2xl items-start gap-2 rounded-[10px] border border-[#FF5D73]/18 bg-[#FF5D73]/[0.06] px-3 py-2 text-xs leading-5 text-[#FF9AAA]">
              <AlertTriangle
                size={13}
                className="mt-0.5 shrink-0"
              />
              {record.error}
            </div>
          )}
        </div>

        <div>
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{
              color: statusColor,
            }}
          >
            <StatusIcon
              status={
                record.status
              }
            />

            {
              statusLabels[
                record.status
              ]
            }
          </span>
        </div>

        <div>
          <p
            className="text-lg font-semibold"
            style={{
              color: scoreColor,
            }}
          >
            {record.score ??
              "—"}
          </p>

          <p className="mt-1 text-xs text-[#AEBCCC]">
            Confidenza:{" "}
            {record.confidence}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-white">
              {record.coverage}%
            </span>

            <span className="text-[#AEBCCC]">
              {record.sourceCount} fonti
            </span>
          </div>

          <div className="mt-2 h-1.5 max-w-[130px] overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-[#2492E8]"
              style={{
                width: `${record.coverage}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-[#AEBCCC]">
            {record.missingSources} mancanti
          </p>
        </div>

        <p className="text-sm text-[#B8C5D4]">
          {record.updatedAt}
        </p>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <Link
            href={record.href}
            className="group inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-white/[0.09] bg-white/[0.035] px-4 text-sm font-semibold transition hover:border-[#2492E8]/35 hover:bg-white/[0.07]"
          >
            {record.nextAction}
            <ChevronRight
              size={14}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>

          <button
            type="button"
            onClick={onToggleMenu}
            className="flex size-10 items-center justify-center rounded-[10px] text-[#AEBCCC] transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Altre azioni"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>

      {selected && (
        <div className="absolute right-6 top-[76px] z-20 min-w-[220px] overflow-hidden rounded-[13px] border border-white/[0.1] bg-[#101D31] p-2 shadow-[0_20px_55px_rgba(0,0,0,.4)]">
          <Link
            href={record.href}
            className="flex min-h-10 items-center gap-3 rounded-[9px] px-3 text-sm font-medium transition hover:bg-white/[0.06]"
          >
            <Globe2
              size={15}
              className="text-[#79C6F5]"
            />
            Apri dettaglio
          </Link>

          <Link
            href="/reports"
            className="flex min-h-10 items-center gap-3 rounded-[9px] px-3 text-sm font-medium transition hover:bg-white/[0.06]"
          >
            <BarChart3
              size={15}
              className="text-[#6D4FD2]"
            />
            Apri report
          </Link>

          {onRemove && (
            <>
              <div className="my-2 h-px bg-white/[0.07]" />

              <button
                type="button"
                onClick={onRemove}
                className="flex min-h-10 w-full items-center gap-3 rounded-[9px] px-3 text-left text-sm font-medium text-[#FF8191] transition hover:bg-[#FF5D73]/10"
              >
                <Trash2 size={15} />
                Rimuovi dato locale
              </button>
            </>
          )}
        </div>
      )}
    </article>
  );
}

function StatusIcon({
  status,
}: {
  status: AuditStatus;
}) {
  if (status === "completed") {
    return (
      <CheckCircle2 size={14} />
    );
  }

  if (status === "failed") {
    return (
      <AlertTriangle size={14} />
    );
  }

  if (status === "running") {
    return (
      <CircleDot
        size={14}
        className="animate-pulse"
      />
    );
  }

  if (status === "queued") {
    return <Clock3 size={14} />;
  }

  return <CircleDot size={14} />;
}

function ModeBadge({
  mode,
}: {
  mode: AuditRecord["mode"];
}) {
  const meta = {
    real: {
      label: "Operativa",
      color: "#24D27C",
    },
    demo: {
      label: "Demo",
      color: "#6D4FD2",
    },
    draft: {
      label: "Bozza",
      color: "#F5A623",
    },
  }[mode];

  return (
    <span
      className="rounded-full border px-2.5 py-1 text-xs font-semibold"
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

function ArchiveMetric({
  label,
  value,
  detail,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof FileSearch;
  color: string;
}) {
  return (
    <article className="rounded-[18px] border border-white/[0.08] bg-[#0B1628] p-5">
      <span
        className="flex size-10 items-center justify-center rounded-[12px] border"
        style={{
          color,
          borderColor: `${color}35`,
          backgroundColor: `${color}12`,
        }}
      >
        <Icon size={17} />
      </span>

      <p className="mt-5 text-sm text-[#B8C5D4]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
        {value}
      </p>

      <p className="mt-2 text-sm text-[#AEBCCC]">
        {detail}
      </p>
    </article>
  );
}

function FilterField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold text-[#AEBCCC]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="min-h-11 w-full rounded-[11px] border border-white/[0.09] bg-[#0B1628] px-3 text-sm text-white outline-none transition focus:border-[#2492E8]/45"
      >
        {options.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ),
        )}
      </select>
    </label>
  );
}

function EmptyArchive({
  hasFilters,
  clearFilters,
}: {
  hasFilters: boolean;
  clearFilters: () => void;
}) {
  return (
    <div className="flex min-h-[440px] flex-col items-center justify-center px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-[18px] border border-white/[0.09] bg-white/[0.035] text-[#71839B]">
        <FileSearch size={25} />
      </span>

      <h3 className="mt-6 text-xl font-semibold">
        {hasFilters
          ? "Nessun risultato trovato"
          : "Nessuna analisi disponibile"}
      </h3>

      <p className="mt-3 max-w-lg text-sm leading-7 text-[#B8C5D4]">
        {hasFilters
          ? "Modifica i filtri o la ricerca per visualizzare altre sessioni."
          : "Avvia un progetto e completa la configurazione per creare la prima analisi."}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold"
          >
            <RefreshCcw size={14} />
            Azzera filtri
          </button>
        )}

        <Link
          href="/audits/new"
          className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] bg-[#FF6B1A] px-5 text-sm font-semibold transition hover:bg-[#FF7D34]"
        >
          <Plus size={15} />
          Nuova analisi
        </Link>
      </div>
    </div>
  );
}
