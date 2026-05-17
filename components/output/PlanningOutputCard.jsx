/**
 * PlanningOutputCard
 * Renders the planning agent JSON (itinerary days, budgets, trip-wide tips) in a structured layout.
 */

"use client";

import AgentCardShell from "@/components/output/AgentCardShell.jsx";

function LoadingBody() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-[92%] rounded bg-white/10" />
      <div className="h-4 w-[80%] rounded bg-white/10" />
      <div className="h-4 w-[64%] rounded bg-white/10" />
    </div>
  );
}

export default function PlanningOutputCard({
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
          <p>The planner specialist returned a response that could not be formatted into a structured itinerary. This can happen with very complex requests.</p>
        </div>
      ) : (
        <div className="space-y-4 text-sm md:text-[15px] text-sand leading-relaxed">
          <div>
            <h4 className="font-cinzel text-gold text-lg">{structured.tripTitle}</h4>
            <p className="mt-1 text-sand-dark">{structured.tripOverview}</p>
            {typeof structured.estimatedTripTotalUsd === "number" ? (
              <p className="mt-2 text-xs text-gold-light">
                Estimated trip total: ~${structured.estimatedTripTotalUsd} USD
              </p>
            ) : null}
          </div>
          <div className="space-y-3">
            {(Array.isArray(structured.days) ? structured.days : []).map((d, i) => (
              <div
                key={i}
                className="rounded-lg border border-gold/15 bg-black/15 p-3 md:p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-cinzel text-sand">
                    Day {d.dayNumber}
                    {d.city ? (
                      <span className="text-gold text-sm font-crimson">
                        {" "}
                        · {d.city}
                      </span>
                    ) : null}
                  </span>
                  {typeof d.estimatedDayBudgetUsd === "number" ? (
                    <span className="text-xs text-sand-dark">
                      ~${d.estimatedDayBudgetUsd} / day
                    </span>
                  ) : null}
                </div>
                {d.headline ? (
                  <p className="mt-2 text-sand font-medium">{d.headline}</p>
                ) : null}
                <ul className="mt-2 list-disc pl-5 space-y-1 text-sand-dark">
                  {(Array.isArray(d.activities) ? d.activities : []).map((a, j) => (
                    <li key={j}>{a}</li>
                  ))}
                </ul>
                {d.transportNotes ? (
                  <p className="mt-2 text-xs text-sand-dark">
                    <span className="text-gold/90 font-cinzel text-[10px] tracking-widest uppercase">
                      Travel
                    </span>{" "}
                    {d.transportNotes}
                  </p>
                ) : null}
                {(Array.isArray(d.culturalTips) ? d.culturalTips : []).length ? (
                  <ul className="mt-2 list-disc pl-5 text-xs text-sand-dark space-y-1">
                    {d.culturalTips.map((t, k) => (
                      <li key={k}>{t}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
          {(Array.isArray(structured.tripWideTips) ? structured.tripWideTips : [])
            .length ? (
            <div className="rounded-lg border border-gold/20 bg-gold/5 p-3">
              <p className="text-[10px] font-cinzel tracking-[0.2em] uppercase text-gold mb-2">
                Trip-wide tips
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sand-dark text-sm">
                {structured.tripWideTips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </AgentCardShell>
  );
}
