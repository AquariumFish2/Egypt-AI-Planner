/**
 * HotelsOutputCard
 * Renders tiered hotel recommendations from the hotels agent JSON schema.
 */

"use client";

import AgentCardShell from "@/components/output/AgentCardShell.jsx";
import { Building2 } from "lucide-react";

function tierStyle(tier) {
  if (tier === "luxury") return "border-gold/40 bg-gold/10 text-gold-light";
  if (tier === "mid") return "border-lapis-light/40 bg-lapis/15 text-sand";
  return "border-turquoise/30 bg-turquoise/10 text-sand";
}

function LoadingBody() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-[66%] rounded bg-white/10" />
      <div className="h-28 w-full rounded bg-white/10" />
    </div>
  );
}

export default function HotelsOutputCard({
  agentName,
  symbol,
  status,
  index,
  structured,
  rawOutput,
  parseOk,
}) {
  const isLoading = status === "loading";

  return (
    <AgentCardShell
      agentName={agentName}
      symbol={symbol}
      status={status}
      index={index}
      parseOk={!isLoading ? parseOk : undefined}
    >
      {isLoading ? (
        <LoadingBody />
      ) : !parseOk || !structured ? (
        <div className="rounded-lg border border-gold/15 bg-black/20 p-4 text-sm text-sand-dark">
          <p>The hotel specialist provided accommodation ideas that could not be parsed into a structured list. This may happen if the search criteria are too specific.</p>
        </div>
      ) : (
        <div className="space-y-4 text-sm md:text-[15px]">
          <div className="flex items-center gap-2 text-sand-dark text-xs">
            <Building2 className="h-4 w-4 text-gold" />
            {structured.summary ? (
              <span className="leading-relaxed text-sand">{structured.summary}</span>
            ) : null}
          </div>

          <div className="space-y-3">
            {(Array.isArray(structured.recommendations)
              ? structured.recommendations
              : []
            ).map((h, i) => (
              <div
                key={i}
                className={`rounded-lg border p-3 md:p-4 ${tierStyle(h.tier)}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-cinzel tracking-[0.2em] uppercase opacity-90">
                      {h.tier} stay
                    </span>
                    <h4 className="font-cinzel text-lg mt-1">{h.hotelName}</h4>
                    <p className="text-xs opacity-90 mt-1">
                      {h.city}
                      {h.estimatedStarsBucket ? (
                        <span className="ml-2">· ~{h.estimatedStarsBucket}★ class</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-cinzel">from ${h.priceFromUsdPerNight}/night</p>
                  </div>
                </div>
                {h.highlight ? (
                  <p className="mt-2 text-sm leading-relaxed">{h.highlight}</p>
                ) : null}
                {h.bestForTravelerProfile ? (
                  <p className="mt-2 text-xs opacity-90">
                    <span className="font-cinzel text-[10px] tracking-widest uppercase">
                      Best for
                    </span>{" "}
                    {h.bestForTravelerProfile}
                  </p>
                ) : null}
                {h.neighborhoodNote ? (
                  <p className="mt-2 text-[11px] opacity-85 border-t border-black/10 pt-2">
                    {h.neighborhoodNote}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </AgentCardShell>
  );
}
