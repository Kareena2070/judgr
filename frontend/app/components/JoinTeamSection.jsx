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
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Join an Existing Team</h2>
        <p className="mt-3 text-gray-600">Loading teams...</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Join an Existing Team</h2>

      {message && <p className="mt-3 text-green-700">{message}</p>}
      {error && <p className="mt-3 text-red-700">{error}</p>}

      {teams.length === 0 ? (
        <p className="mt-3 text-gray-600">No teams are currently available.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {teams.map((team) => (
            <li
              className="flex flex-col gap-3 rounded-md border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              key={team._id}
            >
              <div>
                <strong className="block">{team.name}</strong>
                <span className="text-sm text-gray-600">
                  Members: {team.memberCount} / {maxMembers}
                </span>
              </div>

              <button
                className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
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