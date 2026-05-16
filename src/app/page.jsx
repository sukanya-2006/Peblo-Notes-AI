"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main
      className="min-h-screen overflow-hidden relative flex flex-col items-center justify-center px-6"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, #2d1b69 0%, #0f0a1e 50%, #0a0a0f 100%)" }}
    >
      {/* Stars — only render on client to avoid hydration mismatch */}
      {mounted && <Stars />}

      {/* Floating decorative notes */}
      {mounted && <FloatingNotes />}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">

        {/* Logo */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <div className="relative inline-flex">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", boxShadow: "0 0 40px rgba(124,58,237,0.4)" }}
            >
              <NoteIcon />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center"
              style={{ boxShadow: "0 0 12px rgba(251,191,36,0.8)" }}
            >
              <span style={{ fontSize: 8 }}>✦</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div {...fadeUp(0.1)} className="mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd" }}
          >
            <span style={{ color: "#a78bfa" }}>✦</span>
            AI-Powered Notes Workspace
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.15)}
          className="font-bold leading-tight mb-4"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", letterSpacing: "-0.03em", fontFamily: "'Georgia', serif" }}
        >
          Your ideas,{" "}
          <span style={{ background: "linear-gradient(135deg, #a78bfa, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            supercharged
          </span>{" "}
          by AI
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.2)}
          className="leading-relaxed mb-10 max-w-xl"
          style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1rem" }}
        >
          Write notes, let AI summarize them, organize with tags, and share your thoughts — all in one beautiful workspace built for curious minds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(0.25)} className="flex gap-4 mb-16 flex-wrap justify-center">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/auth/signup")}
            className="px-8 py-3.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: "0 8px 32px rgba(124,58,237,0.4)" }}
          >
            Start for free →
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/auth/login")}
            className="px-8 py-3.5 rounded-xl font-semibold text-sm"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
          >
            Sign in
          </motion.button>
        </motion.div>

        {/* Feature pills */}
        <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3 justify-center mb-12">
          {[
            { icon: "✦", label: "AI Summaries" },
            { icon: "⭐", label: "Pin & Organize" },
            { icon: "🔗", label: "Public Sharing" },
            { icon: "📊", label: "Smart Insights" },
            { icon: "🏷️", label: "Tag Notes" },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05, duration: 0.4 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            >
              <span>{f.icon}</span>
              {f.label}
            </motion.div>
          ))}
        </motion.div>

        {/* App preview */}
        <motion.div {...fadeUp(0.4)} className="w-full max-w-2xl">
          <AppPreview />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 text-center text-xs"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        Built for curious minds · Powered by AI
      </motion.p>
    </main>
  );
}

// Fixed star positions — no Math.random() at render time
const STAR_DATA = [
  { x: 5, y: 10, size: 1.5, delay: 0, duration: 3 },
  { x: 15, y: 25, size: 1, delay: 0.5, duration: 4 },
  { x: 25, y: 60, size: 2, delay: 1, duration: 2.5 },
  { x: 35, y: 15, size: 1.2, delay: 0.3, duration: 3.5 },
  { x: 45, y: 80, size: 0.8, delay: 0.8, duration: 4 },
  { x: 55, y: 35, size: 1.8, delay: 0.2, duration: 2.8 },
  { x: 65, y: 70, size: 1, delay: 1.2, duration: 3.2 },
  { x: 75, y: 20, size: 1.5, delay: 0.6, duration: 3.8 },
  { x: 85, y: 50, size: 0.8, delay: 0.4, duration: 4.2 },
  { x: 92, y: 85, size: 1.3, delay: 1.5, duration: 2.6 },
  { x: 10, y: 45, size: 2, delay: 0.7, duration: 3.4 },
  { x: 20, y: 90, size: 1.1, delay: 0.9, duration: 2.9 },
  { x: 30, y: 40, size: 0.9, delay: 1.3, duration: 3.7 },
  { x: 40, y: 5, size: 1.6, delay: 0.1, duration: 4.5 },
  { x: 50, y: 55, size: 1.2, delay: 1.8, duration: 3.1 },
  { x: 60, y: 30, size: 0.7, delay: 0.5, duration: 3.9 },
  { x: 70, y: 75, size: 2, delay: 1.1, duration: 2.7 },
  { x: 80, y: 12, size: 1.4, delay: 0.3, duration: 4.1 },
  { x: 90, y: 65, size: 1, delay: 1.6, duration: 3.3 },
  { x: 95, y: 40, size: 1.8, delay: 0.8, duration: 2.5 },
  { x: 8, y: 78, size: 0.9, delay: 1.4, duration: 4.3 },
  { x: 48, y: 22, size: 1.3, delay: 0.2, duration: 3.6 },
  { x: 72, y: 95, size: 0.6, delay: 2, duration: 2.8 },
  { x: 38, y: 88, size: 1.7, delay: 0.6, duration: 3.2 },
  { x: 58, y: 48, size: 1, delay: 1.7, duration: 4 },
];

function Stars() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {STAR_DATA.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
          animate={{ opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const NOTE_DATA = [
  { x: "8%", y: "20%", rotate: -12, delay: 0, color: "#7c3aed", label: "Meeting notes", lines: 3 },
  { x: "82%", y: "15%", rotate: 8, delay: 0.5, color: "#f59e0b", label: "Ideas ✨", lines: 2 },
  { x: "88%", y: "60%", rotate: -6, delay: 1, color: "#06b6d4", label: "Summary", lines: 4 },
  { x: "5%", y: "65%", rotate: 10, delay: 1.5, color: "#10b981", label: "Todo list", lines: 3 },
  { x: "75%", y: "80%", rotate: -8, delay: 0.8, color: "#f43f5e", label: "Quick note", lines: 2 },
  { x: "18%", y: "82%", rotate: 5, delay: 1.2, color: "#8b5cf6", label: "Research", lines: 4 },
];

function FloatingNotes() {
  return (
    <>
      {NOTE_DATA.map((note, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none hidden lg:block"
          style={{ left: note.x, top: note.y }}
          initial={{ opacity: 0, scale: 0.6, rotate: note.rotate - 10 }}
          animate={{ opacity: 1, scale: 1, rotate: note.rotate, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: note.delay },
            scale: { duration: 0.6, delay: note.delay },
            rotate: { duration: 0.6, delay: note.delay },
            y: { duration: 3 + note.delay, repeat: Infinity, ease: "easeInOut", delay: note.delay },
          }}
        >
          <div
            className="w-28 rounded-xl p-3 shadow-2xl"
            style={{
              background: "rgba(15,15,20,0.85)",
              border: `1px solid ${note.color}40`,
              backdropFilter: "blur(10px)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${note.color}20`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: note.color }} />
              <span className="text-white text-[10px] font-medium opacity-90">{note.label}</span>
            </div>
            {Array.from({ length: note.lines }).map((_, j) => (
              <div
                key={j}
                className="h-1 rounded-full mb-1.5"
                style={{ background: `${note.color}30`, width: j === note.lines - 1 ? "60%" : "100%" }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </>
  );
}

function AppPreview() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15,15,20,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-amber-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-4">
          <div className="h-5 rounded-md mx-auto" style={{ background: "rgba(255,255,255,0.05)", maxWidth: 200 }} />
        </div>
      </div>
      <div className="flex" style={{ height: 180 }}>
        <div className="w-40 shrink-0 p-3" style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,10,30,0.6)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 rounded bg-violet-600" />
            <div className="h-2 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
          </div>
          {["Meeting notes ⭐", "Project ideas", "Research"].map((t, i) => (
            <div key={i} className="px-2 py-1.5 rounded-lg mb-1" style={{ background: i === 0 ? "rgba(124,58,237,0.2)" : "transparent", border: i === 0 ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent" }}>
              <div className="h-1.5 rounded-full" style={{ background: i === 0 ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.12)", width: ["80%","65%","70%"][i] }} />
              <div className="h-1 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.06)", width: "50%" }} />
            </div>
          ))}
        </div>
        <div className="flex-1 p-4">
          <div className="h-4 w-48 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.15)" }} />
          <div className="flex gap-1.5 mb-3">
            {["#work", "#ai"].map((t) => (
              <div key={t} className="h-4 w-10 rounded-full" style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }} />
            ))}
          </div>
          {[100, 85, 95, 60].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)", width: `${w}%` }} />
          ))}
          <div className="mt-3 p-2 rounded-lg" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-3 h-3 rounded" style={{ background: "rgba(124,58,237,0.4)" }} />
              <div className="h-1.5 w-12 rounded-full" style={{ background: "rgba(167,139,250,0.4)" }} />
            </div>
            <div className="h-1 w-full rounded-full mb-1" style={{ background: "rgba(167,139,250,0.15)" }} />
            <div className="h-1 w-3/4 rounded-full" style={{ background: "rgba(167,139,250,0.1)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NoteIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}











































// "use client";

// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";

// const fadeUp = (delay = 0) => ({
//   initial: { opacity: 0, y: 24 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
// });

// const floatAnim = (delay = 0, range = 10) => ({
//   animate: {
//     y: [0, -range, 0],
//     rotate: [-2, 2, -2],
//   },
//   transition: {
//     duration: 4 + delay,
//     repeat: Infinity,
//     ease: "easeInOut",
//     delay,
//   },
// });

// export default function Home() {
//   const router = useRouter();

//   return (
//     <main
//       className="min-h-screen overflow-hidden relative flex flex-col items-center justify-center px-6"
//       style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, #2d1b69 0%, #0f0a1e 50%, #0a0a0f 100%)" }}
//     >
//       {/* Stars background */}
//       <Stars />

//       {/* Floating decorative notes */}
//       <FloatingNotes />

//       {/* Glow orbs */}
//       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

//       {/* Main content */}
//       <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">

//         {/* Logo mark */}
//         <motion.div {...fadeUp(0)} className="mb-8">
//           <div className="relative inline-flex">
//             <div
//               className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
//               style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", boxShadow: "0 0 40px rgba(124,58,237,0.4)" }}
//             >
//               <NoteIcon />
//             </div>
//             <motion.div
//               animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
//               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//               className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center"
//               style={{ boxShadow: "0 0 12px rgba(251,191,36,0.8)" }}
//             >
//               <span style={{ fontSize: 8 }}>✦</span>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Badge */}
//         <motion.div {...fadeUp(0.1)} className="mb-6">
//           <span
//             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
//             style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd" }}
//           >
//             <span style={{ color: "#a78bfa" }}>✦</span>
//             AI-Powered Notes Workspace
//           </span>
//         </motion.div>

//         {/* Headline */}
//         <motion.h1
//           {...fadeUp(0.15)}
//           className="font-bold leading-tight mb-4"
//           style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", letterSpacing: "-0.03em", fontFamily: "'Georgia', serif" }}
//         >
//           Your ideas,{" "}
//           <span style={{ background: "linear-gradient(135deg, #a78bfa, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//             supercharged
//           </span>{" "}
//           by AI
//         </motion.h1>

//         {/* Subheadline */}
//         <motion.p
//           {...fadeUp(0.2)}
//           className="text-lg leading-relaxed mb-10 max-w-xl"
//           style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1rem" }}
//         >
//           Write notes, let AI summarize them, organize with tags, and share your thoughts — all in one beautiful workspace built for curious minds.
//         </motion.p>

//         {/* CTA Buttons */}
//         <motion.div {...fadeUp(0.25)} className="flex gap-4 mb-16 flex-wrap justify-center">
//           <motion.button
//             whileHover={{ scale: 1.04, y: -2 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => router.push("/auth/signup")}
//             className="px-8 py-3.5 rounded-xl font-semibold text-sm text-white relative overflow-hidden"
//             style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: "0 8px 32px rgba(124,58,237,0.4)" }}
//           >
//             <span className="relative z-10">Start for free →</span>
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.04, y: -2 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => router.push("/auth/login")}
//             className="px-8 py-3.5 rounded-xl font-semibold text-sm"
//             style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
//           >
//             Sign in
//           </motion.button>
//         </motion.div>

//         {/* Feature pills */}
//         <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3 justify-center mb-12">
//           {[
//             { icon: "✦", label: "AI Summaries" },
//             { icon: "⭐", label: "Pin & Organize" },
//             { icon: "🔗", label: "Public Sharing" },
//             { icon: "📊", label: "Smart Insights" },
//             { icon: "🏷️", label: "Tag Notes" },
//           ].map((f, i) => (
//             <motion.div
//               key={f.label}
//               initial={{ opacity: 0, scale: 0.85 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.35 + i * 0.05, duration: 0.4 }}
//               className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
//               style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
//             >
//               <span>{f.icon}</span>
//               {f.label}
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* App preview strip */}
//         <motion.div {...fadeUp(0.4)} className="w-full max-w-2xl">
//           <AppPreview />
//         </motion.div>
//       </div>

//       {/* Footer */}
//       <motion.p
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.8 }}
//         className="absolute bottom-6 text-center text-xs"
//         style={{ color: "rgba(255,255,255,0.2)" }}
//       >
//         Built for curious minds · Powered by AI
//       </motion.p>
//     </main>
//   );
// }

// function Stars() {
//   const stars = Array.from({ length: 60 }, (_, i) => ({
//     id: i,
//     x: Math.random() * 100,
//     y: Math.random() * 100,
//     size: Math.random() * 2 + 0.5,
//     delay: Math.random() * 3,
//     duration: 2 + Math.random() * 3,
//   }));

//   return (
//     <div className="absolute inset-0 pointer-events-none">
//       {stars.map((star) => (
//         <motion.div
//           key={star.id}
//           className="absolute rounded-full bg-white"
//           style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, opacity: 0.4 }}
//           animate={{ opacity: [0.2, 0.8, 0.2] }}
//           transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
//         />
//       ))}
//     </div>
//   );
// }

// function FloatingNotes() {
//   const notes = [
//     { x: "8%", y: "20%", rotate: -12, delay: 0, color: "#7c3aed", label: "Meeting notes", lines: 3 },
//     { x: "82%", y: "15%", rotate: 8, delay: 0.5, color: "#f59e0b", label: "Ideas ✨", lines: 2 },
//     { x: "88%", y: "60%", rotate: -6, delay: 1, color: "#06b6d4", label: "Summary", lines: 4 },
//     { x: "5%", y: "65%", rotate: 10, delay: 1.5, color: "#10b981", label: "Todo list", lines: 3 },
//     { x: "75%", y: "80%", rotate: -8, delay: 0.8, color: "#f43f5e", label: "Quick note", lines: 2 },
//     { x: "18%", y: "82%", rotate: 5, delay: 1.2, color: "#8b5cf6", label: "Research", lines: 4 },
//   ];

//   return (
//     <>
//       {notes.map((note, i) => (
//         <motion.div
//           key={i}
//           className="absolute pointer-events-none hidden lg:block"
//           style={{ left: note.x, top: note.y }}
//           initial={{ opacity: 0, scale: 0.6, rotate: note.rotate - 10 }}
//           animate={{ opacity: 1, scale: 1, rotate: note.rotate, y: [0, -8, 0] }}
//           transition={{
//             opacity: { duration: 0.6, delay: note.delay },
//             scale: { duration: 0.6, delay: note.delay },
//             rotate: { duration: 0.6, delay: note.delay },
//             y: { duration: 3 + note.delay, repeat: Infinity, ease: "easeInOut", delay: note.delay },
//           }}
//         >
//           <div
//             className="w-28 rounded-xl p-3 shadow-2xl"
//             style={{
//               background: "rgba(15,15,20,0.85)",
//               border: `1px solid ${note.color}40`,
//               backdropFilter: "blur(10px)",
//               boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${note.color}20`,
//             }}
//           >
//             <div className="flex items-center gap-1.5 mb-2">
//               <div className="w-2 h-2 rounded-full" style={{ background: note.color }} />
//               <span className="text-white text-[10px] font-medium opacity-90">{note.label}</span>
//             </div>
//             {Array.from({ length: note.lines }).map((_, j) => (
//               <div
//                 key={j}
//                 className="h-1 rounded-full mb-1.5"
//                 style={{
//                   background: `${note.color}30`,
//                   width: j === note.lines - 1 ? "60%" : "100%",
//                 }}
//               />
//             ))}
//           </div>
//         </motion.div>
//       ))}
//     </>
//   );
// }

// function AppPreview() {
//   return (
//     <div
//       className="rounded-2xl overflow-hidden"
//       style={{
//         background: "rgba(15,15,20,0.8)",
//         border: "1px solid rgba(255,255,255,0.08)",
//         boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
//         backdropFilter: "blur(20px)",
//       }}
//     >
//       {/* Window chrome */}
//       <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
//         <div className="w-3 h-3 rounded-full bg-red-500/60" />
//         <div className="w-3 h-3 rounded-full bg-amber-500/60" />
//         <div className="w-3 h-3 rounded-full bg-green-500/60" />
//         <div className="flex-1 mx-4">
//           <div className="h-5 rounded-md mx-auto" style={{ background: "rgba(255,255,255,0.05)", maxWidth: 200 }} />
//         </div>
//       </div>

//       {/* App layout preview */}
//       <div className="flex" style={{ height: 180 }}>
//         {/* Sidebar */}
//         <div className="w-40 shrink-0 p-3" style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,10,30,0.6)" }}>
//           <div className="flex items-center gap-2 mb-3">
//             <div className="w-4 h-4 rounded bg-violet-600" />
//             <div className="h-2 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
//           </div>
//           {["Meeting notes ⭐", "Project ideas", "Research"].map((t, i) => (
//             <div
//               key={i}
//               className="px-2 py-1.5 rounded-lg mb-1"
//               style={{
//                 background: i === 0 ? "rgba(124,58,237,0.2)" : "transparent",
//                 border: i === 0 ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
//               }}
//             >
//               <div className="h-1.5 rounded-full" style={{ background: i === 0 ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.12)", width: ["80%","65%","70%"][i] }} />
//               <div className="h-1 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.06)", width: "50%" }} />
//             </div>
//           ))}
//         </div>

//         {/* Editor */}
//         <div className="flex-1 p-4">
//           <div className="h-4 w-48 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.15)" }} />
//           <div className="flex gap-1.5 mb-3">
//             {["#work", "#ai"].map((t) => (
//               <div key={t} className="h-4 w-10 rounded-full" style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }} />
//             ))}
//           </div>
//           {[100, 85, 95, 60].map((w, i) => (
//             <div key={i} className="h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)", width: `${w}%` }} />
//           ))}
//           {/* AI summary card */}
//           <div className="mt-3 p-2 rounded-lg" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
//             <div className="flex items-center gap-1.5 mb-1.5">
//               <div className="w-3 h-3 rounded" style={{ background: "rgba(124,58,237,0.4)" }} />
//               <div className="h-1.5 w-12 rounded-full" style={{ background: "rgba(167,139,250,0.4)" }} />
//             </div>
//             <div className="h-1 w-full rounded-full mb-1" style={{ background: "rgba(167,139,250,0.15)" }} />
//             <div className="h-1 w-3/4 rounded-full" style={{ background: "rgba(167,139,250,0.1)" }} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function NoteIcon() {
//   return (
//     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//       <polyline points="14 2 14 8 20 8" />
//       <line x1="8" y1="13" x2="16" y2="13" />
//       <line x1="8" y1="17" x2="13" y2="17" />
//     </svg>
//   );
// }