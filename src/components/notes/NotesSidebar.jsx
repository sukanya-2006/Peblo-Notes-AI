"use client";

import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Plus,
  Archive,
  LayoutDashboard,
  FileText,
  Tag,
  X,
  StickyNote,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import {
  useEffect,
  useState,
} from "react";

export default function NotesSidebar({
  notes,
  activeNote,
  setActiveNote,
  onCreateNote,
  search,
  setSearch,
  selectedTag,
  setSelectedTag,
  allTags,
  showArchived,
  setShowArchived,
  view,
  setView,
}) {
  const [username, setUsername] =
    useState("Peblo User");

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUsername(
        user?.user_metadata
          ?.username ||
          "Peblo User"
      );
    }

    getUser();
  }, []);

  const formatDate = (d) => {
    if (!d) return "";

    const date = new Date(d);
    const now = new Date();

    const diff = now - date;

    const mins = Math.floor(
      diff / 60000
    );

    const hours = Math.floor(
      diff / 3600000
    );

    const days = Math.floor(
      diff / 86400000
    );

    if (mins < 1)
      return "Just now";

    if (mins < 60)
      return `${mins}m ago`;

    if (hours < 24)
      return `${hours}h ago`;

    if (days === 1)
      return "Yesterday";

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  };

  const truncate = (str, n) =>
    str && str.length > n
      ? str.slice(0, n) + "…"
      : str;

  return (
    <aside className="w-[310px] h-full flex flex-col bg-[#080808] border-r border-white/[0.06] shrink-0 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-6 pt-7 pb-6">
        <div className="w-11 h-11 rounded-2xl border border-white/[0.08] bg-[#111111] flex items-center justify-center shrink-0">
          <StickyNote
            size={16}
            className="text-white"
          />
        </div>

        <div>
          <span className="text-white text-[15px] font-semibold tracking-tight leading-none">
            {username}
          </span>

          <p className="text-white/25 text-[10px] mt-1 tracking-wide">
            Peblo Notes Workspace
          </p>
        </div>
      </div>

      {/* NAV */}
      <div className="px-4 pb-5">
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
          <NavBtn
            icon={<FileText size={13} />}
            label="Notes"
            active={view === "notes"}
            onClick={() =>
              setView("notes")
            }
          />

          <NavBtn
            icon={
              <LayoutDashboard
                size={13}
              />
            }
            label="Insights"
            active={
              view === "insights"
            }
            onClick={() =>
              setView("insights")
            }
          />
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-4 pb-5">
        <div className="flex items-center gap-2.5 px-3 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <Search
            size={13}
            className="text-white/25 shrink-0"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search notes..."
            className="bg-transparent text-[13px] text-white/80 placeholder-white/20 outline-none w-full"
          />

          <AnimatePresence>
            {search && (
              <motion.button
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                onClick={() =>
                  setSearch("")
                }
                className="text-white/25 hover:text-white/60 transition-all"
              >
                <X size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* TAGS */}
      <AnimatePresence>
        {allTags.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="px-4 pb-5 overflow-hidden"
          >
            <p className="text-white/20 text-[10px] uppercase tracking-[0.22em] font-medium mb-3 px-1">
              Tags
            </p>

            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() =>
                    setSelectedTag(
                      selectedTag ===
                        tag
                        ? ""
                        : tag
                    )
                  }
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all duration-200 ${
                    selectedTag ===
                    tag
                      ? "bg-white text-black"
                      : "bg-white/[0.03] border border-white/[0.06] text-white/45 hover:text-white/75"
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

      {/* SECTION */}
      <div className="flex items-center justify-between px-5 pb-3">
        <span className="text-white/20 text-[10px] uppercase tracking-[0.22em] font-medium">
          {showArchived
            ? "Archived"
            : "All Notes"}{" "}
          · {notes.length}
        </span>

        <motion.button
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.92,
          }}
          onClick={() =>
            setShowArchived(
              !showArchived
            )
          }
          className={`p-1.5 rounded-xl transition-all ${
            showArchived
              ? "text-orange-300 bg-orange-500/10"
              : "text-white/20 hover:text-white/60"
          }`}
        >
          <Archive size={13} />
        </motion.button>
      </div>

      {/* NOTES */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {notes.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="flex flex-col items-center justify-center gap-4 py-14 px-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <FileText
                size={18}
                className="text-white/20"
              />
            </div>

            <p className="text-white/25 text-xs text-center leading-relaxed">
              {search
                ? `No notes match "${search}"`
                : "No notes yet. Create one to get started."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {notes.map((note, i) => {
              const isActive =
                activeNote?.id ===
                note.id;

              return (
                <motion.button
                  key={note.id}
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
                      i * 0.03,
                  }}
                  onClick={() => {
                    setActiveNote(
                      note
                    );

                    setView(
                      "notes"
                    );
                  }}
                  className={`w-full text-left px-4 py-4 rounded-2xl border transition-all duration-200 ${
                    isActive
                      ? "bg-[#111111] border-white/[0.08]"
                      : "bg-[#090909] border-transparent hover:border-white/[0.08] hover:bg-[#101010]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-[13px] font-medium truncate flex-1 ${
                        isActive
                          ? "text-white"
                          : "text-white/65"
                      }`}
                    >
                      {note.title ||
                        "Untitled Note"}
                    </p>

                    {note.aiUsed && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/15">
                        AI
                      </span>
                    )}
                  </div>

                  <p className="text-white/30 text-[11.5px] mt-1.5 truncate leading-snug">
                    {truncate(
                      note.content,
                      50
                    ) ||
                      "Empty note"}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1 flex-wrap">
                      {(note.tags ||
                        [])
                        .slice(0, 2)
                        .map(
                          (
                            tag
                          ) => (
                            <span
                              key={
                                tag
                              }
                              className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.03] text-white/35"
                            >
                              #
                              {
                                tag
                              }
                            </span>
                          )
                        )}

                      {(note.tags ||
                        [])
                        .length >
                        2 && (
                        <span className="text-[10px] text-white/20">
                          +
                          {note
                            .tags
                            .length -
                            2}
                        </span>
                      )}
                    </div>

                    <span className="text-white/20 text-[10px]">
                      {formatDate(
                        note.updatedAt
                      )}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* NEW NOTE */}
      <div className="p-4 border-t border-white/[0.05]">
        <motion.button
          whileHover={{
            scale: 1.01,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={onCreateNote}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-black text-[13px] font-semibold transition-all duration-200 hover:opacity-90"
        >
          <Plus size={15} />

          <span>New Note</span>
        </motion.button>
      </div>
    </aside>
  );
}

function NavBtn({
  icon,
  label,
  active,
  onClick,
}) {
  return (
    <motion.button
      whileTap={{
        scale: 0.97,
      }}
      onClick={onClick}
      className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 ${
        active
          ? "bg-white text-black"
          : "text-white/30 hover:text-white/60"
      }`}
    >
      <span className="relative flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </motion.button>
  );
}