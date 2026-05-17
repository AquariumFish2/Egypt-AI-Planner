/**
 * ReviewsOutputCard
 * Renders review items (ratings, pros/cons, sentiment) from the reviews agent JSON schema.
 */

"use client";

import AgentCardShell from "@/components/output/AgentCardShell.jsx";

function LoadingBody() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-full rounded bg-white/10" />
      <div className="h-20 w-full rounded bg-white/10" />
    </div>
  );
}

export default function ReviewsOutputCard({
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
          <p>The reviews specialist provided feedback that could not be parsed into structured ratings. This usually happens if the destinations are very obscure.</p>
        </div>
      ) : (
        <div className="space-y-4 text-sm md:text-[15px]">
          {structured.summary ? (
            <p className="text-sand leading-relaxed">{structured.summary}</p>
          ) : null}
          <div className="space-y-3">
            {(Array.isArray(structured.items) ? structured.items : []).map(
              (it, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gold/15 bg-black/15 p-3 md:p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-cinzel tracking-widest uppercase text-gold">
                        {it.category}
                      </span>
                      <h4 className="font-cinzel text-sand mt-1">{it.name}</h4>
                      {it.location ? (
                        <p className="text-xs text-sand-dark">{it.location}</p>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-md border border-gold/25 bg-white/5 px-2 py-1 text-xs text-gold">
                        ★ {it.ratingStars}/5
                      </span>
                      <p className="text-[10px] text-sand-dark mt-1 capitalize">
                        {it.travelerSentiment}
                      </p>
                    </div>
                  </div>
                  {it.verdict ? (
                    <p className="mt-2 text-sand text-[15px]">{it.verdict}</p>
                  ) : null}
                  {it.priceValueNote ? (
                    <p className="mt-2 text-xs text-gold-light/90 italic">
                      {it.priceValueNote}
                    </p>
                  ) : null}
                  <div className="mt-3 grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-cinzel text-gold/80 uppercase tracking-wide mb-1">
                        Pros
                      </p>
                      <ul className="list-disc pl-5 text-xs text-sand-dark space-y-1">
                        {(Array.isArray(it.pros) ? it.pros : []).map((p, j) => (
                          <li key={j}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-cinzel text-gold/80 uppercase tracking-wide mb-1">
                        Cons
                      </p>
                      <ul className="list-disc pl-5 text-xs text-sand-dark space-y-1">
                        {(Array.isArray(it.cons) ? it.cons : []).map((c, j) => (
                          <li key={j}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </AgentCardShell>
  );
}
