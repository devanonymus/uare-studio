"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Layers3,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { PRODUCT } from "@/core/brand/identity";

const agents = [
  {
    name: "Research",
    icon: ScanLine,
    status: "Online",
  },
  {
    name: "Vision",
    icon: Sparkles,
    status: "Online",
  },
  {
    name: "Strategy",
    icon: BrainCircuit,
    status: "Online",
  },
  {
    name: "Creative",
    icon: Layers3,
    status: "Online",
  },
];

export function CinematicIntro() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070709] text-white">
      <div className="noise" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-22rem] size-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(194,144,64,0.13),rgba(91,61,25,0.035)_45%,transparent_70%)] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-28rem] right-[-15rem] size-[52rem] rounded-full bg-[radial-gradient(circle,rgba(62,83,124,0.08),transparent_68%)] blur-3xl"
      />

      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-10 xl:px-14">
        <BrandMark compact />

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/28 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.65)]" />
            System operational
          </div>

          <Link
            href="/dashboard"
            className="rounded-full border border-white/[0.08] bg-white/[0.025] px-5 py-2.5 text-[9px] uppercase tracking-[0.18em] text-white/48 transition hover:border-white/15 hover:text-white"
          >
            Accedi
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-[1500px] flex-col justify-center px-6 pb-14 pt-10 md:px-10 xl:px-14">
        <div className="grid items-center gap-16 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-3 rounded-full border border-[#caa563]/16 bg-[#caa563]/[0.045] px-4 py-2"
            >
              <Sparkles
                size={13}
                className="text-[#d8b36c]"
              />

              <span className="text-[8px] uppercase tracking-[0.25em] text-[#d8b36c]">
                Multi-sector AI Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.12,
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-8 max-w-5xl text-[clamp(3.8rem,7.5vw,8.2rem)] font-medium leading-[0.86] tracking-[-0.065em] text-[#f5f1e9]"
            >
              Understand.
              <br />
              Decide.
              <br />
              <span className="gold-text">Transform.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.27, duration: 0.75 }}
              className="mt-8 max-w-2xl text-base leading-7 text-white/38 md:text-lg md:leading-8"
            >
              {PRODUCT.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.7 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/projects/new"
                className="group inline-flex items-center justify-center gap-4 rounded-full bg-[#d4aa61] px-7 py-4 text-xs font-medium text-[#171109] shadow-[0_25px_80px_rgba(194,144,64,0.15)] transition hover:bg-[#e8c77f]"
              >
                Avvia una nuova intelligence
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.025] px-7 py-4 text-xs text-white/46 transition hover:border-white/[0.16] hover:text-white"
              >
                <Building2 size={15} />
                Apri workspace
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62, duration: 0.8 }}
              className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.055] pt-7"
            >
              {[
                "Analisi evidence-based",
                "Agenti AI specializzati",
                "Demo multisettore",
                "Strategie commerciali",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/25"
                >
                  <ShieldCheck
                    size={13}
                    className="text-[#cfa65f]"
                  />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.18,
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[60px] bg-[#caa563]/[0.055] blur-3xl"
            />

            <div className="relative overflow-hidden rounded-[36px] border border-white/[0.075] bg-[#0d0d10]/88 p-5 shadow-[0_60px_160px_rgba(0,0,0,0.55)] backdrop-blur-3xl md:p-7">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.27em] text-[#cda660]">
                    Intelligence Core
                  </p>

                  <p className="mt-2 text-sm text-white/54">
                    Autonomous agent network
                  </p>
                </div>

                <div className="flex size-11 items-center justify-center rounded-full border border-emerald-300/15 bg-emerald-300/[0.045]">
                  <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
                </div>
              </div>

              <div className="relative mt-7 flex min-h-[390px] items-center justify-center">
                <div
                  aria-hidden="true"
                  className="absolute size-72 rounded-full border border-white/[0.04]"
                />
                <div
                  aria-hidden="true"
                  className="absolute size-52 rounded-full border border-[#caa563]/[0.09]"
                />
                <div
                  aria-hidden="true"
                  className="absolute size-36 rounded-full border border-white/[0.055]"
                />

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 32,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute size-64 rounded-full border border-dashed border-[#caa563]/[0.12]"
                />

                <div className="relative z-10 flex size-28 flex-col items-center justify-center rounded-full border border-[#caa563]/20 bg-[#caa563]/[0.065] shadow-[0_0_70px_rgba(194,144,64,0.1)]">
                  <span className="text-3xl font-semibold tracking-[-0.06em] text-[#f3d18d]">
                    IQ
                  </span>

                  <span className="mt-1 text-[6px] uppercase tracking-[0.22em] text-white/25">
                    Active
                  </span>
                </div>

                {agents.map((agent, index) => {
                  const positions = [
                    "left-1/2 top-4 -translate-x-1/2",
                    "right-0 top-1/2 -translate-y-1/2",
                    "bottom-4 left-1/2 -translate-x-1/2",
                    "left-0 top-1/2 -translate-y-1/2",
                  ];

                  const Icon = agent.icon;

                  return (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.7 + index * 0.12,
                        duration: 0.55,
                      }}
                      className={`absolute ${positions[index]} flex items-center gap-3 rounded-[18px] border border-white/[0.065] bg-[#111114]/95 px-4 py-3 shadow-xl`}
                    >
                      <Icon
                        size={15}
                        strokeWidth={1.4}
                        className="text-[#d4ad67]"
                      />

                      <div>
                        <p className="text-[10px] text-white/58">
                          {agent.name}
                        </p>

                        <p className="mt-1 text-[6px] uppercase tracking-[0.16em] text-emerald-300/55">
                          {agent.status}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-5">
                {[
                  ["9", "Settori"],
                  ["4", "AI Agents"],
                  ["24/7", "Core"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[18px] border border-white/[0.05] bg-white/[0.015] p-4 text-center"
                  >
                    <p className="text-lg font-medium text-white/68">
                      {value}
                    </p>

                    <p className="mt-1 text-[6px] uppercase tracking-[0.18em] text-white/20">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-16 flex flex-col justify-between gap-3 border-t border-white/[0.05] pt-6 text-[7px] uppercase tracking-[0.22em] text-white/14 sm:flex-row">
          <span>{PRODUCT.company}</span>
          <span>{PRODUCT.fullName} · Core v1.0</span>
        </footer>
      </section>
    </main>
  );
}
