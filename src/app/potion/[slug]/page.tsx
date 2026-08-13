import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipeView } from "@/components/RecipeView";
import { getRecipe, recipes } from "@/lib/recipes";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: PageProps<"/potion/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};

  const ingredients = recipe.ingredients
    .map((item) => `${item.qty}× ${item.name}`)
    .join(", ");

  return {
    title: recipe.name,
    description: `How to brew ${recipe.name} in Kingdom Come: Deliverance 2 — ${recipe.liquid} base with ${ingredients}.`,
  };
}

export default async function PotionPage({ params }: PageProps<"/potion/[slug]">) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  return <RecipeView recipe={recipe} />;
}
