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

        const response = await apiClient.get("/api/v1/hackathons", {
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
    <div>
      <h1>Hackathons</h1>

      <div>
        <label htmlFor="search">Search</label>

        <input
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
        <label htmlFor="status">Status</label>

        <select
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

      {isLoading ? (
        <p>Loading hackathons...</p>
      ) : hackathons.length === 0 ? (
        <p>No hackathons found.</p>
      ) : (
        <div>
          {hackathons.map((hackathon) => (
            <div key={hackathon._id}>
              <h2>
                <Link href={`/hackathons/${hackathon._id}`}>
                  {hackathon.title}
                </Link>
              </h2>

              <p>{hackathon.theme}</p>
              <p>{hackathon.status}</p>
            </div>
          ))}

          {pagination && pagination.totalPages > 1 && (
            <div>
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
    </div>
  );
}
