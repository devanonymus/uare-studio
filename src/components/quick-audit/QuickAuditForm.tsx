"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AtSign,
  Bot,
  Building2,
  Globe2,
  MapPin,
  Search,
  Share2,
  UserRound,
  Video,
} from "lucide-react";
import type {
  QuickAuditInput,
  RestaurantCategory,
} from "@/types/quick-audit";

const STORAGE_KEY = "uare-quick-audit-input";

const initialState: QuickAuditInput = {
  restaurantName: "",
  city: "",
  contactPerson: "",
  category: "Sushi e cucina giapponese",
  website: "",
  googleBusiness: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  currentMenu: "",
  notes: "",
};

const categories: RestaurantCategory[] = [
  "Sushi e cucina giapponese",
  "Ristorante cinese",
  "Asian fusion",
  "Poké",
  "Ramen restaurant",
  "Ristorante coreano",
  "Ristorante thailandese",
];

export function QuickAuditForm() {
  const router = useRouter();
  const [form, setForm] = useState<QuickAuditInput>(initialState);
  const [error, setError] = useState("");

  function update<K extends keyof QuickAuditInput>(
    field: K,
    value: QuickAuditInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submitAudit() {
    if (form.restaurantName.trim().length < 2) {
      setError("Inserisci il nome del ristorante.");
      return;
    }

    if (
      form.website.trim().length < 4 &&
      form.instagram.trim().length < 3 &&
      form.googleBusiness.trim().length < 4
    ) {
      setError(
        "Inserisci almeno il sito, il profilo Instagram oppure Google Business.",
      );
      return;
    }

    setError("");
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(form),
    );
    window.localStorage.removeItem("uare-quick-audit-result");
    router.push("/audits/analysis");
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-white/[0.055] pb-8">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#caa563]/16 bg-[#caa563]/[0.05] px-3 py-1 text-[8px] uppercase tracking-[0.2em] text-[#caa563]">
            UAE Intelligence
          </span>

          <span className="text-[9px] uppercase tracking-[0.24em] text-white/24">
            Valutazione preliminare
          </span>
        </div>

        <h1 className="font-display mt-5 max-w-4xl text-4xl leading-tight text-[#f4eee5] md:text-6xl">
          Inizia l’analisi digitale del ristorante.
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/36">
          Inserisci i principali punti di contatto. La piattaforma produrrà
          una valutazione preliminare, individuerà le priorità e proporrà gli
          interventi più coerenti.
        </p>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_310px]">
        <section className="panel rounded-[32px] p-6 md:p-9">
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Nome del ristorante"
              icon={Building2}
              value={form.restaurantName}
              placeholder="Yammy Ristorante Giapponese"
              onChange={(value) => update("restaurantName", value)}
            />

            <Field
              label="Città"
              icon={MapPin}
              value={form.city}
              placeholder="Martina Franca"
              onChange={(value) => update("city", value)}
            />

            <Field
              label="Referente"
              icon={UserRound}
              value={form.contactPerson}
              placeholder="Titolare o responsabile"
              onChange={(value) => update("contactPerson", value)}
            />

            <label className="block">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/32">
                Categoria
              </span>

              <select
                value={form.category}
                onChange={(event) =>
                  update(
                    "category",
                    event.target.value as RestaurantCategory,
                  )
                }
                className="mt-3 w-full rounded-2xl border border-white/[0.075] bg-[#0a0a0b] px-4 py-4 text-sm text-white/76 outline-none transition focus:border-[#caa563]/40"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="my-9 h-px bg-white/[0.055]" />

          <p className="text-[9px] uppercase tracking-[0.27em] text-[#caa563]">
            Presenza digitale
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Field
              label="Sito web"
              icon={Globe2}
              value={form.website}
              placeholder="https://ristorante.it"
              onChange={(value) => update("website", value)}
            />

            <Field
              label="Google Business"
              icon={Search}
              value={form.googleBusiness}
              placeholder="Link della scheda Google"
              onChange={(value) => update("googleBusiness", value)}
            />

            <Field
              label="Instagram"
              icon={AtSign}
              value={form.instagram}
              placeholder="@nomeristorante"
              onChange={(value) => update("instagram", value)}
            />

            <Field
              label="Facebook"
              icon={Share2}
              value={form.facebook}
              placeholder="Link della pagina"
              onChange={(value) => update("facebook", value)}
            />

            <Field
              label="TikTok"
              icon={Video}
              value={form.tiktok}
              placeholder="@nomeristorante"
              onChange={(value) => update("tiktok", value)}
            />

            <Field
              label="Menù attuale"
              icon={Globe2}
              value={form.currentMenu}
              placeholder="Link del menù o PDF"
              onChange={(value) => update("currentMenu", value)}
            />
          </div>

          <label className="mt-7 block">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/32">
              Annotazioni preliminari
            </span>

            <textarea
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="Inserisci eventuali osservazioni già raccolte sul ristorante..."
              rows={4}
              className="mt-3 w-full resize-none rounded-2xl border border-white/[0.075] bg-white/[0.02] px-4 py-4 text-sm leading-6 text-white/75 outline-none transition placeholder:text-white/17 focus:border-[#caa563]/40"
            />
          </label>

          {error && (
            <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/[0.055] px-4 py-3 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={submitAudit}
              className="group inline-flex items-center gap-4 rounded-full bg-[#d1aa62] px-7 py-4 text-xs font-medium text-[#171008] transition hover:bg-[#e4c47d]"
            >
              Avvia analisi
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="panel rounded-[28px] p-6">
            <Bot
              size={20}
              strokeWidth={1.4}
              className="text-[#d6b36d]"
            />

            <p className="mt-6 text-[9px] uppercase tracking-[0.26em] text-[#caa563]">
              Aree analizzate
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Identità e posizionamento",
                "Sito ed esperienza mobile",
                "SEO e Google Business",
                "Social e contenuti",
                "Menù digitale",
                "Prenotazioni e conversione",
              ].map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-3 text-xs text-white/42"
                >
                  <span className="size-1.5 rounded-full bg-[#caa563]" />
                  {area}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#caa563]/15 bg-[#caa563]/[0.045] p-6">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#caa563]">
              Metodo UAE
            </p>

            <p className="mt-4 text-xs leading-6 text-white/40">
              La valutazione automatica è preliminare e viene successivamente
              verificata e validata dal consulente Univibe prima della
              consegna al ristorante.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  icon: typeof Building2;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

function Field({
  label,
  icon: Icon,
  value,
  placeholder,
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-[0.2em] text-white/32">
        {label}
      </span>

      <div className="relative mt-3">
        <Icon
          size={16}
          strokeWidth={1.4}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/24"
        />

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-white/[0.075] bg-white/[0.02] py-4 pl-11 pr-4 text-sm text-white/76 outline-none transition placeholder:text-white/17 focus:border-[#caa563]/40"
        />
      </div>
    </label>
  );
}
