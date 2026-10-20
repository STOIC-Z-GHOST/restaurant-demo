"use client";

import { useEffect, useState } from "react";

type Cat = { id: string; label: string };

// Sticky jump bar under the header: tap a course to scroll straight to it,
// and the current course stays highlighted as you read down the page.
export default function CategoryNav({ categories }: { categories: Cat[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? "");

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-130px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav
      aria-label="Menu sections"
      className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-line"
    >
      <div className="mx-auto max-w-6xl overflow-x-auto px-6 sm:px-12">
        <ul className="flex gap-2 py-3 sm:justify-center min-w-max sm:min-w-0">
          {categories.map((c) => {
            const isActive = active === c.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`block font-body text-sm tracking-wide px-4 py-1.5 rounded-full border transition-colors ${
                    isActive
                      ? "bg-foreground-strong text-background border-foreground-strong"
                      : "border-line-strong text-secondary hover:border-accent hover:text-foreground-strong"
                  }`}
                >
                  {c.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
