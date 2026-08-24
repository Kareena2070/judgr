"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiClient, { setAccessToken } from "../lib/apiClient";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [accessToken, setAuthAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const register = async (name, email, password) => {
    try {
      const response = await apiClient.post("/api/v1/auth/register", {
        name,
        email,
        password,
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/api/v1/auth/login", {
        email,
        password,
      });

      const { user, accessToken: newAccessToken } = response.data.data;

      setAccessToken(newAccessToken);
      setAuthAccessToken(newAccessToken);
      setUser(user);

      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear access token from memory
      setAccessToken(null);
      setAuthAccessToken(null);

      // Clear logged-in user
      setUser(null);

      // Go to login page
      router.push("/login");
    }
  };

  const refresh = async () => {
    try {
      const response = await apiClient.post("/api/v1/auth/refresh");

      const newAccessToken = response.data.data.accessToken;

      setAccessToken(newAccessToken);
      setAuthAccessToken(newAccessToken);

      return newAccessToken;
    } catch (error) {
      setAccessToken(null);
      setAuthAccessToken(null);
      setUser(null);

      return null;
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const newAccessToken = await refresh();

      if (newAccessToken) {
        try {
          const response = await apiClient.get("/api/v1/auth/me");

          setUser(response.data.data);
        } catch (error) {
          setAccessToken(null);
          setAuthAccessToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const value = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
