"use client";

import Link from "next/link";
import { withEmphasis } from "@/lib/emphasis";
import { DRIED_HERBS, PERKS, TIMING_NOTE } from "@/lib/perks";
import type { Recipe, Variant } from "@/lib/types";
import {
  bestQuality,
  isDangerNote,
  isPerkNote,
  nextVariant,
  pickVariant,
  pickYield,
  yieldColumn,
  yieldUsesSecrets,
} from "@/lib/variant";
import { useBuild } from "./build-context";
import { InfoTip } from "./InfoTip";

const YIELD_COLUMNS = ["No perks", "Matter I", "Matter II", "Matter I + II"];

function methodLabel(variant: Variant): string {
  if (variant.minLevel === null) return "Any level";
  return `Level ${variant.minLevel}+${variant.uncertain ? " (unconfirmed)" : ""}`;
}

function Section({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule px-4 py-4 md:px-8 md:py-5">
      <div className="mb-2 flex items-center gap-1.5">
        <h2 className="label">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function RecipeView({ recipe }: { recipe: Recipe }) {
  const { level, perks, hydrated } = useBuild();

  const { active, alternate } = pickVariant(recipe, level);
  const upcoming = nextVariant(recipe, level);
  const portions = pickYield(recipe, perks);
  const reachable = bestQuality(recipe, perks);
  const hasQualityTiers = recipe.effects.length > 1;

  const dangerNotes = recipe.notes.filter(isDangerNote);
  const plainNotes = recipe.notes.filter((note) => !isDangerNote(note));

  return (
    <article className="mx-auto w-full max-w-3xl pb-12">
      <Link
        href="/"
        className="flex items-center gap-1.5 px-4 pt-3 text-[0.9375rem] text-muted hover:text-accent md:hidden"
      >
        <span aria-hidden>&lsaquo;</span> All recipes
      </Link>

      <header className="px-4 pt-4 pb-4 md:px-8 md:pt-6">
        <span className="label">No. {String(recipe.no).padStart(2, "0")}</span>
        <h1 className="mt-0.5 font-display text-3xl leading-tight text-ink md:text-4xl">
          {recipe.name}
        </h1>
        <p className="mt-1 text-[0.9375rem] text-muted">
          {recipe.liquid} base · {recipe.ingredients.length} ingredient
          {recipe.ingredients.length === 1 ? "" : "s"} ·{" "}
          <span className="text-ink">
            makes {hydrated ? portions : recipe.yields[0].values[0]}
          </span>
        </p>
      </header>

      {dangerNotes.length > 0 ? (
        <div className="mx-4 mb-1 border-l-2 border-danger bg-danger-soft px-3 py-2 md:mx-8">
          {dangerNotes.map((note) => (
            <p key={note} className="text-[0.9375rem] text-danger">
              <strong className="font-semibold">Warning.</strong> {note}
            </p>
          ))}
        </div>
      ) : null}

      <Section title="Ingredients">
        <ul className="divide-y divide-rule/60 border-y border-rule/60">
          <li className="flex items-baseline gap-3 py-1.5">
            <span className="w-6 shrink-0 text-right font-display text-base text-accent">—</span>
            <span className="text-[1.0625rem] text-ink">{recipe.liquid}</span>
            <span className="ml-auto text-[0.8125rem] text-faint">liquid base</span>
          </li>
          {recipe.ingredients.map((item) => (
            <li key={item.name} className="flex items-baseline gap-3 py-1.5">
              <span className="w-6 shrink-0 text-right font-display text-base text-accent tabular-nums">
                {item.qty}
              </span>
              <span className="text-[1.0625rem] text-ink">{item.name}</span>
            </li>
          ))}
        </ul>

        <p className="mt-2 flex items-start gap-1.5 text-sm leading-snug text-muted">
          <span>
            <span className="font-semibold text-ink">Dried herbs.</span>{" "}
            {hydrated && perks.darkArts ? DRIED_HERBS.with : DRIED_HERBS.without}
          </span>
        </p>
      </Section>

      <Section
        title="Method"
        aside={<InfoTip label="Timing">{TIMING_NOTE}</InfoTip>}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-active bg-active-soft px-2 py-0.5 text-[0.8125rem] text-active">
            {methodLabel(active)}
          </span>
          {hydrated && upcoming ? (
            <span className="text-[0.8125rem] text-faint">
              A faster method unlocks at alchemy level {upcoming.minLevel}.
            </span>
          ) : null}
        </div>

        <ol className="method text-[1.0625rem] leading-normal text-ink">
          {active.steps.map((step, index) => (
            <li key={index}>{withEmphasis(step)}</li>
          ))}
        </ol>

        {alternate ? (
          <details className="mt-3 border-t border-rule pt-3">
            <summary className="cursor-pointer text-[0.9375rem] text-muted hover:text-accent">
              Show the {methodLabel(alternate).toLowerCase()} method
            </summary>
            <ol className="method mt-2 text-[1.0625rem] leading-normal text-muted">
              {alternate.steps.map((step, index) => (
                <li key={index}>{withEmphasis(step)}</li>
              ))}
            </ol>
          </details>
        ) : null}
      </Section>

      <Section title="Yield">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl text-accent tabular-nums">
            {hydrated ? portions : recipe.yields[0].values[0]}
          </span>
          <span className="text-[0.9375rem] text-muted">
            portions with your perks
            {yieldUsesSecrets(recipe) && hydrated && !perks.secretOfSecrets
              ? " — Secret of Secrets raises this"
              : ""}
          </span>
        </div>

        <details className="mt-2">
          <summary className="cursor-pointer text-[0.9375rem] text-muted hover:text-accent">
            Show every perk combination
          </summary>
          <div className="mt-2 -mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[26rem] border-collapse text-[0.9375rem]">
              <thead>
                <tr>
                  {yieldUsesSecrets(recipe) ? <th className="w-px" /> : null}
                  {YIELD_COLUMNS.map((column, index) => (
                    <th
                      key={column}
                      scope="col"
                      className={`border-b border-rule px-3 py-1.5 text-left text-[0.8125rem] font-normal whitespace-nowrap ${
                        hydrated && index === yieldColumn(perks) ? "text-accent" : "text-faint"
                      }`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recipe.yields.map((row) => {
                  const isYourRow =
                    !hydrated ||
                    row.secretOfSecrets === null ||
                    row.secretOfSecrets === perks.secretOfSecrets;
                  return (
                    <tr key={String(row.secretOfSecrets)}>
                      {yieldUsesSecrets(recipe) ? (
                        <th
                          scope="row"
                          className="border-b border-rule/60 py-1.5 pr-3 text-left text-[0.8125rem] font-normal whitespace-nowrap text-faint"
                        >
                          {row.secretOfSecrets ? "With" : "Without"} Secrets
                        </th>
                      ) : null}
                      {row.values.map((value, index) => {
                        const isYours = isYourRow && hydrated && index === yieldColumn(perks);
                        return (
                          <td
                            key={index}
                            className={`border-b border-rule/60 px-3 py-1.5 tabular-nums ${
                              isYours ? "font-semibold text-accent" : "text-muted"
                            }`}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      </Section>

      <Section
        title="Effects"
        aside={
          hasQualityTiers ? (
            <InfoTip label="Quality tiers">
              {PERKS[0].effect} This guide&rsquo;s method always brews the best
              quality your perks allow.
            </InfoTip>
          ) : undefined
        }
      >
        <ul className="space-y-px">
          {recipe.effects.map((effect) => {
            const isReachable = hydrated && hasQualityTiers && effect.quality === reachable;
            return (
              <li
                key={effect.quality}
                className={`flex flex-col gap-0.5 border-l-2 py-1.5 pl-3 sm:flex-row sm:gap-4 ${
                  isReachable ? "border-l-accent bg-accent-soft/40" : "border-l-rule"
                }`}
              >
                <span
                  className={`shrink-0 font-display text-base sm:w-24 ${
                    isReachable ? "text-accent" : "text-muted"
                  }`}
                >
                  {effect.quality}
                  {isReachable ? (
                    <span className="ml-1.5 align-middle text-[0.6875rem] tracking-wide text-faint uppercase">
                      yours
                    </span>
                  ) : null}
                </span>
                <span className="text-[0.9375rem] leading-snug text-muted">{effect.text}</span>
              </li>
            );
          })}
        </ul>
      </Section>

      {plainNotes.length > 0 ? (
        <Section title="Notes">
          <ul className="space-y-1.5">
            {plainNotes.map((note) => {
              const highlighted = hydrated && perks.darkArts && isPerkNote(note);
              return (
                <li
                  key={note}
                  className={`note border-l-2 py-0.5 pl-3 text-[0.9375rem] leading-snug ${
                    highlighted ? "border-l-active text-ink" : "border-l-rule text-muted"
                  }`}
                >
                  {withEmphasis(note)}
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}
    </article>
  );
}
