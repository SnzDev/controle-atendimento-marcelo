import { socket } from "..";


export const changeProfilePic = (pic: string) => {
  socket.emit("change-profile-pic", pic);
}