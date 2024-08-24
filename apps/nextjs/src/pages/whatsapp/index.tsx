import Image from "next/image";
import { useEffect } from "react";
import { ButtonLogout } from "~/components/whatsapp/ButtonLogout";
import { ButtonQrCode } from "~/components/whatsapp/ButtonQrCode";
import { ButtonRestart } from "~/components/whatsapp/ButtonRestart";
import { api } from "~/utils/api";
// import { disconnected, off } from "~/utils/socket/sub/disconnected";


export default function Whatsapp() {
  const getAllInstances = api.whatsapp.getAll.useQuery();


  // useEffect(() => {
  //   disconnected(() => getAllInstances.refetch());

  //   return () => {
  //     off()
  //   }
  // }, []);
  return (
    <div>
      <h1>Whatsapp</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" align="center" className="py-3">
                Instância
              </th>
              <th scope="col" align="center" className="py-3">Telefone</th>
              <th scope="col" align="center" className="py-3">
                Plataforma
              </th>
              <th scope="col" align="center" className="py-3">
                Url
              </th>
              <th scope="col" align="center" className="py-3">
                Criado
              </th>
              <th scope="col" align="center" className="py-3">
                Status
              </th>
              <th scope="col" align="center" className="py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {getAllInstances.data?.map((instance) => (
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={instance.id}>
                <th scope="row" align="center" className="flex items-center justify-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <Image className="rounded-full" src={instance.profilePicUrl ?? '/whatsapp_logo.png'} alt={instance.name} width="40" height="40" />
                  <div className="pl-3">
                    <div className="text-base font-semibold">{instance.name}</div>
                    <div className="font-normal text-gray-500">{instance.instanceName}</div>
                  </div>
                </th>
                <td align="center" >
                  {instance.phone}
                </td>
                <td align="center" >
                  {instance.platform}
                  {instance.platform == "android"}
                  {instance.platform == "iphone"}
                </td>
                <td align="center" className="px-6 py-4">
                  {instance.url}
                </td>
                <td align="center" className="px-6 py-4">
                  {new Date(instance.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </td>
                <td align="center" className="px-6 py-4">
                  <div className="flex justify-center items-center">
                    {instance.status === "OFFLINE" && (<><div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div> Offline</>)}
                    {instance.status === "DISCONNECTED" && (<><div className="h-2.5 w-2.5 rounded-full bg-orange-500 mr-2"></div> Aguardando Conexão</>)}
                    {instance.status === "CONNECTED" && (<><div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div> Conectado</>)}
                  </div>
                </td>
                <td align="center" className="px-6 py-4 text-center">
                  <div className=" flex gap-2 justify-center ">
                    {instance.status !== "OFFLINE" && (<ButtonRestart instanceId={instance.id} />)}
                    {instance.status === "DISCONNECTED" && <ButtonQrCode />}
                    {instance.status === "CONNECTED" && (<ButtonLogout instanceId={instance.id} />)}
                  </div>
                </td>
              </tr>
            ))
            }

          </tbody>
        </table>
      </div>

      {getAllInstances.isLoading && <p>Loading...</p>}

    </div>
  )
}