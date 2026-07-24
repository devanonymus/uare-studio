import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { BusinessDiscoveryForm } from "@/components/projects/BusinessDiscoveryForm";
import {
  getSector,
  isSectorId,
} from "@/core/sectors/registry";

type SectorDiscoveryPageProps = {
  params: Promise<{
    sector: string;
  }>;
};

export default async function SectorDiscoveryPage({
  params,
}: SectorDiscoveryPageProps) {
  const { sector: sectorId } = await params;

  if (!isSectorId(sectorId)) {
    notFound();
  }

  const sector = getSector(sectorId);

  if (!sector || sector.status === "planned") {
    notFound();
  }

  const Icon = sector.icon;

  return (
    <main className="workspace-page min-h-screen">
      <AppSidebar />

      <section className="px-5 pb-28 pt-7 lg:ml-[112px] lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 text-[10px] font-medium text-[#8A97A8] transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Cambia settore
          </Link>

          <header className="mt-10 grid gap-8 border-b border-white/[0.07] pb-9 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span
                  className="flex size-12 items-center justify-center rounded-[14px] border"
                  style={{
                    color: sector.accent,
                    borderColor: `${sector.accent}30`,
                    backgroundColor: `${sector.accent}12`,
                  }}
                >
                  <Icon size={21} strokeWidth={1.55} />
                </span>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4FD1FF]">
                    Business discovery
                  </p>

                  <p className="mt-1 text-xs text-[#8A97A8]">
                    Modulo {sector.status}
                  </p>
                </div>
              </div>

              <h1 className="mt-7 text-4xl font-semibold tracking-[-0.05em] text-[#F5F7FA] md:text-6xl">
                {sector.name}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#8A97A8]">
                {sector.description}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-[12px] border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.05] px-4 py-3 text-[9px] font-semibold text-[#68E0C9]">
              <CheckCircle2 size={14} />
              Blueprint caricato
            </div>
          </header>

          <section className="mt-8">
            <BusinessDiscoveryForm
              sector={{
                id: sector.id,
                name: sector.name,
                description: sector.description,
                conversionGoals: sector.conversionGoals,
              }}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
