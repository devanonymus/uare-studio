type BrandMarkProps = {
  compact?: boolean;
  showDescriptor?: boolean;
};

export function BrandMark({
  compact = false,
  showDescriptor = true,
}: BrandMarkProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div
          className={`font-display gold-text font-medium leading-none tracking-[-0.08em] ${
            compact ? "text-5xl" : "text-[clamp(5.5rem,15vw,10rem)]"
          }`}
        >
          UAE
        </div>

        <span
          aria-hidden="true"
          className={`absolute rounded-full bg-[#a21e26] shadow-[0_0_35px_rgba(162,30,38,0.35)] ${
            compact
              ? "bottom-[0.6rem] left-[0.45rem] size-3"
              : "bottom-[1.3rem] left-[0.9rem] size-[clamp(0.8rem,2vw,1.25rem)]"
          }`}
        />
      </div>

      <div
        className={`font-light uppercase text-[#f3efe7] ${
          compact
            ? "mt-2 text-xs tracking-[0.55em]"
            : "mt-3 text-sm tracking-[0.85em] md:text-base"
        }`}
      >
        Univibe
      </div>

      {showDescriptor && (
        <>
          <div className="mt-6 flex items-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#b98d47]" />
            <span className="text-[9px] uppercase tracking-[0.38em] text-[#cba965] sm:text-[10px]">
              Asian Restaurant Experience
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#b98d47]" />
          </div>

          <p className="mt-5 text-[8px] uppercase tracking-[0.45em] text-white/45 sm:text-[9px]">
            Digital Excellence for Asian Restaurants
          </p>
        </>
      )}
    </div>
  );
}
