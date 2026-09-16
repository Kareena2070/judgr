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
    <form className="mt-5 rounded-lg border border-[#e5e5e0] bg-[#f8f8f6] p-4 sm:p-5" onSubmit={handleSubmit}>
      <h3 className="text-sm font-bold text-[#171717]">Invite a member</h3>
      <p className="mt-1 text-sm leading-5 text-[#737373]">
        Send an invitation by email.
      </p>

      <label className="mt-4 block text-sm font-semibold text-[#171717]" htmlFor="invite-email">
        Student email
      </label>
      <input
        className="mt-2 block h-10 w-full rounded-md border border-[#e5e5e0] bg-white px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
        id="invite-email"
        type="email"
        placeholder="student@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="mt-3 inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#a3a3a3]"
        type="submit"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Invitation"}
      </button>

      {message && (
        <p className="mt-4 rounded-md bg-[#dcfce7] px-3 py-2 text-sm font-medium leading-5 text-[#15803d]">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-[#fee2e2] px-3 py-2 text-sm font-medium leading-5 text-[#b91c1c]">
          {error}
        </p>
      )}
    </form>
  );
}