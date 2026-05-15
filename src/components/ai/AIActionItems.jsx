"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, ListChecks, Type,
  Loader2, Check, ChevronRight, Brain,
} from "lucide-react";

export default function AIActionItems({ open, onClose, data, loading, onApplyTitle }) {
  const [checked, setChecked] = useState({});
  const [titleApplied, setTitleApplied] = useState(false);

  const toggleCheck = (i) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const handleApplyTitle = (title) => {
    onApplyTitle(title);
    setTitleApplied(true);
    setTimeout(() => setTitleApplied(false), 2500);
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalItems = data?.actionItems?.length || 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50 flex flex-col overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #13131a 0%, #0e0e14 60%, #110e1a 100%)",
              borderLeft: "1px solid rgba(124,58,237,0.12)",
              boxShadow: "-24px 0 80px rgba(0,0,0,0.6), -1px 0 0 rgba(124,58,237,0.08)",
            }}
          >
            {/* Ambient top glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

            {/* ── Header ── */}
            <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/[0.05] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/30 to-violet-700/20 border border-violet-500/20 flex items-center justify-center">
                  <Brain size={15} className="text-violet-300" />
                </div>
                <div>
                  <p className="text-white text-[14px] font-semibold leading-none">AI Insights</p>
                  <p className="text-white/25 text-[11px] mt-0.5 leading-none">Powered by AI analysis</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-white/30 hover:text-white/80 hover:bg-white/[0.06] transition-all"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scrollbar-none">

              {/* Loading */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-5 py-20"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-700/10 border border-violet-500/20 flex items-center justify-center">
                      <Sparkles size={22} className="text-violet-400 animate-pulse" />
                    </div>
                    <div className="absolute -inset-1 rounded-2xl border border-violet-500/20 animate-ping opacity-30" />
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-[14px] font-medium">Analyzing your note</p>
                    <p className="text-white/25 text-[12px] mt-1">This takes just a moment…</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-violet-500"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {!loading && data && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >

                  {/* ── Summary Card ── */}
                  {data.summary && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-5"
                      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(15,15,24,0.9) 60%)" }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-5 h-5 rounded-md bg-violet-500/20 flex items-center justify-center">
                            <Sparkles size={10} className="text-violet-400" />
                          </div>
                          <span className="text-violet-400/80 text-[10px] font-semibold uppercase tracking-widest">
                            Summary
                          </span>
                        </div>
                        <p className="text-white/65 text-[13.5px] leading-[1.75]">{data.summary}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Action Items Card ── */}
                  {data.actionItems?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.12 }}
                      className="rounded-2xl border border-white/[0.07] overflow-hidden"
                      style={{ background: "rgba(15,15,20,0.8)" }}
                    >
                      {/* Card header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center">
                            <ListChecks size={10} className="text-emerald-400" />
                          </div>
                          <span className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">
                            Action Items
                          </span>
                        </div>
                        {/* Progress pill */}
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                              animate={{ width: `${totalItems > 0 ? (completedCount / totalItems) * 100 : 0}%` }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            />
                          </div>
                          <span className="text-white/25 text-[11px] tabular-nums">
                            {completedCount}/{totalItems}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="px-4 py-3 space-y-1">
                        {data.actionItems.map((item, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + i * 0.06, duration: 0.2 }}
                            onClick={() => toggleCheck(i)}
                            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 group ${checked[i]
                                ? "bg-emerald-500/[0.06] border border-emerald-500/[0.12]"
                                : "hover:bg-white/[0.04] border border-transparent"
                              }`}
                          >
                            <div className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${checked[i]
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-white/[0.15] group-hover:border-white/30"
                              }`}>
                              <AnimatePresence>
                                {checked[i] && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <Check size={10} className="text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <span className={`text-[13px] leading-relaxed transition-all duration-200 ${checked[i]
                                ? "text-white/25 line-through"
                                : "text-white/60 group-hover:text-white/80"
                              }`}>
                              {item}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Suggested Title Card ── */}
                  {data.suggestedTitle && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="rounded-2xl border border-white/[0.07] overflow-hidden"
                      style={{ background: "rgba(15,15,20,0.8)" }}
                    >
                      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
                        <div className="w-5 h-5 rounded-md bg-blue-500/15 flex items-center justify-center">
                          <Type size={10} className="text-blue-400" />
                        </div>
                        <span className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">
                          Suggested Title
                        </span>
                      </div>

                      <div className="p-4">
                        <p className="text-white/85 text-[15px] font-medium leading-snug mb-4 px-1">
                          "{data.suggestedTitle}"
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleApplyTitle(data.suggestedTitle)}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${titleApplied
                              ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400"
                              : "bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/20 hover:border-violet-500/35 text-violet-300"
                            }`}
                        >
                          <AnimatePresence mode="wait">
                            {titleApplied ? (
                              <motion.span
                                key="applied"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="flex items-center gap-2"
                              >
                                <Check size={13} strokeWidth={2.5} /> Applied!
                              </motion.span>
                            ) : (
                              <motion.span
                                key="apply"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="flex items-center gap-2"
                              >
                                Apply title <ChevronRight size={13} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                </motion.div>
              )}

              {/* Empty state */}
              {!loading && !data && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Brain size={22} className="text-white/20" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[14px] font-medium">No insights yet</p>
                    <p className="text-white/20 text-[12px] mt-1.5 leading-relaxed">
                      Click "AI Insights" on any note with content to generate a summary, action items, and a title suggestion.
                    </p>
                  </div>
                </motion.div>
              )}

            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-4 border-t border-white/[0.05] shrink-0">
              <p className="text-white/15 text-[11px] text-center">
                AI results are generated based on your note content
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}