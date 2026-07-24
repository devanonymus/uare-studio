import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
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

const steps = [
  "Business Discovery",
  "Research Intelligence",
  "Analysis Insights",
  "Strategy Blueprint",
  "Automation Launch",
];

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

      <section className="px-5 pb-28 pt-6 lg:ml-[112px] lg:px-8 xl:px-10">
        <div className="mx-auto max-w-[1520px]">
          <div className="flex flex-col gap-6 border-b border-white/[0.07] pb-6 xl:flex-row xl:items-center xl:justify-between">
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 text-[10px] font-medium text-[#8A97A8] transition hover:text-white"
            >
              <ArrowLeft size={15} />
              Cambia settore
            </Link>

            <ol className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 xl:ml-14 xl:grid-cols-5">
              {steps.map((step, index) => {
                const active = index === 0;

                return (
                  <li
                    key={step}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${
                        active
                          ? "border-[#5B7CFF] bg-[#5B7CFF]/15 text-white shadow-[0_0_20px_rgba(91,124,255,0.28)]"
                          : "border-white/[0.1] bg-[#0E131B] text-[#5E6978]"
                      }`}
                    >
                      {active ? index + 1 : <Circle size={9} />}
                    </span>

                    <span
                      className={`hidden min-w-0 text-[9px] font-medium leading-4 sm:block ${
                        active
                          ? "text-[#F5F7FA]"
                          : "text-[#5E6978]"
                      }`}
                    >
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <header className="relative mt-8 overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#0E131B] px-6 py-8 md:px-8 xl:px-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-28 -top-44 size-[28rem] rounded-full blur-[120px]"
              style={{
                backgroundColor: `${sector.accent}18`,
              }}
            />

            <div className="relative grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
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
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
                      Business discovery
                    </p>

                    <p className="mt-1 text-xs text-[#8A97A8]">
                      Blueprint {sector.status}
                    </p>
                  </div>
                </div>

                <h1 className="mt-7 text-4xl font-semibold tracking-[-0.05em] text-[#F5F7FA] md:text-6xl">
                  {sector.name}
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-[#8A97A8]">
                  Configura il profilo dell’attività. UVIQ userà queste
                  informazioni per preparare ricerca, strategia, contenuti
                  e automazioni specifiche per il settore.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-[12px] border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.05] px-4 py-3 text-[9px] font-semibold text-[#68E0C9]">
                <CheckCircle2 size={14} />
                Blueprint caricato
              </div>
            </div>
          </header>

          <section className="mt-6">
            <BusinessDiscoveryForm
              sector={{
                id: sector.id,
                name: sector.name,
                description: sector.description,
                conversionGoals: sector.conversionGoals,
                analysisAreas: sector.analysisAreas.map(
                  (area) => ({
                    id: area.id,
                    label: area.label,
                  }),
                ),
                requiredFeatures: sector.requiredFeatures,
              }}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
