import { Label } from "~/components/ui/label";
import { useBotActions } from "~/hooks/useBotActions";
import { useQueryParams } from "~/hooks/useQueryParams";
import { ChatCards } from "~/pages/whatsapp/atendimentos";

export function PendingStep() {
  const { searchParams } = useQueryParams();
  const filterInbox = searchParams.get("filterInbox") ?? "";
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