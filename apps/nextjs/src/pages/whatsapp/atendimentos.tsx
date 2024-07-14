"use client";

import {
  Inbox as InboxIcon,
  Plus,
  Search,
  SquareCheckBigIcon,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";

import type { RouterOutputs } from "@morpheus/api";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/components/ui/use-toast";
import { ChatWhatsapp } from "~/components/whatsapp/ButtonChat";
import { AckIcon } from "~/components/whatsapp/ButtonChat/Ack";
import { BotActionsProvider, useBotActions } from "~/hooks/useBotActions";
import { useQueryParams } from "~/hooks/useQueryParams";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import TabLayout from "~/components/Layout";

export default function Assignments() {
  const { searchParams, setQueryParam } = useQueryParams();
  const selectedChatId = searchParams.get("selectedChat") ?? undefined;
  const selectedTab = searchParams.get("tab") ?? "inbox";
  return (
    <TabLayout>
      <BotActionsProvider >
        <Tabs
          defaultValue={selectedTab}
          onValueChange={(e) => setQueryParam("tab", e)}
          className="w-max-[400px] h-full    min-w-[400px]"
        >
          <TabsList className="grid h-fit w-full grid-cols-3 gap-2">
            <TabsTrigger value="inbox">
              <div className="flex flex-col items-center gap-2">
                <InboxIcon />
                <span>Entrada</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="finished">
              <div className="flex flex-col items-center gap-2">
                <SquareCheckBigIcon />
                <span>Resolvido</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="search">
              <div className="flex flex-col items-center gap-2">
                <Search />
                <span>Buscar</span>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent className="h-full" value="inbox">
            <Inbox />
          </TabsContent>
          <TabsContent className="h-full" value="finished">
            <Finished />
          </TabsContent>
          <TabsContent className="h-full" value="search">
            password
          </TabsContent>
        </Tabs>
        <ChatWhatsapp chatId={selectedChatId} />
      </BotActionsProvider>
    </TabLayout>
  );
}

export function Finished() {
  const { searchParams, setQueryParam } = useQueryParams();
  const filterFinished = searchParams.get("filterFinished") ?? undefined;

  return (
    <div className="flex h-full w-full flex-col gap-2 bg-white ">
      <div className="px-2">
        <Input
          defaultValue={filterFinished}
          onChange={(e) => setQueryParam("filterFinished", e.target.value)}
          className="mt-2 w-full"
          placeholder="Buscar"
        />
      </div>
      <Separator />

      <FinishedQueue />
    </div>
  );
}

export function Inbox() {
  const { searchParams, setQueryParam } = useQueryParams();
  const filterInbox = searchParams.get("filterInbox") ?? undefined;
  return (
    <div className="flex h-full w-full flex-col gap-2 bg-white ">
      <div className="px-2">
        <Input
          defaultValue={filterInbox}
          onChange={(e) => setQueryParam("filterInbox", e.target.value)}
          className="mt-2 w-full"
          placeholder="Buscar"
        />
      </div>
      <Separator />

      <AssignmentQueue />

      <Separator />

      <PendingQueue />

      <Separator />
    </div>
  );
}

type ChatCardsProps =
  RouterOutputs["chat"]["findChats"][number] & {
    isPending?: boolean;
    isFinished?: boolean;
  };
export function ChatCards({
  contact,
  lastMessage,
  isPending = false,
  isFinished = false,
  unreadMessagesLenth,

  ...props
}: ChatCardsProps) {
  const apiUtils = api.useUtils();
  const { toast } = useToast();
  const startAssignment = api.chat.startAssignmentByChatId.useMutation();
  const { searchParams, setQueryParam } = useQueryParams();
  const selectedChatId = searchParams.get("selectedChat") ?? undefined;
  const formatedDate = lastMessage?.createdAt
    ? lastMessage.createdAt.toLocaleTimeString().slice(0, 5)
    : "";
  return (
    <div
      className={cn(
        "flex w-full h-full cursor-pointer items-center justify-between border border-slate-100 px-2 py-5",
        selectedChatId === props.chatId ? "bg-primary/10" : "bg-white",
      )}
      onClick={() => setQueryParam("selectedChat", props.chatId ?? "")}
    >
      <div className="mr-2 flex w-full h-full items-center space-x-4">
        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Avatar>
            <AvatarImage src={contact?.profilePicUrl ?? undefined} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
        </span>
        <div className="w-full">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium leading-none">
              {contact?.name}
            </p>
            <Badge className="capitalize">{props.service?.name?.toLocaleLowerCase()}</Badge>
          </div>
          {props?.client?.externalId && <p className="text-xs text-muted-foreground">MK: {props.client.externalId} - {props?.client?.name}</p>}
          <p className="text-sm text-muted-foreground">{contact?.phone}</p>
          <div className="flex items-center gap-1">
            {lastMessage?.fromMe && <AckIcon ack={lastMessage.ack} />}{" "}
            <p className="max-w-[200px] truncate text-xs text-muted-foreground">
              {lastMessage?.body}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          {isPending && (
            <Button
              size="xs"
              type="button"
              onClick={() => {
                startAssignment.mutate(
                  { chatId: props.chatId ?? "" },
                  {
                    onSuccess: () =>
                      toast({
                        title: "Sucesso",
                        description: "Chat atribuído com sucesso",
                        variant: "success",
                      }),
                    onError: (error) =>
                      toast({
                        title: "Erro",
                        description: error.message,
                        variant: "destructive",
                      }),
                    onSettled: () => {
                      void apiUtils.chat.findChats.invalidate();
                    },
                  },
                );
              }}
            >
              Atender
            </Button>
          )}
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "text-xs text-muted-foreground",
                !!unreadMessagesLenth && "font-medium text-green-600",
              )}
            >
              {formatedDate}
            </span>

            {!!unreadMessagesLenth && (
              <Badge size="sm" variant="success">
                {unreadMessagesLenth}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export function AssignmentQueue() {
  const { searchParams } = useQueryParams();
  const filterInbox = searchParams.get("filterInbox") ?? "";
  const { assignmentChats } = useBotActions();

  return (
    <>
      <div className="flex min-h-[40px] w-full items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <Label>Trabalhando em </Label>{" "}
          <span className="text-sm">{assignmentChats.length ?? 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2 ">
            <Label htmlFor="all">Todos</Label>
            <Switch id="all" />
          </div>

          <Button className="h-fit w-fit rounded-full p-2" variant="ghost">
            <Plus />
          </Button>
        </div>
      </div>

      <div className="flex max-h-[400px] w-full flex-col gap-2 overflow-auto">
        {assignmentChats
          .filter(
            (card) =>
              card.contact?.name
                ?.toLowerCase()
                .includes(filterInbox.toLowerCase()) ||
              card.contact?.phone
                ?.toLowerCase()
                .includes(filterInbox.toLowerCase()) ||
              card.lastMessage?.body
                .toLowerCase()
                .includes(filterInbox.toLowerCase()),
          )
          .map((card) => (
            <ChatCards {...card} key={card.id} />
          ))}
      </div>
    </>
  );
}

export function PendingQueue() {
  const { searchParams } = useQueryParams();
  const filterInbox = searchParams.get("filterInbox") ?? "";
  const params = useParams();
  const { pendingChats } = useBotActions();

  return (
    <div>
      <div className="flex min-h-[40px] w-full items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <Label>Pendente</Label>{" "}
          <span className="text-sm">{pendingChats.length ?? 0}</span>
        </div>
      </div>
      <div className="flex max-h-[400px] w-full flex-col gap-2 overflow-auto">
        {pendingChats
          .filter(
            (card) =>
              card.contact?.name
                ?.toLowerCase()
                .includes(filterInbox.toLowerCase()) ||
              card.contact?.phone
                ?.toLowerCase()
                .includes(filterInbox.toLowerCase()) ||
              card.lastMessage?.body
                .toLowerCase()
                .includes(filterInbox.toLowerCase()),
          )
          .map((card) => (
            <ChatCards isPending {...card} key={card.id} />
          ))}
      </div>
    </div>
  );
}

export function FinishedQueue() {
  const { searchParams } = useQueryParams();
  const filterInbox = searchParams.get("filterInbox") ?? "";
  const { finishedChats } = useBotActions();

  return (
    <div>
      <div className="flex min-h-[40px] w-full items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <Label>Finalizados</Label>
          <span className="text-sm">{finishedChats.length ?? 0}</span>
        </div>
      </div>
      <div className="flex max-h-[400px] w-full flex-col gap-2 overflow-auto">
        {finishedChats
          .filter(
            (card) =>
              card.contact?.name
                ?.toLowerCase()
                .includes(filterInbox.toLowerCase()) ||
              card.contact?.phone
                ?.toLowerCase()
                .includes(filterInbox.toLowerCase()) ||
              card.lastMessage?.body
                .toLowerCase()
                .includes(filterInbox.toLowerCase()),
          )
          .map((card) => (
            <ChatCards {...card} key={card.id} />
          ))}
      </div>
    </div>
  );
}
