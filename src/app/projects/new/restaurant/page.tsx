import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  LayoutGrid,
  LockKeyhole,
  Utensils,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { RestaurantDiscovery } from "@/components/projects/RestaurantDiscovery";

export default function RestaurantProjectPage() {
  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/projects/new"
                aria-label="Torna alla selezione settore"
                className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C3CEDB] transition hover:border-[#2492E8]/35 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 text-[#FF9A64]">
                <Utensils size={18} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em] text-white">
                    Discovery Ristorazione
                  </h1>

                  <span className="rounded-full border border-[#2492E8]/20 bg-[#2492E8]/10 px-3 py-1 text-xs font-semibold text-[#79C6F5]">
                    Step 2 di 4
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Raccolta dati e configurazione del modello.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="inline-flex items-center gap-2 text-sm text-[#B8C5D4]">
                <LockKeyhole
                  size={14}
                  className="text-[#24D27C]"
                />
                Salvataggio locale
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
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#2492E8]/[0.05] blur-[160px]" />
          <div className="pointer-events-none absolute bottom-[-18rem] left-1/4 size-[36rem] rounded-full bg-[#FF6B1A]/[0.045] blur-[165px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="mb-6 rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
              <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#24D27C]/18 bg-[#24D27C]/[0.055] px-3 py-1.5 text-xs font-semibold text-[#8AF0BA]">
                    <CheckCircle2 size={13} />
                    Settore configurato
                  </span>

                  <h2 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-white md:text-5xl">
                    Prima comprendiamo l’azienda.
                    <span className="block text-[#FF6B1A]">
                      Poi attiviamo l’intelligenza.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-3xl text-base leading-8 text-[#CBD6E2]">
                    Le risposte serviranno a configurare fonti,
                    agenti, indicatori e criteri di valutazione.
                    Nessun risultato verrà inventato prima della
                    raccolta dei dati reali.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
                  <StatusItem
                    label="Settore"
                    value="Ristorazione"
                    complete
                  />

                  <StatusItem
                    label="Discovery"
                    value="In corso"
                    active
                  />

                  <StatusItem
                    label="Intelligence"
                    value="Non avviata"
                  />
                </div>
              </div>
            </section>

            <RestaurantDiscovery />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusItem({
  label,
  value,
  complete = false,
  active = false,
}: {
  label: string;
  value: string;
  complete?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-[14px] border p-4 ${
        complete
          ? "border-[#24D27C]/20 bg-[#24D27C]/[0.055]"
          : active
            ? "border-[#2492E8]/35 bg-[#2492E8]/10"
            : "border-white/[0.08] bg-[#07111F]/45"
      }`}
    >
      <p className="text-xs text-[#AEBCCC]">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-semibold ${
          complete
            ? "text-[#8AF0BA]"
            : active
              ? "text-[#79C6F5]"
              : "text-[#C3CEDB]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
