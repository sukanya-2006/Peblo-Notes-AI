"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Sparkles,
  Trash2,
  Archive,
  Share2,
  Tag,
  Check,
  X,
  Clock,
  Link2,
} from "lucide-react";

export default function NotesEditor({
  note,
  onChange,
  onDelete,
  onArchive,
  onShare,
  onGenerateAI,
  saving,
}) {
  const [tagInput, setTagInput] =
    useState("");

  const [showTagInput, setShowTagInput] =
    useState(false);

  const [shareToast, setShareToast] =
    useState(false);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [contentFocused, setContentFocused] =
    useState(false);

  const handleAddTag = () => {
    const cleaned = tagInput
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (
      !cleaned ||
      note.tags?.includes(cleaned)
    ) {
      setTagInput("");
      setShowTagInput(false);
      return;
    }

    onChange({
      ...note,
      tags: [
        ...(note.tags || []),
        cleaned,
      ],
    });

    setTagInput("");
    setShowTagInput(false);
  };

  const handleRemoveTag = (tag) => {
    onChange({
      ...note,
      tags: note.tags.filter(
        (t) => t !== tag
      ),
    });
  };

  const handleShare = async () => {
    const url = await onShare(note.id);

    if (url) {
      setShareToast(true);

      setTimeout(() => {
        setShareToast(false);
      }, 3000);
    }
  };

  const handleAI = async () => {
    setAiLoading(true);

    await onGenerateAI(note);

    setAiLoading(false);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  const wordCount = (
    note.content || ""
  )
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const charCount = (
    note.content || ""
  ).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-black">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] bg-black/90 backdrop-blur-sm shrink-0">
        {/* LEFT */}
        <div className="flex items-center gap-2 text-white/25 text-xs">
          <Clock size={11} />

          {saving ? (
            <motion.span
              key="saving"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="text-white/60"
            >
              Saving…
            </motion.span>
          ) : (
            <span>
              Edited{" "}
              {formatDate(
                note.updatedAt ||
                  new Date()
              )}
            </span>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {shareToast && (
              <motion.span
                initial={{
                  opacity: 0,
                  x: 6,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 6,
                }}
                className="text-xs text-green-400 mr-1 flex items-center gap-1.5"
              >
                <Link2 size={11} />
                Link copied
              </motion.span>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-1 py-1">
            <ToolbarBtn
              icon={<Share2 size={14} />}
              label="Share"
              onClick={handleShare}
              variant={
                note.isPublic
                  ? "active"
                  : "default"
              }
            />

            <ToolbarBtn
              icon={<Archive size={14} />}
              label={
                note.archived
                  ? "Unarchive"
                  : "Archive"
              }
              onClick={() =>
                onArchive(
                  note.id,
                  !note.archived
                )
              }
            />

            <div className="w-px h-4 bg-white/[0.08] mx-0.5" />

            <ToolbarBtn
              icon={<Trash2 size={14} />}
              label="Delete"
              onClick={() =>
                onDelete(note.id)
              }
              variant="danger"
            />
          </div>

          {/* AI BUTTON */}
          <button
            onClick={handleAI}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50"
          >
            <Sparkles
              size={14}
              className={
                aiLoading
                  ? "animate-pulse"
                  : ""
              }
            />

            {aiLoading
              ? "Analyzing..."
              : "AI Insights"}
          </button>
        </div>
      </div>

      {/* WRITING AREA */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-10 lg:px-16 py-14">
          {/* TITLE */}
          <div className="mb-8">
            <input
              type="text"
              value={note.title || ""}
              onChange={(e) =>
                onChange({
                  ...note,
                  title:
                    e.target.value,
                })
              }
              placeholder="Untitled"
              className="w-full bg-transparent text-5xl lg:text-6xl font-bold text-white placeholder-white/10 outline-none leading-[1] tracking-[-0.05em]"
            />
          </div>

          {/* TAGS */}
          <div className="flex flex-wrap items-center gap-2 mb-10 min-h-[28px]">
            <AnimatePresence mode="popLayout">
              {(note.tags || []).map(
                (tag) => (
                  <motion.span
                    key={tag}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[12px] text-white/60"
                  >
                    #{tag}

                    <button
                      onClick={() =>
                        handleRemoveTag(
                          tag
                        )
                      }
                      className="text-white/20 hover:text-white/60 transition-all"
                    >
                      <X size={10} />
                    </button>
                  </motion.span>
                )
              )}
            </AnimatePresence>

            {/* TAG INPUT */}
            <AnimatePresence mode="wait">
              {showTagInput ? (
                <motion.div
                  key="input"
                  initial={{
                    opacity: 0,
                    width: 0,
                  }}
                  animate={{
                    opacity: 1,
                    width: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    width: 0,
                  }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <input
                    autoFocus
                    value={tagInput}
                    onChange={(e) =>
                      setTagInput(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      )
                        handleAddTag();

                      if (
                        e.key ===
                        "Escape"
                      ) {
                        setShowTagInput(
                          false
                        );

                        setTagInput(
                          ""
                        );
                      }
                    }}
                    placeholder="tag-name"
                    className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-1.5 text-[12px] text-white/70 placeholder-white/20 outline-none w-28"
                  />

                  <button
                    onClick={
                      handleAddTag
                    }
                    className="text-white/40 hover:text-white transition-all"
                  >
                    <Check size={13} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="btn"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  onClick={() =>
                    setShowTagInput(
                      true
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] text-white/25 hover:text-white/60 border border-dashed border-white/[0.08] hover:border-white/[0.16] transition-all"
                >
                  <Tag size={11} />
                  Add tag
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* DIVIDER */}
          <div className="w-full h-px bg-white/[0.06] mb-10" />

          {/* CONTENT */}
          <textarea
            value={note.content || ""}
            onChange={(e) =>
              onChange({
                ...note,
                content:
                  e.target.value,
              })
            }
            onFocus={() =>
              setContentFocused(true)
            }
            onBlur={() =>
              setContentFocused(false)
            }
            placeholder="Start writing your thoughts..."
            className="w-full bg-transparent text-white/75 placeholder-white/10 outline-none resize-none text-[17px] leading-[2] min-h-[500px] font-normal"
          />

          {/* COUNTER */}
          <AnimatePresence>
            {contentFocused && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 4,
                }}
                className="flex gap-4 mt-5 text-[11px] text-white/20"
              >
                <span>
                  {wordCount} words
                </span>

                <span>
                  {charCount} characters
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI SUMMARY */}
          <AnimatePresence>
            {note.summary && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 8,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="mt-14 bg-[#0F0F0F] border border-white/[0.06] rounded-[32px] overflow-hidden"
              >
                <div className="p-7">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Sparkles
                        size={13}
                        className="text-blue-400"
                      />
                    </div>

                    <p className="text-blue-400 text-[10px] font-semibold uppercase tracking-[0.22em]">
                      AI Summary
                    </p>
                  </div>

                  <p className="text-white/65 text-[15px] leading-[1.9] mb-6">
                    {note.summary}
                  </p>

                  {note.actionItems
                    ?.length > 0 && (
                    <div className="space-y-3 pt-5 border-t border-white/[0.06]">
                      <p className="text-white/20 text-[10px] uppercase tracking-[0.22em] font-medium mb-3">
                        Action Items
                      </p>

                      {note.actionItems.map(
                        (
                          item,
                          i
                        ) => (
                          <motion.div
                            key={i}
                            initial={{
                              opacity: 0,
                              x: -5,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            transition={{
                              delay:
                                i *
                                0.05,
                            }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />

                            <span className="text-white/55 text-[14px] leading-relaxed">
                              {item}
                            </span>
                          </motion.div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({
  icon,
  label,
  onClick,
  variant = "default",
}) {
  const styles = {
    default:
      "text-white/30 hover:text-white/80 hover:bg-white/[0.06]",

    active:
      "text-green-400 hover:bg-white/[0.06]",

    danger:
      "text-white/30 hover:text-red-400 hover:bg-red-500/[0.08]",
  };

  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-2 rounded-xl transition-all duration-150 ${styles[variant]}`}
    >
      {icon}
    </button>
  );
}