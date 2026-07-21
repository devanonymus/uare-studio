"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Globe2,
  MapPin,
  Menu,
  Monitor,
  Palette,
  Phone,
  RefreshCcw,
  Smartphone,
  Sparkles,
  Star,
  Utensils,
  X,
} from "lucide-react";
import type { QuickAuditResult } from "@/types/quick-audit";

const RESULT_KEY = "uare-quick-audit-result";

type ThemeKey = "noir" | "ivory" | "sakura";
type ViewMode = "desktop" | "mobile";

type DemoTheme = {
  key: ThemeKey;
  name: string;
  description: string;
  background: string;
  surface: string;
  surfaceSoft: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
  heroGlow: string;
};

const themes: DemoTheme[] = [
  {
    key: "noir",
    name: "Noir Experience",
    description: "Premium, scenografico e serale",
    background: "#090807",
    surface: "#12100e",
    surfaceSoft: "#181512",
    text: "#f7f0e4",
    muted: "#a49a8c",
    accent: "#d2a654",
    accentText: "#171008",
    border: "rgba(255,255,255,0.09)",
    heroGlow: "rgba(195,138,49,0.22)",
  },
  {
    key: "ivory",
    name: "Ivory Minimal",
    description: "Luminoso, raffinato e contemporaneo",
    background: "#f4efe6",
    surface: "#fffaf2",
    surfaceSoft: "#ebe3d6",
    text: "#1b1814",
    muted: "#756c61",
    accent: "#83602f",
    accentText: "#fffaf2",
    border: "rgba(34,27,19,0.12)",
    heroGlow: "rgba(151,104,48,0.17)",
  },
  {
    key: "sakura",
    name: "Sakura Modern",
    description: "Giappone contemporaneo e distintivo",
    background: "#130d10",
    surface: "#1c1317",
    surfaceSoft: "#271920",
    text: "#fff1f4",
    muted: "#bca3aa",
    accent: "#e3859b",
    accentText: "#210e14",
    border: "rgba(255,221,230,0.12)",
    heroGlow: "rgba(217,93,127,0.22)",
  },
];

const menuItems = [
  {
    name: "Sashimi Selection",
    description:
      "Selezione dello chef con salmone, tonno, ricciola e pescato del giorno.",
    price: "24",
    tag: "Chef selection",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Signature Uramaki",
    description:
      "Salmone, avocado, crema delicata, sesamo tostato e salsa della casa.",
    price: "16",
    tag: "Best seller",
    image:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Tataki Experience",
    description:
      "Tonno scottato, ponzu, erba cipollina e croccante aromatico.",
    price: "19",
    tag: "Premium",
    image:
      "https://images.unsplash.com/photo-1563612116625-3012372fccce?auto=format&fit=crop&w=1000&q=85",
  },
];

const experiencePoints = [
  "Materie prime selezionate",
  "Preparazioni espresse",
  "Ambiente contemporaneo",
  "Prenotazione immediata",
];

function getTheme(themeKey: ThemeKey): DemoTheme {
  return themes.find((theme) => theme.key === themeKey) ?? themes[0];
}

export function DemoGenerator() {
  const [result, setResult] = useState<QuickAuditResult | null>(null);
  const [missingResult, setMissingResult] = useState(false);
  const [themeKey, setThemeKey] = useState<ThemeKey>("noir");
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [showPanel, setShowPanel] = useState(true);

  useEffect(() => {
    const storedResult = window.localStorage.getItem(RESULT_KEY);

    if (!storedResult) {
      setMissingResult(true);
      return;
    }

    try {
      const parsed = JSON.parse(storedResult) as QuickAuditResult;
      setResult(parsed);
    } catch {
      setMissingResult(true);
    }
  }, []);

  const theme = useMemo(() => getTheme(themeKey), [themeKey]);

  if (missingResult) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6">
        <section className="panel max-w-xl rounded-[34px] p-10 text-center">
          <Globe2
            size={28}
            strokeWidth={1.3}
            className="mx-auto text-[#d8b671]"
          />

          <h1 className="font-display mt-6 text-4xl text-[#f4eee5]">
            Nessun progetto disponibile
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/35">
            Completa prima un audit per generare una homepage personalizzata.
          </p>

          <Link
            href="/audits/new"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#d1aa62] px-6 py-3 text-xs font-medium text-[#171008]"
          >
            Avvia audit
            <ArrowRight size={15} />
          </Link>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505]">
        <p className="text-[9px] uppercase tracking-[0.28em] text-white/25">
          Generazione concept…
        </p>
      </main>
    );
  }

  const restaurantName = result.input.restaurantName;
  const city = result.input.city || "La tua città";
  const category = result.input.category;

  return (
    <main className="min-h-screen bg-[#050505]">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/90 px-5 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/audits/analysis"
              className="flex size-10 items-center justify-center rounded-full border border-white/[0.08] text-white/35 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft size={16} />
            </Link>

            <div>
              <div className="flex items-center gap-3">
                <p className="text-[9px] uppercase tracking-[0.27em] text-[#caa563]">
                  UVIQ Demo Generator
                </p>

                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.05] px-2.5 py-1 text-[7px] uppercase tracking-[0.16em] text-emerald-300/70">
                  Concept live
                </span>
              </div>

              <h1 className="mt-1 text-sm font-medium text-white/72">
                {restaurantName}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full border border-white/[0.08] bg-white/[0.025] p-1">
              <button
                type="button"
                onClick={() => setViewMode("desktop")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[9px] uppercase tracking-[0.16em] transition ${
                  viewMode === "desktop"
                    ? "bg-white/[0.09] text-white/75"
                    : "text-white/26"
                }`}
              >
                <Monitor size={13} />
                Desktop
              </button>

              <button
                type="button"
                onClick={() => setViewMode("mobile")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[9px] uppercase tracking-[0.16em] transition ${
                  viewMode === "mobile"
                    ? "bg-white/[0.09] text-white/75"
                    : "text-white/26"
                }`}
              >
                <Smartphone size={13} />
                Mobile
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPanel((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-3 text-[9px] uppercase tracking-[0.16em] text-white/42 transition hover:text-white"
            >
              <Palette size={14} />
              Personalizza
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#d1aa62] px-5 py-3 text-[9px] font-medium uppercase tracking-[0.14em] text-[#171008] transition hover:bg-[#e4c47d]"
            >
              <ExternalLink size={14} />
              Presenta al cliente
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 md:px-8">
        {showPanel && (
          <aside className="hidden w-[290px] shrink-0 xl:block">
            <div className="panel sticky top-24 rounded-[30px] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.24em] text-[#caa563]">
                    Direzione creativa
                  </p>

                  <h2 className="font-display mt-2 text-2xl text-[#f3eee5]">
                    Aspetto del concept
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPanel(false)}
                  className="text-white/22 transition hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {themes.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setThemeKey(item.key)}
                    className={`w-full rounded-[22px] border p-4 text-left transition ${
                      themeKey === item.key
                        ? "border-[#caa563]/28 bg-[#caa563]/[0.055]"
                        : "border-white/[0.055] bg-white/[0.012] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-2">
                        <span
                          className="size-5 rounded-full border border-white/10"
                          style={{ backgroundColor: item.background }}
                        />
                        <span
                          className="size-5 rounded-full border border-white/10"
                          style={{ backgroundColor: item.accent }}
                        />
                      </div>

                      {themeKey === item.key && (
                        <Check size={14} className="text-[#d8b671]" />
                      )}
                    </div>

                    <p className="mt-4 text-xs font-medium text-white/67">
                      {item.name}
                    </p>

                    <p className="mt-2 text-[10px] leading-4 text-white/26">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="my-6 h-px bg-white/[0.055]" />

              <div className="space-y-4">
                <Insight
                  label="Brand score"
                  value={result.areas.find((area) => area.id === "brand")?.score}
                />

                <Insight
                  label="Website score"
                  value={
                    result.areas.find((area) => area.id === "website")?.score
                  }
                />

                <Insight
                  label="Conversion score"
                  value={
                    result.areas.find((area) => area.id === "conversion")?.score
                  }
                />
              </div>

              <div className="mt-6 rounded-[20px] border border-[#caa563]/14 bg-[#caa563]/[0.04] p-4">
                <Sparkles size={16} className="text-[#d8b671]" />

                <p className="mt-3 text-[10px] leading-5 text-white/33">
                  Il concept trasferisce online una percezione più premium,
                  riduce gli attriti e valorizza prenotazione, menù e identità.
                </p>
              </div>
            </div>
          </aside>
        )}

        <section className="min-w-0 flex-1">
          <div
            className={`mx-auto overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#111] shadow-[0_45px_120px_rgba(0,0,0,0.48)] transition-all duration-500 ${
              viewMode === "mobile"
                ? "max-w-[430px]"
                : "max-w-[1280px]"
            }`}
          >
            <BrowserBar
              restaurantName={restaurantName}
              theme={theme}
              viewMode={viewMode}
            />

            <RestaurantDemo
              restaurantName={restaurantName}
              city={city}
              category={category}
              theme={theme}
              viewMode={viewMode}
            />
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-white/[0.055] pt-5 md:flex-row md:items-center">
            <div>
              <p className="text-[8px] uppercase tracking-[0.22em] text-white/20">
                Concept generato da UVIQ Intelligence
              </p>

              <p className="mt-2 text-[10px] text-white/30">
                Anteprima dimostrativa, contenuti e immagini da validare con il
                cliente.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-3 text-[9px] uppercase tracking-[0.16em] text-white/35 transition hover:text-white"
              >
                <RefreshCcw size={13} />
                Rigenera concept
              </button>

              <Link
                href="/growth-plan"
                className="inline-flex items-center gap-3 rounded-full border border-[#caa563]/20 bg-[#caa563]/[0.055] px-5 py-3 text-[9px] uppercase tracking-[0.16em] text-[#dfbd78]"
              >
                Vai alla proposta
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Insight({
  label,
  value = 0,
}: {
  label: string;
  value?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
          {label}
        </p>

        <p className="font-display text-lg text-[#d9b873]">{value}</p>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#785020] to-[#d9b873]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function BrowserBar({
  restaurantName,
  theme,
  viewMode,
}: {
  restaurantName: string;
  theme: DemoTheme;
  viewMode: ViewMode;
}) {
  const domain = restaurantName
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòù]+/gi, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#111] px-4 py-3">
      <div className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-red-400/60" />
        <span className="size-2.5 rounded-full bg-amber-300/60" />
        <span className="size-2.5 rounded-full bg-emerald-300/60" />
      </div>

      <div className="mx-auto flex max-w-md flex-1 items-center gap-2 rounded-full border border-white/[0.07] bg-black/30 px-4 py-2">
        <Globe2 size={11} className="text-white/22" />

        <span className="truncate text-[9px] text-white/30">
          https://www.{domain || "ristorante"}.it
        </span>
      </div>

      <span
        className="hidden rounded-full px-2 py-1 text-[7px] uppercase tracking-[0.14em] sm:block"
        style={{
          color: theme.accent,
          backgroundColor: `${theme.accent}14`,
        }}
      >
        {viewMode}
      </span>
    </div>
  );
}

function RestaurantDemo({
  restaurantName,
  city,
  category,
  theme,
  viewMode,
}: {
  restaurantName: string;
  city: string;
  category: string;
  theme: DemoTheme;
  viewMode: ViewMode;
}) {
  const compact = viewMode === "mobile";

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <nav
        className={`flex items-center justify-between border-b px-5 ${
          compact ? "py-4" : "px-10 py-5"
        }`}
        style={{ borderColor: theme.border }}
      >
        <div>
          <p
            className={`font-serif font-semibold tracking-[-0.03em] ${
              compact ? "text-lg" : "text-2xl"
            }`}
          >
            {restaurantName}
          </p>

          {!compact && (
            <p
              className="mt-1 text-[8px] uppercase tracking-[0.3em]"
              style={{ color: theme.muted }}
            >
              Asian dining experience
            </p>
          )}
        </div>

        {compact ? (
          <Menu size={20} />
        ) : (
          <div className="flex items-center gap-7">
            {["Esperienza", "Menù", "Gallery", "Contatti"].map((item) => (
              <span
                key={item}
                className="text-[10px] uppercase tracking-[0.16em]"
                style={{ color: theme.muted }}
              >
                {item}
              </span>
            ))}

            <button
              type="button"
              className="rounded-full px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.14em]"
              style={{
                backgroundColor: theme.accent,
                color: theme.accentText,
              }}
            >
              Prenota
            </button>
          </div>
        )}
      </nav>

      <section
        className={`relative overflow-hidden ${
          compact
            ? "min-h-[680px] px-5 pb-10 pt-14"
            : "min-h-[720px] px-12 py-20 lg:px-20"
        }`}
      >
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.78), rgba(0,0,0,0.18)), url('https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1800&q=88')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />

        <div
          className="absolute -right-24 top-10 size-96 rounded-full blur-3xl"
          style={{ backgroundColor: theme.heroGlow }}
        />

        <div
          className={`relative z-10 flex h-full flex-col justify-center ${
            compact ? "pt-40" : "max-w-3xl pt-24"
          }`}
        >
          <div
            className="flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[8px] uppercase tracking-[0.2em]"
            style={{
              color: theme.accent,
              borderColor: `${theme.accent}55`,
              backgroundColor: `${theme.background}99`,
            }}
          >
            <MapPin size={11} />
            {city}
          </div>

          <p
            className={`mt-7 font-serif leading-[0.93] tracking-[-0.055em] ${
              compact ? "text-5xl" : "text-7xl lg:text-8xl"
            }`}
          >
            Non solo cucina.
            <br />
            <span style={{ color: theme.accent }}>Un’esperienza.</span>
          </p>

          <p
            className={`mt-7 max-w-xl leading-7 ${
              compact ? "text-sm" : "text-base"
            }`}
            style={{ color: "#d9d0c5" }}
          >
            Sapori autentici, ricerca contemporanea e atmosfera si incontrano
            in un percorso pensato per essere ricordato.
          </p>

          <div
            className={`mt-9 flex gap-3 ${
              compact ? "flex-col" : "flex-wrap"
            }`}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{
                backgroundColor: theme.accent,
                color: theme.accentText,
              }}
            >
              <CalendarDays size={15} />
              Prenota il tuo tavolo
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-3 rounded-full border px-6 py-4 text-[10px] uppercase tracking-[0.14em]"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.24)",
              }}
            >
              Scopri il menù
              <ArrowRight size={14} />
            </button>
          </div>

          <div
            className={`mt-12 flex gap-6 ${
              compact ? "flex-col" : "items-center"
            }`}
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={13}
                  fill="currentColor"
                  style={{ color: theme.accent }}
                />
              ))}
            </div>

            <p className="text-[10px] text-white/55">
              Un’esperienza scelta e consigliata dai nostri ospiti
            </p>
          </div>
        </div>
      </section>

      <section
        className={`grid border-y ${
          compact ? "grid-cols-2" : "grid-cols-4"
        }`}
        style={{
          borderColor: theme.border,
          backgroundColor: theme.surface,
        }}
      >
        {experiencePoints.map((point, index) => (
          <div
            key={point}
            className={`p-5 text-center ${
              compact ? "" : "border-r last:border-r-0"
            }`}
            style={{ borderColor: theme.border }}
          >
            <p
              className="font-serif text-xl"
              style={{ color: theme.accent }}
            >
              0{index + 1}
            </p>

            <p
              className="mt-2 text-[8px] uppercase tracking-[0.16em]"
              style={{ color: theme.muted }}
            >
              {point}
            </p>
          </div>
        ))}
      </section>

      <section
        className={compact ? "px-5 py-16" : "px-12 py-24 lg:px-20"}
        style={{ backgroundColor: theme.background }}
      >
        <div
          className={`flex justify-between gap-8 ${
            compact ? "flex-col" : "items-end"
          }`}
        >
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ color: theme.accent }}
            >
              Signature menu
            </p>

            <h2
              className={`mt-4 font-serif tracking-[-0.04em] ${
                compact ? "text-4xl" : "text-6xl"
              }`}
            >
              Piatti che raccontano
              <br />
              la nostra identità.
            </h2>
          </div>

          <p
            className="max-w-md text-sm leading-6"
            style={{ color: theme.muted }}
          >
            Una selezione costruita per valorizzare qualità, tecnica e
            presentazione, accompagnando l’ospite in ogni momento della scelta.
          </p>
        </div>

        <div
          className={`mt-12 grid gap-5 ${
            compact ? "grid-cols-1" : "grid-cols-3"
          }`}
        >
          {menuItems.map((item) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-[26px] border"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.surface,
              }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />

                <span
                  className="absolute left-4 top-4 rounded-full px-3 py-2 text-[7px] font-semibold uppercase tracking-[0.16em]"
                  style={{
                    color: theme.accentText,
                    backgroundColor: theme.accent,
                  }}
                >
                  {item.tag}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-2xl">{item.name}</h3>

                  <p
                    className="font-serif text-2xl"
                    style={{ color: theme.accent }}
                  >
                    €{item.price}
                  </p>
                </div>

                <p
                  className="mt-4 text-xs leading-5"
                  style={{ color: theme.muted }}
                >
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="mx-auto mt-10 flex items-center gap-3 rounded-full border px-6 py-4 text-[9px] uppercase tracking-[0.18em]"
          style={{
            borderColor: theme.border,
            color: theme.text,
          }}
        >
          Esplora il menù completo
          <ArrowRight size={14} />
        </button>
      </section>

      <section
        className={`grid overflow-hidden ${
          compact ? "grid-cols-1" : "grid-cols-2"
        }`}
        style={{ backgroundColor: theme.surfaceSoft }}
      >
        <div
          className={compact ? "min-h-[360px]" : "min-h-[560px]"}
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1600&q=88')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />

        <div
          className={`flex flex-col justify-center ${
            compact ? "px-6 py-14" : "px-14 py-16"
          }`}
        >
          <Utensils size={24} style={{ color: theme.accent }} />

          <p
            className="mt-8 text-[9px] uppercase tracking-[0.28em]"
            style={{ color: theme.accent }}
          >
            La nostra filosofia
          </p>

          <h2
            className={`mt-4 font-serif leading-tight tracking-[-0.04em] ${
              compact ? "text-4xl" : "text-5xl"
            }`}
          >
            La qualità si percepisce prima ancora di assaggiarla.
          </h2>

          <p
            className="mt-6 max-w-xl text-sm leading-7"
            style={{ color: theme.muted }}
          >
            Ogni dettaglio racconta il nostro modo di intendere la cucina:
            ingredienti scelti, equilibrio, tecnica e un servizio capace di
            trasformare una cena in un’esperienza.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Information
              icon={Clock3}
              title="Aperti ogni sera"
              detail="19:00 – 00:00"
              theme={theme}
            />

            <Information
              icon={MapPin}
              title={city}
              detail="Indicazioni stradali"
              theme={theme}
            />
          </div>
        </div>
      </section>

      <section
        className={`text-center ${compact ? "px-5 py-16" : "px-12 py-24"}`}
        style={{ backgroundColor: theme.background }}
      >
        <p
          className="text-[9px] uppercase tracking-[0.28em]"
          style={{ color: theme.accent }}
        >
          {category}
        </p>

        <h2
          className={`mx-auto mt-5 max-w-3xl font-serif leading-tight tracking-[-0.045em] ${
            compact ? "text-4xl" : "text-6xl"
          }`}
        >
          La tua prossima esperienza comincia da qui.
        </h2>

        <p
          className="mx-auto mt-6 max-w-xl text-sm leading-7"
          style={{ color: theme.muted }}
        >
          Prenota il tuo tavolo e scopri una nuova interpretazione della cucina
          asiatica.
        </p>

        <div
          className={`mt-9 flex justify-center gap-3 ${
            compact ? "flex-col" : "flex-wrap"
          }`}
        >
          <button
            type="button"
            className="inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{
              backgroundColor: theme.accent,
              color: theme.accentText,
            }}
          >
            <CalendarDays size={15} />
            Prenota ora
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-3 rounded-full border px-7 py-4 text-[10px] uppercase tracking-[0.14em]"
            style={{
              borderColor: theme.border,
              color: theme.text,
            }}
          >
            <Phone size={15} />
            Contattaci
          </button>
        </div>
      </section>

      <footer
        className={`border-t ${compact ? "px-5 py-8" : "px-12 py-10"}`}
        style={{
          borderColor: theme.border,
          backgroundColor: theme.surface,
        }}
      >
        <div
          className={`flex justify-between gap-6 ${
            compact ? "flex-col" : "items-center"
          }`}
        >
          <div>
            <p className="font-serif text-2xl">{restaurantName}</p>

            <p
              className="mt-2 text-[8px] uppercase tracking-[0.2em]"
              style={{ color: theme.muted }}
            >
              Asian dining experience · {city}
            </p>
          </div>

          <p className="text-[8px]" style={{ color: theme.muted }}>
            Concept digitale dimostrativo · UVIQ Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}

function Information({
  icon: Icon,
  title,
  detail,
  theme,
}: {
  icon: typeof Clock3;
  title: string;
  detail: string;
  theme: DemoTheme;
}) {
  return (
    <div
      className="rounded-[20px] border p-4"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.background,
      }}
    >
      <Icon size={16} style={{ color: theme.accent }} />

      <p className="mt-4 text-xs font-medium">{title}</p>

      <p className="mt-2 text-[9px]" style={{ color: theme.muted }}>
        {detail}
      </p>
    </div>
  );
}
