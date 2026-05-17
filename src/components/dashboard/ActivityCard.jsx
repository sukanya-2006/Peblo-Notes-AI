"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Tag,
  Archive,
  TrendingUp,
} from "lucide-react";

export default function ActivityCard({ notes }) {
  const totalNotes = notes.length;
  const archivedNotes = notes.filter((n) => n.archived).length;
  const aiUsedNotes = notes.filter((n) => n.aiUsed).length;

  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const tagMap = {};

  notes.forEach((n) =>
    (n.tags || []).forEach((t) => {
      tagMap[t] = (tagMap[t] || 0) + 1;
    })
  );

  const topTags = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();

    d.setDate(d.getDate() - (6 - i));

    return {
      label: d.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: d.toDateString(),
      count: 0,
    };
  });

  notes.forEach((n) => {
    const d = new Date(n.updatedAt).toDateString();

    const b = last7.find((x) => x.date === d);

    if (b) b.count++;
  });

  const maxCount = Math.max(
    ...last7.map((b) => b.count),
    1
  );

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="h-full overflow-y-auto bg-black px-8 lg:px-12 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-[-0.05em] text-white mb-2">
            Workspace Insights
          </h1>

          <p className="text-white/35 text-sm max-w-lg leading-relaxed">
            Analytics and activity from your Peblo Notes workspace.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={<FileText size={18} />}
            label="Total Notes"
            value={totalNotes}
            accent="blue"
          />

          <StatCard
            icon={<Sparkles size={18} />}
            label="AI Insights"
            value={aiUsedNotes}
            accent="green"
          />

          <StatCard
            icon={<Archive size={18} />}
            label="Archived"
            value={archivedNotes}
            accent="orange"
          />

          <StatCard
            icon={<Tag size={18} />}
            label="Unique Tags"
            value={Object.keys(tagMap).length}
            accent="red"
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          {/* WEEKLY ACTIVITY */}
          <div className="bg-[#0B0B0B] border border-white/[0.06] rounded-[28px] p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp
                size={15}
                className="text-blue-400"
              />

              <h2 className="text-white font-semibold text-sm">
                Weekly Activity
              </h2>
            </div>

            <div className="flex items-end gap-3 h-28">
              {last7.map((bucket, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${
                        (bucket.count / maxCount) * 90
                      }px`,
                    }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.4,
                    }}
                    className="w-full rounded-xl bg-white/80 hover:bg-white transition-all min-h-[6px]"
                  />

                  <span className="text-white/25 text-[10px]">
                    {bucket.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TAGS */}
          <div className="bg-[#0B0B0B] border border-white/[0.06] rounded-[28px] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Tag
                size={15}
                className="text-orange-300"
              />

              <h2 className="text-white font-semibold text-sm">
                Top Tags
              </h2>
            </div>

            {topTags.length === 0 ? (
              <p className="text-white/35 text-sm">
                No tags yet.
              </p>
            ) : (
              <div className="space-y-4">
                {topTags.map(([tag, count], i) => (
                  <div
                    key={tag}
                    className="flex items-center gap-3"
                  >
                    <span className="text-white/70 text-xs w-20 truncate">
                      #{tag}
                    </span>

                    <div className="flex-1 bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (count / topTags[0][1]) * 100
                          }%`,
                        }}
                        transition={{
                          delay: i * 0.05,
                          duration: 0.4,
                        }}
                        className="h-full bg-orange-300 rounded-full"
                      />
                    </div>

                    <span className="text-white/30 text-xs w-4 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RECENT NOTES */}
        <div className="bg-[#0B0B0B] border border-white/[0.06] rounded-[28px] p-6">
          <h2 className="text-white font-semibold text-sm mb-5">
            Recently Edited
          </h2>

          {recentNotes.length === 0 ? (
            <p className="text-white/35 text-sm">
              No notes yet.
            </p>
          ) : (
            <div className="space-y-2">
              {recentNotes.map((note, i) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.04,
                  }}
                  className="flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-white/[0.03] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70" />

                    <span className="text-white/80 text-sm">
                      {note.title || "Untitled Note"}
                    </span>

                    {note.aiUsed && (
                      <span className="text-[10px] text-green-400">
                        ✦ AI
                      </span>
                    )}
                  </div>

                  <span className="text-white/25 text-xs">
                    {formatDate(note.updatedAt)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}) {
  const colors = {
    blue: "text-blue-400 bg-blue-500/10",
    green: "text-green-400 bg-green-500/10",
    orange: "text-orange-300 bg-orange-500/10",
    red: "text-red-400 bg-red-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-[#0B0B0B] border border-white/[0.06] rounded-[28px] p-6"
    >
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 ${colors[accent]}`}
      >
        {icon}
      </div>

      <p className="text-4xl font-bold tracking-[-0.04em] text-white mb-1">
        {value}
      </p>

      <p className="text-white/35 text-sm">
        {label}
      </p>
    </motion.div>
  );
}