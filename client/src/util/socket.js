import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");

const emitRemoteEvent = (socket, action, payload = {}) => {
  socket.emit("sync-event", {
    action,
    payload,
  });
};

export { socket, emitRemoteEvent };
