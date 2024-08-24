import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useBotActions } from "~/hooks/useBotActions";
import { useQueryParams } from "~/hooks/useQueryParams";
import { ChatCards } from "~/pages/whatsapp/atendimentos";

export function AssignmentStep() {
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