import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: MetricCardProps) {
  return (
    <article className="panel group rounded-[26px] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#c7a05c]/30">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-2xl border border-[#c7a05c]/16 bg-[#c7a05c]/8 text-[#dfbd78]">
          <Icon size={18} strokeWidth={1.5} />
        </div>

        <span className="text-[9px] uppercase tracking-[0.24em] text-white/23">
          Live
        </span>
      </div>

      <p className="mt-7 text-xs text-white/42">{label}</p>
      <p className="font-display mt-1 text-4xl font-medium text-[#f6f1e8]">
        {value}
      </p>
      <p className="mt-2 text-[11px] text-white/28">{detail}</p>
    </article>
  );
}
