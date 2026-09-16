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
    <form className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Create a Team</h2>

      <input
        className="mt-4 block w-full rounded-md border border-gray-300 px-3 py-2"
        type="text"
        placeholder="Team name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="mt-3 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Team"}
      </button>

      {error && <p className="mt-3 text-red-700">{error}</p>}
    </form>
  );
}