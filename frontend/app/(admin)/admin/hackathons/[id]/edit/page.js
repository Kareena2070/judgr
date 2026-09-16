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
        const response = await apiClient.get(`/hackathons/${params.id}`);

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
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <p className="rounded-lg border border-dashed border-[#e5e5e0] bg-white px-4 py-12 text-center text-sm text-[#737373]">
          Loading hackathon...
        </p>
      </main>
    );
  }

  if (!hackathon) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <p className="rounded-lg border border-[#fee2e2] bg-[#fff7f7] px-4 py-12 text-center text-sm font-medium text-[#b91c1c]">
          Hackathon not found.
        </p>
      </main>
    );
  }

  return (
    <AdminRouteGuard>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
            Hackathons
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
            Edit Hackathon
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#737373]">
            Update the event details while respecting its current lifecycle.
          </p>
        </div>

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
      </main>
    </AdminRouteGuard>
  );
}
