import { Unplug } from "lucide-react"
import { Spinner } from "~/components/Spinner";
import { api } from "~/utils/api";



interface ButtonLogoutProps {
  instanceId: string;
}
const ButtonLogout = ({ instanceId }: ButtonLogoutProps) => {


  return (
    <button className="p-2 bg-red-600 text-white rounded-lg">
      <Unplug />
      {/* {logoutWhatsapp.isLoading && <Spinner />} */}
    </button>
  )

}
export { ButtonLogout }