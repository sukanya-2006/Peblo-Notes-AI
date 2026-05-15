"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      router.push("/dashboard");
    } else {
      alert(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="bg-zinc-900 p-8 rounded-2xl w-[400px] space-y-4"
      >
        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-zinc-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-zinc-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-white text-black p-3 rounded-lg font-semibold"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}