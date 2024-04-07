import { type BatteryInfo } from "whatsapp-web.js";
import { socket } from "..";


export const changeBattery = (battery: BatteryInfo) => {
  socket.emit("change_battery", battery);
}