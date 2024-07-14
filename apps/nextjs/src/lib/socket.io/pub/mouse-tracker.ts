import { socket } from "..";

interface MouseTrackerProps {
  instanceId: string;
  x: number;
  y: number;
  id: string;
}

export const pubMouseTracker = (data: MouseTrackerProps) => {
  socket.emit(`mouse-tracker`, data);
};

export const subMouseTracker = (
  instanceId: string,
  callback: (data: MouseTrackerProps) => void,
) => {
  socket.on(`mouse-tracker-${instanceId}`, callback);
};
