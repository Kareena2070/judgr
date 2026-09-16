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
      <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
          My team
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
          {team.name}
        </h1>

        <p className="mt-3 text-sm text-[#737373]">
          {members.length} of {hackathon.teamSize.max} members
        </p>
      </section>

      <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <h2 className="text-lg font-bold tracking-tight text-[#171717]">
          Members
        </h2>

        <ul className="mt-5 divide-y divide-[#e5e5e0]">
          {members.map((member) => (
            <li className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" key={member._id}>
              <strong className="text-sm font-semibold text-[#171717]">
                {member.userId?.name}
              </strong>
              <span className="rounded-full bg-[#f1f1ee] px-2.5 py-1 text-xs font-semibold capitalize text-[#737373]">
                {member.role}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <h2 className="text-lg font-bold tracking-tight text-[#171717]">
          Team actions
        </h2>
        {isLeader && (
          <InviteMemberForm
            teamId={team._id}
            onInvited={onTeamUpdated}
          />
        )}

        <button
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-[#e5e5e0] px-4 text-sm font-semibold text-[#737373] transition-colors hover:border-[#b91c1c] hover:text-[#b91c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#f1f1ee] disabled:text-[#a3a3a3]"
          onClick={handleLeave}
          disabled={leaving || isLeader}
        >
          {leaving ? "Leaving..." : "Leave Team"}
        </button>

        {isLeader && (
          <p className="mt-3 rounded-md bg-[#fef3c7] px-3 py-2 text-sm leading-5 text-[#a16207]">
            Team leaders cannot leave until leadership is reassigned.
          </p>
        )}

        {error && (
          <p className="mt-3 rounded-md bg-[#fee2e2] px-3 py-2 text-sm font-medium leading-5 text-[#b91c1c]">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}