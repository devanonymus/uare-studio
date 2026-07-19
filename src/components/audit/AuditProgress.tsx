type AuditProgressProps = {
  currentStep: number;
  totalSteps: number;
  label: string;
};

export function AuditProgress({
  currentStep,
  totalSteps,
  label,
}: AuditProgressProps) {
  const percentage = Math.round(
    ((currentStep + 1) / totalSteps) * 100,
  );

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">
            Avanzamento audit
          </p>
          <p className="mt-2 text-sm text-white/66">{label}</p>
        </div>

        <p className="font-display text-3xl text-[#e1c17c]">
          {percentage}%
        </p>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.055]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7b5524] via-[#e3c27e] to-[#a67834] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
