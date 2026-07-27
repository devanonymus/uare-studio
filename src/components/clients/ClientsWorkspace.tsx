"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Euro,
  FileSearch,
  Filter,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type ClientStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "client"
  | "inactive";

type ClientType =
  | "prospect"
  | "client"
  | "demo";

type ClientRecord = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  sector: string;
  stage: ClientStage;
  type: ClientType;
  opportunityValue: number;
  nextAction: string;
  nextActionDate: string;
  projects: number;
  audits: number;
  updatedAt: string;
  notes: string;
  href: string;
};

const ACTIVE_PROJECT_KEY =
  "uviq:active-project";

const demoClients: ClientRecord[] = [
  {
    id: "yammy-prospect",
    company:
      "Yammy Ristorante Giapponese",
    contact: "Referente da definire",
    email: "",
    phone: "",
    city: "Martina Franca",
    sector: "Ristorazione",
    stage: "qualified",
    type: "prospect",
    opportunityValue: 2800,
    nextAction:
      "Completare Business Discovery",
    nextActionDate: "Oggi",
    projects: 1,
    audits: 0,
    updatedAt: "Oggi, 09:45",
    notes:
      "Prospect reale inserito per preparare una proposta personalizzata.",
    href: "/projects/new/restaurant",
  },
  {
    id: "demo-healthcare",
    company: "Studio Medico Aurora",
    contact: "Caso dimostrativo",
    email: "",
    phone: "",
    city: "Bari",
    sector: "Sanità e benessere",
    stage: "proposal",
    type: "demo",
    opportunityValue: 4900,
    nextAction:
      "Mostrare report dimostrativo",
    nextActionDate: "Demo",
    projects: 1,
    audits: 1,
    updatedAt: "Ieri, 17:30",
    notes:
      "Dataset dimostrativo per presentare il flusso Healthcare.",
    href: "/reports",
  },
  {
    id: "demo-fitness",
    company: "Northwave Fitness",
    contact: "Caso dimostrativo",
    email: "",
    phone: "",
    city: "Torino",
    sector: "Fitness e sport",
    stage: "lead",
    type: "demo",
    opportunityValue: 3200,
    nextAction:
      "Completare analisi demo",
    nextActionDate: "Demo",
    projects: 1,
    audits: 1,
    updatedAt: "18 lug, 14:20",
    notes:
      "Dataset dimostrativo per testare acquisizione e retention.",
    href: "/audits",
  },
];

const stageMeta: Record<
  ClientStage,
  {
    label: string;
    color: string;
  }
> = {
  lead: {
    label: "Lead",
    color: "#AEBCCC",
  },
  qualified: {
    label: "Qualificato",
    color: "#2492E8",
  },
  proposal: {
    label: "Proposta",
    color: "#6D4FD2",
  },
  negotiation: {
    label: "Negoziazione",
    color: "#F5A623",
  },
  client: {
    label: "Cliente",
    color: "#24D27C",
  },
  inactive: {
    label: "Inattivo",
    color: "#FF5D73",
  },
};

function euro(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ClientsWorkspace() {
  const [records, setRecords] =
    useState<ClientRecord[]>(
      demoClients,
    );

  const [query, setQuery] =
    useState("");

  const [stageFilter, setStageFilter] =
    useState("all");

  const [sectorFilter, setSectorFilter] =
    useState("all");

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  useEffect(() => {
    const stored =
      window.localStorage.getItem(
        ACTIVE_PROJECT_KEY,
      );

    if (!stored) {
      return;
    }

    try {
      const project = JSON.parse(
        stored,
      ) as {
        businessName?: string;
        city?: string;
        sector?: string;
        createdAt?: string;
      };

      if (!project.businessName) {
        return;
      }

      const record: ClientRecord = {
        id: "active-local-project",
        company: project.businessName,
        contact:
          "Referente da definire",
        email: "",
        phone: "",
        city:
          project.city ||
          "Località non indicata",
        sector:
          project.sector ===
          "restaurant"
            ? "Ristorazione"
            : project.sector ||
              "Settore non definito",
        stage: "qualified",
        type: "prospect",
        opportunityValue: 0,
        nextAction:
          "Configurare Intelligence",
        nextActionDate: "Da pianificare",
        projects: 1,
        audits: 0,
        updatedAt:
          project.createdAt
            ? new Intl.DateTimeFormat(
                "it-IT",
                {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              ).format(
                new Date(
                  project.createdAt,
                ),
              )
            : "Oggi",
        notes:
          "Prospect creato dalla Business Discovery locale.",
        href: "/audits/new",
      };

      setRecords((current) => [
        record,
        ...current.filter(
          (item) =>
            item.id !== record.id &&
            item.company.toLowerCase() !==
              record.company.toLowerCase(),
        ),
      ]);
    } catch {
      // Il workspace resta operativo
      // anche senza progetto locale valido.
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
    const normalized =
      query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !normalized ||
        [
          record.company,
          record.contact,
          record.city,
          record.sector,
          record.email,
          record.phone,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      const matchesStage =
        stageFilter === "all" ||
        record.stage === stageFilter;

      const matchesSector =
        sectorFilter === "all" ||
        record.sector === sectorFilter;

      const matchesType =
        typeFilter === "all" ||
        record.type === typeFilter;

      return (
        matchesQuery &&
        matchesStage &&
        matchesSector &&
        matchesType
      );
    });
  }, [
    query,
    records,
    sectorFilter,
    stageFilter,
    typeFilter,
  ]);

  const prospects =
    records.filter(
      (record) =>
        record.type === "prospect",
    );

  const clients =
    records.filter(
      (record) =>
        record.type === "client",
    );

  const pipelineValue =
    prospects.reduce(
      (total, record) =>
        total +
        record.opportunityValue,
      0,
    );

  const proposals =
    records.filter(
      (record) =>
        record.stage === "proposal" ||
        record.stage ===
          "negotiation",
    ).length;

  const hasFilters =
    query ||
    stageFilter !== "all" ||
    sectorFilter !== "all" ||
    typeFilter !== "all";

  function resetFilters() {
    setQuery("");
    setStageFilter("all");
    setSectorFilter("all");
    setTypeFilter("all");
  }

  function removeLocalRecord() {
    window.localStorage.removeItem(
      ACTIVE_PROJECT_KEY,
    );

    setRecords((current) =>
      current.filter(
        (record) =>
          record.id !==
          "active-local-project",
      ),
    );

    setSelectedId(null);
  }

  return (
    <div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ClientMetric
          label="Prospect attivi"
          value={`${prospects.length}`}
          detail="Esclusi i casi demo"
          icon={Target}
          color="#2492E8"
        />

        <ClientMetric
          label="Clienti acquisiti"
          value={`${clients.length}`}
          detail="Nessun cliente demo incluso"
          icon={CheckCircle2}
          color="#24D27C"
        />

        <ClientMetric
          label="Valore pipeline"
          value={euro(pipelineValue)}
          detail="Valore potenziale"
          icon={Euro}
          color="#FF6B1A"
        />

        <ClientMetric
          label="Proposte aperte"
          value={`${proposals}`}
          detail="Proposta o negoziazione"
          icon={Sparkles}
          color="#6D4FD2"
        />
      </section>

      <section className="mt-5 overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
        <header className="border-b border-white/[0.08] px-6 py-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                Commercial workspace
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                Aziende e opportunità
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#B8C5D4]">
                Segui prospect, clienti, progetti
                e prossime attività commerciali.
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
                  hasFilters
                    ? "border-[#2492E8]/35 bg-[#2492E8]/10"
                    : "border-white/[0.1] bg-white/[0.035] hover:bg-white/[0.065]"
                }`}
              >
                <SlidersHorizontal size={15} />
                Filtri
              </button>

              <Link
                href="/projects/new"
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[12px] bg-[#FF6B1A] px-5 text-sm font-semibold transition hover:bg-[#FF7D34]"
              >
                <Plus size={16} />
                Nuova azienda
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
              placeholder="Cerca azienda, referente, città o settore"
              className="min-h-12 w-full rounded-[13px] border border-white/[0.1] bg-[#07111F]/70 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-[#8496AC] focus:border-[#2492E8]/55 focus:ring-4 focus:ring-[#2492E8]/10"
            />

            {query && (
              <button
                type="button"
                onClick={() =>
                  setQuery("")
                }
                aria-label="Cancella ricerca"
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-[9px] text-[#9EADC0] transition hover:bg-white/[0.06] hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {filtersOpen && (
            <div className="mt-4 grid gap-3 rounded-[16px] border border-white/[0.08] bg-[#07111F]/55 p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <FilterField
                label="Fase commerciale"
                value={stageFilter}
                onChange={
                  setStageFilter
                }
                options={[
                  {
                    value: "all",
                    label:
                      "Tutte le fasi",
                  },
                  {
                    value: "lead",
                    label: "Lead",
                  },
                  {
                    value: "qualified",
                    label: "Qualificato",
                  },
                  {
                    value: "proposal",
                    label: "Proposta",
                  },
                  {
                    value:
                      "negotiation",
                    label:
                      "Negoziazione",
                  },
                  {
                    value: "client",
                    label: "Cliente",
                  },
                  {
                    value: "inactive",
                    label: "Inattivo",
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
                    label:
                      "Tutti i settori",
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
                value={typeFilter}
                onChange={
                  setTypeFilter
                }
                options={[
                  {
                    value: "all",
                    label: "Tutte",
                  },
                  {
                    value:
                      "prospect",
                    label: "Prospect",
                  },
                  {
                    value: "client",
                    label: "Clienti",
                  },
                  {
                    value: "demo",
                    label:
                      "Casi demo",
                  },
                ]}
              />

              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasFilters}
                className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] border border-white/[0.09] bg-white/[0.035] px-4 text-sm font-semibold transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <RefreshCcw size={14} />
                Azzera
              </button>
            </div>
          )}
        </header>

        {filteredRecords.length > 0 ? (
          <>
            <div className="hidden grid-cols-[1.3fr_0.62fr_0.62fr_0.58fr_0.76fr_auto] border-b border-white/[0.07] bg-[#091321] px-6 py-4 text-xs font-semibold text-[#AEBCCC] lg:grid">
              <span>Azienda</span>
              <span>Pipeline</span>
              <span>Valore</span>
              <span>Attività</span>
              <span>Prossima azione</span>
              <span />
            </div>

            <div className="divide-y divide-white/[0.065]">
              {filteredRecords.map(
                (record) => (
                  <ClientRow
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
                      "active-local-project"
                        ? removeLocalRecord
                        : undefined
                    }
                  />
                ),
              )}
            </div>
          </>
        ) : (
          <EmptyClients
            hasFilters={
              Boolean(hasFilters)
            }
            resetFilters={
              resetFilters
            }
          />
        )}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_390px]">
        <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
              <Users size={18} />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                Regola commerciale
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                Ogni opportunità deve avere
                una prossima azione.
              </h2>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-[#C8D4E1]">
                Un prospect senza attività,
                responsabile e data di follow-up
                non deve restare nella pipeline
                come opportunità attiva.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[22px] border border-[#FF6B1A]/18 bg-[#FF6B1A]/[0.045] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#FF9A64]">
            Prossimo passo
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            Completa il primo prospect
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#C8D4E1]">
            Inserisci referente, contatti,
            valore stimato e data del prossimo
            incontro.
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

function ClientRow({
  record,
  selected,
  onToggleMenu,
  onRemove,
}: {
  record: ClientRecord;
  selected: boolean;
  onToggleMenu: () => void;
  onRemove?: () => void;
}) {
  const stage =
    stageMeta[record.stage];

  return (
    <article className="relative px-6 py-5 transition hover:bg-white/[0.02]">
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.62fr_0.62fr_0.58fr_0.76fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold">
              {record.company}
            </h3>

            <ClientTypeBadge
              type={record.type}
            />
          </div>

          <p className="mt-2 text-sm text-[#C8D4E1]">
            {record.contact}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#AEBCCC]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} />
              {record.city}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Building2 size={12} />
              {record.sector}
            </span>

            {record.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail size={12} />
                {record.email}
              </span>
            )}

            {record.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone size={12} />
                {record.phone}
              </span>
            )}
          </div>
        </div>

        <span
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold"
          style={{
            color: stage.color,
          }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{
              backgroundColor:
                stage.color,
            }}
          />

          {stage.label}
        </span>

        <div>
          <p className="text-base font-semibold">
            {record.opportunityValue >
            0
              ? euro(
                  record.opportunityValue,
                )
              : "Da stimare"}
          </p>

          <p className="mt-1 text-xs text-[#AEBCCC]">
            Opportunità
          </p>
        </div>

        <div className="text-sm">
          <p className="font-semibold">
            {record.projects} progetti
          </p>

          <p className="mt-1 text-xs text-[#AEBCCC]">
            {record.audits} analisi
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">
            {record.nextAction}
          </p>

          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#F8C867]">
            <CalendarDays size={12} />
            {record.nextActionDate}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <Link
            href={record.href}
            className="group inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-white/[0.09] bg-white/[0.035] px-4 text-sm font-semibold transition hover:border-[#2492E8]/35 hover:bg-white/[0.07]"
          >
            Apri
            <ChevronRight
              size={14}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>

          <button
            type="button"
            onClick={onToggleMenu}
            aria-label="Altre azioni"
            className="flex size-10 items-center justify-center rounded-[10px] text-[#AEBCCC] transition hover:bg-white/[0.06] hover:text-white"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-[11px] border border-white/[0.06] bg-[#07111F]/35 px-4 py-3">
        <p className="text-xs font-semibold text-[#AEBCCC]">
          Nota commerciale
        </p>

        <p className="mt-1 text-sm leading-6 text-[#C8D4E1]">
          {record.notes}
        </p>
      </div>

      {selected && (
        <div className="absolute right-6 top-[76px] z-20 min-w-[230px] overflow-hidden rounded-[13px] border border-white/[0.1] bg-[#101D31] p-2 shadow-[0_20px_55px_rgba(0,0,0,.4)]">
          <Link
            href={record.href}
            className="flex min-h-10 items-center gap-3 rounded-[9px] px-3 text-sm font-medium transition hover:bg-white/[0.06]"
          >
            <Building2
              size={15}
              className="text-[#79C6F5]"
            />
            Apri azienda
          </Link>

          <Link
            href="/reports"
            className="flex min-h-10 items-center gap-3 rounded-[9px] px-3 text-sm font-medium transition hover:bg-white/[0.06]"
          >
            <Sparkles
              size={15}
              className="text-[#6D4FD2]"
            />
            Apri proposta
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

function ClientMetric({
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

function ClientTypeBadge({
  type,
}: {
  type: ClientType;
}) {
  const meta = {
    prospect: {
      label: "Prospect",
      color: "#2492E8",
    },
    client: {
      label: "Cliente",
      color: "#24D27C",
    },
    demo: {
      label: "Demo",
      color: "#6D4FD2",
    },
  }[type];

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

function EmptyClients({
  hasFilters,
  resetFilters,
}: {
  hasFilters: boolean;
  resetFilters: () => void;
}) {
  return (
    <div className="flex min-h-[440px] flex-col items-center justify-center px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-[18px] border border-white/[0.09] bg-white/[0.035] text-[#71839B]">
        <Users size={25} />
      </span>

      <h3 className="mt-6 text-xl font-semibold">
        {hasFilters
          ? "Nessuna azienda trovata"
          : "Nessuna azienda presente"}
      </h3>

      <p className="mt-3 max-w-lg text-sm leading-7 text-[#B8C5D4]">
        {hasFilters
          ? "Modifica i filtri oppure la ricerca."
          : "Crea il primo progetto per aggiungere automaticamente un prospect."}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold"
          >
            <RefreshCcw size={14} />
            Azzera filtri
          </button>
        )}

        <Link
          href="/projects/new"
          className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] bg-[#FF6B1A] px-5 text-sm font-semibold transition hover:bg-[#FF7D34]"
        >
          <Plus size={15} />
          Nuova azienda
        </Link>
      </div>
    </div>
  );
}
