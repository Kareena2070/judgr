"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
    } else if (user.role === "student") {
      router.replace("/student");
    } else if (user.role === "judge") {
      router.replace("/judge");
    } else if (user.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  return null;
}