import { io } from "socket.io-client";
import { BACKEND_URL } from "./config";

const socket = io(BACKEND_URL);

const emitEvent = (action, payload = {}) => {
  socket.emit("sync-event", {
    action,
    payload,
  });
};

export { socket, emitEvent };
