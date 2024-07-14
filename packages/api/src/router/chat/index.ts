import { createTRPCRouter } from "../../trpc";
import { finalizeChat } from "./finalizeChat";
import { findChats } from "./findChats";
import { getMessagesByChatId } from "./getMessagesByChatId";
import { getContactByChatId } from "./getcontactByChatId";
import { startAssignmentByChatId } from "./startAssignmentByChatId";


export const chatRouter = createTRPCRouter({
  getMessagesByChatId,
  getContactByChatId,
  finalizeChat,
  findChats,
  startAssignmentByChatId
});