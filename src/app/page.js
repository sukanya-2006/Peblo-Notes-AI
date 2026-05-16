// export default function Home() {
//   return (
//     <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
//       <h1 className="text-5xl font-bold">
//         Peblo Notes
//       </h1>
//     </main>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, FileText, Share2, BarChart2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0C0C0E] text-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mb-12"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#7C3AED] flex items-center justify-center mb-6 shadow-lg shadow-[#7C3AED]/30">
          <span className="text-white text-3xl font-bold">P</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Peblo Notes
        </h1>
        <p className="text-[#6B6B80] text-lg max-w-md leading-relaxed">
          Your AI-powered notes workspace. Write, organize, and let AI summarize your thoughts.
        </p>
      </motion.div>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-3 justify-center mb-12"
      >
        {[
          { icon: <Sparkles size={14} />, label: "AI Summaries" },
          { icon: <FileText size={14} />, label: "Smart Notes" },
          { icon: <Share2 size={14} />, label: "Public Sharing" },
          { icon: <BarChart2 size={14} />, label: "Insights" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A22] border border-[#2A2A35] rounded-full text-sm text-[#9090A8]"
          >
            <span className="text-[#7C3AED]">{f.icon}</span>
            {f.label}
          </div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-4"
      >
        <button
          onClick={() => router.push("/auth/signup")}
          className="px-8 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#7C3AED]/25 hover:shadow-[#7C3AED]/40"
        >
          Get Started Free
        </button>
        <button
          onClick={() => router.push("/auth/login")}
          className="px-8 py-3.5 bg-[#1A1A22] hover:bg-[#222230] border border-[#2A2A35] text-white rounded-xl font-semibold text-sm transition-all"
        >
          Sign In
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-[#3B3B50] text-xs"
      >
        No credit card required · Free to use
      </motion.p>
    </main>
  );
}