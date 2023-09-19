import { RotateCcw, Unplug } from "lucide-react"
import { Spinner } from "~/components/Spinner";
import { api } from "~/utils/api";



interface ButtonRestartProps {
  instanceId: string;
}
const ButtonRestart = ({ instanceId }: ButtonRestartProps) => {
  const queryCtx = api.useContext();
  const restartWhatsapp = api.whatsapp.restart.useMutation({
    onSettled: async () => await queryCtx.whatsapp.invalidate()
  });

  return (
    <button onClick={async () => await restartWhatsapp.mutateAsync({ id: instanceId })} className="p-2 bg-orange-600 text-white rounded-lg">
      {!restartWhatsapp.isLoading && <RotateCcw />}
      {restartWhatsapp.isLoading && <Spinner />}
    </button>
  )

}
export { ButtonRestart }