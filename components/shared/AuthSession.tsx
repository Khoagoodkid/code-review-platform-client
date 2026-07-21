"use client";

import { useEffect } from "react";
import { registerLogoutHandler } from "@/lib/auth/session";
import { useAppStore } from "@/lib/store/app-store";

export function AuthSession() {
  const logout = useAppStore((state) => state.logout);

  useEffect(() => {
    registerLogoutHandler(logout);
  }, [logout]);

  return null;
}
