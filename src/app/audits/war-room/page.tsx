import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  LayoutGrid,
  LockKeyhole,
  RadioTower,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { IntelligenceWarRoom } from "@/components/intelligence/IntelligenceWarRoom";

export default function WarRoomPage() {
  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/audits/new?sector=restaurant"
                aria-label="Torna alla configurazione Intelligence"
                className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C3CEDB] transition hover:border-[#2492E8]/35 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                <RadioTower size={18} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em] text-white">
                    Intelligence War Room
                  </h1>

                  <span className="rounded-full border border-[#F5A623]/20 bg-[#F5A623]/[0.07] px-3 py-1 text-xs font-semibold text-[#F8C867]">
                    Interfaccia dimostrativa
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Controllo delle fonti, degli stati e dell’esecuzione.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="inline-flex items-center gap-2 text-sm text-[#B8C5D4]">
                <LockKeyhole
                  size={14}
                  className="text-[#24D27C]"
                />
                Esecuzione locale
              </span>

              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold text-white transition hover:border-[#2492E8]/35 hover:bg-white/[0.06]"
              >
                <LayoutGrid size={15} />
                Mission Control
              </Link>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden px-5 pb-24 pt-8 lg:px-8 xl:px-10">
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#2492E8]/[0.055] blur-[160px]" />
          <div className="pointer-events-none absolute bottom-[-20rem] left-1/4 size-[38rem] rounded-full bg-[#6D4FD2]/[0.045] blur-[170px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="mb-6 overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
              <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#2492E8]/20 bg-[#2492E8]/10 px-3 py-1.5 text-xs font-semibold text-[#79C6F5]">
                      <BrainCircuit size={13} />
                      Intelligence orchestration
                    </span>
                  </div>

                  <h2 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-white md:text-5xl">
                    Ogni attività deve essere
                    <span className="block text-[#FF6B1A]">
                      visibile, verificabile e controllabile.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-3xl text-base leading-8 text-[#CBD6E2]">
                    La War Room mostra cosa sta accadendo,
                    quali fonti vengono utilizzate e dove
                    l’esecuzione incontra limiti o anomalie.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[470px]">
                  <StageCard
                    label="Setup"
                    value="Completato"
                    color="#24D27C"
                  />

                  <StageCard
                    label="Sessione"
                    value="Da avviare"
                    color="#2492E8"
                  />

                  <StageCard
                    label="Business Twin"
                    value="In attesa"
                    color="#6D4FD2"
                  />
                </div>
              </div>
            </section>

            <IntelligenceWarRoom />
          </div>
        </section>
      </div>
    </main>
  );
}

function StageCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-[14px] border border-white/[0.08] bg-[#07111F]/45 p-4">
      <p className="text-xs text-[#AEBCCC]">
        {label}
      </p>

      <p
        className="mt-2 text-sm font-semibold"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}
