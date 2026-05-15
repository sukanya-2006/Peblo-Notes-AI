/**
 * actions/notes.js
 *
 * Centralized data access layer for Peblo Notes.
 * All API communication flows through here — components never call fetch() directly.
 *
 * Functions:
 *   fetchNotes(filters)          → Note[]
 *   createNote(fields)           → Note
 *   updateNote(id, fields)       → Note
 *   deleteNote(id)               → { message }
 *   shareNote(id)                → { note, shareUrl }
 *   generateAISummary(note)      → { summary, actionItems, suggestedTitle }
 *   saveAIResults(id, aiData)    → Note
 */

// ─── Internal helper ──────────────────────────────────────────────────────────

/**
 * Thin wrapper around fetch that:
 *  - Sets JSON headers automatically for non-GET requests
 *  - Throws a descriptive error when the server responds with a non-2xx status
 *  - Returns the parsed JSON body
 */
async function apiFetch(url, options = {}) {
    const { body, ...rest } = options;

    const init = {
        ...rest,
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...options.headers,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const res = await fetch(url, init);

    if (!res.ok) {
        let message = `API error ${res.status}`;
        try {
            const err = await res.json();
            if (err?.error) message = err.error;
        } catch {
            // response body wasn't JSON — keep the status message
        }
        throw new Error(message);
    }

    return res.json();
}

// ─── Notes CRUD ───────────────────────────────────────────────────────────────

/**
 * Fetch all notes, optionally filtered by search text, tag, or archived status.
 *
 * @param {{ search?: string, tag?: string, archived?: boolean }} filters
 * @returns {Promise<Note[]>}
 */
export async function fetchNotes({ search = "", tag = "", archived = false } = {}) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    if (archived) params.set("archived", "true");

    const data = await apiFetch(`/api/notes?${params}`);
    return Array.isArray(data) ? data : [];
}

/**
 * Create a new blank note.
 *
 * @param {{ title?: string, content?: string }} fields
 * @returns {Promise<Note>}
 */
export async function createNote({ title = "Untitled Note", content = "" } = {}) {
    return apiFetch("/api/notes", {
        method: "POST",
        body: { title, content },
    });
}

/**
 * Partially update a note. Only the fields present in `fields` are sent.
 *
 * @param {string} id
 * @param {Partial<Note>} fields  e.g. { title, content, tags, archived, isPublic, ... }
 * @returns {Promise<Note>}
 */
export async function updateNote(id, fields) {
    if (!id) throw new Error("updateNote: note id is required");
    return apiFetch("/api/notes", {
        method: "PATCH",
        body: { id, ...fields },
    });
}

/**
 * Delete a note by id.
 *
 * @param {string} id
 * @returns {Promise<{ message: string }>}
 */
export async function deleteNote(id) {
    if (!id) throw new Error("deleteNote: note id is required");
    return apiFetch("/api/notes", {
        method: "DELETE",
        body: { id },
    });
}

/**
 * Make a note public and copy its share URL to the clipboard.
 * Returns the updated note and the generated share URL.
 *
 * @param {string} id
 * @returns {Promise<{ note: Note, shareUrl: string }>}
 */
export async function shareNote(id) {
    if (!id) throw new Error("shareNote: note id is required");

    const note = await updateNote(id, { isPublic: true });
    const shareUrl = `${window.location.origin}/share/${note.shareId}`;

    try {
        await navigator.clipboard.writeText(shareUrl);
    } catch {
        // Clipboard API unavailable (non-HTTPS dev env) — silently skip
        console.warn("[shareNote] Clipboard write failed; copy manually:", shareUrl);
    }

    return { note, shareUrl };
}

// ─── AI ───────────────────────────────────────────────────────────────────────

/**
 * Send a note to the AI route and get back a structured analysis.
 *
 * @param {{ title?: string, content: string }} note
 * @returns {Promise<{ summary: string, actionItems: string[], suggestedTitle: string }>}
 */
export async function generateAISummary({ title = "", content }) {
    if (!content || content.trim().length < 20) {
        throw new Error("Note content is too short to analyze (minimum 20 characters)");
    }

    return apiFetch("/api/ai", {
        method: "POST",
        body: { title, content },
    });
}

/**
 * Persist the AI-generated results back onto the note record.
 *
 * @param {string} id
 * @param {{ summary: string, actionItems: string[], suggestedTitle: string }} aiData
 * @returns {Promise<Note>}
 */
export async function saveAIResults(id, { summary, actionItems, suggestedTitle }) {
    return updateNote(id, {
        summary,
        actionItems,
        suggestedTitle,
        aiUsed: true,
    });
}
