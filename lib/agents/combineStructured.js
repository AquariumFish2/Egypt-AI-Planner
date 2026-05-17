/**
 * Builds a compact plain-text recap from validated specialist payloads only (no supervisor).
 */

function bullets(lines) {
  return lines.filter(Boolean).join("\n");
}

export function buildCombinedSummaryFromStructured(responsesWithStructured) {
  const parts = [];
  for (const r of responsesWithStructured) {
    const p = r?.structured;
    if (!p || typeof p !== "object") continue;
    const label = String(r.agentName || "").toUpperCase();
    if (r.agentName === "planning") {
      const days = Array.isArray(p.days) ? p.days : [];
      const dayLines = days.map((d) => {
        if (!d || typeof d !== "object") return "";
        const headline = d.headline ? `: ${d.headline}` : "";
        return `- Day ${d.dayNumber}${d.city ? ` (${d.city})` : ""}${headline}`;
      });
      parts.push(
        bullets([
          `【${label}】 ${p.tripTitle || "Egypt itinerary"}`,
          typeof p.tripOverview === "string" ? p.tripOverview : "",
          dayLines.join("\n"),
          typeof p.estimatedTripTotalUsd === "number"
            ? `Estimated trip total (USD): ~${p.estimatedTripTotalUsd}`
            : "",
        ])
      );
    } else if (r.agentName === "reviews") {
      const listings = Array.isArray(p.items) ? p.items : [];
      const lines = listings.map((it) => {
        if (!it || typeof it !== "object" || !it.name) return "";
        const stars =
          typeof it.ratingStars === "number" ? `${it.ratingStars}/5` : "?/5";
        return `- [${it.category || "review"}] ${it.name} ★${stars} — ${it.verdict || ""}`;
      });
      parts.push(
        bullets([
          `【${label}】`,
          typeof p.summary === "string" ? p.summary : "",
          lines.filter(Boolean).join("\n"),
        ])
      );
    } else if (r.agentName === "flights") {
      const opts = Array.isArray(p.options) ? p.options : [];
      const lines = opts.map((o) => {
        if (!o || typeof o !== "object" || !o.airline) return "";
        const low = o.approximateLowPriceUsd;
        const high = o.approximateHighPriceUsd;
        const price =
          typeof low === "number" && typeof high === "number"
            ? `$${low}-$${high}`
            : typeof low === "number"
              ? `from $${low}`
              : "";
        return `- ${o.airline} ${o.route || ""} | ${price} | ${o.durationHoursTotal ?? "?"}h | stops: ${o.stops ?? "?"}`;
      });
      parts.push(
        bullets([
          `【${label}】`,
          typeof p.recommendation === "string" ? p.recommendation : "",
          lines.filter(Boolean).join("\n"),
        ])
      );
    } else if (r.agentName === "hotels") {
      const recs = Array.isArray(p.recommendations) ? p.recommendations : [];
      const lines = recs.map((h) => {
        if (!h || typeof h !== "object" || !h.hotelName) return "";
        return `- [${h.tier || "stay"}] ${h.hotelName} · ${h.city || ""} — $${h.priceFromUsdPerNight ?? "?"}/night · ${h.highlight || ""}`;
      });
      parts.push(
        bullets([
          `【${label}】`,
          typeof p.summary === "string" ? p.summary : "",
          lines.filter(Boolean).join("\n"),
        ])
      );
    }
  }
  return parts.filter(Boolean).join("\n\n").trim();
}
