"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Archive, LayoutDashboard,
  FileText, Tag, X, StickyNote,
} from "lucide-react";

export default function NotesSidebar({
  notes, activeNote, setActiveNote, onCreateNote,
  search, setSearch, selectedTag, setSelectedTag,
  allTags, showArchived, setShowArchived, view, setView,
}) {
  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const truncate = (str, n) =>
    str && str.length > n ? str.slice(0, n) + "…" : str;

  return (
    <aside className="w-[272px] h-full flex flex-col bg-[#0f0f13] border-r border-white/[0.06] shrink-0 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* ── Brand Header ── */}
      <div className="relative flex items-center gap-3 px-4 pt-5 pb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-900/40 shrink-0">
          <StickyNote size={14} className="text-white" />
        </div>
        <div>
          <span className="text-white text-[14px] font-semibold tracking-tight leading-none">
            Peblo Notes
          </span>
          <p className="text-white/30 text-[10px] mt-0.5 leading-none">Your second brain</p>
        </div>
      </div>

      {/* ── Nav Tabs ── */}
      <div className="px-3 pb-3">
        <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.05]">
          <NavBtn
            icon={<FileText size={13} />}
            label="Notes"
            active={view === "notes"}
            onClick={() => setView("notes")}
          />
          <NavBtn
            icon={<LayoutDashboard size={13} />}
            label="Insights"
            active={view === "insights"}
            onClick={() => setView("insights")}
          />
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-3 pb-3">
        <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 ${search
          ? "bg-white/[0.07] border-violet-500/40 shadow-sm shadow-violet-900/20"
          : "bg-white/[0.04] border-white/[0.06] hover:border-white/[0.12]"
          }`}>
          <Search size={13} className="text-white/30 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="bg-transparent text-[13px] text-white/80 placeholder-white/20 outline-none w-full"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSearch("")}
                className="text-white/30 hover:text-white/70 transition-colors shrink-0"
              >
                <X size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Tags ── */}
      <AnimatePresence>
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3 overflow-hidden"
          >
            <p className="text-white/20 text-[10px] uppercase tracking-widest font-medium mb-2 px-1">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 ${selectedTag === tag
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                    : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/70 hover:border-white/[0.14]"
                    }`}
                >
                  <Tag size={9} />
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-4 pb-2">
        <span className="text-white/20 text-[10px] uppercase tracking-widest font-medium">
          {showArchived ? "Archived" : "All Notes"} · {notes.length}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowArchived(!showArchived)}
          title={showArchived ? "Show active notes" : "Show archived"}
          className={`p-1 rounded-md transition-colors ${showArchived
            ? "text-violet-400 bg-violet-500/10"
            : "text-white/20 hover:text-white/60"
            }`}
        >
          <Archive size={13} />
        </motion.button>
      </div>

      {/* ── Notes List ── */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-none">
        {notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-3 py-12 px-4"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <FileText size={16} className="text-white/20" />
            </div>
            <p className="text-white/25 text-xs text-center leading-relaxed">
              {search ? `No notes match "${search}"` : "No notes yet.\nCreate one to get started."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-0.5">
            {notes.map((note, i) => {
              const isActive = activeNote?.id === note.id;
              return (
                <motion.button
                  key={note.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: i * 0.03, ease: "easeOut" }}
                  onClick={() => { setActiveNote(note); setView("notes"); }}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                    ? "bg-violet-500/12 border border-violet-500/20"
                    : "hover:bg-white/[0.04] border border-transparent"
                    }`}
                >
                  {/* Active left accent bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-2 bottom-2 w-[3px] bg-gradient-to-b from-violet-400 to-violet-600 rounded-full"
                    />
                  )}

                  <div className="flex items-start justify-between gap-2 pl-1">
                    <p className={`text-[13px] font-medium leading-snug truncate flex-1 transition-colors ${isActive ? "text-white" : "text-white/60 group-hover:text-white/85"
                      }`}>
                      {note.title || "Untitled Note"}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      {note.aiUsed && (
                        <span className="text-[9px] text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-md border border-violet-500/20">
                          AI
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-white/25 text-[11.5px] mt-1 truncate pl-1 leading-snug">
                    {truncate(note.content, 50) || "Empty note"}
                  </p>

                  <div className="flex items-center justify-between mt-2 pl-1">
                    <div className="flex gap-1 flex-wrap">
                      {(note.tags || []).slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] text-violet-400/60 bg-violet-500/[0.08] px-1.5 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                      {(note.tags || []).length > 2 && (
                        <span className="text-[10px] text-white/20">+{note.tags.length - 2}</span>
                      )}
                    </div>
                    <span className="text-white/20 text-[10px] shrink-0">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── New Note Button ── */}
      <div className="p-3 border-t border-white/[0.05]">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNote}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all duration-200 relative overflow-hidden group bg-gradient-to-r from-violet-600 to-violet-500 shadow-lg shadow-violet-900/30 hover:shadow-violet-800/40"
        >
          <span className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.06] transition-colors duration-200 rounded-xl" />
          <Plus size={15} className="relative" />
          <span className="relative">New Note</span>
        </motion.button>
      </div>
    </aside>
  );
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${active
        ? "text-white"
        : "text-white/30 hover:text-white/60"
        }`}
    >
      {active && (
        <motion.div
          layoutId="navPill"
          className="absolute inset-0 bg-violet-500/20 border border-violet-500/25 rounded-lg"
        />
      )}
      <span className="relative flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </motion.button>
  );
}