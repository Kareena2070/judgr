"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import apiClient from "../../../../lib/apiClient";
import CreateTeamForm from "../../../../components/CreateTeamForm";
import TeamDashboard from "../../../../components/TeamDashboard";
import JoinTeamSection from "../../../../components/JoinTeamSection";

export default function TeamPage() {
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();

  const hackathonId = params.id;

  const [team, setTeam] = useState(null);
  const [hackathon, setHackathon] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeam = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get(
        `/hackathons/${hackathonId}/my-team`,
      );

      const myTeam = response.data.data;

      const teamResponse = await apiClient.get(`/teams/${myTeam._id}`);

      setTeam(teamResponse.data.data);
    } catch (error) {
      const code = error.response?.data?.error?.code;

      if (code === "TEAM_NOT_FOUND") {
        setTeam(null);
      } else {
        setError("Unable to load your team.");
      }
    } finally {
      setLoading(false);
    }
  }, [hackathonId]);

  const loadHackathon = useCallback(async () => {
    try {
      const response = await apiClient.get(`/hackathons/${hackathonId}`);

      setHackathon(response.data.data);
    } catch (error) {
      setError("Unable to load hackathon.");
    }
  }, [hackathonId]);

  useEffect(() => {
    const loadPage = async () => {
      await Promise.all([loadHackathon(), loadTeam()]);
    };

    void loadPage();
  }, [loadHackathon, loadTeam]);

  if (authLoading || loading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-dashed border-[#e5e5e0] bg-white px-4 py-16 text-center text-sm text-[#737373]">
          Loading team...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="rounded-md bg-[#fee2e2] px-4 py-3 text-sm font-medium text-[#b91c1c]">
          {error}
        </p>
      </main>
    );
  }

  if (!hackathon) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="rounded-md border border-[#e5e5e0] bg-white px-4 py-6 text-sm text-[#737373]">
          Hackathon not found.
        </p>
      </main>
    );
  }

  if (!team) {
    return (
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
            {hackathon.title}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
            Your Team
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#737373]">
            Build your team or join one that is already forming.
          </p>
        </div>

        <section className="rounded-xl border border-dashed border-[#bfdbfe] bg-[#eff6ff] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">
            Team workspace
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-[#171717]">
            No team yet
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#737373]">
            You are not currently part of a team. Create one to start inviting collaborators.
          </p>
        </section>

        <CreateTeamForm hackathonId={hackathonId} onCreated={loadTeam} />

        <JoinTeamSection
          hackathonId={hackathonId}
          maxMembers={hackathon.teamSize.max}
          onJoined={loadTeam}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <TeamDashboard
        team={team}
        hackathon={hackathon}
        currentUserId={user?.id}
        onTeamUpdated={loadTeam}
      />
    </main>
  );
}
