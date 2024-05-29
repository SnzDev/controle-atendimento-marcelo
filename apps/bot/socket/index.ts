import { io } from "socket.io-client";

const PORT = process.env.SOCKETIO_PORT ?? 4000;
const SOCKET_URL = `http://localhost:${PORT}`;


export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});
