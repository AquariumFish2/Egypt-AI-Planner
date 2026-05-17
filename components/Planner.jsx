/**
 * Planner
 * Single-page multi-tab AI planner UI powered by a LangChain multi-agent backend.
 * Specialist outputs are rendered from strict JSON schemas via role-specific card components.
 */

"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import AgentResponseRouter from "@/components/output/AgentResponseRouter.jsx";

const TABS = [
  {
    id: "full",
    label: "Full Plan",
    icon: "⊞",
    agents: ["planning", "reviews", "flights", "hotels"],
  },
  {
    id: "day",
    label: "Day Plan",
    icon: "☀",
    agents: ["planning"],
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: "★",
    agents: ["reviews"],
  },
  {
    id: "flights",
    label: "Flights",
    icon: "✈",
    agents: ["flights"],
  },
  {
    id: "hotels",
    label: "Hotels",
    icon: "⌂",
    agents: ["hotels"],
  },
];

const AGENT_SYMBOLS = {
  planning: "𓅓",
  reviews: "𓆣",
  flights: "𓁹",
  hotels: "𓏤",
};

const ALL_AGENTS = ["planning", "reviews", "flights", "hotels"];

const EXAMPLE_QUERY =
  "I have 7 days in Egypt in October. I want Cairo + Luxor + Aswan, mid-range budget, flying in from Paris. I love history, want a felucca sunset, and prefer fewer tourist traps. Build a day-by-day plan with costs and flight/hotel picks.";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatDuration(ms) {
  if (!Number.isFinite(ms)) return "";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function Planner() {
  const [selectedTab, setSelectedTab] = React.useState("full");
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [steps, setSteps] = React.useState([]);
  const [finalOutput, setFinalOutput] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [totalDuration, setTotalDuration] = React.useState(null);

  const stepsEndRef = React.useRef(null);
  const maxChars = 500;

  const activeTab = TABS.find((t) => t.id === selectedTab) || TABS[0];
  const hintAgents = activeTab.agents;

  React.useEffect(() => {
    if (!stepsEndRef.current) return;
    stepsEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [steps, finalOutput]);

  async function runPlanner() {
    const trimmed = (input || "").trim();
    if (!trimmed) return;

    setIsLoading(true);
    setSteps([]);
    setFinalOutput("");
    setCopied(false);
    setTotalDuration(null);

    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuery: trimmed,
          tab: selectedTab,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      const responses = Array.isArray(data.responses) ? data.responses : [];

      for (let i = 0; i < responses.length; i++) {
        await sleep(150);
        setSteps((prev) => [
          ...prev,
          {
            agentName: responses[i].agentName,
            structured: responses[i].structured ?? null,
            rawOutput: responses[i].rawOutput ?? "",
            parseOk: !!responses[i].parseOk,
            duration: responses[i].duration ?? 0,
            status: "complete",
          },
        ]);
      }

      setFinalOutput(data.finalOutput || "");
      setTotalDuration(data.totalDuration ?? null);
    } catch (err) {
      console.error("Planner error:", err);
      setFinalOutput(
        "Something went wrong while invoking the agents. Check your `OPENAI_API_KEY` in `.env.local` and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function copyFinal() {
    try {
      await navigator.clipboard.writeText(finalOutput || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  }

  return (
    <section id="planner" className="relative">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-sand">
              AI Travel Planner
            </h2>
            <p className="mt-2 max-w-2xl text-sand-dark leading-relaxed">
              Tell us about your dream Egypt trip, and our AI travel specialists will craft a personalized itinerary with hotels, flights, and reviews.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-sand-dark">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/5 px-3 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-gold" />
              Ancient theme · Modern reasoning
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = t.id === selectedTab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTab(t.id)}
                className={[
                  "clip-parallelogram px-4 py-2 font-cinzel text-sm tracking-wide border transition",
                  "bg-white/5 border-gold/20 text-sand hover:bg-white/10",
                  active ? "bg-gold-dark/80 border-gold/40 text-sand" : "",
                ].join(" ")}
              >
                <span className="mr-2">{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-white/5 border border-gold/20 backdrop-blur-sm shadow-[0_0_0_1px_rgba(201,147,58,0.08)]">
          <div className="p-5 md:p-6 border-b border-gold/15">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {ALL_AGENTS.map((a) => {
                  const active = hintAgents.includes(a);
                  const pulsing = isLoading && active;
                  return (
                    <div
                      key={a}
                      className={[
                        "flex items-center gap-2 rounded-xl px-3 py-2 border text-xs",
                        "bg-white/5 border-gold/15 text-sand-dark",
                        active ? "text-sand border-gold/25" : "opacity-60",
                        pulsing ? "animate-pulse" : "",
                      ].join(" ")}
                    >
                      <span className="text-base leading-none text-gold">
                        {AGENT_SYMBOLS[a]}
                      </span>
                      <span className="font-cinzel tracking-wide">{a.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setInput(EXAMPLE_QUERY)}
                className="clip-parallelogram px-4 py-2 text-xs font-cinzel tracking-wide border border-gold/20 bg-white/5 hover:bg-white/10 transition text-sand"
              >
                Try an example
              </button>
            </div>

            <div className="mt-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
                placeholder="Describe your Egypt trip… dates, cities, budget, interests, and constraints."
                className="w-full min-h-[120px] resize-y rounded-xl bg-black/20 border border-gold/20 px-4 py-3 text-sand placeholder:text-sand-dark/70 focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-sand-dark">
                  {input.length}/{maxChars} characters
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={runPlanner}
                    disabled={isLoading || !input.trim()}
                    className={[
                      "clip-parallelogram px-5 py-3 font-cinzel text-sm tracking-wide border transition",
                      "bg-gold text-obsidian border-gold/30 hover:bg-gold-light",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                    ].join(" ")}
                  >
                    Invoke Agents ↗
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-cinzel text-lg text-sand">Specialist outputs</h3>
              <div className="text-xs text-sand-dark">
                {totalDuration != null ? (
                  <span>Total: {formatDuration(totalDuration)}</span>
                ) : null}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {steps.length === 0 ? (
                isLoading ? (
                  <div className="space-y-3">
                    {hintAgents.map((a, i) => (
                      <AgentResponseRouter
                        key={`skeleton-${a}-${i}`}
                        agentName={a}
                        status="loading"
                        index={i}
                        structured={null}
                        rawOutput=""
                        parseOk={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-gold/15 bg-white/5 p-4 text-sand-dark">
                    Enter your request above, then hit{" "}
                    <span className="text-sand">Invoke Agents</span>.
                  </div>
                )
              ) : (
                steps.map((s, i) => (
                  <AgentResponseRouter
                    key={`${s.agentName}-${i}`}
                    agentName={s.agentName}
                    status={s.status}
                    structured={s.structured}
                    rawOutput={s.rawOutput}
                    parseOk={s.parseOk}
                    index={i}
                  />
                ))
              )}



              <div ref={stepsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
