"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, Tag, Archive, TrendingUp } from "lucide-react";

export default function ActivityCard({ notes }) {
  const totalNotes = notes.length;
  const archivedNotes = notes.filter((n) => n.archived).length;
  const aiUsedNotes = notes.filter((n) => n.aiUsed).length;
  const recentNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  const tagMap = {};
  notes.forEach((n) => (n.tags || []).forEach((t) => { tagMap[t] = (tagMap[t] || 0) + 1; }));
  const topTags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString("en-US", { weekday: "short" }), date: d.toDateString(), count: 0 };
  });
  notes.forEach((n) => { const d = new Date(n.updatedAt).toDateString(); const b = last7.find((x) => x.date === d); if (b) b.count++; });
  const maxCount = Math.max(...last7.map((b) => b.count), 1);

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="h-full overflow-y-auto px-10 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Insights</h1>
        <p className="text-[#4B4B60] text-sm mb-8">Overview of your notes workspace</p>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<FileText size={18} />} label="Total Notes" value={totalNotes} color="#7C3AED" />
          <StatCard icon={<Sparkles size={18} />} label="AI Insights Used" value={aiUsedNotes} color="#059669" />
          <StatCard icon={<Archive size={18} />} label="Archived" value={archivedNotes} color="#D97706" />
          <StatCard icon={<Tag size={18} />} label="Unique Tags" value={Object.keys(tagMap).length} color="#DB2777" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111115] border border-[#1E1E26] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={15} className="text-[#7C3AED]" />
              <h2 className="text-white font-semibold text-sm">Weekly Activity</h2>
            </div>
            <div className="flex items-end gap-2 h-24">
              {last7.map((bucket, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(bucket.count / maxCount) * 80}px` }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="w-full bg-[#7C3AED]/40 hover:bg-[#7C3AED] rounded-md transition-colors min-h-[4px]"
                  />
                  <span className="text-[#4B4B60] text-[10px]">{bucket.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111115] border border-[#1E1E26] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Tag size={15} className="text-[#7C3AED]" />
              <h2 className="text-white font-semibold text-sm">Top Tags</h2>
            </div>
            {topTags.length === 0 ? (
              <p className="text-[#4B4B60] text-sm">No tags yet.</p>
            ) : (
              <div className="space-y-2">
                {topTags.map(([tag, count], i) => (
                  <div key={tag} className="flex items-center gap-3">
                    <span className="text-[#A78BFA] text-xs w-20 truncate">#{tag}</span>
                    <div className="flex-1 bg-[#1A1A22] rounded-full h-1.5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(count / topTags[0][1]) * 100}%` }} transition={{ delay: i * 0.05, duration: 0.4 }} className="h-full bg-[#7C3AED] rounded-full" />
                    </div>
                    <span className="text-[#4B4B60] text-xs w-4 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#111115] border border-[#1E1E26] rounded-2xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4">Recently Edited</h2>
          {recentNotes.length === 0 ? (
            <p className="text-[#4B4B60] text-sm">No notes yet.</p>
          ) : (
            <div className="space-y-1">
              {recentNotes.map((note, i) => (
                <motion.div key={note.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1A1A22] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                    <span className="text-[#C0C0D0] text-sm">{note.title || "Untitled Note"}</span>
                    {note.aiUsed && <span className="text-[10px] text-[#7C3AED]">✦ AI</span>}
                  </div>
                  <span className="text-[#4B4B60] text-xs">{formatDate(note.updatedAt)}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} className="bg-[#111115] border border-[#1E1E26] rounded-2xl p-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-[#4B4B60] text-xs">{label}</p>
    </motion.div>
  );
}