import { faker } from "@faker-js/faker";
import {
  Inbox as InboxIcon,
  Plus,
  Search,
  SquareCheckBigIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Assignments() {
  const session = useSession();
  const sessionUserId = session?.data?.user.id;
  const sessionUserName = session?.data?.user.name;
  const date = new Date().toISOString();

  return (
    <main className="min-w-screen flex min-h-screen flex-1 flex-col items-center overflow-y-hidden bg-black ">
      {/* <div
        className={`mt-20 flex w-full h-full flex-1 flex-row gap-2 px-4 `}
      >
        <div className="flex flex-row gap-2">
          <AssignmentColumn
            dateActivity={date}
            userId={sessionUserId ?? ""}
            userName={sessionUserName ?? ""}
          />
        </div>
        <div className="flex flex-row gap-2 overflow-x-auto">

          <AssignmentColumn
            dateActivity={date}
            userId="clq63rc3s0000i0aq3ntbwewu"
            userName="Whatsapp"
          />
        </div>
      </div>


      <MessageAudio /> */}

      <div>
        <div>
          <Tabs defaultValue="account">
            <TabsList className="grid h-fit w-full grid-cols-3 gap-2">
              <TabsTrigger value="inbox" className="w-full px-20">
                <div className="flex flex-col items-center gap-2">
                  <InboxIcon />
                  <span>Entrada</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="finished" className="flex flex-col">
                <div className="flex flex-col items-center gap-2">
                  <SquareCheckBigIcon />
                  <span>Resolvido</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex flex-col">
                <div className="flex flex-col items-center gap-2">
                  <Search />
                  <span>Buscar</span>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="inbox">
              <Inbox />
            </TabsContent>
            <TabsContent value="finished">password</TabsContent>
            <TabsContent value="search">password</TabsContent>
          </Tabs>
        </div>
        <div></div>
      </div>
    </main>
  );
}

export function Inbox() {
  return (
    <div className="flex h-full w-full flex-col gap-2 bg-white ">
      <div className="px-2">
        <Input className="w-200 mt-2" placeholder="Buscar" icon={<Search />} />
      </div>
      <Separator />

      <AssignmentQueue />

      <Separator />

      <PendingQueue />

      <Separator />
    </div>
  );
}

const fakeAssignmentQueueCards = new Array(5).fill(0).map((_, i) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  phone: faker.phone.number(),
  avatarUrl: faker.image.avatar(),
  updatedAt: faker.date.past(),
}));

type ChatCards = {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
  updatedAt: string;
}
export function ChatCards({ avatarUrl, id, name, phone, updatedAt, }: ChatCards) {
  return (
    <div className="flex items-center justify-between py-5 px-2 ">
      <div className="flex items-center space-x-4">
        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Avatar >
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </span>
        <div>
          <div className="flex gap-2 items-center"><p className="text-sm font-medium leading-none">{name}</p> <p className="text-sm text-muted-foreground">{phone}</p></div>
          <p className="text-sm text-muted-foreground">m@example.com</p>
        </div>
      </div>
      <button
        className="ml-auto inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="radix-:r9s:"
        data-state="closed"
      >
        Owner{" "}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2 h-4 w-4 text-muted-foreground"
        >
          <path
            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
}
export function AssignmentQueue() {
  return (
    <div>
      <div className="flex min-h-[40px] w-full items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <Label>Trabalhando em </Label> <span className="text-sm">2</span>
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

      <div>
        {fakeAssignmentQueueCards.map((card) => (
          <ChatCards {...card} key={card.id} />
        ))}
      </div>
    </div>
  );
}

export function PendingQueue() {
  return (
    <div>
      <div className="flex min-h-[40px] w-full items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <Label>Fila </Label> <span className="text-sm">0</span>
        </div>
      </div>
    </div>
  );
}
