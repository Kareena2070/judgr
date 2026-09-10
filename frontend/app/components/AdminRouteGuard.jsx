"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminRouteGuard({ children }) {
  const router = useRouter();

  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/student");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <p>Checking authorization...</p>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return children;
}