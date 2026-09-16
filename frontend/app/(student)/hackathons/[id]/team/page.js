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
    return <main className="p-6"><p>Loading team...</p></main>;
  }

  if (error) {
    return <main className="p-6"><p className="text-red-700">{error}</p></main>;
  }

  if (!hackathon) {
    return <main className="p-6"><p>Hackathon not found.</p></main>;
  }

  if (!team) {
    return (
      <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
        <div>
          <p className="text-sm text-gray-600">{hackathon.title}</p>
          <h1 className="text-3xl font-bold">Your Team</h1>
        </div>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Your Team</h2>
          <p className="mt-2 text-gray-700">
            You are not currently part of a team.
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
    <main className="mx-auto w-full max-w-3xl p-6">
      <TeamDashboard
        team={team}
        hackathon={hackathon}
        currentUserId={user?.id}
        onTeamUpdated={loadTeam}
      />
    </main>
  );
}
