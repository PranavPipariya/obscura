"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { FeatureCard } from "../components/featurecard";

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function Dashboard() {
  const router = useRouter();

  React.useEffect(() => {
    const id = "obscura-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <main
      className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-200 text-black"
      style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
    >
      <header className="mb-12 text-center">
        <h1
          className="text-6xl sm:text-7xl font-bold tracking-tight text-neutral-900 drop-shadow-sm"
          style={{
            fontFamily:
              "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          }}
        >
          Obscura
        </h1>

        <p className="mt-4 text-xl text-neutral-700">
          Trustless WhistleBlowing Platform
        </p>
        <p className="mt-2 text-base text-neutral-600">
          Submit privately. Verify publicly. All in monochrome.
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Share sensitive info while remaining anonymous.
        </p>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
        <FeatureCard
          title="Private proofs. Public trust."
          description={`Convert an email or document into mathematical proof — evidence that something exists or was said,
          without exposing who said it or what it contains.

          Obscura lets you submit sensitive information with zero personal metadata.
          Generate a zero-knowledge proof in your browser, attach a short description,
          and publish it as a verifiable leak that anyone can validate — but no one can deanonymize.`}
          buttonLabel="Submit a leak"
          buttonIcon={ArrowRightIcon}
          onButtonClick={() => router.push("/dashboard")}
        />

        <FeatureCard
          title="Explore verifiable claims."
          description={`Every submission is backed by math, not trust.
          View published proofs, see what they claim, and verify them locally — all without ever touching the underlying data.

          Browse a feed of mathematically guaranteed statements: leaked letters, corporate claims, whistleblower evidence —
          all provable, none exposed.
          Obscura turns credibility into a computation.`}
          buttonLabel="Explore"
          buttonIcon={ArrowRightIcon}
          onButtonClick={() => router.push("/leaks")}
        />
      </section>

      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} Obscura — Minimal. Monochrome. Verified by
        math.
      </footer>
    </main>
  );
}
