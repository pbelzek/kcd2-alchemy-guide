import type { Metadata, Viewport } from "next";
import { EB_Garamond, Spectral } from "next/font/google";
import { GuideShell } from "@/components/GuideShell";
import "./globals.css";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
});

/*
  Body text. Spectral is a serif drawn for reading at screen sizes, so the
  brewing steps read like a printed manual rather than a dashboard. It is
  sturdier and larger on the body than EB Garamond, which keeps the potion
  names distinct from the prose underneath them.

  To try another: swap the import and this call. Runners-up, all in
  next/font/google and all needing an explicit `weight` array like this one —
  Literata (warmer, wider), Faustina (closer to Garamond), or, if you would
  rather keep a sans, Karla or Alegreya_Sans.
*/
const body = Spectral({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KCD2 Alchemy guide — potion recipes",
    template: "%s — KCD2 Alchemy guide",
  },
  description:
    "Searchable Kingdom Come: Deliverance 2 alchemy recipes, with the brewing method matched to your alchemy level and perks.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4ede0" },
    { media: "(prefers-color-scheme: dark)", color: "#17130f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${garamond.variable} ${body.variable} antialiased`}>
      <body>
        <GuideShell>{children}</GuideShell>
      </body>
    </html>
  );
}
