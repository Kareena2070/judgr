"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "../../../../../lib/apiClient";
import HackathonForm from "../../../../../components/HackathonForm";
import AdminRouteGuard from "@/app/components/AdminRouteGuard";

function formatDateTimeLocal(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function EditHackathonPage() {
  const params = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHackathon() {
      try {
        const response = await apiClient.get(`/api/v1/hackathons/${params.id}`);

        console.log("Hackathon:", response.data);

        setHackathon(response.data.data);
      } catch (error) {
        console.error("Failed to fetch hackathon:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathon();
  }, [params.id]);

  if (isLoading) {
    return <p>Loading hackathon...</p>;
  }

  if (!hackathon) {
    return <p>Hackathon not found.</p>;
  }

  return (
    <AdminRouteGuard>
      <div>
        <h1>Edit Hackathon</h1>

        <HackathonForm
          initialData={{
            _id: hackathon._id,
            status: hackathon.status,

            title: hackathon.title,
            description: hackathon.description,
            theme: hackathon.theme,

            registrationStart: formatDateTimeLocal(hackathon.registrationStart),
            registrationEnd: formatDateTimeLocal(hackathon.registrationEnd),

            submissionStart: formatDateTimeLocal(hackathon.submissionStart),
            submissionEnd: formatDateTimeLocal(hackathon.submissionEnd),

            judgingStart: formatDateTimeLocal(hackathon.judgingStart),
            judgingEnd: formatDateTimeLocal(hackathon.judgingEnd),

            teamSize: {
              min: hackathon.teamSize.min,
              max: hackathon.teamSize.max,
            },
          }}
          isEdit={true}
        />
      </div>
    </AdminRouteGuard>
  );
}
