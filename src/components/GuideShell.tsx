"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

/**
 * The two-pane frame. The sidebar lives here rather than inside a page so it
 * never unmounts — which is what keeps the search box and the list's scroll
 * position intact as you move between recipes.
 *
 * On a phone there isn't room for a real split, so the two panes take turns:
 * the list is the home screen and a recipe is a page you navigate to, with the
 * URL and the back button doing exactly what they look like they do.
 */
export function GuideShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showingRecipe = pathname !== "/";

  return (
    <div className="flex h-dvh w-full">
      <aside
        className={`${
          showingRecipe ? "hidden md:flex" : "flex"
        } w-full shrink-0 flex-col border-rule bg-surface md:w-72 md:border-r lg:w-80`}
      >
        <Sidebar />
      </aside>

      <main
        className={`${
          showingRecipe ? "flex" : "hidden md:flex"
        } min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain`}
      >
        {children}
      </main>
    </div>
  );
}
