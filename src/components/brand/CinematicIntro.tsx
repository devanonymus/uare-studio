"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand/BrandMark";

const introLines = [
  "Inizializzazione esperienza",
  "Caricamento analisi strategica",
  "Preparazione UARE Studio",
];

export function CinematicIntro() {
  const router = useRouter();
  const [lineIndex, setLineIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const lineTimer = window.setInterval(() => {
      setLineIndex((current) =>
        Math.min(current + 1, introLines.length - 1),
      );
    }, 950);

    const exitTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 3800);

    const navigationTimer = window.setTimeout(() => {
      router.push("/dashboard");
    }, 4550);

    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(navigationTimer);
    };
  }, [router]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.035,
            filter: "blur(12px)",
          }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030303] px-6"
        >
          <div className="noise" />

          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.65 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(191,145,65,0.13),transparent_68%)] blur-3xl"
          />

          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.35,
                duration: 1.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <BrandMark />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.8 }}
              className="mt-16 w-full max-w-sm"
            >
              <div className="h-px overflow-hidden bg-white/8">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{
                    delay: 1.35,
                    duration: 2.45,
                    ease: [0.65, 0, 0.35, 1],
                  }}
                  className="h-full bg-gradient-to-r from-[#7e5723] via-[#f3d48f] to-[#8f652d]"
                />
              </div>

              <div className="mt-4 h-5 text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={introLines[lineIndex]}
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -7 }}
                    transition={{ duration: 0.35 }}
                    className="text-[9px] uppercase tracking-[0.3em] text-white/42"
                  >
                    {introLines[lineIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7, duration: 0.8 }}
              className="absolute -bottom-24 text-[8px] uppercase tracking-[0.35em] text-white/22"
            >
              Piattaforma per audit e trasformazione digitale dei ristoranti
            </motion.p>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
