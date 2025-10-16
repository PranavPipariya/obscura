"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureButton } from "../../components/featurebutton";
import { ArrowRightIcon, Heart, Plus, CheckCircle2, List } from "lucide-react";
import type { LeakRequest } from "../../lib/types/requests";

export default function RequestLeakPage() {
  const [items, setItems] = useState<LeakRequest[]>([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [liking, setLiking] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<"create" | "browse">("create");

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/requests");
      if (!r.ok) return;
      const data = (await r.json()) as LeakRequest[];
      setItems(data);
    })();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      title.trim().length >= 3 && details.trim().length >= 10 && !submitting
    );
  }, [title, details, submitting]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    const [result] = await Promise.all([
      (async () => {
        const r = await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, details }),
        });
        return r;
      })(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);

    try {
      if (result.ok) {
        const { item } = (await result.json()) as { item: LeakRequest };
        setItems((prev) => [item, ...prev]);
        setTitle("");
        setDetails("");
        setJustSubmitted(true);
        setTimeout(() => {
          setJustSubmitted(false);
          setView("browse");
        }, 2000);
      } else {
        console.error(await result.text());
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onLike = async (id: string) => {
    if (liking[id]) return;
    setLiking((s) => ({ ...s, [id]: true }));
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, likes: it.likes + 1 } : it)),
    );
    try {
      const r = await fetch(`/api/requests/${id}/like`, { method: "POST" });
      if (!r.ok) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === id ? { ...it, likes: it.likes - 1 } : it,
          ),
        );
        console.error(await r.text());
      }
    } finally {
      setLiking((s) => ({ ...s, [id]: false }));
    }
  };

  return (
    <main
      className="min-h-screen w-full bg-gradient-to-b from-neutral-50 to-neutral-200 text-neutral-900"
      style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
    >
      {/* Nav */}
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
            <Link
              href="/request"
              className="hover:text-neutral-900 underline underline-offset-4"
            >
              Request Leak
            </Link>
            <Link href="/dashboard" className="hover:text-neutral-900">
              Submit Leak
            </Link>
            <Link href="/leaks" className="hover:text-neutral-900">
              View All
            </Link>
          </div>
        </div>
      </nav>

      {/* Header with Toggle */}
      <header className="max-w-4xl mx-auto px-6 pt-10 pb-6">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight drop-shadow-sm"
          style={{
            fontFamily:
              "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
          }}
        >
          Request a Leak
        </h1>
        <p className="text-neutral-700 mt-3 text-base">
          Tell the community what you would like verified. Others can support
          your request with likes.
        </p>

        {/* Toggle */}
        <div className="mt-8 inline-flex gap-2 bg-white border border-neutral-200 rounded-xl p-1.5 shadow-sm">
          <button
            onClick={() => setView("create")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              view === "create"
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Plus className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            Create Request
          </button>
          <button
            onClick={() => setView("browse")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              view === "browse"
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <List className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            Browse ({items.length})
          </button>
        </div>
      </header>

      {/* Content Area */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <AnimatePresence mode="wait">
          {view === "create" ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.form
                onSubmit={onSubmit}
                className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-8 space-y-5"
                animate={submitting ? { opacity: 0.6 } : { opacity: 1 }}
              >
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Request title (e.g., 'Expense report from Dept X, FY 2024')"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  disabled={submitting}
                />
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide context: What email/domain/source is relevant? Why does it matter? Any constraints or hints for provers?"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm min-h-[140px] focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent resize-none"
                  disabled={submitting}
                />
                <div className="flex justify-end pt-2">
                  <FeatureButton
                    label={submitting ? "Submitting…" : "Submit Request"}
                    icon={ArrowRightIcon}
                    onClick={() => {}}
                  />
                  <button
                    type="submit"
                    className="hidden"
                    disabled={!canSubmit}
                  />
                </div>
              </motion.form>

              {/* Success message */}
              <AnimatePresence>
                {justSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-800">
                      Request submitted! Redirecting to browse view...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {items.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
                  <p className="text-neutral-600 mb-4">
                    No requests yet. Be the first to create one!
                  </p>
                  <button
                    onClick={() => setView("create")}
                    className="text-sm text-neutral-900 font-medium underline underline-offset-4"
                  >
                    Create a request
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((req, index) => (
                    <motion.article
                      key={req.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      className="bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-semibold">{req.title}</h3>
                          <p className="text-sm text-neutral-700 leading-relaxed">
                            {req.details}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Requested {new Date(req.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <motion.button
                            type="button"
                            onClick={() => onLike(req.id)}
                            disabled={!!liking[req.id]}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 px-3 py-2 text-sm transition disabled:opacity-60"
                            title="Support this request"
                          >
                            <Heart className="w-4 h-4" />
                            <span>{req.likes}</span>
                          </motion.button>

                          <FeatureButton
                            label="Follow"
                            icon={ArrowRightIcon}
                            onClick={() => console.log("follow", req.id)}
                          />
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="text-center text-sm text-neutral-500 mt-10 pb-8">
        © {new Date().getFullYear()} Obscura — Private. Proven. Minimal.
      </footer>
    </main>
  );
}
