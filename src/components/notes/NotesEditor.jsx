"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Trash2, Archive, Share2, Tag,
  Check, X, Clock, Link2,
} from "lucide-react";

export default function NotesEditor({
  note, onChange, onDelete, onArchive, onShare, onGenerateAI, saving,
}) {
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [contentFocused, setContentFocused] = useState(false);

  const handleAddTag = () => {
    const cleaned = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!cleaned || note.tags?.includes(cleaned)) {
      setTagInput(""); setShowTagInput(false); return;
    }
    onChange({ ...note, tags: [...(note.tags || []), cleaned] });
    setTagInput("");
    setShowTagInput(false);
  };

  const handleRemoveTag = (tag) => {
    onChange({ ...note, tags: note.tags.filter((t) => t !== tag) });
  };

  const handleShare = async () => {
    const url = await onShare(note.id);
    if (url) { setShareToast(true); setTimeout(() => setShareToast(false), 3000); }
  };

  const handleAI = async () => {
    setAiLoading(true);
    await onGenerateAI(note);
    setAiLoading(false);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const wordCount = (note.content || "").trim().split(/\s+/).filter(Boolean).length;
  const charCount = (note.content || "").length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0c0c0f]">

      {/* ── Top Toolbar ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.05] shrink-0 bg-[#0f0f13]/80 backdrop-blur-sm">

        {/* Left — save status */}
        <div className="flex items-center gap-2 text-white/25 text-xs">
          <Clock size={11} />
          {saving ? (
            <motion.span
              key="saving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-violet-400"
            >
              Saving…
            </motion.span>
          ) : (
            <span>Edited {formatDate(note.updatedAt || new Date())}</span>
          )}
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1">
          <AnimatePresence>
            {shareToast && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                className="text-xs text-emerald-400 mr-2 flex items-center gap-1.5"
              >
                <Link2 size={11} /> Link copied
              </motion.span>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.06] rounded-xl px-1 py-1">
            <ToolbarBtn
              icon={<Share2 size={14} />}
              label="Share"
              onClick={handleShare}
              variant={note.isPublic ? "active" : "default"}
            />
            <ToolbarBtn
              icon={<Archive size={14} />}
              label={note.archived ? "Unarchive" : "Archive"}
              onClick={() => onArchive(note.id, !note.archived)}
            />
            <div className="w-px h-4 bg-white/[0.08] mx-0.5" />
            <ToolbarBtn
              icon={<Trash2 size={14} />}
              label="Delete"
              onClick={() => onDelete(note.id)}
              variant="danger"
            />
          </div>

          <button
            onClick={handleAI}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 ml-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-all duration-200 shadow-lg shadow-violet-900/30 hover:shadow-violet-800/40"
          >
            <Sparkles size={12} className={aiLoading ? "animate-pulse" : ""} />
            {aiLoading ? "Analyzing…" : "AI Insights"}
          </button>
        </div>
      </div>

      {/* ── Writing Area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10">

          {/* Title */}
          <div className="relative mb-6">
            <input
              type="text"
              value={note.title || ""}
              onChange={(e) => onChange({ ...note, title: e.target.value })}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              placeholder="Untitled"
              className="w-full bg-transparent text-4xl font-bold text-white placeholder-white/10 outline-none leading-tight tracking-tight"
              style={{ caretColor: "#7C3AED" }}
            />
            {/* Subtle underline that animates on focus */}
            <motion.div
              animate={{ scaleX: titleFocused ? 1 : 0, opacity: titleFocused ? 1 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500/60 via-violet-400/30 to-transparent origin-left"
            />
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2 mb-8 min-h-[28px]">
            <AnimatePresence mode="popLayout">
              {(note.tags || []).map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-lg text-[12px] text-violet-300/80 group"
                >
                  <span className="text-violet-400/50">#</span>{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-violet-400/30 hover:text-violet-300 transition-colors ml-0.5"
                  >
                    <X size={10} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {showTagInput ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-1.5 overflow-hidden"
                >
                  <input
                    autoFocus
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTag();
                      if (e.key === "Escape") { setShowTagInput(false); setTagInput(""); }
                    }}
                    placeholder="tag-name"
                    className="bg-violet-500/10 border border-violet-500/30 rounded-lg px-2.5 py-1 text-[12px] text-violet-200 placeholder-violet-400/30 outline-none w-28"
                    style={{ caretColor: "#7C3AED" }}
                  />
                  <button onClick={handleAddTag} className="text-violet-400 hover:text-white transition-colors">
                    <Check size={13} />
                  </button>
                  <button onClick={() => { setShowTagInput(false); setTagInput(""); }} className="text-white/20 hover:text-white/60 transition-colors">
                    <X size={13} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setShowTagInput(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] text-white/20 hover:text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/20 border border-dashed border-white/[0.08] transition-all duration-200"
                >
                  <Tag size={10} /> Add tag
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-white/[0.06] via-white/[0.04] to-transparent mb-8" />

          {/* Content area */}
          <div className="relative">
            <textarea
              value={note.content || ""}
              onChange={(e) => onChange({ ...note, content: e.target.value })}
              onFocus={() => setContentFocused(true)}
              onBlur={() => setContentFocused(false)}
              placeholder="Start writing your thoughts…"
              className="w-full bg-transparent text-white/75 placeholder-white/10 outline-none resize-none text-[15.5px] leading-[1.85] min-h-[420px] font-normal"
              style={{ caretColor: "#7C3AED" }}
            />
          </div>

          {/* Word / char count */}
          <AnimatePresence>
            {contentFocused && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex gap-4 mt-4 text-[11px] text-white/20"
              >
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── AI Summary Panel ── */}
          <AnimatePresence>
            {note.summary && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-10 relative overflow-hidden rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-950/40 via-[#0f0f18] to-[#0f0f18]"
              >
                {/* Glow accent */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="relative p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <Sparkles size={11} className="text-violet-400" />
                    </div>
                    <p className="text-violet-400 text-[11px] font-semibold uppercase tracking-widest">
                      AI Summary
                    </p>
                  </div>

                  <p className="text-white/55 text-[14px] leading-relaxed mb-4">
                    {note.summary}
                  </p>

                  {note.actionItems?.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                      <p className="text-white/25 text-[10px] uppercase tracking-widest font-medium mb-3">
                        Action Items
                      </p>
                      {note.actionItems.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500/60 mt-2 shrink-0" />
                          <span className="text-white/50 text-[13.5px] leading-relaxed">{item}</span>
                        </motion.div>
                      ))}
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

function ToolbarBtn({ icon, label, onClick, variant = "default" }) {
  const styles = {
    default: "text-white/30 hover:text-white/80 hover:bg-white/[0.06]",
    active: "text-emerald-400 hover:bg-white/[0.06]",
    danger: "text-white/30 hover:text-red-400 hover:bg-red-500/[0.08]",
  };
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-lg transition-all duration-150 ${styles[variant]}`}
    >
      {icon}
    </button>
  );
}