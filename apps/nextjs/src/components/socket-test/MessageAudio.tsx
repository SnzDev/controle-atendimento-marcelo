import { useEffect, useRef, useState } from "react";
import { type IBody } from "~/pages/api/webhook/whatsapp";
import { socket } from "~/utils/socket";

export const MessageAudio = () => {
  const [messages, setMessages] = useState<IBody[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const play = async () => {
    if (audioRef.current) {
      await audioRef.current.play()
    } else {
      // Throw error
    }
  }

  useEffect(() => {
    const speak = (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    };


    async function onMessageCreated(value: IBody) {
      setMessages((prev) => [...prev, value]);
      const pushname = value.message?.fromMe ? value.fromInfo?.pushname : value.toInfo?.pushname;
      speak(`${pushname} disse: ${value.message?.body}`);
      console.log({ value });
      await play();
    }
    socket.on('message-kanban', () => {
      console.log('message-kanban')
    });

    return () => {
      // socket.off('message-kanban', onMessageCreated);
    };
  }, []);

  return (<div>
    <p className="text-white">{JSON.stringify({ messages }, null, 2)
    }</p>
    <button className="text-white" onClick={play}> Play </button>
    <audio ref={audioRef} src='/sounds/notification-message.mp3' />
  </div >
  );

}
