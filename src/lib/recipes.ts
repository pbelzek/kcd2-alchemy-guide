import data from "@/data/recipes.json";
import type { Recipe } from "./types";

export const recipes = data as Recipe[];

const bySlug = new Map(recipes.map((recipe) => [recipe.slug, recipe]));

export function getRecipe(slug: string): Recipe | undefined {
  return bySlug.get(slug);
}

/**
 * Folds away case, accents and curly apostrophes so that typing `bowman's`
 * matches `Bowman’s Brew`, and `st johns wort` matches `St. John’s Wort`.
 */
export function normalise(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’ʼ.]/g, "")
    .toLowerCase();
}

/** Everything a recipe can be found by, pre-folded once at module load. */
const haystacks = new Map(
  recipes.map((recipe) => [
    recipe.slug,
    normalise(
      [
        recipe.name,
        recipe.liquid,
        ...recipe.ingredients.map((item) => item.name),
      ].join(" "),
    ),
  ]),
);

export function searchRecipes(query: string): Recipe[] {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return recipes;
  return recipes.filter((recipe) => {
    const haystack = haystacks.get(recipe.slug) ?? "";
    return terms.every((term) => haystack.includes(term));
  });
}
