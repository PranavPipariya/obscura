"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadIcon, Search, Filter, Calendar, FileText } from "lucide-react";
import { FeatureButton } from "../../components/featurebutton";
import type { Leak } from "@/lib/types/leaks";

type SortOption = "newest" | "oldest";

export default function LeaksPage() {
  const [leaks, setLeaks] = useState<Leak[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  //  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/leaks");
      if (!res.ok) return;
      const data = (await res.json()) as Leak[];
      setLeaks(data);
    })();
  }, []);

  const filteredAndSortedLeaks = useMemo(() => {
    let result = [...leaks];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((leak) => {
        const desc = leak.description.toLowerCase();
        const subject = Array.isArray(leak.proof.publicData?.subject)
          ? (leak.proof.publicData!.subject as unknown as string[])
              .join("")
              .toLowerCase()
          : "";
        return desc.includes(query) || subject.includes(query);
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [leaks, searchQuery, sortBy]);

  const handleDownload = (leak: Leak) => {
    const file = {
      proofData: leak.proof.proofData,
      publicOutputs:
        (leak.proof as { publicOutputs?: unknown }).publicOutputs ??
        leak.proof.publicData,
      externalInputs: leak.proof.externalInputs,
      isLocal: leak.proof.isLocal,
      blueprintSlug: leak.proof.blueprintSlug,
      description: leak.description,
      createdAt: leak.createdAt,
    };

    const blob = new Blob([JSON.stringify(file, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proof-${leak.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main
      className="min-h-screen w-full bg-gradient-to-b from-neutral-50 to-neutral-200 text-neutral-900"
      style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
            <Link href="/request" className="hover:text-neutral-900">
              Request Leak
            </Link>
            <Link href="/dashboard" className="hover:text-neutral-900">
              Submit Leak
            </Link>
            <Link
              href="/leaks"
              className="hover:text-neutral-900 underline underline-offset-4"
            >
              View All
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight drop-shadow-sm"
          style={{
            fontFamily:
              "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          }}
        >
          All Leaks
        </h1>
        <p className="text-neutral-700 mt-3 text-base">
          Browse verified proofs submitted by the community. Download any proof
          to verify locally.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-neutral-600" />
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Search
                  </h3>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search descriptions..."
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                />
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-neutral-600" />
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Sort By
                  </h3>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      sortBy === "newest"
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                    Newest First
                  </button>
                  <button
                    onClick={() => setSortBy("oldest")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      sortBy === "oldest"
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                    Oldest First
                  </button>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-neutral-600">
                    Total Leaks
                  </span>
                  <span className="text-sm font-bold text-neutral-900">
                    {leaks.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-600">
                    Showing
                  </span>
                  <span className="text-sm font-bold text-neutral-900">
                    {filteredAndSortedLeaks.length}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {filteredAndSortedLeaks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-neutral-200 rounded-2xl p-12 text-center"
              >
                <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600 mb-2">
                  {leaks.length === 0
                    ? "No leaks have been published yet."
                    : "No leaks match your search."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-sm text-neutral-900 font-medium underline underline-offset-4 mt-2"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedLeaks.map((leak, index) => (
                    <motion.article
                      key={leak.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.03,
                      }}
                      className="bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-lg text-neutral-900">
                            {leak.description}
                          </h3>

                          <div className="flex-shrink-0">
                            <FeatureButton
                              label="Download Proof"
                              icon={DownloadIcon}
                              onClick={() => handleDownload(leak)}
                            />
                          </div>
                        </div>

                        {Array.isArray(leak.proof.publicData?.subject) && (
                          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                            <p className="text-xs font-medium text-neutral-600 mb-1">
                              Email Subject
                            </p>
                            <p className="text-sm text-neutral-800">
                              {(
                                leak.proof.publicData!
                                  .subject as unknown as string[]
                              ).join("")}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(leak.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {leak.proof.isLocal
                              ? "Local proof"
                              : "Remote proof"}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center text-sm text-neutral-500 mt-16 pb-6">
        © {new Date().getFullYear()} Obscura — Private. Proven. Minimal.
      </footer>
    </main>
  );
}
