"use client";

import { useState } from "react";
import apiClient from "../lib/apiClient";

export default function InviteMemberForm({ teamId, onInvited }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter an email");
      return;
    }

    try {
      setLoading(true);

      await apiClient.post(`/teams/${teamId}/invitations`, {
        email: email.trim(),
      });

      setMessage("Invitation sent successfully.");
      setEmail("");

      if (onInvited) {
        onInvited();
      }
    } catch (error) {
      const code = error.response?.data?.error?.code;

      if (code === "USER_NOT_FOUND") {
        setError("No student was found with this email.");
      } else if (code === "ALREADY_IN_TEAM") {
        setError("This student is already in a team.");
      } else if (code === "ONLY_TEAM_LEADER_CAN_INVITE") {
        setError("Only the team leader can invite members.");
      } else {
        setError("Unable to send invitation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4" onSubmit={handleSubmit}>
      <h3 className="font-semibold">Invite a Member</h3>

      <input
        className="mt-3 block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
        type="email"
        placeholder="student@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="mt-3 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        type="submit"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Invitation"}
      </button>

      {message && <p className="mt-3 text-green-700">{message}</p>}
      {error && <p className="mt-3 text-red-700">{error}</p>}
    </form>
  );
}