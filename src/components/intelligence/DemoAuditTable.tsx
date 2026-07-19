import {
  ArrowUpRight,
  Building2,
  CircleDot,
  MapPin,
} from "lucide-react";
import { demoRestaurants } from "@/data/demo-restaurants";

function scoreStyle(score: number): string {
  if (score < 50) {
    return "border-red-400/20 bg-red-400/[0.06] text-red-300";
  }

  if (score < 65) {
    return "border-amber-300/20 bg-amber-300/[0.06] text-amber-200";
  }

  return "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-200";
}

export function DemoAuditTable() {
  return (
    <section className="panel rounded-[30px] p-5 md:p-7">
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.055] pb-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#caa563]">
              Attività recenti
            </p>

            <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[8px] uppercase tracking-[0.16em] text-white/32">
              Dati dimostrativi
            </span>
          </div>

          <h2 className="font-display mt-3 text-3xl text-[#f3eee5]">
            Audit e progetti in lavorazione
          </h2>
        </div>

        <button
          type="button"
          className="w-fit text-[9px] uppercase tracking-[0.22em] text-[#caa563] transition hover:text-[#efd08d]"
        >
          Visualizza archivio
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {demoRestaurants.map((restaurant) => (
          <article
            key={restaurant.id}
            className="group grid gap-5 rounded-[24px] border border-white/[0.055] bg-white/[0.016] p-5 transition duration-300 hover:border-[#caa563]/22 hover:bg-[#caa563]/[0.035] lg:grid-cols-[1.4fr_0.75fr_0.65fr_auto] lg:items-center"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#caa563]/15 bg-[#caa563]/[0.055] text-[#d5b16d]">
                <Building2 size={19} strokeWidth={1.4} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-medium text-white/82">
                    {restaurant.name}
                  </h3>

                  <span className="rounded-full border border-[#caa563]/14 px-2 py-0.5 text-[7px] uppercase tracking-[0.16em] text-[#caa563]/75">
                    Demo
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-white/28">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={11} />
                    {restaurant.city}
                  </span>

                  <span>{restaurant.category}</span>
                  <span>{restaurant.projectCode}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.18em] text-white/22">
                Stato
              </p>

              <p className="mt-2 inline-flex items-center gap-2 text-xs text-white/55">
                <CircleDot size={11} className="text-[#caa563]" />
                {restaurant.status}
              </p>
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.18em] text-white/22">
                Esigenza prioritaria
              </p>

              <p className="mt-2 text-xs text-white/52">
                {restaurant.primaryNeed}
              </p>
            </div>

            <div className="flex items-center justify-between gap-5 lg:justify-end">
              <div
                className={`flex size-12 items-center justify-center rounded-full border font-display text-xl ${scoreStyle(
                  restaurant.score,
                )}`}
              >
                {restaurant.score}
              </div>

              <ArrowUpRight
                size={17}
                className="text-white/20 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dfbd78]"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
