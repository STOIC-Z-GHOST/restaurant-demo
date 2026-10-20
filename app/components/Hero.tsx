"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SplashScreen from "./SplashScreen";
import { splashState } from "./splashState";

const NAV = [
  { label: "Reservations", href: "/reservations" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
];

export default function Hero() {
  const [showSplash, setShowSplash] = useState(!splashState.shown);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      setCursor({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          splashState.shown = true;
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* real photo background */}
      <Image
        src="/images/hero-bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      {/* darkening overlay so the wordmark and nav stay legible over the photo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,6,3,0.55) 0%, rgba(8,6,3,0.35) 30%, rgba(8,6,3,0.55) 60%, rgba(6,5,3,0.8) 100%)",
        }}
      />

      {/* cursor-following glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-300 ease-out"
        style={{
          background: `radial-gradient(circle 420px at ${cursor.x}% ${cursor.y}%, rgba(224,180,110,0.14) 0%, rgba(224,180,110,0) 70%)`,
        }}
      />

      {/* vignette to keep focus centered */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6">
        <h1
          className="font-serif text-[clamp(2.5rem,8vw,5.5rem)] tracking-[0.35em] text-foreground-strong"
          style={{
            textShadow: "0 0 40px rgba(224,180,110,0.35), 0 0 90px rgba(0,0,0,0.6)",
          }}
        >
          AHADU
        </h1>

        <p className="mt-6 font-serif italic text-base tracking-wide text-[#D8BE8F] opacity-90">
          The table is set. Come as you are, stay for the evening.
        </p>

        <nav className="mt-14 flex flex-col items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-block font-serif font-light text-lg tracking-[0.4em] text-[#EDE6D6] hover:text-[#F6EFE0] hover:scale-110 transition-all duration-500 ease-out hover:[text-shadow:0_0_28px_rgba(224,180,110,0.75),0_0_56px_rgba(224,180,110,0.35),0_2px_8px_rgba(0,0,0,0.7)]"
              style={{
                textShadow:
                  "0 0 18px rgba(224,180,110,0.4), 0 0 36px rgba(224,180,110,0.15), 0 2px 8px rgba(0,0,0,0.7)",
              }}
            >
              {item.label.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
