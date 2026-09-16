"use client";

import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";
import Link from "next/link";

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
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Hackathons</h1>
        <p className="mt-2 text-gray-600">Find a hackathon and manage your team.</p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium" htmlFor="search">Search</label>

          <input
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
          <label className="block text-sm font-medium" htmlFor="status">Status</label>

          <select
            className="mt-1 rounded-md border border-gray-300 px-3 py-2"
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
        <p>Loading hackathons...</p>
      ) : hackathons.length === 0 ? (
        <p>No hackathons found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {hackathons.map((hackathon) => (
            <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm" key={hackathon._id}>
              <h2 className="text-xl font-semibold">
                <Link className="hover:underline" href={`/hackathons/${hackathon._id}`}>
                  {hackathon.title}
                </Link>
              </h2>

              <p className="mt-2 text-gray-700">{hackathon.description}</p>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Theme:</strong> {hackathon.theme}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                <strong>Status:</strong> {hackathon.status}
              </p>
              <Link
                className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                href={`/hackathons/${hackathon._id}`}
              >
                View Hackathon
              </Link>
            </article>
          ))}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
