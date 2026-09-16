"use client";

import { useState } from "react";
import apiClient from "../lib/apiClient";
import InviteMemberForm from "./InviteMemberForm";

export default function TeamDashboard({
  team,
  hackathon,
  currentUserId,
  onTeamUpdated,
}) {
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");

  const members = team.members || [];

  const currentMembership = members.find(
    (member) =>
      currentUserId &&
      member.userId?._id &&
      String(member.userId._id) === String(currentUserId)
  );

  const isLeader = currentMembership?.role === "leader";

  const handleLeave = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this team?"
    );

    if (!confirmed) return;

    try {
      setLeaving(true);
      setError("");

      await apiClient.post(`/teams/${team._id}/leave`);

      onTeamUpdated();
    } catch (error) {
      const code = error.response?.data?.error?.code;

      if (code === "LEADER_MUST_REASSIGN_BEFORE_LEAVING") {
        setError(
          "The team leader must reassign leadership before leaving."
        );
      } else if (code === "NOT_TEAM_MEMBER") {
        setError("You are no longer a member of this team.");
      } else {
        setError("Unable to leave the team.");
      }
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          My Team
        </p>
        <h1 className="mt-1 text-3xl font-bold">{team.name}</h1>

        <p className="mt-2 text-gray-700">
          Members: {members.length} / {hackathon.teamSize.max}
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Members</h2>

        <ul className="mt-4 space-y-3">
          {members.map((member) => (
            <li className="rounded-md border border-gray-200 p-4" key={member._id}>
              <strong className="block">{member.userId?.name}</strong>
              <span className="text-sm text-gray-600">Role: {member.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Team Actions</h2>
        {isLeader && (
          <InviteMemberForm
            teamId={team._id}
            onInvited={onTeamUpdated}
          />
        )}

        <button
          className="mt-4 rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          onClick={handleLeave}
          disabled={leaving || isLeader}
        >
          {leaving ? "Leaving..." : "Leave Team"}
        </button>

        {isLeader && (
          <p className="mt-3 text-sm text-gray-600">
            Team leaders cannot leave until leadership is reassigned.
          </p>
        )}

        {error && <p className="mt-3 text-red-700">{error}</p>}
      </section>
    </div>
  );
}