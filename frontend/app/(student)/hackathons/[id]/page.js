"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import apiClient from "../../../lib/apiClient";
import StatusPill from "../../../components/StatusPill";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-dashed border-[#e5e5e0] bg-white px-4 py-16 text-center text-sm text-[#737373]">
          Loading hackathon...
        </div>
      </main>
    );
  }

  if (!hackathon) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-[#fee2e2] bg-[#fff7f7] px-4 py-16 text-center">
          <h1 className="text-lg font-semibold text-[#b91c1c]">
            Hackathon not found.
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f1f1ee] px-2.5 py-1 text-xs font-semibold text-[#737373]">
                {hackathon.theme}
              </span>
              <StatusPill status={hackathon.status} />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
              {hackathon.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#737373]">
              {hackathon.description}
            </p>
          </div>

          {hackathon.status === "REGISTRATION" ? (
            <Link
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-[#2563eb] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
              href={`/hackathons/${hackathon._id}/team`}
            >
              {teamStatus === "You are not currently part of a team."
                ? "Form a team"
                : "View my team"}
            </Link>
          ) : (
            <span>
              {hackathon.status === "DRAFT"
                ? "Team formation not open yet"
                : "Team formation closed"}
            </span>
          )}
        </div>

        {countdown && (
          <div className="mt-8 border-t border-[#e5e5e0] pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">
              Next deadline
            </p>
            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
              <p className="text-lg font-bold text-[#171717]">{countdown.label}</p>
              <p className="text-sm text-[#737373]">
                {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
          <h2 className="text-lg font-bold tracking-tight text-[#171717]">
            Important dates
          </h2>
          <div className="mt-5 divide-y divide-[#e5e5e0]">
            <div className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold text-[#171717]">Registration</span>
              <span className="text-sm text-[#737373]">
                {formatDate(hackathon.registrationStart)} - {formatDate(hackathon.registrationEnd)}
              </span>
            </div>
            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold text-[#171717]">Submission</span>
              <span className="text-sm text-[#737373]">
                {formatDate(hackathon.submissionStart)} - {formatDate(hackathon.submissionEnd)}
              </span>
            </div>
            <div className="flex flex-col gap-1 py-4 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold text-[#171717]">Judging</span>
              <span className="text-sm text-[#737373]">
                {formatDate(hackathon.judgingStart)} - {formatDate(hackathon.judgingEnd)}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
          <h2 className="text-lg font-bold tracking-tight text-[#171717]">
            Team size
          </h2>
          <p className="mt-4 text-3xl font-bold text-[#171717]">
            {hackathon.teamSize.min}-{hackathon.teamSize.max}
          </p>
          <p className="mt-1 text-sm text-[#737373]">members per team</p>
          <p className="mt-6 border-t border-[#e5e5e0] pt-4 text-sm leading-6 text-[#737373]">
            {teamStatus}
          </p>
        </section>
      </div>
    </main>
  );
}
