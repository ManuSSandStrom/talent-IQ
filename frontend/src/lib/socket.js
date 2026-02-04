import { io } from "socket.io-client";

// Production backend URL
const SOCKET_URL = "https://talent-iq-backend-h0rb.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
