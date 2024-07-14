"use client";

import { ArrowSquareRight } from "iconsax-react";
import type { FormEvent, KeyboardEvent } from "react";
import { useState } from "react";

import { Textarea } from "~/components/ui/textarea";
import { messageSend } from "~/lib/socket.io/pub/message-send";
import { api } from "~/utils/api";

interface SendMessageProps {
  phone: string;
  chatId: string;
}

export function SendMessage({ phone, chatId }: SendMessageProps) {
  const [handleInputMessage, setHandleInputMessage] = useState("");
  const { data } = api.auth.getSession.useQuery();
  const apiUtils = api.useUtils();

  const handleSubmit = (
    e: KeyboardEvent<HTMLDivElement> | FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement> | undefined,
  ) => {
    e?.preventDefault();
    if (!handleInputMessage) return;
    messageSend({
      phone,
      message: `*${data?.user.name}*: ${handleInputMessage}`,
    });

    apiUtils.chat.getMessagesByChatId.setData({ chatId }, (prev) => {
      return prev ? [...prev, {
        fromMe: true, ack: 0, body: `*${data?.user.name}*: ${handleInputMessage}`, chatId, createdAt: new Date(),
        fileKey: null,
        from: "",
        id: "",
        isGif: false,
        isRevoked: false,
        location: null,
        mimetype: null,
        protocol: "",
        timestamp: new Date().getTime(),
        to: phone,
        type: "chat",
        updatedAt: new Date,
        vcard: null
      }] : [];
    })
    setHandleInputMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 px-4"
    >
      <Textarea
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
          //if key shift + enter then add a new line
          if (e.key === "Enter" && e.shiftKey)
            setHandleInputMessage(handleInputMessage + "\n");
        }}
        onChange={(e) => setHandleInputMessage(e.target.value ?? "")}
        value={handleInputMessage}
        placeholder="Digite uma mensagem"
        className=" max-h-24 min-h-14 w-full rounded-xl pl-3 pt-3 text-black shadow-md "
      />

      <button
        type="submit"
        className="h-fit transition-opacity hover:opacity-90"
      >
        <ArrowSquareRight size="38" variant="Bold" />
      </button>
    </form>
  );
}