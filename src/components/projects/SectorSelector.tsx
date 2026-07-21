"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import {
  sectorRegistry,
} from "@/core/sectors/registry";
import type { SectorDefinition } from "@/core/sectors/types";

const SECTOR_STORAGE_KEY = "uae-selected-sector";

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

    if (sector.id === "restaurant") {
      router.push("/audits/new");
      return;
    }

    router.push(`/projects/new/discovery?sector=${sector.id}`);
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
            className={`group relative overflow-hidden rounded-[30px] border p-6 text-left transition duration-500 ${
              disabled
                ? "cursor-not-allowed border-white/[0.04] bg-white/[0.01] opacity-45"
                : "border-white/[0.065] bg-[#0c0c0d] hover:-translate-y-1 hover:border-white/[0.13]"
            }`}
          >
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 size-52 rounded-full blur-3xl transition duration-500 group-hover:scale-125"
              style={{
                backgroundColor: sector.glow,
              }}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <span
                  className="flex size-12 items-center justify-center rounded-[18px] border"
                  style={{
                    color: sector.accent,
                    borderColor: `${sector.accent}30`,
                    backgroundColor: `${sector.accent}10`,
                  }}
                >
                  <Icon size={21} strokeWidth={1.4} />
                </span>

                <span
                  className={`rounded-full border px-2.5 py-1 text-[7px] uppercase tracking-[0.17em] ${
                    sector.status === "active"
                      ? "border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-300/70"
                      : sector.status === "beta"
                        ? "border-[#caa563]/15 bg-[#caa563]/[0.05] text-[#d7b36d]"
                        : "border-white/[0.07] bg-white/[0.025] text-white/27"
                  }`}
                >
                  {sector.status === "active"
                    ? "Attivo"
                    : sector.status === "beta"
                      ? "Beta"
                      : "Prossimamente"}
                </span>
              </div>

              <p className="mt-7 text-[8px] uppercase tracking-[0.25em] text-white/22">
                {sector.shortName}
              </p>

              <h2 className="font-display mt-2 text-3xl text-[#f3eee5]">
                {sector.name}
              </h2>

              <p className="mt-4 min-h-[52px] text-xs leading-6 text-white/32">
                {sector.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {sector.examples.slice(0, 4).map((example) => (
                  <span
                    key={example}
                    className="rounded-full border border-white/[0.06] bg-white/[0.018] px-3 py-1.5 text-[8px] text-white/28"
                  >
                    {example}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-white/[0.05] pt-5">
                <div className="flex items-center gap-2 text-[9px] text-white/25">
                  {disabled ? (
                    <LockKeyhole size={13} />
                  ) : sector.status === "active" ? (
                    <Check size={13} className="text-emerald-300/70" />
                  ) : (
                    <Sparkles size={13} style={{ color: sector.accent }} />
                  )}

                  {disabled
                    ? "Modulo in sviluppo"
                    : `${sector.analysisAreas.length} aree specializzate`}
                </div>

                {!disabled && (
                  <ArrowRight
                    size={15}
                    className="text-white/17 transition group-hover:translate-x-1 group-hover:text-white/60"
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
