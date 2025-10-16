"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span
            className="text-xl sm:text-2xl font-bold tracking-tight group-hover:opacity-90"
            style={{
              fontFamily:
                "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            }}
            title="Go home"
          >
            Obscura
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-neutral-700">
          <Link href="/dashboard" className="hover:text-neutral-900">
            Submit Leak
          </Link>
          <Link href="/leaks" className="hover:text-neutral-900">
            View Leaks
          </Link>
          <Link href="/request" className="hover:text-neutral-900">
            Request Leak
          </Link>
        </div>
      </div>
    </nav>
  );
}
