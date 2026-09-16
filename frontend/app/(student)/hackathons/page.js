"use client";

import { useCallback, useEffect, useState } from "react";
import HackathonCard from "../../components/HackathonCard";
import apiClient from "../../lib/apiClient";

function CardLoading() {
  return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div className="h-80 animate-pulse rounded-2xl border border-[#e5e5e0] bg-white" key={item} />)}</div>;
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const loadHackathons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await apiClient.get("/hackathons", { params: { page, limit: 9, search, status: status || undefined } });
      setHackathons(response.data.data.items || []);
      setPagination(response.data.data.pagination || null);
    } catch (requestError) {
      setError("We couldn't load hackathons right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadHackathons();
    });
    return () => { cancelled = true; };
  }, [loadHackathons]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">Discover your next challenge</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-[#171717] sm:text-5xl">Hackathons</h1><p className="mt-4 text-base leading-7 text-[#525252]">Explore opportunities, check important dates, and find a challenge your team wants to take on.</p></header>

      <section className="mt-10 rounded-2xl border border-[#e5e5e0] bg-white p-3 shadow-[0_2px_10px_rgba(23,23,23,0.04)] sm:flex sm:items-center sm:gap-3" aria-label="Hackathon filters">
        <div className="flex-1"><label className="sr-only" htmlFor="search">Search hackathons</label><input className="h-11 w-full rounded-lg border border-[#e5e5e0] bg-[#fafaf8] px-4 text-sm text-[#171717] outline-none placeholder:text-[#737373] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20" id="search" type="search" placeholder="Search by title or theme" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
        <div className="mt-3 sm:mt-0"><label className="sr-only" htmlFor="status">Filter by status</label><select className="h-11 w-full rounded-lg border border-[#e5e5e0] bg-white px-4 text-sm font-medium text-[#171717] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 sm:w-48" id="status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">All statuses</option><option value="DRAFT">Upcoming</option><option value="REGISTRATION">Registration open</option><option value="SUBMISSION">Submission</option><option value="JUDGING">Judging</option><option value="COMPLETED">Completed</option></select></div>
      </section>

      <section className="mt-8" aria-live="polite">
        {isLoading ? <CardLoading /> : error ? <div className="rounded-2xl border border-[#fee2e2] bg-[#fff7f7] p-10 text-center"><h2 className="font-semibold text-[#b91c1c]">{error}</h2><button className="mt-4 rounded-md border border-[#b91c1c] px-4 py-2 text-sm font-semibold text-[#b91c1c]" onClick={loadHackathons}>Try again</button></div> : hackathons.length === 0 ? <div className="rounded-2xl border border-dashed border-[#d4d4d4] bg-white p-12 text-center"><h2 className="text-lg font-semibold text-[#171717]">No hackathons available right now.</h2><p className="mt-2 text-sm text-[#737373]">Try adjusting your search or check back soon for new challenges.</p></div> : <><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{hackathons.map((hackathon) => <HackathonCard hackathon={hackathon} key={hackathon._id} />)}</div>{pagination?.totalPages > 1 && <nav className="mt-10 flex items-center justify-between border-t border-[#e5e5e0] pt-6" aria-label="Hackathon pagination"><button className="rounded-md border border-[#e5e5e0] px-4 py-2 text-sm font-semibold text-[#525252] hover:border-[#171717] disabled:cursor-not-allowed disabled:opacity-40" onClick={() => setPage((current) => current - 1)} disabled={page === 1}>Previous</button><span className="text-sm text-[#737373]">Page {pagination.page} of {pagination.totalPages}</span><button className="rounded-md border border-[#e5e5e0] px-4 py-2 text-sm font-semibold text-[#525252] hover:border-[#171717] disabled:cursor-not-allowed disabled:opacity-40" onClick={() => setPage((current) => current + 1)} disabled={page === pagination.totalPages}>Next</button></nav>}</>}
      </section>
    </main>
  );
}
