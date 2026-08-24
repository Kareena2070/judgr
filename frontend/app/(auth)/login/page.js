"use client";

import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient.js";

export default function LoginPage() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await apiClient.get("/api/v1/health");

        console.log("Health response:", response.data);

        setStatus("Backend connected");
      } catch (error) {
        console.error("Health check failed:", error);

        setStatus("Backend connection failed");
      }
    };

    checkBackend();
  }, []);

  return (
    <main>
      <h1>Login</h1>
      <p>Login page coming soon</p>

      <p>{status}</p>
    </main>
  );
}