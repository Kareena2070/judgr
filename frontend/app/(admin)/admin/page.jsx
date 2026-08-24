"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/student");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>

      <p>Welcome, {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </main>
  );
}