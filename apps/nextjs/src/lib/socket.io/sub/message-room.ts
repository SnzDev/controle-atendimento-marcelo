
// import { socket } from "..";

// type Callback = (data: MessageSchema) => void;

// export const messageRoom = (phone: string, callback: Callback) =>
//   socket.on(`message-${phone}`, (data: MessageSchema) => {
//     const parse = messageSchema.safeParse(data);

//     if (!parse.success) return console.error(parse.error.format());

//     callback(data);
//   });

// export const messageRoomOff = (phone: string) => {
//   socket.off(`message-${phone}`);
// };
