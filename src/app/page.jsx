"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Sparkles,
  Share2,
  Lock,
  PencilLine,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
              <PencilLine className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Peblo Notes
              </h1>

              <p className="text-xs text-zinc-500 -mt-0.5">
                Your second brain
              </p>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-10 text-sm text-zinc-400 font-medium">
            <a
              href="#features"
              className="hover:text-white transition"
            >
              Features
            </a>

            <a
              href="#about"
              className="hover:text-white transition"
            >
              About
            </a>

            <a
              href="#ai"
              className="hover:text-white transition"
            >
              AI Insights
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="hidden md:flex text-sm text-zinc-300 hover:text-white transition"
            >
              Sign In
            </Link>

            <Link
              href="/auth/signup"
              className="px-5 py-2.5 rounded-2xl bg-white text-black text-sm font-semibold hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 lg:pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT IMAGE */}
            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />

              <Image
                src="/landing-illustration.png"
                alt="Peblo Notes Illustration"
                width={900}
                height={900}
                priority
                className="relative z-10 w-full max-w-2xl mx-auto"
              />
            </motion.div>

            {/* RIGHT CONTENT */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-xl">
                <Sparkles className="w-4 h-4 text-white" />

                <span className="text-sm text-zinc-300 font-medium">
                  AI-Powered Workspace
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]">
                Your thoughts,
                <br />
                organized.
                <br />
                Your ideas,
                <br />
                supercharged.
              </h1>

              <p className="mt-8 text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-xl font-medium">
                Peblo Notes helps you capture ideas,
                organize thoughts, generate AI insights,
                and build your second brain in one
                beautiful workspace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link
                  href="/auth/signup"
                  className="group px-8 py-4 rounded-2xl bg-white text-black font-semibold text-base flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/auth/login"
                  className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-semibold text-base hover:bg-white/[0.06] transition-all text-center"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-t border-white/10 bg-zinc-950/40"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="mb-16 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500 mb-4">
              Features
            </p>

            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Everything you need
              <br />
              in one workspace.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <FeatureCard
              icon={<PencilLine className="w-5 h-5" />}
              title="Smart Notes"
              description="Write, organize, and structure your ideas in a clean distraction-free workspace."
            />

            <FeatureCard
              icon={<Sparkles className="w-5 h-5" />}
              title="AI Insights"
              description="Generate summaries, action items, titles, and intelligent insights instantly."
            />

            <FeatureCard
              icon={<Share2 className="w-5 h-5" />}
              title="Share Anywhere"
              description="Create public note links and collaborate effortlessly with anyone."
            />

            <FeatureCard
              icon={<Lock className="w-5 h-5" />}
              title="Private & Secure"
              description="Your notes stay protected with secure authentication and encrypted storage."
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="border-t border-white/10"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-28 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500 mb-6">
            About Peblo
          </p>

          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
            A calm workspace
            <br />
            for your ideas.
          </h2>

          <p className="mt-8 text-zinc-400 text-lg leading-relaxed max-w-3xl mx-auto">
            Peblo Notes is designed to help students,
            creators, developers, and thinkers capture
            thoughts without distractions.
            <br />
            <br />
            Write notes, organize knowledge, generate
            AI-powered insights, and build your second
            brain — all in one elegant workspace.
          </p>
        </div>
      </section>

      {/* AI SECTION */}
      <section
        id="ai"
        className="border-t border-white/10 bg-zinc-950/30"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500 mb-6">
                AI Insights
              </p>

              <h2 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                Turn notes into
                intelligent action.
              </h2>

              <p className="mt-8 text-zinc-400 text-lg leading-relaxed max-w-xl">
                Peblo AI analyzes your notes and instantly
                generates summaries, action items,
                suggested titles, and insights —
                helping you think faster and stay organized.
              </p>
            </div>

            {/* RIGHT */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
              <div className="space-y-6">
                <div className="rounded-2xl bg-black border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
                    Summary
                  </p>

                  <p className="text-zinc-300 leading-relaxed">
                    Peblo Notes helps organize project
                    planning, generate AI summaries, and
                    keep track of actionable insights.
                  </p>
                </div>

                <div className="rounded-2xl bg-black border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">
                    Action Items
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      Deploy project to Vercel
                    </div>

                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      Improve dashboard responsiveness
                    </div>

                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      Generate AI insights
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 hover:bg-white/[0.05] transition-all"
    >
      <div className="w-12 h-12 rounded-2xl border border-white/10 bg-black flex items-center justify-center mb-5 text-white">
        {icon}
      </div>

      <h3 className="text-xl font-semibold tracking-tight mb-3">
        {title}
      </h3>

      <p className="text-zinc-400 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </motion.div>
  );
}

























