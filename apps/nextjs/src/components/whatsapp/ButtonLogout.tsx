import { Unplug } from "lucide-react"
import { Spinner } from "~/components/Spinner";
import { api } from "~/utils/api";



interface ButtonLogoutProps {
  instanceId: string;
}
const ButtonLogout = ({ instanceId }: ButtonLogoutProps) => {
  const queryCtx = api.useContext();
  const logoutWhatsapp = api.whatsapp.logout.useMutation({
    onSettled: () => void queryCtx.whatsapp.invalidate
  });

  return (
    <button onClick={() => logoutWhatsapp.mutate({ id: instanceId })} className="p-2 bg-red-600 text-white rounded-lg">
      {!logoutWhatsapp.isLoading && <Unplug />}
      {logoutWhatsapp.isLoading && <Spinner />}
    </button>
  )

}
export { ButtonLogout }