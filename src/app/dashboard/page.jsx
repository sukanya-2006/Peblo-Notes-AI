"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import Sidebar from "@/components/notes/NotesSidebar";
import NoteEditor from "@/components/notes/NotesEditor";
import AIDrawer from "@/components/ai/AIActionItems";
import InsightsDashboard from "@/components/dashboard/ActivityCard";

import { useAutosave } from "@/hooks/useAutosave";

import {
  fetchNotes as apiFetchNotes,
  createNote as apiCreateNote,
  updateNote,
  deleteNote as apiDeleteNote,
  shareNote as apiShareNote,
  generateAISummary,
  saveAIResults,
} from "@/actions/notes";

import {
  Menu,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const [notes, setNotes] = useState([]);

  const [activeNote, setActiveNote] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [selectedTag, setSelectedTag] =
    useState("");

  const [showArchived, setShowArchived] =
    useState(false);

  const [aiDrawerOpen, setAiDrawerOpen] =
    useState(false);

  const [aiData, setAiData] =
    useState(null);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [view, setView] =
    useState("notes");

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  // LOAD NOTES
  const loadNotes = useCallback(
    async () => {
      try {
        const data =
          await apiFetchNotes({
            search,
            tag: selectedTag,
            archived:
              showArchived,
          });

        setNotes(data);
      } catch (err) {
        console.error(
          "[fetchNotes]",
          err
        );
      }
    },
    [
      search,
      selectedTag,
      showArchived,
    ]
  );

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // AUTOSAVE
  const patchNote = useCallback(
    async (note) => {
      const saved =
        await updateNote(note.id, {
          title: note.title,
          content:
            note.content,
          tags: note.tags,
        });

      if (saved?.id) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === saved.id
              ? saved
              : n
          )
        );

        setActiveNote((prev) =>
          prev?.id === saved.id
            ? {
                ...saved,
                ...prev,
                updatedAt:
                  saved.updatedAt,
              }
            : prev
        );
      }
    },
    []
  );

  const { saving } = useAutosave(
    activeNote,
    patchNote,
    1000
  );

  // LOCAL CHANGE
  const handleNoteChange =
    useCallback((updatedNote) => {
      setActiveNote(updatedNote);

      setNotes((prev) =>
        prev.map((n) =>
          n.id === updatedNote.id
            ? {
                ...n,
                ...updatedNote,
              }
            : n
        )
      );
    }, []);

  // CREATE
  const createNote = async () => {
    try {
      const note =
        await apiCreateNote();

      setNotes((prev) => [
        note,
        ...prev,
      ]);

      setActiveNote(note);

      setView("notes");

      setMobileSidebarOpen(false);
    } catch (err) {
      console.error(
        "[createNote]",
        err
      );
    }
  };

  // DELETE
  const deleteNote = async (
    id
  ) => {
    try {
      await apiDeleteNote(id);

      if (
        activeNote?.id === id
      ) {
        setActiveNote(null);
      }

      setNotes((prev) =>
        prev.filter(
          (n) => n.id !== id
        )
      );
    } catch (err) {
      console.error(
        "[deleteNote]",
        err
      );
    }
  };

  // ARCHIVE
  const archiveNote = async (
    id,
    archived
  ) => {
    try {
      await updateNote(id, {
        archived,
      });

      if (
        activeNote?.id === id
      ) {
        setActiveNote(null);
      }

      setNotes((prev) =>
        prev.filter(
          (n) => n.id !== id
        )
      );
    } catch (err) {
      console.error(
        "[archiveNote]",
        err
      );
    }
  };

  // SHARE
  const shareNote = async (
    id
  ) => {
    try {
      const {
        note,
        shareUrl,
      } = await apiShareNote(id);

      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? note
            : n
        )
      );

      setActiveNote((prev) =>
        prev?.id === id
          ? {
              ...prev,
              ...note,
            }
          : prev
      );

      return shareUrl;
    } catch (err) {
      console.error(
        "[shareNote]",
        err
      );
    }
  };

  // AI
  const generateAI = async (
    note
  ) => {
    if (
      !note?.content ||
      note.content.trim()
        .length < 20
    )
      return;

    setAiLoading(true);

    setAiDrawerOpen(true);

    setAiData(null);

    try {
      const data =
        await generateAISummary({
          title: note.title,
          content:
            note.content,
        });

      setAiData(data);

      await saveAIResults(
        note.id,
        data
      );

      setNotes((prev) =>
        prev.map((n) =>
          n.id === note.id
            ? {
                ...n,
                aiUsed: true,
              }
            : n
        )
      );
    } catch (err) {
      console.error(
        "[generateAI]",
        err
      );
    } finally {
      setAiLoading(false);
    }
  };

  // TAGS
  const allTags = [
    ...new Set(
      notes.flatMap(
        (n) => n.tags || []
      )
    ),
  ];

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setMobileSidebarOpen(
                false
              )
            }
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed lg:relative z-50 lg:z-0 h-full transition-transform duration-300 ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar
          notes={notes}
          activeNote={
            activeNote
          }
          setActiveNote={(
            note
          ) => {
            setActiveNote(
              note
            );

            setMobileSidebarOpen(
              false
            );
          }}
          onCreateNote={
            createNote
          }
          search={search}
          setSearch={setSearch}
          selectedTag={
            selectedTag
          }
          setSelectedTag={
            setSelectedTag
          }
          allTags={allTags}
          showArchived={
            showArchived
          }
          setShowArchived={
            setShowArchived
          }
          view={view}
          setView={setView}
        />
      </div>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* MOBILE TOPBAR */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-black shrink-0">
          <button
            onClick={() =>
              setMobileSidebarOpen(
                true
              )
            }
            className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center"
          >
            <Menu size={18} />
          </button>

          <p className="text-sm font-semibold tracking-tight">
            Peblo Notes
          </p>

          <button
            onClick={() =>
              setMobileSidebarOpen(
                false
              )
            }
            className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {view ===
          "insights" ? (
            <motion.div
              key="insights"
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.2,
              }}
              className="flex-1 overflow-y-auto"
            >
              <InsightsDashboard
                notes={notes}
              />
            </motion.div>
          ) : activeNote ? (
            <motion.div
              key={
                activeNote.id
              }
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <NoteEditor
                note={
                  activeNote
                }
                onChange={
                  handleNoteChange
                }
                onDelete={
                  deleteNote
                }
                onArchive={
                  archiveNote
                }
                onShare={
                  shareNote
                }
                onGenerateAI={
                  generateAI
                }
                saving={saving}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center"
            >
              <div className="w-20 h-20 rounded-[28px] bg-[#111111] border border-white/[0.06] flex items-center justify-center">
                <span className="text-4xl">
                  📝
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-[-0.04em] text-white mb-3">
                  Your workspace is
                  empty
                </h2>

                <p className="text-white/35 text-sm max-w-sm leading-relaxed">
                  Start writing
                  notes, ideas, and
                  thoughts inside
                  your Peblo
                  workspace.
                </p>
              </div>

              <button
                onClick={
                  createNote
                }
                className="mt-2 px-6 py-3 bg-white text-black rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
              >
                Create Note
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI DRAWER */}
      <AIDrawer
        open={aiDrawerOpen}
        onClose={() =>
          setAiDrawerOpen(
            false
          )
        }
        data={aiData}
        loading={aiLoading}
        onApplyTitle={(
          title
        ) => {
          if (activeNote)
            handleNoteChange({
              ...activeNote,
              title,
            });
        }}
      />
    </div>
  );
}