import { socket } from "..";

type Callback = (data: { instanceId: string }) => void;

export const invalidateKanban = (instanceId: string, callback: Callback) =>
  socket.on(
    `invalidate-kanban-${instanceId}`,
    (data: { instanceId: string }) => {
      callback(data);
    },
  );

export const invalidateKanbanOff = (instanceId: string) => {
  socket.off(`invalidate-kanban-${instanceId}`);
};
