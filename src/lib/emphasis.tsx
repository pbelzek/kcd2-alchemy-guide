import { Fragment, type ReactNode } from "react";

/**
 * The guide bolds the nouns you act on ("Add **Spirits** to the **Cauldron**").
 * That emphasis is the whole reading shortcut, so keep it — but only that one
 * construct, rather than pulling in a markdown renderer for it.
 */
export function withEmphasis(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index}>{part}</strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
