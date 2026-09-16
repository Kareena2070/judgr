"use client";

import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";
import Link from "next/link";
import StatusPill from "../../components/StatusPill";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function StudentHackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    async function fetchHackathons() {
      try {
        setIsLoading(true);

        const response = await apiClient.get("/hackathons", {
          params: {
            page,
            limit: 10,
            search,
            status: status || undefined,
          },
        });

        console.log("Student hackathons:", response.data);

        setHackathons(response.data.data.items);
        setPagination(response.data.data.pagination);
      } catch (error) {
        console.error("Failed to fetch hackathons:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathons();
  }, [search, status, page]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
          Explore
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
          Hackathons
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#737373]">
          Find a hackathon and manage your team.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-[#e5e5e0] bg-white p-3 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="sr-only" htmlFor="search">
            Search hackathons
          </label>

          <input
            className="h-10 w-full rounded-md border border-[#e5e5e0] bg-white px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
            id="search"
            type="text"
            placeholder="Search hackathons..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="status">
            Filter by status
          </label>

          <select
            className="h-10 w-full rounded-md border border-[#e5e5e0] bg-white px-3 text-sm font-medium text-[#171717] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 sm:w-44"
            id="status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="REGISTRATION">Registration</option>
            <option value="SUBMISSION">Submission</option>
            <option value="JUDGING">Judging</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-[#e5e5e0] bg-white px-4 py-12 text-center text-sm text-[#737373]">
          Loading hackathons...
        </div>
      ) : hackathons.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#e5e5e0] bg-white px-4 py-12 text-center">
          <h2 className="text-base font-semibold text-[#171717]">
            No hackathons found
          </h2>
          <p className="mt-2 text-sm text-[#737373]">
            Try adjusting your search or status filter.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hackathons.map((hackathon) => (
              <article
                className="flex min-h-64 flex-col rounded-lg border border-[#e5e5e0] bg-white p-5 shadow-[0_1px_3px_rgba(23,23,23,0.06)] transition-colors hover:border-[#bfdbfe]"
                key={hackathon._id}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#737373]">
                    {hackathon.theme}
                  </p>
                  <StatusPill status={hackathon.status} />
                </div>

                <h2 className="mt-4 text-lg font-bold tracking-tight text-[#171717]">
                  <Link
                    className="transition-colors hover:text-[#1d4ed8]"
                    href={`/hackathons/${hackathon._id}`}
                  >
                    {hackathon.title}
                  </Link>
                </h2>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#737373]">
                  {hackathon.description}
                </p>

                <p className="mt-4 text-xs font-medium text-[#737373]">
                  Registration: {formatDate(hackathon.registrationStart)} - {formatDate(hackathon.registrationEnd)}
                </p>

                <Link
                  className="mt-auto inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
                  href={`/hackathons/${hackathon._id}`}
                >
                  View
                </Link>
              </article>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#e5e5e0] pt-5">
              <button
                className="rounded-md border border-[#e5e5e0] px-3 py-2 text-sm font-semibold text-[#737373] transition-colors hover:border-[#171717] hover:text-[#171717] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <span className="text-sm font-medium text-[#737373]">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                className="rounded-md border border-[#e5e5e0] px-3 py-2 text-sm font-semibold text-[#737373] transition-colors hover:border-[#171717] hover:text-[#171717] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
