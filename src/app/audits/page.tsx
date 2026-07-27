import Link from "next/link";
import {
  ArrowLeft,
  FileSearch,
  LayoutGrid,
  LockKeyhole,
  Plus,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AuditsArchive } from "@/components/audits/AuditsArchive";

export default function AuditsPage() {
  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/dashboard"
                aria-label="Torna alla Mission Control"
                className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C3CEDB] transition hover:border-[#2492E8]/35 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                <FileSearch size={18} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em]">
                    Archivio Intelligence
                  </h1>

                  <span className="rounded-full border border-[#6D4FD2]/20 bg-[#6D4FD2]/10 px-3 py-1 text-xs font-semibold text-[#B9AAF4]">
                    Demo e analisi operative
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Sessioni, risultati, copertura e prossime azioni.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="inline-flex items-center gap-2 text-sm text-[#B8C5D4]">
                <LockKeyhole
                  size={14}
                  className="text-[#24D27C]"
                />
                Archivio locale
              </span>

              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold transition hover:border-[#2492E8]/35 hover:bg-white/[0.06]"
              >
                <LayoutGrid size={15} />
                Mission Control
              </Link>

              <Link
                href="/audits/new"
                className="inline-flex min-h-11 items-center gap-3 rounded-[12px] bg-[#FF6B1A] px-5 text-sm font-semibold transition hover:bg-[#FF7D34]"
              >
                <Plus size={15} />
                Nuova analisi
              </Link>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden px-5 pb-24 pt-8 lg:px-8 xl:px-10">
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#2492E8]/[0.05] blur-[160px]" />
          <div className="pointer-events-none absolute bottom-[-20rem] left-1/4 size-[38rem] rounded-full bg-[#6D4FD2]/[0.04] blur-[170px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="mb-6 rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
              <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    Intelligence operations
                  </p>

                  <h2 className="mt-5 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] md:text-5xl">
                    Ogni analisi conserva
                    <span className="block text-[#FF6B1A]">
                      stato, fonti e affidabilità.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-4xl text-base leading-8 text-[#CBD6E2]">
                    Un risultato è utilizzabile soltanto quando
                    è possibile verificare come è stato ottenuto,
                    quali fonti erano disponibili e quali dati
                    restano mancanti.
                  </p>
                </div>

                <Link
                  href="/audits/new"
                  className="group inline-flex min-h-13 shrink-0 items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-6 text-sm font-semibold transition hover:bg-[#FF7D34]"
                >
                  Avvia nuova Intelligence
                  <Plus
                    size={16}
                    className="transition group-hover:rotate-90"
                  />
                </Link>
              </div>
            </section>

            <AuditsArchive />
          </div>
        </section>
      </div>
    </main>
  );
}
