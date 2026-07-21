import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <main className="workspace-page flex min-h-screen items-center justify-center bg-[#050505] px-6">
      <div className="noise" />

      <section className="panel relative w-full max-w-2xl rounded-[32px] p-8 text-center md:p-12">
        <p className="text-[9px] uppercase tracking-[0.38em] text-[#caa563]">
          UVIQ Studio
        </p>

        <h1 className="font-display mt-4 text-4xl capitalize text-[#f5f0e7]">
          audits
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/38">
          Questo modulo verrà sviluppato nella prossima fase della piattaforma.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs text-white/60 transition hover:border-[#caa563]/30 hover:text-[#e4c47f]"
        >
          <ArrowLeft size={15} />
          Torna alla dashboard
        </Link>
      </section>
    </main>
  );
}
