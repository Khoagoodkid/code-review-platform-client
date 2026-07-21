"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ExitIcon } from "@radix-ui/react-icons";
import { Avatar } from "@radix-ui/themes";
import { Button } from "@/components/shared/Button";
import { logoutUser } from "@/lib/auth/session";
import { useAppStore } from "@/lib/store/app-store";

type NavItem = {
  label: string;
  href: string;
};

const defaultNavItems: NavItem[] = [
  { label: "Repositories", href: "/user" },
];

type TopNavProps = {
  navItems?: NavItem[];
};

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export function TopNav({ navItems = defaultNavItems }: TopNavProps) {
  const pathname = usePathname();
  const { user, loading } = useAppStore();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logoutUser();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 sm:px-10">
        <div className="flex items-center gap-8">
          <Link href="/user" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-sky-500/10">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4 text-indigo-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-white sm:inline">
              Code Review
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <>
              <span className="hidden h-4 w-24 animate-pulse rounded bg-white/10 sm:inline" />
              <span className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
            </>
          ) : user ? (
            <>
              <span className="hidden text-sm text-zinc-400 sm:inline">
                {user.username}
              </span>
              <Avatar
                size="2"
                radius="full"
                fallback={getInitials(user.username)}
                src={user.avatar_url}
              />
              <Button
                size="2"
                variant="soft"
                color="gray"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <ExitIcon />
                {loggingOut ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
