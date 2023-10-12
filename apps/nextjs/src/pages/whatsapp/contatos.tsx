import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { ButtonChat } from "~/components/whatsapp/ButtonChat";
import { api } from "~/utils/api";

export default function WhatsappContacts() {
  const getAllContacts = api.whatsapp.getAllContacts.useQuery();
  return (
    <div>
      <h1>WhatsappContacts</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" align="left" className="px-6 py-4">
                Contato
              </th>
              <th scope="col" align="left" className="px-6 py-4">Telefone</th>
              <th scope="col" align="left" className="px-6 py-4">
                Plataforma
              </th>
              <th scope="col" align="left" className="px-6 py-4">
                Criado
              </th>
              <th scope="col" align="left" className="px-6 py-4">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {getAllContacts.data?.map((contact) => (
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={contact.id}>
                <th scope="row" align="left" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <Image className="rounded-full" src={contact.profilePicUrl ?? '/whatsapp_logo.png'} alt={contact.name} width="40" height="40" />
                  <div className="pl-3">
                    <div className="text-base font-semibold">{contact.name}</div>
                  </div>
                </th>
                <td align="left" className="px-6 py-4 font-mono">
                  {contact.phone}
                </td>
                <td align="left" className="px-6 py-4">
                  {contact.platform}
                </td>
                <td align="left" className="px-6 py-4">
                  {new Date(contact.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </td>
                <td align="left" className="px-6 py-4" >
                  <ButtonChat contactId={contact.id} />
                </td>
              </tr>
            ))
            }

          </tbody>
        </table>
      </div>

      {getAllContacts.isLoading && <p>Loading...</p>}

    </div>
  )
}