"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

const navItems = [
  {
    label: "Prodotto",
    id: "product",
  },
  {
    label: "Funzioni",
    id: "functions",
  },
  {
    label: "Settori",
    id: "sectors",
  },
  {
    label: "Reparto AI",
    id: "department",
  },
  {
    label: "Pricing",
    id: "pricing",
  },
];

export function HomeNavbar() {
  const [activeSection, setActiveSection] =
    useState("product");

  const navbarRef =
    useRef<HTMLElement | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  const correctionTimersRef =
    useRef<number[]>([]);

  const isProgrammaticScrollRef =
    useRef(false);

  function clearScrollOperations() {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(
        animationFrameRef.current,
      );

      animationFrameRef.current = null;
    }

    correctionTimersRef.current.forEach(
      (timer) => window.clearTimeout(timer),
    );

    correctionTimersRef.current = [];
  }

  function getNavbarOffset() {
    const navbarHeight =
      navbarRef.current?.getBoundingClientRect()
        .height ?? 110;

    return navbarHeight + 28;
  }

  function getTargetPosition(
    section: HTMLElement,
  ) {
    const offset = getNavbarOffset();

    return Math.max(
      0,
      section.getBoundingClientRect().top +
        window.scrollY -
        offset,
    );
  }

  function animateScrollTo(
    targetPosition: number,
    duration = 650,
  ) {
    const startPosition = window.scrollY;
    const distance =
      targetPosition - startPosition;
    const startTime = performance.now();

    function easeInOutCubic(progress: number) {
      return progress < 0.5
        ? 4 * progress * progress * progress
        : 1 -
            Math.pow(-2 * progress + 2, 3) /
              2;
    }

    function frame(currentTime: number) {
      const elapsed =
        currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1,
      );

      const easedProgress =
        easeInOutCubic(progress);

      window.scrollTo(
        0,
        startPosition +
          distance * easedProgress,
      );

      if (progress < 1) {
        animationFrameRef.current =
          window.requestAnimationFrame(frame);
      } else {
        animationFrameRef.current = null;
      }
    }

    animationFrameRef.current =
      window.requestAnimationFrame(frame);
  }

  async function scrollToSection(
    sectionId: string,
  ) {
    const section =
      document.getElementById(sectionId);

    if (!section) {
      return;
    }

    clearScrollOperations();

    isProgrammaticScrollRef.current = true;
    setActiveSection(sectionId);

    /*
     * Attendiamo il caricamento dei font.
     * Evita variazioni di altezza durante lo scroll.
     */
    if ("fonts" in document) {
      try {
        await document.fonts.ready;
      } catch {
        // Il browser può non supportare completamente FontFaceSet.
      }
    }

    const initialTarget =
      getTargetPosition(section);

    animateScrollTo(initialTarget);

    /*
     * Correzioni successive:
     * se immagini, font o componenti cambiano altezza,
     * UVIQ riallinea la sezione alla posizione corretta.
     */
    const correctionDelays = [
      700,
      1050,
      1500,
    ];

    correctionTimersRef.current =
      correctionDelays.map((delay, index) =>
        window.setTimeout(() => {
          const updatedSection =
            document.getElementById(
              sectionId,
            );

          if (!updatedSection) {
            return;
          }

          const correctedTarget =
            getTargetPosition(
              updatedSection,
            );

          const difference =
            Math.abs(
              window.scrollY -
                correctedTarget,
            );

          if (difference > 2) {
            window.scrollTo({
              top: correctedTarget,
              behavior:
                index === 0
                  ? "smooth"
                  : "auto",
            });
          }

          if (
            index ===
            correctionDelays.length - 1
          ) {
            isProgrammaticScrollRef.current =
              false;
          }
        }, delay),
      );

    /*
     * Rimuove eventuali hash vecchi senza
     * generare una nuova navigazione.
     */
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }

  useEffect(() => {
    /*
     * Se la pagina viene aperta con un vecchio hash,
     * lo rimuoviamo per impedire al browser
     * di eseguire uno scroll automatico concorrente.
     */
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    const handleScroll = () => {
      if (
        isProgrammaticScrollRef.current
      ) {
        return;
      }

      const offset =
        getNavbarOffset() + 80;

      let currentSection = "product";

      for (const item of navItems) {
        const section =
          document.getElementById(
            item.id,
          );

        if (!section) {
          continue;
        }

        const sectionTop =
          section.getBoundingClientRect()
            .top;

        if (sectionTop <= offset) {
          currentSection = item.id;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      handleScroll,
    );

    handleScroll();

    return () => {
      clearScrollOperations();

      window.removeEventListener(
        "scroll",
        handleScroll,
      );

      window.removeEventListener(
        "resize",
        handleScroll,
      );
    };
  }, []);

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-50 px-4 pt-4 md:px-7"
    >
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[20px] border border-white/[0.1] bg-[#081425]/95 shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur-2xl">
        <div className="flex min-h-[92px] items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-4"
          >
            <span className="flex size-14 items-center justify-center rounded-[14px] border border-[#2492E8]/20 bg-[#0D1D34] p-2">
              <Image
                src="/uviq-logo.svg"
                alt="UVIQ"
                width={44}
                height={44}
                priority
                className="size-full object-contain"
              />
            </span>

            <span className="hidden sm:block">
              <span className="flex items-center gap-3">
                <span className="text-2xl font-bold tracking-[-0.06em] text-white">
                  UVIQ
                </span>

                <span className="rounded-full bg-[#2492E8] px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em] text-white">
                  AI OS
                </span>
              </span>

              <span className="mt-1 block text-[7px] font-semibold uppercase tracking-[0.28em] text-[#D3DCE8]">
                AI Business Operating System
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const active =
                activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    scrollToSection(
                      item.id,
                    )
                  }
                  className={`group relative flex min-h-12 cursor-pointer items-center border-0 bg-transparent px-1 text-[10px] font-bold transition ${
                    active
                      ? "text-white"
                      : "text-[#D3DCE8] hover:text-white"
                  }`}
                >
                  {item.label}

                  <span
                    className={`absolute bottom-0 left-0 right-0 mx-auto h-0.5 rounded-full transition-all duration-300 ${
                      active
                        ? "w-full bg-[#FF6B1A] shadow-[0_0_12px_rgba(255,107,26,.65)]"
                        : "w-0 bg-[#2492E8] group-hover:w-full"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden min-h-12 items-center gap-3 rounded-[13px] border border-white/[0.13] bg-[#091323] px-5 text-[10px] font-bold text-white transition hover:border-[#2492E8]/40 hover:bg-[#0E1C31] md:inline-flex"
            >
              <LayoutGrid
                size={15}
                className="text-[#2492E8]"
              />
              Workspace
            </Link>

            <Link
              href="/projects/new"
              className="inline-flex min-h-12 items-center gap-3 rounded-[13px] bg-[#FF6B1A] px-5 text-[10px] font-bold text-white shadow-[0_12px_34px_rgba(255,107,26,.3)] transition hover:-translate-y-0.5 hover:bg-[#FF7D34]"
            >
              Nuovo progetto
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <nav className="grid grid-cols-5 border-t border-white/[0.08] lg:hidden">
          {navItems.map((item) => {
            const active =
              activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  scrollToSection(
                    item.id,
                  )
                }
                className={`relative flex min-h-11 cursor-pointer items-center justify-center border-0 border-r border-white/[0.06] bg-transparent px-1 text-center text-[7px] font-bold uppercase tracking-[0.08em] last:border-r-0 ${
                  active
                    ? "bg-[#FF6B1A]/10 text-white"
                    : "text-[#D3DCE8]"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-[#FF6B1A]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
