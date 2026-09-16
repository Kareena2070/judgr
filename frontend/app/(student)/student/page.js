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
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">
          Student Dashboard
        </h1>

        {user && (
          <div className="mt-4 space-y-1 text-sm leading-6 text-[#737373]">
            <p>Welcome, {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        )}
      </section>

      <section id="invitations" className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-[#171717]">
          My Invitations
        </h2>

        {invitationsLoading ? (
          <p className="mt-4 text-sm leading-6 text-[#737373]">
            Loading invitations...
          </p>
        ) : invitationsError ? (
          <p className="mt-4 rounded-md bg-[#fee2e2] px-3 py-2 text-sm font-medium leading-5 text-[#b91c1c]">
            {invitationsError}
          </p>
        ) : invitations.length === 0 ? (
          <div className="mt-5 rounded-lg border border-dashed border-[#e5e5e0] bg-[#f8f8f6] px-4 py-10 text-center">
            <p className="text-sm leading-6 text-[#737373]">
              You don&apos;t have any pending team invitations.
            </p>
            <Link
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-[#e5e5e0] bg-white px-4 text-sm font-semibold text-[#171717] transition-colors hover:border-[#2563eb] hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
              href="/hackathons"
            >
              Browse Hackathons
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {invitations.map((invitation) => {
              const hackathon = invitation.teamId?.hackathonId;
              const hackathonId = getHackathonId(invitation);

              return (
                <article
                  className="rounded-lg border border-[#e5e5e0] bg-[#f8f8f6] p-5"
                  key={invitation._id}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">
                    Team Invitation
                  </h3>
                  <p className="mt-3 text-lg font-bold tracking-tight text-[#171717]">
                    {invitation.teamId?.name || "Team invitation"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#737373]">
                    {invitation.message}
                  </p>
                  {hackathon && (
                    <p className="mt-3 text-xs font-medium text-[#737373]">
                      Hackathon: {hackathon.title || hackathonId}
                    </p>
                  )}
                  {invitation.createdAt && (
                    <p className="mt-1 text-xs text-[#737373]">
                      Received: {new Date(invitation.createdAt).toLocaleString()}
                    </p>
                  )}
                  <button
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#a3a3a3]"
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
          <div className="mt-5 rounded-md bg-[#dcfce7] p-4">
            <p className="text-sm font-medium leading-5 text-[#15803d]">
              {successMessage}
            </p>
            {getHackathonId(acceptedInvitation) && (
              <Link
                className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-[#15803d] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:ring-offset-2"
                href={`/hackathons/${getHackathonId(acceptedInvitation)}/team`}
              >
                Go to My Team
              </Link>
            )}
            {!getHackathonId(acceptedInvitation) && (
              <p className="mt-3 text-sm font-medium leading-5 text-[#b91c1c]">
                Your invitation was accepted, but the team hackathon could not
                be identified. Reload the page and try again.
              </p>
            )}
          </div>
        )}
      </section>

      <Link className="inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2" href="/hackathons">
        Browse Hackathons
      </Link>

      <button className="block rounded-md border border-[#e5e5e0] px-4 py-2 text-sm font-semibold text-[#737373] transition-colors hover:border-[#171717] hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2" onClick={logout}>
        Logout
      </button>
    </main>
  );
}