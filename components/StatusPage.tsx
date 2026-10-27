import Link from "next/link";
import type { ReactNode } from "react";

// Shared layout for the 404 and error pages: centered copy over the site
// background, with the actions passed in by each page.
export default function StatusPage({
  kicker,
  title,
  body,
  children,
}: {
  kicker?: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
      {kicker ? (
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-ice-300">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-ice-50">
        {title}
      </h1>
      <p className="max-w-md text-ice-200 leading-relaxed">{body}</p>
      <div className="flex flex-wrap justify-center gap-3">{children}</div>
    </main>
  );
}

export function HomeLink({ label }: { label: string }) {
  return (
    <Link href="/" className="frost-btn frost-btn--primary">
      {label}
    </Link>
  );
}
