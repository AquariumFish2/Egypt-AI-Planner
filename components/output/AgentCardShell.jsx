/**
 * AgentCardShell
 * Shared motion wrapper, hieroglyph badge, and glass card chrome for specialist outputs.
 */

"use client";

import { motion } from "framer-motion";

export default function AgentCardShell({
  agentName,
  symbol,
  status,
  index,
  parseOk,
  children,
}) {
  const isLoading = status === "loading";
  const isComplete = status === "complete";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-xl bg-white/5 border border-gold/20 p-4 md:p-5 backdrop-blur-sm shadow-[0_0_0_1px_rgba(201,147,58,0.08)]"
    >
      <div className="absolute left-0 top-0 h-full w-[2px] bg-gold-dark/80 rounded-l-xl" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 text-sand">
            <span className="text-lg leading-none">{symbol}</span>
          </div>
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-2 flex-wrap">
              <span className="px-2 py-1 text-[9px] tracking-[0.22em] uppercase font-cinzel bg-gold/20 border border-gold/40 text-gold rounded-md">
                {agentName}
              </span>
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
        ) : null}
      </div>

      <div className="mt-3">{children}</div>
    </motion.div>
  );
}
