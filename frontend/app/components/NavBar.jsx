"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const hackathonId = pathname.match(/^\/hackathons\/([^/]+)/)?.[1];
  const myTeamHref = hackathonId ? `/hackathons/${hackathonId}/team` : null;
  const userInitial =
    user?.name?.trim()?.charAt(0).toUpperCase() ||
    user?.role?.charAt(0).toUpperCase() ||
    "U";

  const linkClass = (href) => {
    const isActive =
      pathname === href ||
      (href !== "/" && pathname.startsWith(`${href}/`));

    return `relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-[#dbeafe] text-[#1d4ed8]"
        : "text-[#737373] hover:bg-[#f1f1ee] hover:text-[#171717]"
    }`;
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="border-b border-[#e5e5e0] bg-white px-4 sm:px-6">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4">
        <Link className="shrink-0 text-lg font-bold tracking-tight text-[#171717]" href="/">
          Judgr
        </Link>

        <div className="ml-auto flex items-center gap-1 overflow-x-auto">
          {user.role === "student" && (
            <>
              <Link
                className={linkClass("/student")}
                href="/student"
                aria-current={pathname === "/student" ? "page" : undefined}
              >
                Dashboard
              </Link>
              <Link
                className={linkClass("/hackathons")}
                href="/hackathons"
                aria-current={pathname.startsWith("/hackathons") ? "page" : undefined}
              >
                Hackathons
              </Link>
              {myTeamHref && (
                <Link
                  className={linkClass(myTeamHref)}
                  href={myTeamHref}
                  aria-current={pathname === myTeamHref ? "page" : undefined}
                >
                  My Team
                </Link>
              )}
              <Link
                className={linkClass("/student#invitations")}
                href="/student#invitations"
              >
                Invitations
              </Link>
            </>
          )}

          {user.role === "judge" && (
            <Link
              className={linkClass("/judge")}
              href="/judge"
              aria-current={pathname === "/judge" ? "page" : undefined}
            >
              Dashboard
            </Link>
          )}

          {user.role === "admin" && (
            <Link
              className={linkClass("/admin")}
              href="/admin"
              aria-current={pathname === "/admin" ? "page" : undefined}
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3 border-l border-[#e5e5e0] pl-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f1ee] text-sm font-bold text-[#171717]">
              {userInitial}
            </span>
            <span className="hidden text-sm font-medium capitalize text-[#171717] sm:inline">
              {user.name}
            </span>
          </div>

          <button
            className="rounded-md border border-[#e5e5e0] px-3 py-2 text-sm font-semibold text-[#737373] transition-colors hover:border-[#171717] hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}