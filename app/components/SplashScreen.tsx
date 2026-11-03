"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// twelve horizontal slivers, softly feathered — more, thinner pieces than
// before for a smoother assembly. They assemble bottom-to-top — the last
// piece to appear is the top of the glyph — each rising up into place from
// just below its final position.
const SLICE_COUNT = 12;
const FEATHER = 3; // percent
const SLICE_MS = 700; // per-slice fade/rise duration
const FADE_MS = 500; // whole-splash fade out

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

  // Hero passes a fresh onComplete every render, and it re-renders on every
  // mouse move (cursor glow). With onComplete in the effect's dependencies,
  // each mouse move restarted the whole timer chain and stretched the splash.
  // Keep the latest callback in a ref and run the timers exactly once.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // ~2.4s total (was ~6s): 100ms + 12 slices x 90ms stagger, 700ms per
    // slice, a short hold, then a 500ms fade.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      onCompleteRef.current();
      return;
    }

    const stagger = 90;
    const startDelay = 100;
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
    const lastSliceDone = startDelay + (SLICE_COUNT - 1) * stagger + SLICE_MS;
    const startFadeOut = setTimeout(() => setFadingOut(true), lastSliceDone + 150);
    const finish = setTimeout(() => onCompleteRef.current(), lastSliceDone + 150 + FADE_MS);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(startFadeOut);
      clearTimeout(finish);
    };
  }, []);

  // Tap, click or any key skips: fade out quickly, then hand over to the page.
  function skip() {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => onCompleteRef.current(), 250);
  }

  useEffect(() => {
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fadingOut]);

  const anyIn = inFlags.some(Boolean);

  return (
    <div
      onClick={skip}
      role="presentation"
      title="Tap to skip"
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer transition-opacity duration-500 ease-out ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
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
              transition: `opacity ${SLICE_MS}ms ease-out, transform ${SLICE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              transform: inFlags[i] ? "translateY(0)" : "translateY(30px)",
              opacity: inFlags[i] ? 1 : 0,
              filter: inFlags[i]
                ? "drop-shadow(0 0 24px rgba(224,180,110,0.35))"
                : "none",
            }}
          >
            <Image
              src="/images/splash/glyph.webp"
              alt={i === 0 ? "AHADU" : ""}
              fill
              sizes="380px"
              priority
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
