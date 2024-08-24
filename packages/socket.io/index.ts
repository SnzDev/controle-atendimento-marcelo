import http from "http";
import { Server } from "socket.io";
import { disconnected } from "./bot-to-client/disconnected";
import { message } from "./bot-to-client/message";
import { messageAck } from "./bot-to-client/message-ack";
import { messageCreate } from "./bot-to-client/message-create";
import { messageGroup } from "./bot-to-client/message-group";
import { messageRevokeEveryone } from "./bot-to-client/message-revoke-everyone";
import { qr } from "./bot-to-client/qr";
import { ready } from "./bot-to-client/ready";
import { messageSend } from "./client-to-bot/message-send";
import { logout } from "./client-to-bot/logout";

const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });

export const PORT = process.env.SOCKET_IO_PORT ?? 4000;

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected`);
  socket.on("disconnect", () => {

    console.log("A user disconnected", socket.disconnected);
  });

  //Bot to Client
  qr(socket);
  ready(socket);
  disconnected(socket);
  message(socket);
  message(socket);
  messageCreate(socket);
  messageAck(socket);
  messageRevokeEveryone(socket);
  messageGroup(socket);

  // Client to Bot
  logout(socket);
  messageSend(socket);

});

server.listen(PORT, () => {
  return console.log(`Socket.Io is listening at 0.0.0.0:${PORT}`);
});