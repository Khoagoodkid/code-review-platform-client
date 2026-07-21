import { logoutRequest } from "@/lib/api/logout";

type LogoutHandler = () => void;

let logoutHandler: LogoutHandler | null = null;

export function registerLogoutHandler(handler: LogoutHandler) {
  logoutHandler = handler;
}

export async function logoutUser() {
  try {
    await logoutRequest();
  } catch {
    // Continue with local logout even if the API call fails.
  }

  logoutHandler?.();

  if (typeof window !== "undefined") {
    window.location.assign("/login");
  }
}

export function performLogout() {
  void logoutUser();
}
