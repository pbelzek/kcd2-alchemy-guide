"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { searchRecipes } from "@/lib/recipes";
import { SOURCE } from "@/lib/perks";
import { BuildBar } from "./BuildBar";

export function Sidebar() {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const results = useMemo(() => searchRecipes(query), [query]);
  const activeSlug = pathname.startsWith("/potion/") ? pathname.slice("/potion/".length) : null;

  return (
    <>
      <div className="border-b border-rule px-3 pt-3 pb-2.5 md:px-4">
        <Link href="/" className="block">
          <span className="label">Kingdom Come: Deliverance II</span>
          <h1 className="font-display text-xl leading-tight text-ink">
            Henry&rsquo;s Alchemy Bench
          </h1>
        </Link>

        <div className="relative mt-2.5">
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search potions or herbs…"
            aria-label="Search recipes by name, herb or liquid"
            className="w-full rounded-sm border border-rule bg-paper py-1.5 pr-3 pl-9 text-[0.9375rem] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <nav aria-label="Recipes" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {results.length === 0 ? (
          <p className="px-3 py-6 text-center text-[0.9375rem] text-muted md:px-4">
            Nothing brews under{" "}
            <span className="text-ink">&ldquo;{query.trim()}&rdquo;</span>.
          </p>
        ) : (
          <ul>
            {results.map((recipe) => {
              const isActive = recipe.slug === activeSlug;
              return (
                <li key={recipe.slug}>
                  <Link
                    href={`/potion/${recipe.slug}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-[2.5rem] items-baseline gap-2.5 border-b border-rule/60 border-l-2 py-1.5 pr-3 pl-3 transition-colors md:pr-4 md:pl-[0.875rem] ${
                      isActive
                        ? "border-l-accent bg-accent-soft/60"
                        : "border-l-transparent hover:bg-sunken/60"
                    }`}
                  >
                    <span className="w-6 shrink-0 font-display text-[0.8125rem] text-faint tabular-nums">
                      {String(recipe.no).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-display text-[1.0625rem] leading-snug ${
                          isActive ? "text-accent" : "text-ink"
                        }`}
                      >
                        {recipe.name}
                      </span>
                      <span className="block truncate text-[0.8125rem] leading-snug text-faint">
                        {recipe.liquid} ·{" "}
                        {recipe.ingredients.map((item) => item.name).join(", ")}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <BuildBar />

      <p className="border-t border-rule px-3 py-1.5 text-xs leading-snug text-faint md:px-4">
        Recipes from{" "}
        <a
          href={SOURCE.url}
          target="_blank"
          rel="noreferrer"
          className="text-muted underline decoration-rule-strong underline-offset-2 hover:text-accent"
        >
          {SOURCE.title}
        </a>{" "}
        by {SOURCE.author}.
      </p>
    </>
  );
}
