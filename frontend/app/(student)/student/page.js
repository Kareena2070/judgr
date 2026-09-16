"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "../../lib/apiClient";

function getHackathonId(invitation) {
  const hackathon = invitation.teamId?.hackathonId;

  return hackathon?._id?.toString() || hackathon?.toString() || invitation.hackathonId?.toString();
}

export default function StudentPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [invitations, setInvitations] = useState([]);
  const [invitationsLoading, setInvitationsLoading] = useState(true);
  const [invitationsError, setInvitationsError] = useState("");
  const [acceptingInvitationId, setAcceptingInvitationId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [acceptedInvitation, setAcceptedInvitation] = useState(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  const loadInvitations = useCallback(async () => {
    try {
      setInvitationsLoading(true);
      setInvitationsError("");

      const response = await apiClient.get("/invitations/my");

      setInvitations(response.data.data || []);
    } catch (error) {
      setInvitationsError("Unable to load invitations.");
    } finally {
      setInvitationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading || !user) {
      return undefined;
    }

    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        void loadInvitations();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isLoading, loadInvitations, user]);

  const handleAcceptInvitation = async (invitation) => {
    try {
      setAcceptingInvitationId(invitation._id);
      setInvitationsError("");
      setSuccessMessage("");

      const response = await apiClient.post(
        `/invitations/${invitation._id}/accept`,
      );
      const acceptedMembership = response.data.data;
      const acceptedHackathonId =
        acceptedMembership?.hackathonId?.toString() ||
        getHackathonId(invitation);

      setAcceptedInvitation({
        ...invitation,
        hackathonId: acceptedHackathonId,
      });
      setSuccessMessage("Invitation accepted successfully.");
      await loadInvitations();
    } catch (error) {
      const code = error.response?.data?.error?.code;

      if (code === "INVITATION_ALREADY_ACCEPTED") {
        setInvitationsError("This invitation has already been accepted.");
      } else if (code === "ALREADY_IN_TEAM") {
        setInvitationsError("You are already a member of a team.");
      } else if (code === "TEAMS_NOT_ACCEPTING") {
        setInvitationsError("This team is no longer accepting members.");
      } else {
        setInvitationsError("Unable to accept this invitation.");
      }
    } finally {
      setAcceptingInvitationId(null);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>

        {user && (
          <div className="mt-4 space-y-1 text-gray-700">
            <p>Welcome, {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        )}
      </section>

      <section id="invitations" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">My Invitations</h2>

        {invitationsLoading ? (
          <p className="mt-3 text-gray-600">Loading invitations...</p>
        ) : invitationsError ? (
          <p className="mt-3 text-red-700">{invitationsError}</p>
        ) : invitations.length === 0 ? (
          <>
            <p className="mt-3 text-gray-700">
              You don&apos;t have any pending team invitations.
            </p>
            <Link
              className="mt-4 inline-block rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
              href="/hackathons"
            >
              Browse Hackathons
            </Link>
          </>
        ) : (
          <div className="mt-4 space-y-4">
            {invitations.map((invitation) => {
              const hackathon = invitation.teamId?.hackathonId;
              const hackathonId = getHackathonId(invitation);

              return (
                <article
                  className="rounded-md border border-gray-200 p-4"
                  key={invitation._id}
                >
                  <h3 className="font-semibold">Team Invitation</h3>
                  <p className="mt-2 text-lg font-medium">
                    {invitation.teamId?.name || "Team invitation"}
                  </p>
                  <p className="mt-2 text-gray-700">{invitation.message}</p>
                  {hackathon && (
                    <p className="mt-2 text-sm text-gray-600">
                      Hackathon: {hackathon.title || hackathonId}
                    </p>
                  )}
                  {invitation.createdAt && (
                    <p className="mt-1 text-sm text-gray-600">
                      Received: {new Date(invitation.createdAt).toLocaleString()}
                    </p>
                  )}
                  <button
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    disabled={acceptingInvitationId === invitation._id}
                    onClick={() => handleAcceptInvitation(invitation)}
                  >
                    {acceptingInvitationId === invitation._id
                      ? "Accepting..."
                      : "Accept Invitation"}
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4">
            <p className="text-green-800">{successMessage}</p>
            {getHackathonId(acceptedInvitation) && (
              <Link
                className="mt-3 inline-block rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800"
                href={`/hackathons/${getHackathonId(acceptedInvitation)}/team`}
              >
                Go to My Team
              </Link>
            )}
            {!getHackathonId(acceptedInvitation) && (
              <p className="mt-3 text-red-700">
                Your invitation was accepted, but the team hackathon could not
                be identified. Reload the page and try again.
              </p>
            )}
          </div>
        )}
      </section>

      <Link className="inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" href="/hackathons">
        Browse Hackathons
      </Link>

      <button className="block rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50" onClick={logout}>
        Logout
      </button>
    </main>
  );
}