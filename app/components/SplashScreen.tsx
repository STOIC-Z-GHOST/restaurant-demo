"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// twelve horizontal slivers, softly feathered — more, thinner pieces than
// before for a smoother assembly. They assemble bottom-to-top — the last
// piece to appear is the top of the glyph — each rising up into place from
// just below its final position.
const SLICE_COUNT = 12;
const FEATHER = 3; // percent

function maskFor(index: number) {
  const step = 100 / SLICE_COUNT;
  const start = index * step;
  const end = start + step;
  const fadeInStart = Math.max(0, start - FEATHER);
  const fadeInEnd = Math.min(100, start + FEATHER);
  const fadeOutStart = Math.max(0, end - FEATHER);
  const fadeOutEnd = Math.min(100, end + FEATHER);
  return `linear-gradient(to bottom,
    transparent 0%, transparent ${fadeInStart}%,
    black ${fadeInEnd}%, black ${fadeOutStart}%,
    transparent ${fadeOutEnd}%, transparent 100%)`;
}

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [inFlags, setInFlags] = useState<boolean[]>(Array(SLICE_COUNT).fill(false));
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const stagger = 290; // was 340 — tuned down slightly since there are more slices now, so the overall build lands a bit slower without dragging
    const startDelay = 250;
    // bottom slice (highest index) appears first, working upward
    const timers = Array.from({ length: SLICE_COUNT }).map((_, i) => {
      const order = SLICE_COUNT - 1 - i; // 0 = bottom slice goes first
      return setTimeout(() => {
        setInFlags((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, startDelay + order * stagger);
    });
    const totalReveal = startDelay + SLICE_COUNT * stagger;
    const startFadeOut = setTimeout(() => setFadingOut(true), totalReveal + 1500);
    const finish = setTimeout(onComplete, totalReveal + 2200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(startFadeOut);
      clearTimeout(finish);
    };
  }, [onComplete]);

  const anyIn = inFlags.some(Boolean);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-700 ease-out ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* warm dark-gold ambient glow behind the mark */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-[1500ms] ease-out"
        style={{
          opacity: anyIn ? 1 : 0,
          background:
            "radial-gradient(ellipse 520px 580px at center, rgba(90,64,24,0.55) 0%, rgba(50,34,12,0.35) 35%, rgba(20,13,5,0.15) 60%, rgba(0,0,0,0) 85%)",
        }}
      />

      <div className="relative" style={{ width: 380, height: 448 }}>
        {Array.from({ length: SLICE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              maskImage: maskFor(i),
              WebkitMaskImage: maskFor(i),
              transition: "opacity 1100ms ease-out, transform 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
              transform: inFlags[i] ? "translateY(0)" : "translateY(30px)",
              opacity: inFlags[i] ? 1 : 0,
              filter: inFlags[i]
                ? "drop-shadow(0 0 24px rgba(224,180,110,0.35))"
                : "none",
            }}
          >
            <Image src="/images/splash/glyph.png" alt="AHADU" fill className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
