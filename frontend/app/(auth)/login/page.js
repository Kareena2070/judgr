"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(email, password);

      if (user.role === "student") {
        router.push("/student");
      } else if (user.role === "judge") {
        router.push("/judge");
      } else if (user.role === "admin") {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error?.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-4 py-12">
      <section className="w-full max-w-md rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
            Judgr
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#737373]">
            Sign in to continue to your hackathons.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171717]" htmlFor="email">
              Email
            </label>

            <input
              className="h-11 w-full rounded-md border border-[#e5e5e0] bg-white px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171717]" htmlFor="password">
              Password
            </label>

            <input
              className="h-11 w-full rounded-md border border-[#e5e5e0] bg-white px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="rounded-md bg-[#fee2e2] px-3 py-2 text-sm font-medium leading-5 text-[#b91c1c]">
              {error}
            </p>
          )}

          <button
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#a3a3a3]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#737373]">
          New to Judgr?{" "}
          <Link className="font-semibold text-[#2563eb] hover:text-[#1d4ed8]" href="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}