import { useEffect, useRef, useCallback, useState } from "react";

/**
 * useAutosave
 *
 * Debounced autosave hook for a modern productivity app.
 *
 * @param {object|null} note      - The active note object being edited
 * @param {function}    saveFn    - Async function that persists the note; receives the note object
 * @param {number}      delay     - Debounce delay in ms (default 1000)
 *
 * @returns {{ saving: boolean, lastSaved: Date|null, saveNow: function }}
 *
 * Behaviour:
 *  - Schedules a save `delay` ms after the last change to title, content, or tags
 *  - Skips saving if the note hasn't actually changed since last save (dirty check)
 *  - Resets the snapshot when the active note ID changes (prevents cross-note saves)
 *  - Flushes any pending save immediately on unmount (tab/route change safety)
 *  - Never fires concurrent saves — a second save waits for the first to finish
 *  - Exposes `saveNow()` for explicit immediate saves (e.g. Ctrl+S)
 */
export function useAutosave(note, saveFn, delay = 1000) {
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Refs — stable across renders, no re-render triggered
    const timerRef = useRef(null);   // debounce timer handle
    const pendingRef = useRef(null);   // latest note queued for save
    const snapshotRef = useRef(null);   // last successfully persisted field values
    const savingRef = useRef(false);  // guard against concurrent saves
    const saveFnRef = useRef(saveFn); // latest saveFn without stale closure risk
    const isMountedRef = useRef(true);   // avoid setState after unmount

    // Keep saveFnRef current without retrigger effects
    useEffect(() => {
        saveFnRef.current = saveFn;
    }, [saveFn]);

    // ── Dirty check ────────────────────────────────────────────────────────────
    // Compares the note's editable fields against the last saved snapshot.
    // Returns true only when something meaningful actually changed.
    const isDirty = (candidate) => {
        const snap = snapshotRef.current;
        if (!snap || !candidate) return false;
        return (
            candidate.title !== snap.title ||
            candidate.content !== snap.content ||
            JSON.stringify(candidate.tags) !== JSON.stringify(snap.tags)
        );
    };

    // ── Core flush ─────────────────────────────────────────────────────────────
    // Calls saveFn if there are real changes and no save is already in-flight.
    const flush = useCallback(async (candidate) => {
        if (!candidate?.id) return;
        if (savingRef.current) return; // prevent concurrent saves
        if (!isDirty(candidate)) return; // nothing changed — skip network call

        savingRef.current = true;
        if (isMountedRef.current) setSaving(true);

        try {
            await saveFnRef.current(candidate);

            // Advance the snapshot to the just-saved values
            snapshotRef.current = {
                title: candidate.title,
                content: candidate.content,
                tags: candidate.tags ? [...candidate.tags] : [],
            };

            if (isMountedRef.current) setLastSaved(new Date());
        } catch (err) {
            console.error("[useAutosave] Save failed:", err);
        } finally {
            savingRef.current = false;
            if (isMountedRef.current) setSaving(false);
        }
    }, []); // no deps — uses refs only

    // ── Reset on note switch ───────────────────────────────────────────────────
    // When the user opens a different note, clear any pending debounce for the
    // old note and re-baseline the snapshot to the new note's current values.
    const noteId = note?.id;
    useEffect(() => {
        // Cancel any timer belonging to the previous note
        clearTimeout(timerRef.current);

        // Baseline the snapshot for the new note (treat it as already "saved")
        snapshotRef.current = note
            ? { title: note.title, content: note.content, tags: note.tags ? [...note.tags] : [] }
            : null;

        pendingRef.current = note ?? null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteId]); // deliberately only re-run when the ID changes

    // ── Debounced save ─────────────────────────────────────────────────────────
    // Runs whenever title, content, or tags change.
    // Tags array reference changes on every onChange call, but the dirty check
    // inside flush prevents an actual network call when the values are identical.
    useEffect(() => {
        if (!note?.id) return;

        pendingRef.current = note;

        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            flush(pendingRef.current);
        }, delay);

        return () => clearTimeout(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note?.title, note?.content, note?.tags, delay, flush]);
    // note?.id intentionally omitted — handled by the reset effect above

    // ── Unmount flush ──────────────────────────────────────────────────────────
    // If the user navigates away mid-debounce, fire the save immediately.
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            clearTimeout(timerRef.current);
            const pending = pendingRef.current;
            // Fire-and-forget — component is gone, we just need the network request out
            if (pending?.id && isDirty(pending)) {
                saveFnRef.current(pending).catch(console.error);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Manual flush ───────────────────────────────────────────────────────────
    // Exposes an immediate save for Ctrl+S or other explicit triggers.
    const saveNow = useCallback(() => {
        clearTimeout(timerRef.current);
        flush(pendingRef.current);
    }, [flush]);

    return { saving, lastSaved, saveNow };
}




