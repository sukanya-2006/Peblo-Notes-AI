"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  X,
  Sparkles,
  ListChecks,
  Type,
  Check,
  ChevronRight,
  Brain,
} from "lucide-react";

export default function AIActionItems({
  open,
  onClose,
  data,
  loading,
  onApplyTitle,
}) {
  const [checked, setChecked] = useState({});
  const [titleApplied, setTitleApplied] =
    useState(false);

  const toggleCheck = (i) =>
    setChecked((prev) => ({
      ...prev,
      [i]: !prev[i],
    }));

  const handleApplyTitle = (title) => {
    onApplyTitle(title);

    setTitleApplied(true);

    setTimeout(() => {
      setTitleApplied(false);
    }, 2500);
  };

  const completedCount = Object.values(
    checked
  ).filter(Boolean).length;

  const totalItems =
    data?.actionItems?.length || 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* DRAWER */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 260,
            }}
            className="fixed right-0 top-0 h-full w-full max-w-[430px] z-50 flex flex-col overflow-hidden bg-[#090909] border-l border-white/[0.06]"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Brain
                    size={18}
                    className="text-white"
                  />
                </div>

                <div>
                  <p className="text-white text-[15px] font-semibold tracking-tight">
                    AI Insights
                  </p>

                  <p className="text-white/25 text-[11px] mt-0.5">
                    Peblo analysis engine
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* LOADING */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-6 py-24"
                >
                  <div className="w-16 h-16 rounded-[24px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Sparkles
                      size={22}
                      className="text-white animate-pulse"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-white/70 text-sm font-medium">
                      Analyzing your note
                    </p>

                    <p className="text-white/25 text-xs mt-1">
                      Generating summary and
                      action items...
                    </p>
                  </div>

                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          opacity: [0.2, 1, 0.2],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-white"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* RESULTS */}
              {!loading && data && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  {/* SUMMARY */}
                  {data.summary && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="bg-[#0F0F0F] border border-white/[0.06] rounded-[28px] p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Sparkles
                            size={12}
                            className="text-blue-400"
                          />
                        </div>

                        <span className="text-blue-400 text-[10px] uppercase tracking-[0.2em] font-semibold">
                          Summary
                        </span>
                      </div>

                      <p className="text-white/70 text-[14px] leading-[1.9]">
                        {data.summary}
                      </p>
                    </motion.div>
                  )}

                  {/* ACTION ITEMS */}
                  {data.actionItems?.length >
                    0 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="bg-[#0F0F0F] border border-white/[0.06] rounded-[28px] overflow-hidden"
                    >
                      {/* HEADER */}
                      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <ListChecks
                              size={12}
                              className="text-green-400"
                            />
                          </div>

                          <span className="text-green-400 text-[10px] uppercase tracking-[0.2em] font-semibold">
                            Action Items
                          </span>
                        </div>

                        <span className="text-white/25 text-xs">
                          {completedCount}/
                          {totalItems}
                        </span>
                      </div>

                      {/* ITEMS */}
                      <div className="p-4 space-y-2">
                        {data.actionItems.map(
                          (item, i) => (
                            <motion.button
                              key={i}
                              initial={{
                                opacity: 0,
                                y: 5,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                delay:
                                  i * 0.05,
                              }}
                              onClick={() =>
                                toggleCheck(i)
                              }
                              className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all ${
                                checked[i]
                                  ? "bg-green-500/[0.06] border border-green-500/[0.12]"
                                  : "hover:bg-white/[0.03]"
                              }`}
                            >
                              <div
                                className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                  checked[i]
                                    ? "bg-green-500 border-green-500"
                                    : "border-white/[0.12]"
                                }`}
                              >
                                <AnimatePresence>
                                  {checked[i] && (
                                    <motion.div
                                      initial={{
                                        scale: 0,
                                      }}
                                      animate={{
                                        scale: 1,
                                      }}
                                      exit={{
                                        scale: 0,
                                      }}
                                    >
                                      <Check
                                        size={10}
                                        className="text-white"
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <span
                                className={`text-[14px] leading-relaxed transition-all ${
                                  checked[i]
                                    ? "text-white/25 line-through"
                                    : "text-white/70"
                                }`}
                              >
                                {item}
                              </span>
                            </motion.button>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TITLE */}
                  {data.suggestedTitle && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="bg-[#0F0F0F] border border-white/[0.06] rounded-[28px] overflow-hidden"
                    >
                      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/[0.06]">
                        <div className="w-6 h-6 rounded-lg bg-orange-500/10 flex items-center justify-center">
                          <Type
                            size={12}
                            className="text-orange-300"
                          />
                        </div>

                        <span className="text-orange-300 text-[10px] uppercase tracking-[0.2em] font-semibold">
                          Suggested Title
                        </span>
                      </div>

                      <div className="p-6">
                        <p className="text-white text-[17px] font-medium leading-snug mb-5 tracking-tight">
                          “{data.suggestedTitle}”
                        </p>

                        <motion.button
                          whileHover={{
                            scale: 1.01,
                          }}
                          whileTap={{
                            scale: 0.98,
                          }}
                          onClick={() =>
                            handleApplyTitle(
                              data.suggestedTitle
                            )
                          }
                          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all ${
                            titleApplied
                              ? "bg-green-500/10 border border-green-500/20 text-green-400"
                              : "bg-white text-black hover:opacity-90"
                          }`}
                        >
                          <AnimatePresence
                            mode="wait"
                          >
                            {titleApplied ? (
                              <motion.span
                                key="done"
                                initial={{
                                  opacity: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                }}
                                className="flex items-center gap-2"
                              >
                                <Check size={14} />
                                Applied
                              </motion.span>
                            ) : (
                              <motion.span
                                key="apply"
                                initial={{
                                  opacity: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                }}
                                className="flex items-center gap-2"
                              >
                                Apply Title
                                <ChevronRight
                                  size={14}
                                />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* EMPTY */}
              {!loading && !data && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-5 py-24 text-center"
                >
                  <div className="w-16 h-16 rounded-[24px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <Brain
                      size={22}
                      className="text-white/20"
                    />
                  </div>

                  <div>
                    <p className="text-white/50 text-sm font-medium">
                      No insights yet
                    </p>

                    <p className="text-white/20 text-xs mt-2 leading-relaxed max-w-[260px]">
                      Generate AI insights from
                      your notes to get summaries,
                      action items, and title
                      suggestions.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* FOOTER */}
            <div className="px-5 py-4 border-t border-white/[0.06] shrink-0">
              <p className="text-white/15 text-[11px] text-center">
                AI results are generated from
                your note content
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}