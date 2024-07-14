import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SOCKETIO_URL ?? "http://127.0.0.1:4000";


export const socket = io(URL, {

});
