import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Database,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { QuickAuditForm } from "@/components/quick-audit/QuickAuditForm";

export default function NewAuditPage() {
  return (
    <main className="workspace-page min-h-screen">
      <AppSidebar />

      <section className="px-5 pb-28 pt-7 lg:ml-[112px] lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 text-[10px] font-medium text-[#8A97A8] transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Torna alla configurazione
          </Link>

          <header className="mt-10 grid gap-8 border-b border-white/[0.07] pb-9 xl:grid-cols-[1fr_390px] xl:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
                Intelligence setup
              </p>

              <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.96] tracking-[-0.055em] text-[#F5F7FA] md:text-7xl">
                Configura il reparto
                <br />
                marketing intelligente.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-[#8A97A8]">
                Definisci le fonti da analizzare e i moduli operativi che
                UVIQ dovrà attivare per l’azienda.
              </p>
            </div>

            <aside className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A97A8]">
                Configurazione corrente
              </p>

              <div className="mt-6 space-y-4">
                <SetupItem
                  icon={Database}
                  title="Fonti aziendali"
                  text="Sito, social, Google e materiali."
                />

                <SetupItem
                  icon={BrainCircuit}
                  title="Agenti specializzati"
                  text="Analisi, strategia e produzione."
                />

                <SetupItem
                  icon={ShieldCheck}
                  title="Supervisione"
                  text="Controllo umano prima dell’esecuzione."
                />
              </div>
            </aside>
          </header>

          <section className="mt-8">
            <Suspense fallback={<IntelligenceSetupLoading />}>
              <QuickAuditForm />
            </Suspense>
          </section>
        </div>
      </section>
    </main>
  );
}

function SetupItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BrainCircuit;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] border border-[#5B7CFF]/20 bg-[#5B7CFF]/10 text-[#9AAEFF]">
        <Icon size={16} />
      </span>

      <div>
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-[#F5F7FA]">
            {title}
          </p>

          <CheckCircle2 size={12} className="text-[#2DD4BF]" />
        </div>

        <p className="mt-1 text-[10px] leading-5 text-[#8A97A8]">
          {text}
        </p>
      </div>
    </div>
  );
}


function IntelligenceSetupLoading() {
  return (
    <div className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-8">
      <div className="flex items-center gap-4">
        <span className="size-3 animate-pulse rounded-full bg-[#5B7CFF]" />

        <div>
          <p className="text-sm font-semibold text-[#F5F7FA]">
            Caricamento configurazione
          </p>

          <p className="mt-1 text-xs text-[#8A97A8]">
            UVIQ sta recuperando settore, discovery e moduli disponibili.
          </p>
        </div>
      </div>
    </div>
  );
}
