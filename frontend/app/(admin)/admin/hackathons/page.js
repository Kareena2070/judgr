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
    return <p>Loading hackathons...</p>;
  }

  return (
    <AdminRouteGuard>
    <div>
      <h1>Hackathon Management</h1>

      <button onClick={() => router.push("/admin/hackathons/new")}>
        Create Hackathon
      </button>

      {hackathons.length === 0 ? (
        <p>No hackathons found.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Theme</th>
                <th>Status</th>
                <th>Registration</th>
                <th>Submission</th>
                <th>Judging</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {hackathons.map((hackathon) => (
                <tr key={hackathon._id}>
                  <td>{hackathon.title}</td>

                  <td>{hackathon.theme}</td>

                  <td>
                    <StatusPill status={hackathon.status} />
                  </td>

                  <td>
                    {new Date(hackathon.registrationStart).toLocaleString()}
                    {" → "}
                    {new Date(hackathon.registrationEnd).toLocaleString()}
                  </td>

                  <td>
                    {new Date(hackathon.submissionStart).toLocaleString()}
                    {" → "}
                    {new Date(hackathon.submissionEnd).toLocaleString()}
                  </td>

                  <td>
                    {new Date(hackathon.judgingStart).toLocaleString()}
                    {" → "}
                    {new Date(hackathon.judgingEnd).toLocaleString()}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        router.push(`/admin/hackathons/${hackathon._id}/edit`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AdminRouteGuard>
  );
}
