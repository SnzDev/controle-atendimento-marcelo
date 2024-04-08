import http from "http";
import { Server } from "socket.io";
import { qr } from "./bot-to-client/qr";
import { ready } from "./bot-to-client/ready";
import { logout } from "./client-to-bot/logout";
import { disconnected } from "./bot-to-client/disconnected";
import { messageSend } from "./client-to-bot/message-send";
import { message } from "./bot-to-client/message";
import { messageCreate } from "./bot-to-client/message-create";
import { messageAck } from "./bot-to-client/message-ack";
import { messageRevokeEveryone } from "./bot-to-client/message-revoke-everyone";

const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });

export const PORT = process.env.SOCKETIO_PORT ?? 4000;

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected`);
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  //Bot to Client
  qr(socket);
  ready(socket);
  disconnected(socket);
  message(socket);
  messageCreate(socket);
  messageAck(socket);
  messageRevokeEveryone(socket);

  //Client to Bot
  logout(socket);
  messageSend(socket);

});

server.listen(PORT, () => {
  return console.log(`Socket.Io is listening at http://localhost:${PORT}`);
});