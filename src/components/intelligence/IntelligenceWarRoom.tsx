"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Database,
  FileSearch,
  Globe2,
  LoaderCircle,
  Pause,
  Play,
  RefreshCcw,
  Search,
  ShieldCheck,
  Square,
  TerminalSquare,
  Workflow,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SessionStatus =
  | "idle"
  | "queued"
  | "collecting"
  | "analysing"
  | "validating"
  | "completed"
  | "paused"
  | "failed";

type SourceStatus =
  | "pending"
  | "running"
  | "completed"
  | "unavailable"
  | "skipped";

type SourceItem = {
  id: string;
  name: string;
  description: string;
  status: SourceStatus;
  records: number | null;
  duration: string | null;
  icon: typeof Globe2;
};

type LogItem = {
  id: number;
  time: string;
  level: "info" | "success" | "warning" | "error";
  actor: string;
  message: string;
};

const initialSources: SourceItem[] = [
  {
    id: "website",
    name: "Sito web",
    description:
      "Struttura, contenuti, collegamenti e segnali di conversione.",
    status: "pending",
    records: null,
    duration: null,
    icon: Globe2,
  },
  {
    id: "search",
    name: "Ricerca organica",
    description:
      "Presenza indicizzata e segnali disponibili pubblicamente.",
    status: "pending",
    records: null,
    duration: null,
    icon: Search,
  },
  {
    id: "business",
    name: "Presenza locale",
    description:
      "Informazioni territoriali e reputazione accessibile.",
    status: "pending",
    records: null,
    duration: null,
    icon: FileSearch,
  },
  {
    id: "materials",
    name: "Materiali forniti",
    description:
      "Documenti e informazioni caricati nel progetto.",
    status: "pending",
    records: null,
    duration: null,
    icon: Database,
  },
];

const statusMeta: Record<
  SessionStatus,
  {
    label: string;
    description: string;
    color: string;
  }
> = {
  idle: {
    label: "Non avviata",
    description:
      "La configurazione è pronta, ma nessuna attività è in esecuzione.",
    color: "#AEBCCC",
  },
  queued: {
    label: "In coda",
    description:
      "La sessione attende l’assegnazione delle risorse.",
    color: "#F5A623",
  },
  collecting: {
    label: "Raccolta fonti",
    description:
      "Il sistema sta verificando e acquisendo le fonti configurate.",
    color: "#2492E8",
  },
  analysing: {
    label: "Analisi",
    description:
      "I dati raccolti vengono classificati e confrontati.",
    color: "#6D4FD2",
  },
  validating: {
    label: "Validazione",
    description:
      "Fatti, deduzioni e informazioni mancanti vengono separati.",
    color: "#FF6B1A",
  },
  completed: {
    label: "Completata",
    description:
      "La sessione dimostrativa ha terminato tutte le fasi.",
    color: "#24D27C",
  },
  paused: {
    label: "In pausa",
    description:
      "La sessione è stata sospesa manualmente.",
    color: "#F5A623",
  },
  failed: {
    label: "Errore",
    description:
      "La sessione si è fermata e richiede un intervento.",
    color: "#FF5D73",
  },
};

export function IntelligenceWarRoom() {
  const [status, setStatus] =
    useState<SessionStatus>("idle");

  const [sources, setSources] =
    useState<SourceItem[]>(initialSources);

  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 1,
      time: currentTime(),
      level: "info",
      actor: "System",
      message:
        "War Room inizializzata. Nessuna sessione è stata ancora avviata.",
    },
  ]);

  const [startedAt, setStartedAt] =
    useState<string | null>(null);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const runToken = useRef(0);

  const completedSources = useMemo(
    () =>
      sources.filter(
        (source) =>
          source.status === "completed",
      ).length,
    [sources],
  );

  const progress = useMemo(() => {
    const statusProgress: Record<
      SessionStatus,
      number
    > = {
      idle: 0,
      queued: 8,
      collecting:
        15 +
        Math.round(
          (completedSources /
            sources.length) *
            35,
        ),
      analysing: 65,
      validating: 86,
      completed: 100,
      paused: Math.max(
        8,
        Math.round(
          (completedSources /
            sources.length) *
            50,
        ),
      ),
      failed: Math.max(
        8,
        Math.round(
          (completedSources /
            sources.length) *
            50,
        ),
      ),
    };

    return statusProgress[status];
  }, [completedSources, sources.length, status]);

  useEffect(() => {
    if (
      status === "idle" ||
      status === "completed" ||
      status === "failed" ||
      status === "paused"
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds(
        (current) => current + 1,
      );
    }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [status]);

  function addLog(
    level: LogItem["level"],
    actor: string,
    message: string,
  ) {
    setLogs((current) => [
      ...current,
      {
        id: Date.now() + Math.random(),
        time: currentTime(),
        level,
        actor,
        message,
      },
    ]);
  }

  function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
      window.setTimeout(resolve, milliseconds);
    });
  }

  async function startDemoSession() {
    const token = runToken.current + 1;
    runToken.current = token;

    setStartedAt(currentTime());
    setElapsedSeconds(0);
    setSources(initialSources);
    setLogs([]);
    setStatus("queued");

    addLog(
      "info",
      "Orchestrator",
      "Sessione dimostrativa inserita in coda.",
    );

    await wait(850);

    if (runToken.current !== token) return;

    setStatus("collecting");

    addLog(
      "info",
      "Source Manager",
      "Avviata verifica delle fonti configurate.",
    );

    for (
      let index = 0;
      index < initialSources.length;
      index += 1
    ) {
      if (runToken.current !== token) return;

      const source =
        initialSources[index];

      setSources((current) =>
        current.map((item) =>
          item.id === source.id
            ? {
                ...item,
                status: "running",
              }
            : item,
        ),
      );

      addLog(
        "info",
        source.name,
        "Verifica disponibilità della fonte.",
      );

      await wait(900);

      if (runToken.current !== token) return;

      const unavailable =
        source.id === "materials";

      setSources((current) =>
        current.map((item) =>
          item.id === source.id
            ? {
                ...item,
                status: unavailable
                  ? "unavailable"
                  : "completed",
                records: unavailable
                  ? 0
                  : 8 + index * 7,
                duration: `${(
                  0.7 +
                  index * 0.3
                ).toFixed(1)} s`,
              }
            : item,
        ),
      );

      addLog(
        unavailable
          ? "warning"
          : "success",
        source.name,
        unavailable
          ? "Nessun materiale aziendale disponibile. La fonte è stata dichiarata mancante."
          : "Fonte acquisita e registrata con tracciamento.",
      );
    }

    if (runToken.current !== token) return;

    setStatus("analysing");

    addLog(
      "info",
      "Analysis Engine",
      "Classificazione dei dati raccolti.",
    );

    await wait(1500);

    if (runToken.current !== token) return;

    addLog(
      "success",
      "Analysis Engine",
      "Classificazione completata. Nessun punteggio definitivo ancora pubblicato.",
    );

    setStatus("validating");

    addLog(
      "info",
      "Validation Engine",
      "Separazione tra fatti, deduzioni e informazioni mancanti.",
    );

    await wait(1400);

    if (runToken.current !== token) return;

    setStatus("completed");

    addLog(
      "success",
      "Validation Engine",
      "Sessione dimostrativa completata. Interfaccia pronta per il collegamento al motore AI reale.",
    );
  }

  function pauseSession() {
    if (
      status === "idle" ||
      status === "completed" ||
      status === "failed"
    ) {
      return;
    }

    runToken.current += 1;
    setStatus("paused");

    addLog(
      "warning",
      "Operator",
      "Sessione sospesa manualmente.",
    );
  }

  function stopSession() {
    runToken.current += 1;
    setStatus("idle");
    setElapsedSeconds(0);
    setStartedAt(null);
    setSources(initialSources);

    addLog(
      "warning",
      "Operator",
      "Sessione annullata. Tutti gli stati temporanei sono stati rimossi.",
    );
  }

  const meta = statusMeta[status];

  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
          <header className="flex flex-col justify-between gap-5 border-b border-white/[0.08] px-6 py-6 md:flex-row md:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                  Intelligence Session
                </p>

                <span className="rounded-full border border-[#F5A623]/20 bg-[#F5A623]/[0.07] px-3 py-1 text-xs font-semibold text-[#F8C867]">
                  Simulazione interfaccia
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">
                Sessione di analisi controllata
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#B8C5D4]">
                Questa esecuzione serve a verificare UX,
                stati e gestione degli errori. Non utilizza
                ancora un modello AI né produce risultati
                commerciali reali.
              </p>
            </div>

            <StatusBadge
              label={meta.label}
              color={meta.color}
            />
          </header>

          <div className="p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-center">
              <div>
                <p className="text-sm font-semibold text-white">
                  {meta.description}
                </p>

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor:
                        meta.color,
                    }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="text-[#AEBCCC]">
                    Avanzamento sessione
                  </span>

                  <span className="font-semibold text-white">
                    {progress}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SessionMetric
                  label="Durata"
                  value={formatDuration(
                    elapsedSeconds,
                  )}
                  icon={Clock3}
                  color="#2492E8"
                />

                <SessionMetric
                  label="Fonti"
                  value={`${completedSources}/${sources.length}`}
                  icon={Database}
                  color="#24D27C"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {(status === "idle" ||
                status === "completed" ||
                status === "paused") && (
                <button
                  type="button"
                  onClick={startDemoSession}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-6 text-sm font-semibold text-white transition hover:bg-[#FF7D34]"
                >
                  {status === "completed" ? (
                    <RefreshCcw size={16} />
                  ) : (
                    <Play size={16} />
                  )}

                  {status === "completed"
                    ? "Ripeti simulazione"
                    : status === "paused"
                      ? "Riavvia sessione"
                      : "Avvia simulazione"}
                </button>
              )}

              {![
                "idle",
                "completed",
                "paused",
                "failed",
              ].includes(status) && (
                <button
                  type="button"
                  onClick={pauseSession}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] border border-[#F5A623]/25 bg-[#F5A623]/[0.07] px-6 text-sm font-semibold text-[#F8C867] transition hover:bg-[#F5A623]/[0.12]"
                >
                  <Pause size={16} />
                  Sospendi
                </button>
              )}

              {status !== "idle" && (
                <button
                  type="button"
                  onClick={stopSession}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[13px] border border-white/[0.1] bg-white/[0.035] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.065]"
                >
                  <Square size={15} />
                  Annulla sessione
                </button>
              )}
            </div>
          </div>
        </article>

        <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                Session Metadata
              </p>

              <h2 className="mt-3 text-xl font-semibold text-white">
                Controllo esecuzione
              </h2>
            </div>

            <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#6D4FD2]/20 bg-[#6D4FD2]/10 text-[#B9AAF4]">
              <BrainCircuit size={18} />
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <MetadataRow
              label="Modalità"
              value="Simulazione locale"
            />

            <MetadataRow
              label="Progetto"
              value="Discovery corrente"
            />

            <MetadataRow
              label="Avviata"
              value={startedAt ?? "Non avviata"}
            />

            <MetadataRow
              label="Supervisione"
              value="Manuale"
            />

            <MetadataRow
              label="Pubblicazioni"
              value="Disabilitate"
            />
          </div>

          <div className="mt-6 rounded-[14px] border border-[#24D27C]/18 bg-[#24D27C]/[0.05] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-[#8AF0BA]"
              />

              <p className="text-sm leading-6 text-[#D1DBE7]">
                Nessuna informazione viene inviata
                all’esterno durante questa simulazione.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
          <header className="border-b border-white/[0.08] px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
              Source Pipeline
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
              Fonti e acquisizione
            </h2>

            <p className="mt-2 text-sm text-[#B8C5D4]">
              Ogni fonte mantiene uno stato indipendente
              e può risultare disponibile, mancante o esclusa.
            </p>
          </header>

          <div className="divide-y divide-white/[0.065]">
            {sources.map((source) => (
              <SourceRow
                key={source.id}
                source={source}
              />
            ))}
          </div>
        </article>

        <article className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
          <header className="flex items-start justify-between gap-5 border-b border-white/[0.08] px-6 py-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                Execution Log
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                Registro della sessione
              </h2>
            </div>

            <TerminalSquare
              size={19}
              className="text-[#AEBCCC]"
            />
          </header>

          <div className="max-h-[620px] overflow-y-auto">
            {logs.length > 0 ? (
              <div className="divide-y divide-white/[0.055]">
                {logs.map((log) => (
                  <LogRow
                    key={log.id}
                    log={log}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                <TerminalSquare
                  size={28}
                  className="text-[#607089]"
                />

                <p className="mt-4 text-sm font-semibold text-white">
                  Registro vuoto
                </p>

                <p className="mt-2 text-sm text-[#AEBCCC]">
                  Gli eventi appariranno dopo
                  l’avvio della sessione.
                </p>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
              Output
            </p>

            <h2 className="mt-3 text-xl font-semibold text-white">
              Business Twin non ancora disponibile
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-[#B8C5D4]">
              Il completamento della simulazione non genera
              punteggi reali. Il Business Twin sarà prodotto
              soltanto quando collegheremo fonti e motore AI.
            </p>
          </div>

          <Link
            href="/audits/analysis"
            aria-disabled={status !== "completed"}
            className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-[13px] px-6 text-sm font-semibold transition ${
              status === "completed"
                ? "border border-white/[0.1] bg-white/[0.04] text-white hover:bg-white/[0.07]"
                : "pointer-events-none border border-white/[0.06] bg-white/[0.02] text-[#607089]"
            }`}
          >
            Anteprima struttura
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SourceRow({
  source,
}: {
  source: SourceItem;
}) {
  const Icon = source.icon;

  const statusStyles: Record<
    SourceStatus,
    {
      label: string;
      color: string;
      icon: typeof CheckCircle2;
    }
  > = {
    pending: {
      label: "In attesa",
      color: "#AEBCCC",
      icon: CircleDot,
    },
    running: {
      label: "Acquisizione",
      color: "#2492E8",
      icon: LoaderCircle,
    },
    completed: {
      label: "Completata",
      color: "#24D27C",
      icon: CheckCircle2,
    },
    unavailable: {
      label: "Non disponibile",
      color: "#F5A623",
      icon: AlertTriangle,
    },
    skipped: {
      label: "Esclusa",
      color: "#607089",
      icon: XCircle,
    },
  };

  const meta = statusStyles[source.status];
  const StatusIcon = meta.icon;

  return (
    <div className="p-5">
      <div className="flex items-start gap-4">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border"
          style={{
            color: meta.color,
            borderColor: `${meta.color}35`,
            backgroundColor: `${meta.color}12`,
          }}
        >
          <Icon size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {source.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#B8C5D4]">
                {source.description}
              </p>
            </div>

            <span
              className="inline-flex items-center gap-2 text-xs font-semibold"
              style={{
                color: meta.color,
              }}
            >
              <StatusIcon
                size={13}
                className={
                  source.status === "running"
                    ? "animate-spin"
                    : ""
                }
              />

              {meta.label}
            </span>
          </div>

          {(source.records !== null ||
            source.duration !== null) && (
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#AEBCCC]">
              <span>
                Record:{" "}
                <strong className="font-semibold text-white">
                  {source.records ?? "—"}
                </strong>
              </span>

              <span>
                Durata:{" "}
                <strong className="font-semibold text-white">
                  {source.duration ?? "—"}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LogRow({
  log,
}: {
  log: LogItem;
}) {
  const styles = {
    info: {
      color: "#79C6F5",
      icon: CircleDot,
    },
    success: {
      color: "#8AF0BA",
      icon: CheckCircle2,
    },
    warning: {
      color: "#F8C867",
      icon: AlertTriangle,
    },
    error: {
      color: "#FF8191",
      icon: XCircle,
    },
  };

  const meta = styles[log.level];
  const Icon = meta.icon;

  return (
    <div className="grid gap-3 px-6 py-4 md:grid-cols-[72px_150px_1fr] md:items-start">
      <span className="font-mono text-xs text-[#8FA2B9]">
        {log.time}
      </span>

      <span
        className="inline-flex items-center gap-2 text-xs font-semibold"
        style={{
          color: meta.color,
        }}
      >
        <Icon size={13} />
        {log.actor}
      </span>

      <p className="text-sm leading-6 text-[#D1DBE7]">
        {log.message}
      </p>
    </div>
  );
}

function SessionMetric({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: typeof Clock3;
  color: string;
}) {
  return (
    <div className="rounded-[14px] border border-white/[0.08] bg-[#07111F]/55 p-4">
      <Icon size={15} style={{ color }} />

      <p className="mt-3 text-xs text-[#AEBCCC]">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function MetadataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-[12px] border border-white/[0.07] bg-[#07111F]/45 px-4 py-3">
      <span className="text-sm text-[#AEBCCC]">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
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
          boxShadow: `0 0 10px ${color}80`,
        }}
      />

      {label}
    </span>
  );
}

function currentTime() {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(
    2,
    "0",
  )}:${String(remainingSeconds).padStart(
    2,
    "0",
  )}`;
}
