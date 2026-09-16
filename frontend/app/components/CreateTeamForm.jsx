"use client";

import { useState } from "react";
import apiClient from "../lib/apiClient";

export default function CreateTeamForm({ hackathonId, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter a team name");
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient.post(
        `/hackathons/${hackathonId}/teams`,
        {
          name: name.trim(),
        }
      );

      onCreated(response.data.data);
    } catch (error) {
      const code = error.response?.data?.error?.code;

      if (code === "ALREADY_IN_TEAM") {
        setError("You are already part of a team.");
      } else if (code === "TEAMS_NOT_ACCEPTING") {
        setError("Teams are not currently accepting registrations.");
      } else {
        setError("Unable to create team. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8" onSubmit={handleSubmit}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">
        Start here
      </p>
      <h2 className="mt-2 text-lg font-bold tracking-tight text-[#171717]">
        Create a team
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#737373]">
        Choose a name your teammates will recognize.
      </p>

      <label className="mt-5 block text-sm font-semibold text-[#171717]" htmlFor="team-name">
        Team name
      </label>
      <input
        className="mt-2 h-11 block w-full rounded-md border border-[#e5e5e0] bg-white px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
        id="team-name"
        type="text"
        placeholder="e.g. Pixel Pioneers"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#a3a3a3]"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Team"}
      </button>

      {error && (
        <p className="mt-4 rounded-md bg-[#fee2e2] px-3 py-2 text-sm font-medium leading-5 text-[#b91c1c]">
          {error}
        </p>
      )}
    </form>
  );
}