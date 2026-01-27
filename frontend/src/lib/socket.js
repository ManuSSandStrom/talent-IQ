import { io } from "socket.io-client";

// In production, this should point to your deployed backend URL
// In development, it points to localhost:5000 (proxied via Vite usually, but here we can be explicit or relative)

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
