"use client";

import AdminRouteGuard from "../../../components/AdminRouteGuard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../../lib/apiClient";
import StatusPill from "../../../components/StatusPill";

export default function HackathonsPage() {
  const router = useRouter();
  const [hackathons, setHackathons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHackathons() {
      try {
        const response = await apiClient.get("/hackathons");

        console.log("Hackathons:", response.data);

        setHackathons(response.data.data.items);
      } catch (error) {
        console.error("Failed to fetch hackathons:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathons();
  }, []);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="rounded-lg border border-dashed border-[#e5e5e0] bg-white px-4 py-12 text-center text-sm text-[#737373]">
          Loading hackathons...
        </div>
      </main>
    );
  }

  return (
    <AdminRouteGuard>
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
            Hackathon Management
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#737373]">
            Create, review, and manage hackathon timelines.
          </p>
        </div>

        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
          onClick={() => router.push("/admin/hackathons/new")}
        >
          Create Hackathon
        </button>
      </div>

      {hackathons.length === 0 ? (
        <section className="rounded-lg border border-dashed border-[#e5e5e0] bg-white px-4 py-12 text-center">
          <h2 className="text-base font-semibold text-[#171717]">
            No hackathons found
          </h2>
          <p className="mt-2 text-sm text-[#737373]">
            Create your first hackathon to begin managing registrations.
          </p>
        </section>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#e5e5e0] bg-white shadow-[0_1px_3px_rgba(23,23,23,0.06)]">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full border-collapse text-left">
              <thead className="border-b border-[#e5e5e0] bg-[#f8f8f6]">
                <tr className="text-xs font-semibold uppercase tracking-[0.08em] text-[#737373]">
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Theme</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Registration</th>
                  <th className="px-5 py-4">Submission</th>
                  <th className="px-5 py-4">Judging</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e5e5e0]">
                {hackathons.map((hackathon) => (
                  <tr className="align-top transition-colors hover:bg-[#fafaf8]" key={hackathon._id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#171717]">{hackathon.title}</p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#737373]">{hackathon.theme}</td>

                    <td className="px-5 py-4">
                      <StatusPill status={hackathon.status} />
                    </td>

                    <td className="px-5 py-4 text-xs leading-5 text-[#737373]">
                      {new Date(hackathon.registrationStart).toLocaleString()}
                      <span className="block text-[#a3a3a3]">to</span>
                      {new Date(hackathon.registrationEnd).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-xs leading-5 text-[#737373]">
                      {new Date(hackathon.submissionStart).toLocaleString()}
                      <span className="block text-[#a3a3a3]">to</span>
                      {new Date(hackathon.submissionEnd).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-xs leading-5 text-[#737373]">
                      {new Date(hackathon.judgingStart).toLocaleString()}
                      <span className="block text-[#a3a3a3]">to</span>
                      {new Date(hackathon.judgingEnd).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-md border border-[#e5e5e0] px-3 py-1.5 text-xs font-semibold text-[#737373] transition-colors hover:border-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
                          onClick={() => router.push(`/hackathons/${hackathon._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="rounded-md border border-[#e5e5e0] px-3 py-1.5 text-xs font-semibold text-[#737373] transition-colors hover:border-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
                          onClick={() =>
                            router.push(`/admin/hackathons/${hackathon._id}/edit`)
                          }
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
    </AdminRouteGuard>
  );
}
