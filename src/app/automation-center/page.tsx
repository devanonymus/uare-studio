import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Database,
  LayoutGrid,
  LockKeyhole,
  Workflow,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AutomationControlCenter } from "@/components/automations/AutomationControlCenter";

export default async function AutomationCenterPage({
  searchParams,
}: {
  searchParams: Promise<{
    businessId?: string;
  }>;
}) {
  const params =
    await searchParams;

  const businessId =
    params.businessId ||
    "001c6d9e-f2a6-429e-8d46-898a7229c5ab";

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href={`/audits/war-room?businessId=${businessId}`}
                className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035] text-[#C3CEDB] transition hover:bg-white/[0.07]"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-[#6D4FD2]/20 bg-[#6D4FD2]/10 text-[#B9AAF4]">
                <Workflow size={18} />
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-[-0.025em]">
                    Automation Control Center
                  </h1>

                  <span className="rounded-full border border-[#24D27C]/20 bg-[#24D27C]/[0.07] px-3 py-1 text-xs font-semibold text-[#8AF0BA]">
                    Sandbox operativa
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Artefatti, approvazioni e coda di esecuzione.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="inline-flex items-center gap-2 text-sm text-[#B8C5D4]">
                <LockKeyhole
                  size={14}
                  className="text-[#F8C867]"
                />
                Effetti esterni bloccati
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
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#6D4FD2]/[0.05] blur-[160px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="mb-6 rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                  <Bot size={20} />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    AI execution governance
                  </p>

                  <h2 className="mt-4 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] md:text-5xl">
                    Revisiona ciò che UVIQ crea
                    <span className="block text-[#FF6B1A]">
                      prima di autorizzarne l’esecuzione.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-4xl text-base leading-8 text-[#CBD6E2]">
                    Ogni materiale è persistente, versionabile e collegato
                    al relativo automation run. La coda non produce ancora
                    effetti su servizi esterni.
                  </p>
                </div>
              </div>
            </section>

            <AutomationControlCenter
              businessId={businessId}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
