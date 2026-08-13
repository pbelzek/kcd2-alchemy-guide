import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-10 md:px-8">
      <span className="label">Nothing here</span>
      <h1 className="mt-1 font-display text-3xl leading-tight text-ink">
        No such recipe
      </h1>
      <p className="mt-2 text-[1.0625rem] leading-normal text-muted">
        That potion isn&rsquo;t in Henry&rsquo;s book.
      </p>
      <Link
        href="/"
        className="mt-4 self-start border-b border-rule-strong pb-0.5 text-[0.9375rem] text-accent hover:border-accent"
      >
        Back to all recipes
      </Link>
    </div>
  );
}
