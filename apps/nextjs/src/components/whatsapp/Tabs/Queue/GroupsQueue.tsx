import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useBotActions } from "~/hooks/useBotActions";
import { useQueryParams } from "~/hooks/useQueryParams";
import { ChatCards } from "~/pages/whatsapp/atendimentos";
import { api } from "~/utils/api";

export function GroupsQueue() {
  const { searchParams, setQueryParam } = useQueryParams();
  const filterInbox = searchParams.get("filterInbox") ?? "";
  const { finishedChats } = useBotActions();
  const filterFinished = searchParams.get("filterFinished") ?? undefined;
  const { data: groups } = api.whatsapp.getGroupChats.useQuery();

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

      <div>
        <div className="flex min-h-[40px] w-full items-center justify-between px-2">
          <div className="flex items-center gap-1">
            <Label>Finalizados</Label>
            <span className="text-sm">{finishedChats.length ?? 0}</span>
          </div>
        </div>
        <div className="flex max-h-[400px] w-full flex-col gap-2 overflow-auto">
          {groups
            ?.filter(
              (card) =>
                card.contact?.name
                  ?.toLowerCase()
                  .includes(filterInbox.toLowerCase()) ||
                card.contact?.phone
                  ?.toLowerCase()
                  .includes(filterInbox.toLowerCase())
            )
            .map((card) => (
              <ChatCards chatId={card.id} {...card} key={card.id} />
            ))}
        </div>
      </div>
    </div>

  );
}