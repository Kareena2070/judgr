"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <nav>
      <div>
        <Link href="/">Judgr</Link>
      </div>

      <div>
        {user.role === "student" && (
          <Link href="/student">Student Dashboard</Link>
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

      <div>
        <span>
          {user.name} ({user.role})
        </span>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}