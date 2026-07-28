"use client";

import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CircleDot,
  CloudCog,
  Database,
  PanelsTopLeft,
  Globe2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MessageCircle,
  Plug,
  RefreshCcw,
  ShieldCheck,
  TestTube2,
  Workflow,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type IntegrationItem = {
  provider: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  externalActions: string[];

  configuration: {
    configured: boolean;
    readiness: number;
    missingVariables: string[];
  };

  connection: {
    id: string;
    status: string;
    enabled: boolean;
    last_tested_at: string | null;
    last_error_message: string | null;
  } | null;
};

type HubData = {
  status: string;

  business: {
    id: string;
    name: string;
  };

  integrations: IntegrationItem[];
};

export function IntegrationHub({
  businessId,
}: {
  businessId: string;
}) {
  const [data, setData] =
    useState<HubData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [testingProvider, setTestingProvider] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const loadData = useCallback(
    async (manual = false) => {
      if (manual) {
        setRefreshing(true);
      }

      try {
        const response = await fetch(
          `/api/core/integrations?businessId=${encodeURIComponent(
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
              "Integration Hub non disponibile.",
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
    [businessId],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function testProvider(
    provider: string,
  ) {
    setTestingProvider(provider);

    try {
      const response = await fetch(
        `/api/core/integrations/${provider}/test`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            businessId,
            actorId:
              "brian-laddomada",
          }),
        },
      );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Test non completato.",
        );
      }

      window.alert(payload.message);

      await loadData(true);
    } catch (caughtError) {
      window.alert(
        caughtError instanceof Error
          ? caughtError.message
          : "Errore sconosciuto.",
      );
    } finally {
      setTestingProvider(null);
    }
  }

  const metrics = useMemo(() => {
    const integrations =
      data?.integrations ?? [];

    return {
      total: integrations.length,

      configured:
        integrations.filter(
          (item) =>
            item.configuration
              .configured,
        ).length,

      missing:
        integrations.filter(
          (item) =>
            !item.configuration
              .configured,
        ).length,

      active:
        integrations.filter(
          (item) =>
            item.connection
              ?.status === "connected",
        ).length,
    };
  }, [data]);

  if (loading) {
    return (
      <StatePanel
        icon="loading"
        title="Caricamento Integration Hub"
        message="Controllo delle configurazioni server…"
      />
    );
  }

  if (error || !data) {
    return (
      <StatePanel
        icon="error"
        title="Integration Hub non disponibile"
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
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Provider"
          value={`${metrics.total}`}
          detail="Adapter registrati"
          icon={Plug}
          color="#2492E8"
        />

        <Metric
          label="Configurazioni"
          value={`${metrics.configured}`}
          detail="Variabili rilevate"
          icon={CloudCog}
          color="#F5A623"
        />

        <Metric
          label="Connessioni reali"
          value={`${metrics.active}`}
          detail="API verificate"
          icon={CheckCircle2}
          color="#24D27C"
        />

        <Metric
          label="Da configurare"
          value={`${metrics.missing}`}
          detail="Credenziali mancanti"
          icon={LockKeyhole}
          color="#FF6B1A"
        />
      </section>

      <section className="overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628]">
        <header className="flex flex-col justify-between gap-5 border-b border-white/[0.08] p-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
              Connected services
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Integrazioni disponibili
            </h2>

            <p className="mt-2 text-sm text-[#B8C5D4]">
              Le credenziali vengono lette esclusivamente dal server.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadData(true)
            }
            disabled={refreshing}
            className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold transition hover:bg-white/[0.07]"
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
        </header>

        <div className="divide-y divide-white/[0.065]">
          {data.integrations.map(
            (integration) => (
              <IntegrationRow
                key={
                  integration.provider
                }
                integration={
                  integration
                }
                testing={
                  testingProvider ===
                  integration.provider
                }
                testProvider={
                  testProvider
                }
              />
            ),
          )}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <article className="rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-6">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
              <ShieldCheck size={18} />
            </span>

            <div>
              <h2 className="text-lg font-semibold">
                Credenziali isolate
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#C8D4E1]">
                Token, secret e password non vengono restituiti dalle API,
                salvati nel browser o mostrati nell’interfaccia.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[22px] border border-[#F5A623]/18 bg-[#F5A623]/[0.045] p-6">
          <div className="flex items-start gap-4">
            <TestTube2
              size={18}
              className="mt-0.5 shrink-0 text-[#F8C867]"
            />

            <div>
              <h2 className="text-lg font-semibold">
                Test attuale
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#C8D4E1]">
                Verifica la presenza della configurazione. Il collegamento
                reale verrà controllato dal singolo adapter.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function IntegrationRow({
  integration,
  testing,
  testProvider,
}: {
  integration: IntegrationItem;
  testing: boolean;
  testProvider: (
    provider: string,
  ) => Promise<void>;
}) {
  const Icon =
    integration.provider === "meta"
      ? PanelsTopLeft
      : integration.provider ===
          "google"
        ? Globe2
        : integration.provider ===
            "whatsapp"
          ? MessageCircle
          : integration.provider ===
              "email"
            ? Mail
            : Database;

  const readiness =
    integration.configuration.readiness;

  const configured =
    integration.configuration.configured;

  return (
    <article className="p-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_230px_180px] xl:items-center">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.09] bg-[#07111F]/55 text-[#79C6F5]">
            <Icon size={20} />
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-semibold">
                {integration.name}
              </h3>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  configured
                    ? "border-[#F5A623]/20 bg-[#F5A623]/10 text-[#F8C867]"
                    : "border-white/[0.1] bg-white/[0.035] text-[#AEBCCC]"
                }`}
              >
                {configured
                  ? "Configurazione rilevata"
                  : "Non configurata"}
              </span>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#B8C5D4]">
              {integration.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {integration.capabilities.map(
                (capability) => (
                  <span
                    key={capability}
                    className="rounded-[8px] border border-white/[0.07] bg-[#07111F]/45 px-2.5 py-1.5 text-xs text-[#C8D4E1]"
                  >
                    {capability}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#AEBCCC]">
              Configurazione
            </span>

            <span className="font-semibold">
              {readiness}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-[#2492E8]"
              style={{
                width: `${readiness}%`,
              }}
            />
          </div>

          {!configured && (
            <p className="mt-3 text-xs leading-5 text-[#FF9AAA]">
              Mancano{" "}
              {
                integration
                  .configuration
                  .missingVariables
                  .length
              }{" "}
              variabili server.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            void testProvider(
              integration.provider,
            )
          }
          disabled={testing}
          className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[11px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold transition hover:border-[#2492E8]/35 hover:bg-white/[0.07] disabled:opacity-50"
        >
          {testing ? (
            <LoaderCircle
              size={15}
              className="animate-spin"
            />
          ) : (
            <TestTube2 size={15} />
          )}
          Controlla
        </button>
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
  icon: typeof Plug;
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

function StatePanel({
  icon,
  title,
  message,
  retry,
}: {
  icon: "loading" | "error";
  title: string;
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="flex min-h-[540px] flex-col items-center justify-center rounded-[22px] border border-white/[0.09] bg-[#0B1628] px-6 text-center">
      {icon === "loading" ? (
        <LoaderCircle
          size={28}
          className="animate-spin text-[#79C6F5]"
        />
      ) : (
        <AlertTriangle
          size={28}
          className="text-[#FF8191]"
        />
      )}

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 max-w-xl text-sm leading-7 text-[#B8C5D4]">
        {message}
      </p>

      {retry && (
        <button
          type="button"
          onClick={retry}
          className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-[11px] bg-[#FF6B1A] px-5 text-sm font-semibold"
        >
          <RefreshCcw size={15} />
          Riprova
        </button>
      )}
    </div>
  );
}
