import { useSession } from "next-auth/react";
import { useState } from "react";
import { Spinner } from "~/components/Spinner";
import { api } from "~/utils/api";

type SendMessageProps = {
  contactId: string;
  onSend: () => void;
}


export const SendMessage = ({ contactId, onSend }: SendMessageProps) => {
  const sendMessage = api.whatsapp.sendMessage.useMutation();
  const session = useSession();

  const [message, setMessage] = useState('');
  const ctx = api.useContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || sendMessage.isLoading) return;

    await sendMessage.mutateAsync({ contactId, instanceId: 'clo3gfcla0000i03nwemri43p', message },
      {
        onSuccess: async () => {
          setMessage('');
          await ctx.whatsapp.messagesFromContact.cancel();
          const previousTodo = ctx.whatsapp.messagesFromContact.getData({ contactId });
          const temporaryData = {
            id: "clq1kqig5000fi10nfdtja5ome",
            instanceId: "clo3gfc1la0000i03nwemri43p",
            from: "clq1jexhk00011i0nf3wov5pdg",
            to: "clq1jexh90000i01nfqeofsm07",
            ack: 0,
            fromMe: true,
            body: `${session.data?.user.name ?? ''}: message`,
            protocol: "3EB045EEAAFB5D0AE80230",
            chatId: "clq1jexh90000i01nfqeofsm07",
            fileKey: null,
            fileUrl: null,
            location: null,
            mimetype: null,
            type: "chat",
            vcard: null,
            isGif: false,
            isRevoked: false,
            timestamp: 1702339080,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          ctx.whatsapp.messagesFromContact.setData({ contactId }, (old) => old ? [...old,
            temporaryData] :
            [
              temporaryData
            ]);

          // Return a context object with the snapshotted value
          onSend();
          return { previousTodo }

        }

      });
  }

  return (<form onSubmit={handleSubmit} className="flex gap-3 w-full p-4 items-end ease-in">
    <textarea
      className="rounded-md w-full border-slate-100 bg-slate-500 p-2 text-slate-100 shadow-lg h-fit"
      value={message}
      onChange={e => setMessage(e.target.value)}
    />
    <button
      disabled={sendMessage.isLoading}
      type="submit"
      className="rounded-md h-fit border-slate-100 bg-slate-500 p-2 text-slate-100 shadow-lg hover:opacity-80 transition-opacity font-bold"
    >
      {sendMessage.isLoading && <Spinner />}
      {!sendMessage.isLoading && "Enviar"}
    </button>
  </form>)
}