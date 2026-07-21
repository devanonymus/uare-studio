import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  BrainCircuit,
  Layers3,
  Sparkles,
} from "lucide-react";
import { SectorSelector } from "@/components/projects/SectorSelector";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-[#070708] px-5 py-8 md:px-10 md:py-10">
      <div className="noise" />

      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/27 transition hover:text-white/70"
        >
          <ArrowLeft size={14} />
          Intelligence Center
        </Link>

        <header className="mt-10 border-b border-white/[0.055] pb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#caa563]/17 bg-[#caa563]/[0.05] px-3 py-1 text-[8px] uppercase tracking-[0.2em] text-[#d6b16d]">
              Sector Intelligence
            </span>

            <span className="text-[8px] uppercase tracking-[0.22em] text-white/22">
              Nuovo progetto
            </span>
          </div>

          <h1 className="font-display mt-6 max-w-5xl text-5xl leading-[0.98] tracking-[-0.045em] text-[#f4eee5] md:text-7xl">
            Che tipo di attività
            <br />
            dobbiamo analizzare?
          </h1>

          <p className="mt-6 max-w-3xl text-sm leading-7 text-white/35">
            UAE caricherà un modello di intelligence specifico per il
            settore scelto. Cambieranno metriche, obiettivi, agenti,
            opportunità commerciali e struttura della demo.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Feature
            icon={BrainCircuit}
            title="Agenti specializzati"
            text="Ogni settore interpreta le evidenze secondo logiche commerciali differenti."
          />

          <Feature
            icon={Layers3}
            title="Demo su misura"
            text="Struttura, CTA e contenuti cambiano in base al tipo di attività."
          />

          <Feature
            icon={Boxes}
            title="Motore unico"
            text="Browser, Vision, SEO e Brand restano condivisi e riutilizzabili."
          />
        </section>

        <section className="mt-10">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles
              size={17}
              strokeWidth={1.4}
              className="text-[#d6b16d]"
            />

            <p className="text-[9px] uppercase tracking-[0.28em] text-white/27">
              Seleziona il settore
            </p>
          </div>

          <SectorSelector />
        </section>
      </div>
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
    <article className="rounded-[24px] border border-white/[0.055] bg-white/[0.015] p-5">
      <Icon
        size={18}
        strokeWidth={1.4}
        className="text-[#d5b16d]"
      />

      <h2 className="mt-5 text-sm font-medium text-white/65">
        {title}
      </h2>

      <p className="mt-3 text-xs leading-5 text-white/28">
        {text}
      </p>
    </article>
  );
}
