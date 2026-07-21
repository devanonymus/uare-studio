import { PRODUCT } from "@/core/brand/identity";

type BrandMarkProps = {
  compact?: boolean;
  showDescriptor?: boolean;
  inverted?: boolean;
};

export function BrandMark({
  compact = false,
  showDescriptor = true,
  inverted = false,
}: BrandMarkProps) {
  const foreground = inverted ? "#09090b" : "#f4f1eb";
  const muted = inverted
    ? "text-black/45"
    : "text-white/34";

  return (
    <div className="inline-flex items-center gap-3">
      <svg
        viewBox="0 0 64 64"
        aria-label="Logo UVIQ"
        className={compact ? "size-10" : "size-14"}
      >
        <defs>
          <linearGradient
            id="uviq-gradient"
            x1="8"
            y1="4"
            x2="57"
            y2="60"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F3D7A0" />
            <stop offset="0.45" stopColor="#C89A4B" />
            <stop offset="1" stopColor="#7C5523" />
          </linearGradient>

          <filter
            id="uviq-glow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="url(#uviq-gradient)"
          strokeWidth="1.4"
          opacity="0.35"
        />

        <path
          d="M17 18V35.5C17 44.6 23.7 50 32 50C40.3 50 47 44.6 47 35.5V18"
          fill="none"
          stroke="url(#uviq-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M32 14V42"
          fill="none"
          stroke={foreground}
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        <circle
          cx="32"
          cy="12"
          r="3.2"
          fill="#E2B661"
          filter="url(#uviq-glow)"
          opacity="0.65"
        />

        <circle
          cx="32"
          cy="12"
          r="2.25"
          fill="#F1CE89"
        />
      </svg>

      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-semibold leading-none tracking-[-0.055em] ${
              compact ? "text-xl" : "text-3xl"
            }`}
            style={{ color: foreground }}
          >
            {PRODUCT.name}
          </span>

          {!compact && (
            <span className="rounded-full border border-[#caa563]/20 bg-[#caa563]/[0.07] px-2 py-1 text-[7px] uppercase tracking-[0.18em] text-[#d8b36c]">
              AI
            </span>
          )}
        </div>

        {showDescriptor && (
          <p
            className={`mt-1.5 uppercase tracking-[0.23em] ${muted} ${
              compact ? "text-[6px]" : "text-[8px]"
            }`}
          >
            {PRODUCT.descriptor}
          </p>
        )}
      </div>
    </div>
  );
}
