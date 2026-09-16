"use client";

import { useCallback, useEffect, useState } from "react";
import apiClient from "../lib/apiClient";

export default function JoinTeamSection({
  hackathonId,
  maxMembers,
  onJoined,
}) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningTeamId, setJoiningTeamId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get(
        `/hackathons/${hackathonId}/teams`
      );

      setTeams(response.data.data || []);
    } catch (error) {
      console.error(error);

      setError("Unable to load teams.");
    } finally {
      setLoading(false);
    }
  }, [hackathonId]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        void loadTeams();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [loadTeams]);

  const handleJoin = async (teamId) => {
    try {
      setJoiningTeamId(teamId);
      setError("");
      setMessage("");

      await apiClient.post(`/teams/${teamId}/join`);

      setMessage("Joined team successfully.");

      if (onJoined) {
        await onJoined();
      }
    } catch (error) {
      const code = error.response?.data?.error?.code;

      if (code === "ALREADY_IN_TEAM") {
        setError("You are already part of a team.");
      } else if (code === "TEAM_FULL") {
        setError("This team is already full.");
      } else if (code === "TEAMS_NOT_ACCEPTING") {
        setError("Teams are not currently accepting registrations.");
      } else {
        setError("Unable to join this team.");
      }
    } finally {
      setJoiningTeamId(null);
    }
  };

  if (loading) {
    return (
      <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-[#171717]">
          Join an Existing Team
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#737373]">Loading teams...</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-[#171717]">
        Join an Existing Team
      </h2>

      {message && (
        <p className="mt-4 rounded-md bg-[#dcfce7] px-3 py-2 text-sm font-medium text-[#15803d]">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-[#fee2e2] px-3 py-2 text-sm font-medium text-[#b91c1c]">
          {error}
        </p>
      )}

      {teams.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-[#e5e5e0] bg-[#f8f8f6] px-4 py-8 text-center text-sm leading-6 text-[#737373]">
          No teams are currently available.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {teams.map((team) => (
            <li
              className="flex flex-col gap-4 rounded-lg border border-[#e5e5e0] bg-[#f8f8f6] p-4 transition-colors hover:border-[#bfdbfe] sm:flex-row sm:items-center sm:justify-between"
              key={team._id}
            >
              <div>
                <strong className="block text-sm font-semibold text-[#171717]">
                  {team.name}
                </strong>
                <span className="mt-1 block text-xs text-[#737373]">
                  Members: {team.memberCount} / {maxMembers}
                </span>
              </div>

              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#a3a3a3]"
                onClick={() => handleJoin(team._id)}
                disabled={joiningTeamId === team._id}
              >
                {joiningTeamId === team._id
                  ? "Joining..."
                  : "Join Team"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}