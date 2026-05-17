"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function handleSignup(e) {
    e.preventDefault();

    const { error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            username,
          },
        },
      });

    if (!error) {
      router.push("/dashboard");
    } else {
      alert(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md border border-white/10 bg-white/[0.03] rounded-[32px] p-8 space-y-5"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Create Account
          </h1>

          <p className="text-zinc-500 mt-2">
            Start organizing your ideas with Peblo Notes.
          </p>
        </div>

        <input
          type="text"
          placeholder="Username"
          className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-white"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-white"
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
          className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-white"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          className="w-full bg-white text-black py-3 rounded-2xl font-semibold hover:scale-[1.01] transition-all"
        >
          Create Account
        </button>
      </form>
    </main>
  );
}