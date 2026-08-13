"use client";

import { useState } from "react";
import { LEVEL_EXPLAINER, MAX_LEVEL, MIN_LEVEL, PERKS } from "@/lib/perks";
import { useBuild } from "./build-context";
import { InfoTip } from "./InfoTip";

export function BuildBar() {
  const { level, perks, setLevel, togglePerk, hydrated } = useBuild();
  const [expanded, setExpanded] = useState(false);

  const activePerks = PERKS.filter((perk) => perks[perk.id]);

  return (
    <section
      aria-label="Your alchemy build"
      className="border-t border-rule-strong bg-sunken/70"
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 px-3 py-2 text-left md:px-4"
      >
        <span className="label">Your build</span>
        <span className="ml-auto flex items-center gap-2 text-[0.8125rem] text-muted">
          {/* Until the saved build loads, show a neutral dash rather than a
              level the player may have already changed. */}
          <span className="font-display text-base text-ink">
            Level {hydrated ? level : "—"}
          </span>
          <span className="text-faint">
            {hydrated
              ? activePerks.length === 0
                ? "no perks"
                : `${activePerks.length} perk${activePerks.length > 1 ? "s" : ""}`
              : ""}
          </span>
          <svg
            aria-hidden
            viewBox="0 0 12 12"
            className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div className={expanded ? "block" : "hidden"}>
        <div className="px-3 pb-3 md:px-4">
          <div className="mb-1.5 flex items-center gap-1.5">
            <label htmlFor="alchemy-level" className="label">
              Alchemy level
            </label>
            <InfoTip label="Alchemy level">{LEVEL_EXPLAINER}</InfoTip>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="alchemy-level"
              type="range"
              min={MIN_LEVEL}
              max={MAX_LEVEL}
              value={level}
              onChange={(event) => setLevel(Number(event.target.value))}
              className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-rule accent-[var(--accent)]"
            />
            <input
              type="number"
              min={MIN_LEVEL}
              max={MAX_LEVEL}
              value={level}
              onChange={(event) => setLevel(Number(event.target.value))}
              aria-label="Alchemy level"
              className="w-14 rounded-sm border border-rule bg-paper px-2 py-1 text-center font-display text-lg text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <div className="mt-3 mb-1.5 flex items-center gap-1.5">
            <span className="label">Perks</span>
            <InfoTip label="Perks">
              Toggle the alchemy perks you have taken. They change how much each
              brew yields and how strong it can get — Secret of Equilibrium is
              not needed for any recipe here.
            </InfoTip>
          </div>

          <ul className="flex flex-wrap gap-1.5">
            {PERKS.map((perk) => {
              const isOn = perks[perk.id];
              return (
                <li key={perk.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isOn}
                    onClick={() => togglePerk(perk.id)}
                    className={`rounded-full border px-2.5 py-1 text-[0.8125rem] transition-colors ${
                      isOn
                        ? "border-active bg-active-soft text-active"
                        : "border-rule text-muted hover:border-rule-strong"
                    }`}
                  >
                    {perk.short}
                  </button>
                  <InfoTip label={perk.name}>{perk.effect}</InfoTip>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
