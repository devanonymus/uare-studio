"use client";

import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  LockKeyhole,
} from "lucide-react";
import { sectorRegistry } from "@/core/sectors/registry";
import type { SectorDefinition } from "@/core/sectors/types";

const SECTOR_STORAGE_KEY = "uviq-selected-sector";

export function SectorSelector() {
  const router = useRouter();

  function chooseSector(sector: SectorDefinition) {
    if (sector.status === "planned") {
      return;
    }

    window.localStorage.setItem(
      SECTOR_STORAGE_KEY,
      sector.id,
    );

    router.push(`/projects/new/${sector.id}`);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sectorRegistry.map((sector) => {
        const Icon = sector.icon;
        const disabled = sector.status === "planned";

        return (
          <button
            key={sector.id}
            type="button"
            disabled={disabled}
            onClick={() => chooseSector(sector)}
            className={`group relative min-h-[286px] overflow-hidden rounded-[18px] border p-6 text-left transition ${
              disabled
                ? "cursor-not-allowed border-white/[0.045] bg-[#0D1016] opacity-45"
                : "border-white/[0.075] bg-[#11151C] hover:border-[#5B7CFF]/35 hover:bg-[#151A23]"
            }`}
          >
            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-5">
                <span
                  className="flex size-11 items-center justify-center rounded-[13px] border"
                  style={{
                    color: sector.accent,
                    borderColor: `${sector.accent}30`,
                    backgroundColor: `${sector.accent}12`,
                  }}
                >
                  <Icon size={20} strokeWidth={1.55} />
                </span>

                <Status status={sector.status} />
              </div>

              <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5E6978]">
                {sector.shortName}
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#F5F7FA]">
                {sector.name}
              </h3>

              <p className="mt-3 min-h-[72px] text-xs leading-6 text-[#8A97A8]">
                {sector.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {sector.examples.slice(0, 3).map((example) => (
                  <span
                    key={example}
                    className="rounded-[8px] border border-white/[0.06] bg-[#0E131B] px-2.5 py-1.5 text-[8px] text-[#8A97A8]"
                  >
                    {example}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-5">
                <span className="text-[9px] font-medium text-[#8A97A8]">
                  {disabled
                    ? "Modulo non ancora disponibile"
                    : `${sector.analysisAreas.length} aree di intelligence`}
                </span>

                {!disabled && (
                  <ArrowUpRight
                    size={15}
                    className="text-[#5E6978] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#8EA4FF]"
                  />
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Status({
  status,
}: {
  status: SectorDefinition["status"];
}) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.06] px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#68E0C9]">
        <CheckCircle2 size={10} />
        Attivo
      </span>
    );
  }

  if (status === "beta") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5B7CFF]/18 bg-[#5B7CFF]/[0.07] px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#9AAEFF]">
        <Clock3 size={10} />
        Beta
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#5E6978]">
      <LockKeyhole size={10} />
      Presto
    </span>
  );
}
