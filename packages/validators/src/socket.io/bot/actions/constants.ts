export enum BotActionTypes {
  MessageReceived = "message-received",
  MessageGroup = "message-group",
  MessageCreated = "message-created",
  Ack = "ack",
  QR = "qr",
  Disconnected = "disconnected",
  // Connected = "connected",
}

export enum ACK {
  ACK_ERROR = -1,
  ACK_PENDING = 0,
  ACK_SERVER = 1,
  ACK_DEVICE = 2,
  ACK_READ = 3,
  ACK_PLAYED = 4,
}
