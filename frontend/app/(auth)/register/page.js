"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext.js";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password
      );

      router.push("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setIsLoading(false);
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
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#737373]">
            Join hackathons, build teams, and ship something great.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171717]" htmlFor="name">
              Name
            </label>
            <input
              className="h-11 w-full rounded-md border border-[#e5e5e0] bg-white px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              id="name"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171717]" htmlFor="email">
              Email
            </label>
            <input
              className="h-11 w-full rounded-md border border-[#e5e5e0] bg-white px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171717]" htmlFor="password">
              Password
            </label>
            <input
              className="h-11 w-full rounded-md border border-[#e5e5e0] bg-white px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#a3a3a3]"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {error && (
            <p className="rounded-md bg-[#fee2e2] px-3 py-2 text-sm font-medium leading-5 text-[#b91c1c]">
              {error}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-[#737373]">
          Already have an account?{" "}
          <Link className="font-semibold text-[#2563eb] hover:text-[#1d4ed8]" href="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}