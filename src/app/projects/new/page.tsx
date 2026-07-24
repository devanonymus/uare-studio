import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SectorSelector } from "@/components/projects/SectorSelector";

export default function NewProjectPage() {
  return (
    <main className="workspace-page min-h-screen">
      <AppSidebar />

      <section className="px-5 pb-28 pt-7 lg:ml-[112px] lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[10px] font-medium text-[#8A97A8] transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Torna al workspace
          </Link>

          <header className="mt-10 grid gap-10 border-b border-white/[0.07] pb-10 xl:grid-cols-[1fr_420px] xl:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
                Nuovo progetto
              </p>

              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.055em] text-[#F5F7FA] md:text-7xl">
                Configura una nuova
                <br />
                intelligence aziendale.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-[#8A97A8]">
                Seleziona il settore dell’attività. UVIQ caricherà metriche,
                obiettivi commerciali, agenti e automazioni coerenti con il
                modello di business.
              </p>
            </div>

            <aside className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A97A8]">
                Processo
              </p>

              <div className="mt-6 space-y-5">
                <ProcessItem
                  number="01"
                  title="Scelta del settore"
                  text="Caricamento del modello operativo."
                />

                <ProcessItem
                  number="02"
                  title="Business discovery"
                  text="Raccolta degli obiettivi e delle informazioni."
                />

                <ProcessItem
                  number="03"
                  title="Intelligence"
                  text="Analisi, strategia e opportunità."
                />
              </div>
            </aside>
          </header>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <Feature
              icon={BrainCircuit}
              title="Agenti contestuali"
              text="Ogni analisi viene interpretata secondo il settore e il modello commerciale."
            />

            <Feature
              icon={Layers3}
              title="Struttura modulare"
              text="Metriche, servizi, obiettivi e workflow vengono caricati dinamicamente."
            />

            <Feature
              icon={ShieldCheck}
              title="Controllo professionale"
              text="Le decisioni AI restano verificabili e supervisionate dal team."
            />
          </section>

          <section className="mt-12">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
                  Sector framework
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-[#F5F7FA]">
                  Seleziona il settore
                </h2>
              </div>

              <p className="text-xs text-[#8A97A8]">
                I moduli beta sono già utilizzabili nella fase discovery.
              </p>
            </div>

            <div className="mt-7">
              <SectorSelector />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BrainCircuit;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-[16px] border border-white/[0.075] bg-[#11151C] p-5">
      <span className="flex size-10 items-center justify-center rounded-[12px] border border-[#5B7CFF]/20 bg-[#5B7CFF]/10 text-[#8EA4FF]">
        <Icon size={18} strokeWidth={1.6} />
      </span>

      <h3 className="mt-5 text-sm font-semibold text-[#F5F7FA]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-[#8A97A8]">
        {text}
      </p>
    </article>
  );
}

function ProcessItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.08] bg-[#0E131B] text-[9px] font-semibold text-[#8EA4FF]">
        {number}
      </span>

      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-[#F5F7FA]">
            {title}
          </h3>

          <CheckCircle2 size={13} className="text-[#2DD4BF]" />
        </div>

        <p className="mt-1 text-[10px] leading-5 text-[#8A97A8]">
          {text}
        </p>
      </div>
    </div>
  );
}
