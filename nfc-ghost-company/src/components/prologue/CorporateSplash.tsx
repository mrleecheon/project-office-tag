"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

export function CorporateSplash() {
  const setPrologueScreen = useGameStore((s) => s.setPrologueScreen);

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#07090f] px-6 py-16 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[120%] -translate-x-1/2 bg-gradient-to-b from-emerald-500/15 via-transparent to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-w-lg flex-col items-center text-center"
      >
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-emerald-500/90">
          Internal • Confidential
        </p>
        <h1 className="mt-4 font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          NFC Ghost Company
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          Onboarding relay for Replacement Hire Batch 07. Connectivity may be
          unstable outside approved premises.
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPrologueScreen("messenger")}
          className="mt-10 w-full max-w-xs rounded-none border border-emerald-600/60 bg-emerald-950/40 px-6 py-3 text-sm font-medium text-emerald-100 shadow-[0_0_40px_-12px_rgba(16,185,129,0.55)] transition-colors hover:border-emerald-400/70 hover:bg-emerald-950/70"
        >
          Open secure messenger
        </motion.button>

        <p className="mt-6 text-[11px] text-zinc-600">
          By continuing you acknowledge archival logging and anomaly monitoring.
        </p>
      </motion.div>
    </div>
  );
}
