"use client";

import { User } from "iconsax-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { useQueryParams } from "~/hooks/useQueryParams";
import { api } from "~/utils/api";
import { Balloon } from "./Balloon";
import { SendMessage } from "./SendMessage";
import { useEffect, useRef } from "react";

interface ChatWhatsappProps {
  chatId?: string;
}
export function ChatWhatsapp({ chatId = "" }: ChatWhatsappProps) {
  const apiUtils = api.useUtils();
  const { removeQueryParam } = useQueryParams();
  const { toast } = useToast();
  const finalizeChat = api.chat.finalizeChat.useMutation();
  const { data: messages, refetch } = api.chat.getMessagesByChatId.useQuery(
    {
      chatId: chatId,
    },
    {
      enabled: !!chatId,
    },
  );

  const { data: contact } = api.chat.getContactByChatId.useQuery(
    { chatId: chatId },
    {
      enabled: !!chatId,
    },
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "auto" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [bottomRef, chatId, messages]);


  if (!messages)
    return (
      <div className="flex h-full w-full max-w-[1000px]  flex-col items-center justify-center  rounded-lg bg-white shadow-md">
        Nenhuma mensagem encontrada
      </div>
    );

  return (
    <div className="flex w-full flex-col items-center h-full  rounded-lg bg-white shadow-md">
      <div
        className="flex w-full  items-center justify-between rounded-t-lg bg-primary shadow"
      >
        <div className="dark:border-gray-200 flex w-full  items-center justify-between px-6 py-4 ">
          <div className=" flex items-center gap-2">
            <Avatar>
              <AvatarImage src={contact?.profilePicUrl ?? undefined} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-md font-medium text-white">
                {contact?.name}
              </h2>
              <p className="text-sm text-white">{contact?.phone}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <Button
            loading={finalizeChat.isLoading}
            onClick={() => {
              finalizeChat.mutate(
                { chatId: chatId ?? "" },
                {
                  onSuccess: () => {
                    toast({
                      title: "Atendimento finalizado com sucesso",
                      variant: "success",
                    });

                    removeQueryParam("selectedChat");
                  },
                  onError: (error) =>
                    toast({
                      title: "Algo deu errado",
                      description: error.message,
                      variant: "destructive",
                    }),
                  onSettled: () => {
                    void apiUtils.chat.findChats.invalidate();
                  },
                },
              );
            }}
            variant="success"
          >
            Finalizar
          </Button>
        </div>
      </div>

      <div className="bg-chatBackground flex w-full h-full flex-col justify-between pb-5 rounded-b-lg">
        <div
          className="flex flex-col gap-2 overflow-y-auto p-10 pt-2"
        >
          {messages?.map((message) => (
            <Balloon key={message.id} message={message} />
          ))}
          <div ref={bottomRef}></div>
        </div>

        <SendMessage chatId={chatId} phone={contact?.phone ?? ""} />
      </div>
    </div>
  );
}
