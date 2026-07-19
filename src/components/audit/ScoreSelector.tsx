"use client";

type ScoreSelectorProps = {
  value: number;
  onChange: (score: number) => void;
};

export function ScoreSelector({
  value,
  onChange,
}: ScoreSelectorProps) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
      {Array.from({ length: 11 }, (_, score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className={`flex h-10 items-center justify-center rounded-xl border text-xs transition duration-200 ${
            value === score
              ? "border-[#d1aa62] bg-[#d1aa62] font-medium text-[#171008]"
              : "border-white/[0.075] bg-white/[0.02] text-white/42 hover:border-[#d1aa62]/35 hover:text-[#e2c27d]"
          }`}
        >
          {score}
        </button>
      ))}
    </div>
  );
}
