"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import HackathonCard from "./components/HackathonCard";
import apiClient from "./lib/apiClient";
import { useAuth } from "./context/AuthContext";

const workflow = [
  ["01", "Discover", "Find a hackathon that matches the kind of problem you want to solve."],
  ["02", "Build your team", "Create a team or join people who bring a different perspective."],
  ["03", "Participate", "Use the event timeline to stay focused from registration through delivery."],
  ["04", "Share your work", "The platform is designed to support a structured submission and evaluation workflow as it evolves."],
];

function FeaturedLoading() {
  return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div className="h-80 animate-pulse rounded-2xl border border-[#e5e5e0] bg-white" key={item} />)}</div>;
}

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get("/hackathons", { params: { page: 1, limit: 3 } });
      setHackathons(response.data.data.items || []);
    } catch (requestError) {
      setError("We couldn't load hackathons right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadFeatured();
    });
    return () => { cancelled = true; };
  }, [loadFeatured]);

  const dashboardHref = user?.role === "student" ? "/student" : user?.role === "admin" ? "/admin" : "/";
  const secondaryHref = user ? dashboardHref : "/register";
  const secondaryLabel = user ? "Go to Dashboard" : "Get Started";

  return (
    <main className="overflow-hidden">
      <section className="relative isolate border-b border-[#e5e5e0] bg-[#fafaf8]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(191,219,254,0.7),transparent_30%),linear-gradient(#e5e5e0_1px,transparent_1px),linear-gradient(90deg,#e5e5e0_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#1d4ed8]">A clearer way to run hackathons</p>
            <h1 className="mt-6 text-5xl font-bold tracking-[-0.055em] text-[#171717] sm:text-6xl lg:text-7xl">Build. Compete.<br />Get Judged.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#525252]">Judgr brings hackathon discovery, team formation, and participant workflows into one focused platform—so builders can spend more energy on the work that matters.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex h-12 items-center justify-center rounded-md bg-[#2563eb] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2" href="/hackathons">Explore Hackathons <span aria-hidden="true" className="ml-2">→</span></Link>
              {!authLoading && <Link className="inline-flex h-12 items-center justify-center rounded-md border border-[#d4d4d4] bg-white px-5 text-sm font-semibold text-[#171717] transition-colors hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2" href={secondaryHref}>{secondaryLabel}</Link>}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="rounded-2xl border border-[#bfdbfe] bg-white p-4 shadow-[0_24px_60px_rgba(37,99,235,0.15)] sm:p-6">
              <div className="flex items-center justify-between border-b border-[#e5e5e0] pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">Your next challenge</p><p className="mt-1 text-lg font-bold text-[#171717]">Hackathon workspace</p></div><span className="h-3 w-3 rounded-full bg-[#22c55e]" aria-label="Active" /></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[#eff6ff] p-4"><p className="text-xs font-medium text-[#2563eb]">Discover</p><p className="mt-2 text-sm font-semibold text-[#171717]">Find the right event</p></div><div className="rounded-xl bg-[#f8f8f6] p-4"><p className="text-xs font-medium text-[#737373]">Collaborate</p><p className="mt-2 text-sm font-semibold text-[#171717]">Build a strong team</p></div></div>
              <div className="mt-4 rounded-xl border border-[#e5e5e0] p-4"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-[#171717]">Event timeline</span><span className="rounded-full bg-[#dbeafe] px-2 py-1 text-xs font-semibold text-[#1d4ed8]">In progress</span></div><div className="mt-4 flex gap-2"><span className="h-2 flex-1 rounded-full bg-[#2563eb]" /><span className="h-2 flex-1 rounded-full bg-[#93c5fd]" /><span className="h-2 flex-1 rounded-full bg-[#e5e5e0]" /></div><p className="mt-3 text-xs text-[#737373]">Discover · Team up · Build</p></div>
            </div>
            <div className="absolute -bottom-6 -left-5 hidden rounded-xl border border-[#e5e5e0] bg-white px-4 py-3 shadow-lg sm:block"><p className="text-xs font-semibold text-[#171717]">From idea to impact</p><p className="mt-1 text-xs text-[#737373]">A focused participant journey</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">Built around the builder</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">Everything starts with a challenge worth joining.</h2></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[["Discover Hackathons", "Explore available challenges and the details that help you choose."], ["Build Teams", "Create a team or find collaborators before registration closes."], ["Stay on Track", "Keep event dates, team context, and participation in one place."], ["Fair Evaluation", "Judgr is designed to support structured, transparent evaluation as the platform grows."]].map(([title, text], index) => <article className="rounded-2xl border border-[#e5e5e0] bg-white p-6" key={title}><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-sm font-bold text-[#2563eb]">0{index + 1}</span><h3 className="mt-5 text-lg font-bold text-[#171717]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#737373]">{text}</p></article>)}
        </div>
      </section>

      <section className="border-y border-[#e5e5e0] bg-white"><div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">Explore</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#171717]">Featured hackathons</h2><p className="mt-3 text-sm leading-6 text-[#737373]">Real opportunities, pulled directly from Judgr.</p></div><Link className="inline-flex text-sm font-semibold text-[#1d4ed8] hover:text-[#1e40af]" href="/hackathons">View all hackathons <span className="ml-2">→</span></Link></div>
        <div className="mt-10">{loading ? <FeaturedLoading /> : error ? <div className="rounded-2xl border border-[#fee2e2] bg-[#fff7f7] p-8 text-center"><p className="text-sm font-medium text-[#b91c1c]">{error}</p><button className="mt-4 rounded-md border border-[#b91c1c] px-4 py-2 text-sm font-semibold text-[#b91c1c]" onClick={loadFeatured}>Try again</button></div> : hackathons.length === 0 ? <div className="rounded-2xl border border-dashed border-[#d4d4d4] bg-[#fafaf8] p-10 text-center"><h3 className="font-semibold text-[#171717]">No hackathons available right now.</h3><p className="mt-2 text-sm text-[#737373]">Check back soon for new challenges.</p></div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{hackathons.map((hackathon) => <HackathonCard hackathon={hackathon} key={hackathon._id} />)}</div>}</div>
      </div></section>

      <section id="how-it-works" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">How it works</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">A more deliberate path from discovery to delivery.</h2><p className="mt-4 text-sm leading-6 text-[#737373]">Start with the opportunity, find your collaborators, then focus on making something meaningful.</p></div><ol className="divide-y divide-[#e5e5e0] border-y border-[#e5e5e0]">{workflow.map(([number, title, text]) => <li className="grid gap-3 py-5 sm:grid-cols-[64px_1fr]" key={number}><span className="text-sm font-bold text-[#2563eb]">{number}</span><div><h3 className="font-bold text-[#171717]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#737373]">{text}</p></div></li>)}</ol></div></section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"><div className="rounded-3xl bg-[#171717] px-6 py-12 text-center text-white sm:px-12 sm:py-16"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#93c5fd]">Your next challenge is waiting</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Ready to build something worth judging?</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#d4d4d4]">Explore hackathons and start your next challenge with Judgr.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-[#171717] hover:bg-[#eff6ff]" href="/hackathons">Explore Hackathons</Link>{!authLoading && <Link className="inline-flex h-11 items-center justify-center rounded-md border border-[#525252] px-5 text-sm font-semibold text-white hover:border-white" href={secondaryHref}>{secondaryLabel}</Link>}</div></div></section>
    </main>
  );
}
