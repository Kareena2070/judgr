"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const hackathonId = pathname.match(/^\/hackathons\/([^/]+)/)?.[1];
  const myTeamHref = hackathonId ? `/hackathons/${hackathonId}/team` : null;

  if (!user) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
      <div>
        <Link className="font-bold" href="/">Judgr</Link>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        {user.role === "student" && (
          <>
            <Link href="/student">Student Dashboard</Link>
            <Link href="/hackathons">Hackathons</Link>
            {myTeamHref && <Link href={myTeamHref}>My Team</Link>}
            <Link href="/student#invitations">My Invitations</Link>
          </>
        )}

        {user.role === "judge" && (
          <>
            <Link href="/judge">Judge Dashboard</Link>
          </>
        )}

        {user.role === "admin" && (
          <>
            <Link href="/admin">Admin Dashboard</Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">
          {user.name} ({user.role})
        </span>

        <button className="rounded-md border border-gray-300 px-3 py-1.5 font-medium hover:bg-gray-50" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}