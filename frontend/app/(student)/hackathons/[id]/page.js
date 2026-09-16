"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import apiClient from "../../../lib/apiClient";

export default function StudentHackathonDetailPage() {
  const params = useParams();

  const [hackathon, setHackathon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [teamStatus, setTeamStatus] = useState("Loading team status...");

  useEffect(() => {
    if (!hackathon) return;

    function updateCountdown() {
      const now = Date.now();

      const registrationStart = new Date(hackathon.registrationStart).getTime();

      const registrationEnd = new Date(hackathon.registrationEnd).getTime();

      const submissionEnd = new Date(hackathon.submissionEnd).getTime();

      const judgingEnd = new Date(hackathon.judgingEnd).getTime();

      let deadline = null;
      let label = "";

      if (now < registrationStart) {
        deadline = registrationStart;
        label = "Registration starts in";
      } else if (now < registrationEnd) {
        deadline = registrationEnd;
        label = "Registration ends in";
      } else if (now < submissionEnd) {
        deadline = submissionEnd;
        label = "Submission ends in";
      } else if (now < judgingEnd) {
        deadline = judgingEnd;
        label = "Judging ends in";
      } else {
        setCountdown(null);
        return;
      }

      const difference = deadline - now;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown({
        label,
        days,
        hours,
        minutes,
        seconds,
      });
    }

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [hackathon]);

  useEffect(() => {
    async function fetchHackathon() {
      try {
        const response = await apiClient.get(`/hackathons/${params.id}`);

        console.log("Hackathon detail:", response.data);

        setHackathon(response.data.data);
      } catch (error) {
        console.error("Failed to fetch hackathon:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathon();
  }, [params.id]);

  useEffect(() => {
    async function fetchTeamStatus() {
      try {
        await apiClient.get(`/hackathons/${params.id}/my-team`);
        setTeamStatus("You are currently part of a team.");
      } catch (error) {
        if (error.response?.data?.error?.code === "TEAM_NOT_FOUND") {
          setTeamStatus("You are not currently part of a team.");
        } else {
          setTeamStatus("Team status is unavailable.");
        }
      }
    }

    fetchTeamStatus();
  }, [params.id]);

  if (isLoading) {
    return <p>Loading hackathon...</p>;
  }

  if (!hackathon) {
    return <p>Hackathon not found.</p>;
  }

  return (
    <div>
      <h1>{hackathon.title}</h1>

      <p>{hackathon.description}</p>

      <p>
        <strong>Theme:</strong> {hackathon.theme}
      </p>

      <p>
        <strong>Status:</strong> {hackathon.status}
      </p>

      {countdown && (
        <div>
          <h2>Next Deadline</h2>

          <p>{countdown.label}</p>

          <p>
            {countdown.days} days {countdown.hours} hours {countdown.minutes}{" "}
            minutes {countdown.seconds} seconds
          </p>
        </div>
      )}
      <h2>Registration</h2>

      <p>
        {new Date(hackathon.registrationStart).toLocaleString()}
        {" → "}
        {new Date(hackathon.registrationEnd).toLocaleString()}
      </p>

      <h2>Submission</h2>

      <p>
        {new Date(hackathon.submissionStart).toLocaleString()}
        {" → "}
        {new Date(hackathon.submissionEnd).toLocaleString()}
      </p>

      <h2>Judging</h2>

      <p>
        {new Date(hackathon.judgingStart).toLocaleString()}
        {" → "}
        {new Date(hackathon.judgingEnd).toLocaleString()}
      </p>

      <h2>Team Size</h2>

      <p>
        {hackathon.teamSize.min} - {hackathon.teamSize.max} members
      </p>
    </div>
  );

      <section className="my-6 max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Team</h2>
        <p className="mt-2 text-gray-700">
          Create or manage your team for this hackathon.
        </p>
        <p className="mt-2 text-sm text-gray-600">{teamStatus}</p>
        <Link
          className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          href={`/hackathons/${hackathon._id}/team`}
        >
          Go to Team
        </Link>
      </section>
}
