import type { LucideIcon } from "lucide-react";

type IntelligenceMetricProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  trend?: string;
};

export function IntelligenceMetric({
  label,
  value,
  detail,
  icon: Icon,
  trend,
}: IntelligenceMetricProps) {
  return (
    <article className="panel group relative overflow-hidden rounded-[28px] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#c9a15c]/30">
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 size-32 rounded-full bg-[#c9a15c]/[0.055] blur-3xl transition duration-500 group-hover:bg-[#c9a15c]/[0.09]"
      />

      <div className="relative flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-2xl border border-[#c9a15c]/15 bg-[#c9a15c]/[0.06] text-[#dfbd78]">
          <Icon size={18} strokeWidth={1.45} />
        </div>

        {trend && (
          <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.055] px-2.5 py-1 text-[9px] text-emerald-300/80">
            {trend}
          </span>
        )}
      </div>

      <p className="relative mt-7 text-[10px] uppercase tracking-[0.18em] text-white/32">
        {label}
      </p>

      <p className="font-display relative mt-2 text-4xl font-medium text-[#f4efe6]">
        {value}
      </p>

      <p className="relative mt-2 text-[11px] leading-5 text-white/28">
        {detail}
      </p>
    </article>
  );
}
