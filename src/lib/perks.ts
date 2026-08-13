/**
 * Perk metadata and the explanatory copy shown in tooltips.
 * All wording is condensed from the guide's own "Perks" and "Dried herbs"
 * sections so the app never contradicts its source.
 */

export type PerkId = "secretOfSecrets" | "matterI" | "matterII" | "darkArts";

export type Perks = Record<PerkId, boolean>;

export const NO_PERKS: Perks = {
  secretOfSecrets: false,
  matterI: false,
  matterII: false,
  darkArts: false,
};

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 30;

export type PerkInfo = {
  id: PerkId;
  /** Compact label for the chip. */
  short: string;
  name: string;
  effect: string;
};

export const PERKS: PerkInfo[] = [
  {
    id: "secretOfSecrets",
    short: "Secrets",
    name: "Secret of Secrets",
    effect:
      "Unlocks Henry's level potions and poisons — the strongest tier. Without it, Strong is your ceiling. It also raises the yield of both gunpowders.",
  },
  {
    id: "matterI",
    short: "Matter I",
    name: "Secret of Matter I",
    effect: "Brews one extra portion of everything you make.",
  },
  {
    id: "matterII",
    short: "Matter II",
    name: "Secret of Matter II",
    effect:
      "Brews another extra portion on top of Matter I. With both you get x6 potions, x9 soap and up to x18 powder.",
  },
  {
    id: "darkArts",
    short: "Dark Arts",
    name: "Dark Arts Apprentice",
    effect:
      "Between 00:00 and 04:30 you may use dried herbs exclusively, and one mistake no longer costs you quality — though it does cost quantity.",
  },
];

/** The alchemy level control's own explanation. */
export const LEVEL_EXPLAINER =
  "Your alchemy level decides how forgiving the brewing timings are. Higher levels let you skip steps and still reach top quality, so this guide swaps in a faster method once you qualify for it.";

export const DRIED_HERBS = {
  without:
    "You may use dried herbs for up to two thirds of the herbs without losing quality — at least one must be fresh (charcoal and boar's tusk don't count as fresh).",
  with: "Brewing between 00:00 and 04:30 you may replace every herb with a dried one at no cost to quality.",
} as const;

export const TIMING_NOTE =
  "The hourglass is really a 10-second glass. “Halfway” means about 5 seconds, and “just before it runs out” means 1–2 seconds left.";

export const SOURCE = {
  title: "Henry's Moste Potente Potions",
  author: "Omricon",
  url: "https://github.com/Omricon/Henrys-Moste-Potente-Potions",
  version: "1.2",
  gameVersion: "1.1.1-11377-release_1_1",
} as const;
