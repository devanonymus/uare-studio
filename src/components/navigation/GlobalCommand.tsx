"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  FileChartColumn,
  Globe2,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Store,
  Target,
  Users,
  X,
} from "lucide-react";

type CommandItem = {
  label: string;
  description: string;
  href: string;
  icon: typeof Search;
  keywords: string[];
};

const commands: CommandItem[] = [
  {
    label: "Intelligence Center",
    description: "Apri la dashboard generale",
    href: "/dashboard",
    icon: LayoutDashboard,
    keywords: ["dashboard", "home", "panoramica"],
  },
  {
    label: "Nuovo progetto",
    description: "Avvia una nuova analisi digitale",
    href: "/audits/new",
    icon: Sparkles,
    keywords: ["nuovo", "audit", "analisi", "ristorante"],
  },
  {
    label: "Progetti",
    description: "Consulta gli audit e i progetti attivi",
    href: "/audits",
    icon: BriefcaseBusiness,
    keywords: ["audit", "progetti", "ristoranti"],
  },
  {
    label: "Report",
    description: "Consulta i report strategici",
    href: "/reports",
    icon: FileChartColumn,
    keywords: ["report", "pdf", "analisi"],
  },
  {
    label: "Growth Plan",
    description: "Configura piano e proposta economica",
    href: "/growth-plan",
    icon: Target,
    keywords: ["growth", "preventivo", "proposta", "prezzi"],
  },
  {
    label: "Demo Generator",
    description: "Genera e presenta il concept del ristorante",
    href: "/demo-generator",
    icon: Globe2,
    keywords: ["demo", "sito", "concept", "homepage"],
  },
  {
    label: "Clienti",
    description: "Gestisci clienti e prospect",
    href: "/clients",
    icon: Users,
    keywords: ["clienti", "prospect", "partner"],
  },
  {
    label: "Impostazioni",
    description: "Configura la piattaforma",
    href: "/settings",
    icon: Settings,
    keywords: ["impostazioni", "account", "sistema"],
  },
];

type GlobalCommandProps = {
  compact?: boolean;
};

export function GlobalCommand({ compact = false }: GlobalCommandProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }

    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return commands;
    }

    return commands.filter((command) => {
      const searchableText = [
        command.label,
        command.description,
        ...command.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function navigateTo(item: CommandItem) {
    setOpen(false);
    router.push(item.href);
  }

  function handleInputKeyboard(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        Math.min(current + 1, filteredCommands.length - 1),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter" && filteredCommands[activeIndex]) {
      event.preventDefault();
      navigateTo(filteredCommands[activeIndex]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          compact
            ? "flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-white/35 transition hover:border-white/15 hover:text-white/75"
            : "inline-flex items-center justify-between gap-5 rounded-full border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-xs text-white/35 transition hover:border-white/15 hover:bg-white/[0.045] hover:text-white/70 sm:min-w-[245px]"
        }
        aria-label="Apri ricerca globale"
      >
        <span className="inline-flex items-center gap-2">
          <Search size={15} />
          {!compact && "Cerca o esegui un comando"}
        </span>

        {!compact && (
          <span className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[8px] text-white/24">
            ⌘ K
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[10vh] backdrop-blur-xl"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <section className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#0c0c0d] shadow-[0_40px_140px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-4 border-b border-white/[0.07] px-5">
              <Search size={19} className="shrink-0 text-[#d2aa62]" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyboard}
                placeholder="Cerca progetto, funzione o comando..."
                className="min-w-0 flex-1 bg-transparent py-5 text-sm text-white/80 outline-none placeholder:text-white/22"
              />

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-white/25 transition hover:bg-white/[0.05] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[480px] overflow-y-auto p-3">
              <p className="px-3 pb-3 pt-2 text-[8px] uppercase tracking-[0.28em] text-white/22">
                Navigazione rapida
              </p>

              {filteredCommands.length > 0 ? (
                <div className="space-y-1">
                  {filteredCommands.map((item, index) => {
                    const Icon = item.icon;
                    const active = activeIndex === index;

                    return (
                      <button
                        key={item.href}
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => navigateTo(item)}
                        className={`flex w-full items-center gap-4 rounded-[18px] px-4 py-3.5 text-left transition ${
                          active
                            ? "bg-[#d1aa62]/[0.09]"
                            : "hover:bg-white/[0.035]"
                        }`}
                      >
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-2xl border ${
                            active
                              ? "border-[#d1aa62]/20 bg-[#d1aa62]/[0.07] text-[#e1c07b]"
                              : "border-white/[0.06] bg-white/[0.02] text-white/28"
                          }`}
                        >
                          <Icon size={17} strokeWidth={1.45} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm ${
                              active ? "text-white/85" : "text-white/58"
                            }`}
                          >
                            {item.label}
                          </span>

                          <span className="mt-1 block truncate text-[10px] text-white/24">
                            {item.description}
                          </span>
                        </span>

                        <span className="text-[9px] text-white/17">↵</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
                  <BarChart3
                    size={24}
                    className="mx-auto text-white/15"
                  />

                  <p className="mt-4 text-sm text-white/35">
                    Nessun comando trovato
                  </p>

                  <p className="mt-2 text-[10px] text-white/20">
                    Prova con “report”, “demo” oppure “nuovo progetto”.
                  </p>
                </div>
              )}
            </div>

            <footer className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3 text-[8px] uppercase tracking-[0.16em] text-white/18">
              <span>UVIQ Intelligence Command Center</span>

              <span>↑↓ Naviga · ↵ Apri · Esc Chiudi</span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
