import { io } from 'socket.io-client';

const PORT = process.env.NEXT_PUBLIC_SOCKETIO_PORT ?? 4000;
const URL = `${process.env.NEXT_PUBLIC_SOCKETIO_URL}:${PORT}`;


export const socket = io(URL);