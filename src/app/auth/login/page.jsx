"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";

import Link from "next/link";

import {
  ArrowRight,
  StickyNote,
} from "lucide-react";

import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    setLoading(false);

    if (!error) {
      router.push(
        "/dashboard"
      );
    } else {
      alert(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:44px_44px]" />

      {/* CONTAINER */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="w-full max-w-md relative z-10"
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-12 h-12 rounded-2xl border border-white/[0.08] bg-[#111111] flex items-center justify-center">
            <StickyNote
              size={18}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Peblo Notes
            </h1>

            <p className="text-white/25 text-[11px] mt-0.5">
              Your second brain
            </p>
          </div>
        </div>

        {/* CARD */}
        <div className="w-full rounded-[32px] border border-white/[0.08] bg-[#090909] p-10">
          <div className="mb-8">
            <h1 className="text-5xl font-bold tracking-[-0.05em] leading-none mb-3">
              Welcome back
            </h1>

            <p className="text-white/35 text-sm leading-relaxed">
              Continue writing and organizing your ideas inside Peblo Notes.
            </p>
          </div>

          <form
            onSubmit={
              handleLogin
            }
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full h-14 rounded-2xl bg-[#111111] border border-white/[0.08] px-5 text-white placeholder-white/20 outline-none focus:border-white/20 transition-all"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-14 rounded-2xl bg-[#111111] border border-white/[0.08] px-5 text-white placeholder-white/20 outline-none focus:border-white/20 transition-all"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-white text-black font-semibold transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2"
            >
              {loading
                ? "Logging in..."
                : "Login"}

              {!loading && (
                <ArrowRight size={16} />
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/30 text-sm">
              Don’t have an account?{" "}

              <Link
                href="/auth/signup"
                className="text-white hover:text-white/70 transition-all"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}