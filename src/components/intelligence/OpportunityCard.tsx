import { Sparkles } from "lucide-react";
import { opportunityBreakdown } from "@/data/demo-restaurants";

export function OpportunityCard() {
  return (
    <section className="panel relative overflow-hidden rounded-[30px] p-6">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 size-60 rounded-full bg-[#a51f27]/[0.07] blur-3xl"
      />

      <div className="relative flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl border border-[#caa563]/15 bg-[#caa563]/[0.055] text-[#d7b36e]">
          <Sparkles size={18} strokeWidth={1.4} />
        </div>

        <div>
          <p className="text-[9px] uppercase tracking-[0.27em] text-[#caa563]">
            UVIQ Intelligence
          </p>

          <h2 className="font-display mt-1 text-2xl text-[#f3eee5]">
            Soluzioni più richieste
          </h2>
        </div>
      </div>

      <div className="relative mt-7 space-y-4">
        {opportunityBreakdown.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-white/48">{item.label}</p>
              <p className="text-[10px] text-[#d8b570]">{item.value}%</p>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.045]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7c5523] to-[#d9b873]"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
