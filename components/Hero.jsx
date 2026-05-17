/**
 * Hero
 * Full-viewport hero with an animated landmark slider, starfield, and ancient Egypt styling.
 * Uses Next.js Image optimization and Framer Motion crossfades + subtle Ken Burns motion.
 */

"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    id: 1,
    location: "Giza Plateau · Cairo",
    title: "Pyramids of Giza",
    subtitle: "The last surviving wonder of the ancient world",
    image: "/egypt/pyramids.webp",
  },
  {
    id: 2,
    location: "Luxor · Upper Egypt",
    title: "Karnak Temple",
    subtitle: "Sacred columns rising toward the Egyptian sky",
    image: "/egypt/karnak.webp",
  },
  {
    id: 3,
    location: "Aswan · Nubia",
    title: "Abu Simbel",
    subtitle: "Ramesses II carved into eternity",
    image: "/egypt/abu-simbel.webp",
  },
  {
    id: 4,
    location: "Valley of the Kings · Luxor",
    title: "Tomb of Tutankhamun",
    subtitle: "Where golden treasures slept for millennia",
    image: "/egypt/valley-kings.webp",
  },
  {
    id: 5,
    location: "River Nile · Egypt",
    title: "Nile at Sunset",
    subtitle: "The lifeblood of civilization flows eternal",
    image: "/egypt/nile.webp",
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function Hero() {
  const [active, setActive] = React.useState(0);
  const intervalRef = React.useRef(null);

  React.useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const slide = slides[active];

  const [stars, setStars] = React.useState([]);

  React.useEffect(() => {
    const out = [];
    for (let i = 0; i < 60; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const dur = 2.5 + Math.random() * 2.5;
      const size = 1 + Math.random() * 2;
      out.push({ top, left, delay, dur, size });
    }
    setStars(out);
  }, []);

  function go(delta) {
    setActive((p) => {
      const next = p + delta;
      const wrapped = ((next % slides.length) + slides.length) % slides.length;
      return clamp(wrapped, 0, slides.length - 1);
    });
  }

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 animate-kenburns">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-obsidian/95" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 pointer-events-none">
          {stars.map((s, i) => (
            <span
              key={i}
              className="star"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.dur}s`,
                width: `${s.size}px`,
                height: `${s.size}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 md:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/5 border border-gold/20 px-4 py-2 backdrop-blur-sm">
            <span className="text-gold font-cinzel tracking-[0.2em] text-xs uppercase">
              Visit Egypt
            </span>
            <span className="h-4 w-px bg-gold/30" />
            <span className="text-sand-dark text-xs">{slide.location}</span>
          </div>

          <h1 className="mt-6 font-cinzel font-black text-5xl leading-[1.02] tracking-tight text-sand lg:text-7xl">
            {slide.title}
          </h1>
          <p className="mt-4 text-lg text-sand-dark md:text-xl max-w-2xl">
            {slide.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("planner");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="clip-parallelogram bg-gold text-obsidian font-cinzel px-5 py-3 text-sm tracking-wide border border-gold/30 hover:bg-gold-light transition"
            >
              Begin Planning
            </button>
            <div className="text-sm text-sand-dark">
              𓂀 AI-Powered · 𓅓 Multi-Agent · 𓆣 Real-Time Planning
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="h-10 w-10 rounded-lg bg-white/5 border border-gold/20 text-sand hover:bg-white/10 transition"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="h-10 w-10 rounded-lg bg-white/5 border border-gold/20 text-sand hover:bg-white/10 transition"
            >
              →
            </button>
          </div>

          <div className="flex items-center gap-2">
            {slides.map((s, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(idx)}
                  aria-label={`Go to slide ${s.id}`}
                  className={[
                    "h-2.5 w-2.5 rounded-full border transition",
                    isActive
                      ? "bg-gold border-gold"
                      : "bg-white/10 border-gold/20 hover:bg-white/20",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-obsidian" />

      <div className="relative z-10 border-t border-gold/20 bg-obsidian/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-3 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap text-sand-dark/90">
            <div className="animate-hiero-scroll flex gap-8">
              <span>𓂀 AI-Powered · 𓅓 Multi-Agent · 𓆣 Real-Time Planning</span>
              <span>𓂀 AI-Powered · 𓅓 Multi-Agent · 𓆣 Real-Time Planning</span>
              <span>𓂀 AI-Powered · 𓅓 Multi-Agent · 𓆣 Real-Time Planning</span>
              <span>𓂀 AI-Powered · 𓅓 Multi-Agent · 𓆣 Real-Time Planning</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
