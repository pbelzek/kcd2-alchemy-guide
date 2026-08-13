import { recipes } from "@/lib/recipes";
import { SOURCE } from "@/lib/perks";

/**
 * Desktop-only welcome pane. On a phone this route renders the recipe list
 * full-screen instead (see GuideShell), so this copy is never in the way.
 */
export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-8 py-10">
      <span className="label">Kingdom Come: Deliverance II</span>
      <h1 className="mt-1 font-display text-4xl leading-tight text-ink">
        Alchemy guide
      </h1>
      <p className="mt-3 max-w-prose text-[1.0625rem] leading-normal text-muted">
        All {recipes.length} alchemy recipes in the game, with the brewing steps
        written out in order. Set your alchemy level and perks at the bottom of
        the list and each recipe adjusts to match — the faster method once
        you&rsquo;ve earned it, and the yield and quality your perks actually
        produce.
      </p>
      <p className="mt-5 border-l-2 border-rule pl-3 text-[0.9375rem] leading-snug text-faint">
        Choose a potion from the list to begin. Recipes are transcribed from{" "}
        <a
          href={SOURCE.url}
          target="_blank"
          rel="noreferrer"
          className="text-muted underline decoration-rule-strong underline-offset-2 hover:text-accent"
        >
          {SOURCE.title}
        </a>{" "}
        v{SOURCE.version} by {SOURCE.author}, tested against game version{" "}
        {SOURCE.gameVersion}.
      </p>
    </div>
  );
}
