"use client";

import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket/socket";
import { mergePullRequest, type MergePullRequestPayload } from "@/lib/api/pr";
import { useAppStore } from "@/lib/store/app-store";

export function SocketProvider() {
  const username = useAppStore((state) => state.user?.username ?? null);

  useEffect(() => {
    const socket = connectSocket();

    function registerUser() {
      if (username) {
        socket.emit("register_user", { username });
        console.log("register_user emitted:", username);
      }
    }

    function handleConnect() {
      console.log("socket connected:", socket.id);
      registerUser();
    }

    function handleMessage(payload: unknown) {
      console.log("socket message:", payload);
    }

    function handleDisconnect(reason: string) {
      console.log("socket disconnected:", reason);
    }

    async function handlePrMerge(payload: MergePullRequestPayload) {
      if (!payload?.repo_name || payload?.pull_number == null) {
        return;
      }

      try {
        await mergePullRequest({
          repo_name: payload.repo_name,
          pull_number: Number(payload.pull_number),
        });
        console.log("pr merged:", payload);
      } catch (error) {
        console.error("failed to merge pr:", error);
      }
    }

    socket.on("connect", handleConnect);
    socket.on("message", handleMessage);
    socket.on("disconnect", handleDisconnect);
    socket.on("pr_merge", handlePrMerge);

    if (socket.connected) {
      registerUser();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("message", handleMessage);
      socket.off("disconnect", handleDisconnect);
      socket.off("pr_merge", handlePrMerge);
    };
  }, [username]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return null;
}

export { getSocket };
