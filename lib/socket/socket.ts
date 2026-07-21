import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:8000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: false,
    });
  }

  return socket;
}

export function connectSocket(): Socket {
  const instance = getSocket();

  if (!instance.connected) {
    instance.connect();
  }

  return instance;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}
