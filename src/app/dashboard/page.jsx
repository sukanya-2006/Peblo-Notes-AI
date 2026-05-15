"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function DashboardPage() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [view, setView] = useState("notes"); // "notes" | "insights"


  const loadNotes = useCallback(async () => {
    try {
      const data = await apiFetchNotes({ search, tag: selectedTag, archived: showArchived });
      setNotes(data);
    } catch (err) {
      console.error("[fetchNotes]", err);
    }
  }, [search, selectedTag, showArchived]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // ── Autosave ──────────────────────────────────────────────────────────────
  // patchNote: pure network call — the autosave hook owns debounce + dirty check
  const patchNote = useCallback(async (note) => {
    const saved = await updateNote(note.id, {
      title: note.title,
      content: note.content,
      tags: note.tags,
    });
    if (saved?.id) {
      setNotes((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
      setActiveNote((prev) =>
        prev?.id === saved.id
          ? { ...saved, ...prev, updatedAt: saved.updatedAt }
          : prev
      );
    }
  }, []);

  const { saving } = useAutosave(activeNote, patchNote, 1000);

  // handleNoteChange — only owns local state; the hook handles persistence
  const handleNoteChange = useCallback((updatedNote) => {
    setActiveNote(updatedNote);
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? { ...n, ...updatedNote } : n))
    );
  }, []);

  const createNote = async () => {
    try {
      const note = await apiCreateNote();
      setNotes((prev) => [note, ...prev]);
      setActiveNote(note);
      setView("notes");
    } catch (err) {
      console.error("[createNote]", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await apiDeleteNote(id);
      if (activeNote?.id === id) setActiveNote(null);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("[deleteNote]", err);
    }
  };

  const archiveNote = async (id, archived) => {
    try {
      await updateNote(id, { archived });
      if (activeNote?.id === id) setActiveNote(null);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("[archiveNote]", err);
    }
  };

  const shareNote = async (id) => {
    try {
      const { note, shareUrl } = await apiShareNote(id);
      setNotes((prev) => prev.map((n) => (n.id === id ? note : n)));
      setActiveNote((prev) => prev?.id === id ? { ...prev, ...note } : prev);
      return shareUrl;
    } catch (err) {
      console.error("[shareNote]", err);
    }
  };

  const generateAI = async (note) => {
    if (!note?.content || note.content.trim().length < 20) return;
    setAiLoading(true);
    setAiDrawerOpen(true);
    setAiData(null);
    try {
      const data = await generateAISummary({ title: note.title, content: note.content });
      setAiData(data);
      await saveAIResults(note.id, data);
      // Reflect the AI badge in the sidebar immediately
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, aiUsed: true } : n))
      );
    } catch (err) {
      console.error("[generateAI]", err);
    } finally {
      setAiLoading(false);
    }
  };

  // All unique tags from all notes
  const allTags = [...new Set(notes.flatMap((n) => n.tags || []))];

  return (
    <div className="flex h-screen bg-[#0C0C0E] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        onCreateNote={createNote}
        search={search}
        setSearch={setSearch}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allTags={allTags}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
        view={view}
        setView={setView}
      />

      {/* Main area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "insights" ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto"
            >
              <InsightsDashboard notes={notes} />
            </motion.div>
          ) : activeNote ? (
            <motion.div
              key={activeNote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <NoteEditor
                note={activeNote}
                onChange={handleNoteChange}
                onDelete={deleteNote}
                onArchive={archiveNote}
                onShare={shareNote}
                onGenerateAI={generateAI}
                saving={saving}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#1A1A1F] flex items-center justify-center mb-2">
                <span className="text-3xl">📝</span>
              </div>
              <p className="text-[#6B6B80] text-lg font-medium">
                Select a note or create a new one
              </p>
              <button
                onClick={createNote}
                className="mt-2 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-medium transition-colors"
              >
                + New Note
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Drawer */}
      <AIDrawer
        open={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        data={aiData}
        loading={aiLoading}
        onApplyTitle={(title) => {
          if (activeNote) handleNoteChange({ ...activeNote, title });
        }}
      />
    </div>
  );
}