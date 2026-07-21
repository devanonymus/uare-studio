import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";

export default function SakuraPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030303] px-6">
      <div className="noise" />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(147,23,31,0.14),transparent_42%)]"
      />

      <section className="relative z-10 w-full max-w-4xl text-center">
        <Link
          href="/dashboard"
          className="absolute -top-20 left-0 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/28 transition hover:text-white/70"
        >
          <ArrowLeft size={14} />
          UVIQ Studio
        </Link>

        <LockKeyhole
          size={17}
          strokeWidth={1.3}
          className="mx-auto text-[#caa563]"
        />

        <p className="mt-6 text-[9px] uppercase tracking-[0.4em] text-[#caa563]">
          Progetto riservato
        </p>

        <h1 className="font-display mt-7 text-[clamp(4.5rem,13vw,9rem)] font-medium leading-none tracking-[-0.05em] text-[#f2ede5]">
          Sakura
        </h1>

        <p className="mt-6 text-[10px] uppercase tracking-[0.38em] text-white/38">
          Preparato esclusivamente per Yammy Ristorante Giapponese
        </p>

        <div className="mx-auto mt-12 h-px w-36 bg-gradient-to-r from-transparent via-[#caa563] to-transparent" />

        <button className="group mt-12 inline-flex items-center gap-3 rounded-full border border-[#caa563]/27 bg-[#caa563]/8 px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#e0c17e] transition hover:bg-[#caa563]/15">
          Apri esperienza
          <ArrowRight
            size={15}
            className="transition group-hover:translate-x-1"
          />
        </button>
      </section>
    </main>
  );
}
