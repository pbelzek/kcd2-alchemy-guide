export const QUALITIES = ["Weak", "Standard", "Strong", "Henry's"] as const;
export type Quality = (typeof QUALITIES)[number];

export const LIQUIDS = ["Water", "Wine", "Spirits", "Oil"] as const;
export type Liquid = (typeof LIQUIDS)[number];

export type Ingredient = {
  qty: number;
  name: string;
};

export type Variant = {
  /** `null` means the method works at any alchemy level. */
  minLevel: number | null;
  /** The guide marks this threshold as unconfirmed (e.g. "Level 18+?"). */
  uncertain: boolean;
  /** Markdown-ish step text; `**bold**` is rendered as emphasis. */
  steps: string[];
};

export type YieldRow = {
  /**
   * `null` when the recipe's yield does not depend on Secret of Secrets.
   * The two gunpowders have one row for each state of the perk.
   */
  secretOfSecrets: boolean | null;
  /** Yields for [no perks, Matter I, Matter II, Matter I + II]. */
  values: [number, number, number, number];
};

export type Effect = {
  quality: Quality;
  text: string;
};

export type Recipe = {
  slug: string;
  /** The guide's own recipe number, e.g. 1 for "No. 01". */
  no: number;
  name: string;
  liquid: Liquid;
  ingredients: Ingredient[];
  variants: Variant[];
  yields: YieldRow[];
  effects: Effect[];
  notes: string[];
};
