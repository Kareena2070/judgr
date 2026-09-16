"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StatusPill from "../../../components/StatusPill";
import apiClient from "../../../lib/apiClient";
import { useAuth } from "../../../context/AuthContext";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function DateRow({ label, start, end }) {
  return <div className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><dt className="text-sm font-semibold text-[#171717]">{label}</dt><dd className="text-sm text-[#525252]">{formatDate(start)} – {formatDate(end)}</dd></div>;
}

export default function HackathonDetailPage() {
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamStatus, setTeamStatus] = useState("");

  const loadHackathon = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get(`/hackathons/${params.id}`);
      setHackathon(response.data.data);
    } catch (requestError) {
      if (requestError.response?.status === 404) setError("not-found");
      else setError("We couldn't load this hackathon right now. Please try again.");
    } finally { setLoading(false); }
  }, [params.id]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadHackathon();
    });
    return () => { cancelled = true; };
  }, [loadHackathon]);

  useEffect(() => {
    if (!user || user.role !== "student" || !hackathon || hackathon.status !== "REGISTRATION") return;
    async function loadTeamStatus() {
      try {
        await apiClient.get(`/hackathons/${params.id}/my-team`);
        setTeamStatus("You are already part of a team for this event.");
      } catch (requestError) {
        if (requestError.response?.data?.error?.code === "TEAM_NOT_FOUND") setTeamStatus("Create a team or join one while registration is open.");
      }
    }
    void loadTeamStatus();
  }, [hackathon, params.id, user]);

  if (loading) return <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="h-96 animate-pulse rounded-3xl border border-[#e5e5e0] bg-white" /></main>;
  if (error === "not-found") return <main className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">404</p><h1 className="mt-3 text-3xl font-bold text-[#171717]">Hackathon not found</h1><p className="mt-3 text-sm text-[#737373]">This event may no longer be available.</p><Link className="mt-6 inline-flex rounded-md bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white" href="/hackathons">Browse hackathons</Link></main>;
  if (error) return <main className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6"><h1 className="text-xl font-semibold text-[#b91c1c]">{error}</h1><button className="mt-5 rounded-md border border-[#b91c1c] px-4 py-2 text-sm font-semibold text-[#b91c1c]" onClick={loadHackathon}>Try again</button></main>;

  const canJoinTeam = user?.role === "student" && hackathon.status === "REGISTRATION";
  const action = !user ? { href: "/register", label: "Get Started" } : canJoinTeam ? { href: `/hackathons/${hackathon._id}/team`, label: "Create or Join Team" } : user.role === "admin" ? { href: "/admin", label: "Go to Dashboard" } : null;

  return <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
    <Link className="text-sm font-semibold text-[#2563eb] hover:text-[#1e40af]" href="/hackathons">← All hackathons</Link>
    <section className="mt-6 rounded-3xl border border-[#e5e5e0] bg-white p-6 shadow-[0_3px_16px_rgba(23,23,23,0.05)] sm:p-10"><div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-3xl"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-[#1d4ed8]">{hackathon.theme}</span><StatusPill status={hackathon.status} /></div><h1 className="mt-5 text-4xl font-bold tracking-tight text-[#171717] sm:text-5xl">{hackathon.title}</h1><p className="mt-5 text-base leading-7 text-[#525252]">{hackathon.description}</p></div>{!authLoading && action && <Link className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-[#1d4ed8]" href={action.href}>{action.label}</Link>}</div></section>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]"><section className="rounded-2xl border border-[#e5e5e0] bg-white p-6 sm:p-8"><h2 className="text-xl font-bold text-[#171717]">Important dates</h2><dl className="mt-5 divide-y divide-[#e5e5e0]"><DateRow label="Registration" start={hackathon.registrationStart} end={hackathon.registrationEnd} /><DateRow label="Build & submit" start={hackathon.submissionStart} end={hackathon.submissionEnd} /><DateRow label="Evaluation period" start={hackathon.judgingStart} end={hackathon.judgingEnd} /></dl></section><aside className="space-y-6"><section className="rounded-2xl border border-[#e5e5e0] bg-white p-6"><h2 className="text-xl font-bold text-[#171717]">Team size</h2><p className="mt-4 text-4xl font-bold tracking-tight text-[#171717]">{hackathon.teamSize.min}–{hackathon.teamSize.max}</p><p className="mt-1 text-sm text-[#737373]">people per team</p></section><section className="rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] p-6"><h2 className="font-bold text-[#171717]">Participation</h2><p className="mt-2 text-sm leading-6 text-[#525252]">{teamStatus || (user ? "Team actions are available to students during registration." : "Create an account to join the Judgr community and participate when registration opens.")}</p>{!authLoading && !user && <Link className="mt-4 inline-flex text-sm font-semibold text-[#1d4ed8] hover:text-[#1e40af]" href="/login">Login to participate →</Link>}</section></aside></div>
  </main>;
}
