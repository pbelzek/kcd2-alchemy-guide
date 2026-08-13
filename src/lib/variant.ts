import type { Quality, Recipe, Variant } from "./types";
import type { Perks } from "./perks";

/**
 * Picks the method that suits the player's alchemy level.
 *
 * Variants are stored hardest-requirement-first, so the first one the player
 * qualifies for is also the fastest one available to them. The runner-up is
 * returned too — a player may prefer the safer, slower method even when a
 * shortcut has unlocked.
 */
export function pickVariant(
  recipe: Recipe,
  level: number,
): { active: Variant; alternate: Variant | null } {
  const active =
    recipe.variants.find((variant) => variant.minLevel === null || level >= variant.minLevel) ??
    recipe.variants[recipe.variants.length - 1];
  const alternate = recipe.variants.find((variant) => variant !== active) ?? null;
  return { active, alternate };
}

/** The next method that unlocks, if the player has one to look forward to. */
export function nextVariant(recipe: Recipe, level: number): Variant | null {
  const upcoming = recipe.variants
    .filter((variant) => variant.minLevel !== null && variant.minLevel > level)
    .sort((a, b) => (a.minLevel ?? 0) - (b.minLevel ?? 0));
  return upcoming[0] ?? null;
}

/** Column index into a yield row: one step per Secret of Matter perk taken. */
export function yieldColumn(perks: Perks): 0 | 1 | 2 | 3 {
  return ((perks.matterI ? 1 : 0) + (perks.matterII ? 2 : 0)) as 0 | 1 | 2 | 3;
}

/** How many portions this recipe makes for the player's exact perk set. */
export function pickYield(recipe: Recipe, perks: Perks): number {
  const row =
    recipe.yields.find((candidate) => candidate.secretOfSecrets === perks.secretOfSecrets) ??
    recipe.yields.find((candidate) => candidate.secretOfSecrets === null) ??
    recipe.yields[0];
  return row.values[yieldColumn(perks)];
}

/** True when the recipe's yield depends on Secret of Secrets (the gunpowders). */
export function yieldUsesSecrets(recipe: Recipe): boolean {
  return recipe.yields.some((row) => row.secretOfSecrets !== null);
}

/**
 * The best tier the player can reach. Secret of Secrets unlocks Henry's level;
 * without it Strong is the ceiling. Recipes with no quality tiers (soap,
 * gunpowder, moonshine) always come out Standard.
 */
export function bestQuality(recipe: Recipe, perks: Perks): Quality {
  const tiers = recipe.effects.map((effect) => effect.quality);
  if (tiers.length === 1) return tiers[0];
  const target: Quality = perks.secretOfSecrets ? "Henry's" : "Strong";
  return tiers.includes(target) ? target : tiers[tiers.length - 1];
}

/**
 * Some recipes document a shortcut that only works with a mistake-forgiving
 * perk. Those notes are worth promoting once Dark Arts Apprentice is on.
 */
export function isPerkNote(note: string): boolean {
  return /perk that allows for mistakes|dark arts apprentice/i.test(note);
}

/** Notes warning of outright failure deserve a louder treatment than a bullet. */
export function isDangerNote(note: string): boolean {
  return /you will die/i.test(note);
}
