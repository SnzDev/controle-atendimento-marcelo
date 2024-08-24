import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useQueryParams } from "~/hooks/useQueryParams";
import { AssignmentStep } from "./AssignmentStep";
import { PendingStep } from "./PendingStep";

export function InboxQueue() {
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

      <AssignmentStep />

      <Separator />

      <PendingStep />

      <Separator />
    </div>
  );
}