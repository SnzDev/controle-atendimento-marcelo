import { socket } from "~/utils/socket";
import { ConnectionManager } from "./ConnectionManager";
import { ConnectionState } from "./ConnectionState";
import { Events } from "./Events";
import { MyForm } from "./MyForm";
import { useEffect, useState } from "react";
import { type IBody } from "~/pages/api/webhook/whatsapp";
import { QrCode } from "./QrCode";

export default function SocketTest() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<IBody[]>([]);
  const [qrCodeEvents, setQrCodeEvents] = useState<string[]>([]);

  useEffect(() => {
    const speak = (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    };
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessageCreated(value: IBody) {
      setMessages((prev) => [...prev, value]);
      const pushname = value.message?.fromMe ? value.fromInfo?.pushname : value.toInfo?.pushname;
      speak(`${pushname} disse: ${value.message?.body}`);
    }

    function onQrCodeEvent(value: string) {
      setQrCodeEvents((prev) => [...prev, value]);
      speak('Qr code atualizado!')
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message_create', onMessageCreated);
    socket.on('qr', onQrCodeEvent);


    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message_create', onMessageCreated);
      socket.off('qr', onQrCodeEvent);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-3">
      <ConnectionState isConnected={isConnected} />
      <QrCode qr={qrCodeEvents} />
      <Events events={messages.map(item => `${item.message?.fromMe ? item.fromInfo?.pushname : item.toInfo?.pushname}: ${item.message?.body}`)} />
      <ConnectionManager />
      <MyForm />
    </div>
  );
}