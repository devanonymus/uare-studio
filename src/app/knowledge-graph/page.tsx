import Link from "next/link";
import {
  ArrowLeft,
  LayoutGrid,
  Network,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { KnowledgeGraphWorkspace } from "@/components/knowledge-graph/KnowledgeGraphWorkspace";

export default async function KnowledgeGraphPage({
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
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between px-5 lg:px-8 xl:px-10">
            <div className="flex items-center gap-4">
              <Link
                href={`/integration-hub?businessId=${businessId}`}
                className="flex size-11 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035]"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 items-center justify-center rounded-[12px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                <Network size={18} />
              </span>

              <div>
                <h1 className="text-lg font-semibold">
                  Business Knowledge Graph
                </h1>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Conoscenza aziendale condivisa tra tutti gli agenti.
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

        <section className="px-5 pb-24 pt-8 lg:px-8 xl:px-10">
          <div className="mx-auto max-w-[1580px]">
            <section className="mb-6 rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
              <div className="flex items-start gap-4">
                <ShieldCheck
                  size={22}
                  className="mt-1 shrink-0 text-[#24D27C]"
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    Shared AI business memory
                  </p>

                  <h2 className="mt-4 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] md:text-5xl">
                    Tutti gli agenti lavorano
                    <span className="block text-[#FF6B1A]">
                      sulla stessa conoscenza verificabile.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-4xl text-base leading-8 text-[#CBD6E2]">
                    Il grafo collega memoria, evidenze, missioni,
                    automazioni, materiali e integrazioni senza confondere
                    fatti verificati e inferenze.
                  </p>
                </div>
              </div>
            </section>

            <KnowledgeGraphWorkspace
              businessId={businessId}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
