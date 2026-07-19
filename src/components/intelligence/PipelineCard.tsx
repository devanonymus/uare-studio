import { pipelineStages } from "@/data/demo-restaurants";

export function PipelineCard() {
  return (
    <section className="panel rounded-[30px] p-6">
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/26">
        Pipeline commerciale
      </p>

      <h2 className="font-display mt-3 text-2xl text-[#f3eee5]">
        Dal primo audit al progetto
      </h2>

      <div className="mt-7 space-y-5">
        {pipelineStages.map((stage) => (
          <div key={stage.label}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-white/48">{stage.label}</p>

              <p className="font-display text-xl text-white/68">
                {stage.value}
              </p>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.045]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#785020] via-[#d7b36e] to-[#f0d18d]"
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
