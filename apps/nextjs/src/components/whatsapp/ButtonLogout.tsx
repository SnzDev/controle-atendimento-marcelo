import { Unplug } from "lucide-react"
import { Spinner } from "~/components/Spinner";
import { api } from "~/utils/api";
import { logout } from "~/utils/socket/pub/logout";



interface ButtonLogoutProps {
  instanceId: string;
}
const ButtonLogout = ({ instanceId }: ButtonLogoutProps) => {


  return (
    <button onClick={logout} className="p-2 bg-red-600 text-white rounded-lg">
      <Unplug />
      {/* {logoutWhatsapp.isLoading && <Spinner />} */}
    </button>
  )

}
export { ButtonLogout }