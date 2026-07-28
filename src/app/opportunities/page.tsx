import Link from "next/link";
import {
  ArrowLeft,
  LayoutGrid,
  Lightbulb,
  Network,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { OpportunityControlCenter } from "@/components/opportunities/OpportunityControlCenter";

export default async function OpportunitiesPage({
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
            <div className="flex items-center gap-4">
              <Link
                href={`/knowledge-graph?businessId=${businessId}`}
                className="flex size-11 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035]"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 items-center justify-center rounded-[12px] border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 text-[#FF9A64]">
                <Lightbulb size={18} />
              </span>

              <div>
                <h1 className="text-lg font-semibold">
                  Business Opportunity Center
                </h1>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Opportunità motivate, valutate e trasformabili in missioni.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="hidden min-h-11 items-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold md:inline-flex"
            >
              <LayoutGrid size={15} />
              Mission Control
            </Link>
          </div>
        </header>

        <section className="relative overflow-hidden px-5 pb-24 pt-8 lg:px-8 xl:px-10">
          <div className="pointer-events-none absolute -right-72 -top-72 size-[42rem] rounded-full bg-[#FF6B1A]/[0.05] blur-[160px]" />

          <div className="relative mx-auto max-w-[1580px]">
            <section className="mb-6 rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
              <div className="flex items-start gap-4">
                <ShieldCheck
                  size={22}
                  className="mt-1 shrink-0 text-[#24D27C]"
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    AI strategic opportunity layer
                  </p>

                  <h2 className="mt-4 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] md:text-5xl">
                    UVIQ individua dove intervenire
                    <span className="block text-[#FF6B1A]">
                      e ti spiega perché.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-4xl text-base leading-8 text-[#CBD6E2]">
                    Ogni opportunità mostra dati di supporto, limiti,
                    rischio, impatto, costi stimati, KPI e piano operativo.
                    Solo quelle approvate diventano missioni.
                  </p>
                </div>
              </div>
            </section>

            <OpportunityControlCenter
              businessId={businessId}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
