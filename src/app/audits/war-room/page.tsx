import Link from "next/link";
import {
  ArrowLeft,
  Database,
  LayoutGrid,
  RadioTower,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { RealIntelligenceWarRoom } from "@/components/intelligence/RealIntelligenceWarRoom";

export default async function WarRoomPage({
  searchParams,
}: {
  searchParams: Promise<{
    businessId?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/audits"
                className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C3CEDB] transition hover:bg-white/[0.07]"
                aria-label="Torna all’archivio"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                <RadioTower size={18} />
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em]">
                    Intelligence War Room
                  </h1>

                  <span className="rounded-full border border-[#24D27C]/20 bg-[#24D27C]/[0.07] px-3 py-1 text-xs font-semibold text-[#8AF0BA]">
                    Core operativo
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Missioni, evidenze, automazioni e autorizzazioni reali.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="inline-flex items-center gap-2 text-sm text-[#B8C5D4]">
                <Database
                  size={14}
                  className="text-[#24D27C]"
                />
                Supabase collegato
              </span>

              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold transition hover:bg-white/[0.07]"
              >
                <LayoutGrid size={15} />
                Mission Control
              </Link>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden px-5 pb-24 pt-8 lg:px-8 xl:px-10">
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#2492E8]/[0.05] blur-[160px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="mb-6 rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
              <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
                <div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      size={18}
                      className="text-[#24D27C]"
                    />

                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                      Live operational intelligence
                    </p>
                  </div>

                  <h2 className="mt-5 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] md:text-5xl">
                    Ogni decisione è collegata
                    <span className="block text-[#FF6B1A]">
                      a dati, rischio e autorizzazione.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-4xl text-base leading-8 text-[#CBD6E2]">
                    La War Room legge direttamente il Core UVIQ e registra
                    ogni approvazione o rifiuto nell’audit log.
                  </p>
                </div>
              </div>
            </section>

            <RealIntelligenceWarRoom
              initialBusinessId={
                params.businessId
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}
