/**
 * FlightsOutputCard
 * Renders structured flight comparison rows plus the consolidated booking recommendation.
 */

"use client";

import AgentCardShell from "@/components/output/AgentCardShell.jsx";
import { Plane } from "lucide-react";

function LoadingBody() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-[74%] rounded bg-white/10" />
      <div className="h-24 w-full rounded bg-white/10" />
    </div>
  );
}

export default function FlightsOutputCard({
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
          <p>The flight specialist provided routing information that could not be parsed into structured options. This can happen with unusual origin airports.</p>
        </div>
      ) : (
        <div className="space-y-4 text-sm md:text-[15px]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-sand-dark">
            <Plane className="h-4 w-4 text-gold" />
            {structured.preferredOrigin ? (
              <span>From: {structured.preferredOrigin}</span>
            ) : null}
            {Array.isArray(structured.targetAirportsEgypt) &&
            structured.targetAirportsEgypt.length ? (
              <span className="rounded-md border border-gold/20 bg-white/5 px-2 py-1 text-[10px] font-cinzel tracking-wide text-sand">
                Egypt: {structured.targetAirportsEgypt.join(" · ")}
              </span>
            ) : null}
          </div>

          <div className="space-y-3">
            {(Array.isArray(structured.options) ? structured.options : []).map(
              (o, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gold/15 bg-black/15 p-3 md:p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-cinzel text-sand">{o.airline}</p>
                      <p className="text-xs text-sand-dark mt-1">{o.route}</p>
                    </div>
                    <div className="text-right text-xs text-sand-dark space-y-1">
                      <p>
                        {o.approximateLowPriceUsd != null &&
                        o.approximateHighPriceUsd != null
                          ? `$${o.approximateLowPriceUsd}–$${o.approximateHighPriceUsd}`
                          : o.approximateLowPriceUsd != null
                            ? `from $${o.approximateLowPriceUsd}`
                            : "—"}
                      </p>
                      <p>
                        {o.durationHoursTotal != null
                          ? `${o.durationHoursTotal}h total`
                          : ""}{" "}
                        · {o.stops != null ? `${o.stops} stop(s)` : ""}
                      </p>
                    </div>
                  </div>
                  {o.stopoverSummary ? (
                    <p className="mt-2 text-xs text-sand-dark">{o.stopoverSummary}</p>
                  ) : null}
                  {o.bookingAdvice ? (
                    <p className="mt-2 text-xs text-gold-light/90 border-t border-gold/10 pt-2">
                      {o.bookingAdvice}
                    </p>
                  ) : null}
                </div>
              )
            )}
          </div>

          {structured.recommendation ? (
            <div className="rounded-lg border border-gold/30 bg-gold/5 p-3">
              <p className="text-[10px] font-cinzel tracking-[0.2em] uppercase text-gold mb-1">
                Recommendation
              </p>
              <p className="text-sand leading-relaxed">{structured.recommendation}</p>
            </div>
          ) : null}
        </div>
      )}
    </AgentCardShell>
  );
}
