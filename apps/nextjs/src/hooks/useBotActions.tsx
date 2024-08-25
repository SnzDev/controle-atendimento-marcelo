import React, { createContext, useCallback, useEffect, useState } from "react";

import { type RouterOutputs } from "@morpheus/api";
import { BotActionTypes, type ActionBotSchema } from "@morpheus/validators";

import { api } from "~/utils/api";
import { QrCode } from "~/components/socket-test/QrCode";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useToast } from "~/components/ui/use-toast";
import { socket } from "~/lib/socket.io";
import { botActions } from "~/lib/socket.io/sub/bot-actions";

type FindChatsByInstance = RouterOutputs["chat"]["findChats"];

type ContextType = {
  actions: ActionBotSchema[];
  pendingChats: FindChatsByInstance;
  assignmentChats: FindChatsByInstance;
  finishedChats: FindChatsByInstance;
};
const BotActions = createContext({} as ContextType);

type BotActionsProviderProps = {
  children: React.ReactNode;
};
const pathToSound = "/sounds/notification.mp3";

export const BotActionsProvider = ({ children }: BotActionsProviderProps) => {
  const apiUtils = api.useUtils();
  const { data: session } = api.auth.getSession.useQuery();
  const [actions, setActions] = useState<ActionBotSchema[]>([]);
  const { data: findChatsFromInstance } = api.chat.findChats.useQuery();

  const finishedChats =
    findChatsFromInstance?.filter((chat) => !!chat.finalizedAt) ?? [];
  const pendingChats =
    findChatsFromInstance?.filter((chat) => !chat.userId && !chat.finalizedAt) ?? [];
  const assignmentChats =
    findChatsFromInstance?.filter(
      (chat) => !!chat.userId && chat.userId === session?.user.id && !chat.finalizedAt,
    ) ?? [];

  const { toast } = useToast();

  const play = async () => {
    const audio = new Audio(pathToSound);

    await audio.play();
  };

  /*
title - New message from Open Chat
icon - image URL from Flaticon
body - main content of the notification
*/
  function sendNotification(title: string, message: string) {
    const notification = new Notification(title, {
      icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
      body: `${message}`,
    });

  }

  async function checkPageStatus(title: string, message: string) {
    if (!("Notification" in window)) {
      alert("Esse navegador não permite notificações");
    } else if (Notification.permission === "granted") {
      sendNotification(title, message);
    } else if (Notification.permission !== "denied") {
      await Notification.requestPermission((permission) => {
        if (permission === "granted") {
          sendNotification(title, message);
        }
      });
    }
  }
  const callback = useCallback(
    async (data: ActionBotSchema) => {
      setActions((prev) => [data, ...prev]);

      if (data.action === BotActionTypes.MessageCreated) {

        if (data.payload.message.body?.toLocaleLowerCase().includes("estaremos encaminhando esse atendimento para o setor responsável")) {
          await apiUtils.chat.findChats.invalidate();
          await checkPageStatus(
            `Novo atendimento (Pendente)`,
            `${data.payload.toInfo.pushname}`,
          );
          await play();
          toast({
            title: `Nova mensagem - ${data.payload.toInfo.pushname} (Pendente)`,
            description: (
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage src={data.payload.toInfo.profilePicUrl} />
                  <AvatarFallback>
                    {data.payload.toInfo.pushname}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {data.payload.toInfo.phone}
                    </span>
                    <div className="flex gap-2">
                      <strong>{data.payload.toInfo.pushname}</strong>
                      <p className="max-w-[150px] truncate">
                        Novo atendimento (Pendente)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ),
          });
        }
      }

      if (data.action === BotActionTypes.MessageReceived) {
        const isPendingOrMyAssignment = findChatsFromInstance?.findIndex(
          (chat) =>
            (chat.contact?.phone === data.payload.fromInfo.phone ||
              !chat.userId) &&
            !chat.finalizedAt,
        );
        if (isPendingOrMyAssignment == -1 || !isPendingOrMyAssignment) return;

        apiUtils.chat.findChats.setData(undefined, (prev) => {
          const newValue = prev ? [...prev] : [];
          const dataPayload = {
            ...newValue[isPendingOrMyAssignment],
            lastMessage: {
              fromMe: data.payload.message.fromMe,
              id: "",
              createdAt: new Date(),
              body: data.payload.message.body,
              ack: data.payload.message.ack,
              type: data.payload.message.type,
              chatId: findChatsFromInstance?.[isPendingOrMyAssignment]?.chatId ?? "",
              fileKey: data.payload.message.fileKey ?? null,
              from: data.payload.fromInfo.phone,
              isGif: data.payload.message.isGif ?? false,
              isRevoked: false,
              location: data.payload.message.location ?? null,
              mimetype: "",
              protocol: "",
              timestamp: data.payload.message.timestamp,
              to: data.payload.toInfo.phone,
              updatedAt: new Date(),
              vcard: data.payload.message.vCards ?? null,
            },
            unreadMessagesLenth: (newValue?.[isPendingOrMyAssignment]?.unreadMessagesLenth ?? 0) + 1
          }
          //@ts-expect-error - data is not null
          newValue[isPendingOrMyAssignment] = {
            ...dataPayload,
          };
          return newValue;
        });

        void apiUtils.chat.getMessagesByChatId.invalidate({
          chatId: findChatsFromInstance?.[isPendingOrMyAssignment]?.chatId ?? undefined,
        });

        await play();

        const status = findChatsFromInstance?.[isPendingOrMyAssignment]?.userId
          ? "Em Atendimento"
          : "Pendente";

        await checkPageStatus(
          `${data.payload.fromInfo.pushname} (${status})`,
          `Disse: ${data.payload.message.body}`,
        );
        toast({
          title: `Nova mensagem - ${data.payload.fromInfo.pushname} (${status})`,
          description: (
            <div className="flex gap-2">
              <Avatar>
                <AvatarImage src={data.payload.fromInfo.profilePicUrl} />
                <AvatarFallback>
                  {data.payload.fromInfo.pushname}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    {data.payload.fromInfo.phone}
                  </span>
                  <div className="flex gap-2">
                    <strong>{data.payload.fromInfo.pushname}</strong>
                    <p className="max-w-[200px] truncate">
                      Disse: {data.payload.message.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
        });
      }
      if (data.action === BotActionTypes.MessageGroup) {


        apiUtils.whatsapp.getGroupChats.setData(undefined, (prev) => {
          const newValue = prev ? [...prev] : [];

          const groupIndex = newValue.findIndex(
            (chat) => chat.contactId === data.payload.message.id.remote,
          );
          if (!groupIndex) return prev;


          const dataPayload = {
            ...newValue[groupIndex],
            lastMessage: {
              fromMe: data.payload.message.fromMe,
              id: "",
              createdAt: new Date(),
              body: data.payload.message.body,
              ack: data.payload.message.ack,
              type: data.payload.message.type,
              chatId: newValue[groupIndex]?.id ?? "",
              fileKey: data.payload.message.fileKey ?? null,
              from: data.payload.fromInfo.phone,
              isGif: data.payload.message.isGif ?? false,
              isRevoked: false,
              location: data.payload.message.location ?? null,
              mimetype: "",
              protocol: "",
              timestamp: data.payload.message.timestamp,
              to: data.payload.toInfo.phone,
              updatedAt: new Date(),
              vcard: data.payload.message.vCards ?? null,
            },
          }

          //@ts-expect-error - data is not null
          newValue[groupIndex] = {
            ...dataPayload,
          };
          return newValue;
        });
        await apiUtils.whatsapp.getGroupChats.invalidate();
        if (data.payload.message.fromMe || !data.payload.authorInfo) return;
        await play();


        await checkPageStatus(
          `${data.payload.authorInfo?.pushname}`,
          `Disse: ${data.payload.message.body}`,
        );
        toast({
          title: `${data.payload.authorInfo?.pushname}`,
          description: (
            <div className="flex gap-2">
              <Avatar>
                <AvatarImage src={data.payload.authorInfo.profilePicUrl} />
                <AvatarFallback>
                  {data.payload.authorInfo?.pushname}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    {data.payload.authorInfo?.phone}
                  </span>
                  <div className="flex gap-2">
                    <strong>{data.payload.authorInfo?.pushname}</strong>
                    <p className="max-w-[200px] truncate">
                      Disse: {data.payload.message.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
        });
      }

      if (data.action === BotActionTypes.QR) {
        toast({
          title: "QR Code",
          description: (
            <div className="flex gap-2">
              <QrCode qr={[data.payload.qr]} />
            </div>
          ),
        });
      }
      if (data.action === BotActionTypes.Disconnected) {
        toast({
          title: "Instância desconectada",
          variant: "destructive",
        });
      }

      if (data.action === BotActionTypes.Ack) {
        await apiUtils.chat.getMessagesByChatId.invalidate();
      }
    },
    [findChatsFromInstance],
  );

  useEffect(() => {
    botActions(callback);

    return () => {
      socket.off(`bot-action`);
    };
  }, [callback]);

  return (
    <BotActions.Provider
      value={{ actions, pendingChats, assignmentChats, finishedChats }}
    >
      {children}
    </BotActions.Provider>
  );
};

export const useBotActions = () => React.useContext(BotActions);
