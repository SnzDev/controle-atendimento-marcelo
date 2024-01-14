import { type WhatsappMessages } from "@acme/db";
import { ChevronDown, Clock, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { useDiscloseSelect } from "~/hooks";
import { type DiscloseSelect } from "~/hooks/useDiscloseSelect";
import useScrollToEnd from "~/hooks/useScrollToEnd";
import { api } from "~/utils/api";
import { Spinner } from "../Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface ButtonQrCodeProps {
  contactId: string;
}
const ButtonChat = ({ contactId }: ButtonQrCodeProps) => {
  const disclose = useDiscloseSelect();
  return (<>
    <button
      onClick={disclose.onOpen}
      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ">
      <MessageSquare />
    </button>

    {disclose.isVisible && <ModalChat contactId={contactId} disclose={disclose} />}
  </>)
}

interface ModalChatProps {
  disclose: DiscloseSelect;
  contactId: string;
}
const ModalChat = ({ disclose, contactId }: ModalChatProps) => {
  const scrollToEnd = useScrollToEnd();
  const messages = api.whatsapp.messagesFromContact.useQuery({ contactId }, {
    refetchInterval: 5000,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
      <div className="flex items-center justify-center">
        <div ref={disclose.ref} className="bg-white dark:bg-slate-600 min-h-[20.6rem] min-w-[40.2rem] rounded-lg shadow-md dark:shadow-slate-600">
          <div id="header">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 dark:border-gray-200 w-full">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Chat</h2>
              <button
                onClick={disclose.onClose}
                className="p-1 rounded-lg hover:scale-125 placeholder:text-slate-700 hover:text-slate-800 dark:text-white hover:bg-gray-300 transition-all ">
                <X />
              </button>
            </div>

            <div id="content">

              <div ref={scrollToEnd.ref} className="flex items-center flex-col gap-2 max-h-[400px] overflow-auto mt-2 justify-center px-10 py-10 h-full ">
                {messages.data?.map(message => <ChatBallon key={message.id} message={message} />)}
              </div>

            </div>

          </div>
          <SendMessage onSend={() => {
            scrollToEnd.ref.current?.scrollIntoView({ behavior: 'smooth' });
          }}
            contactId={contactId} />
        </div>

      </div>
    </div>
  )
}
type ChatBallonProps = {
  message: WhatsappMessages;
}
const ChatBallon = ({ message }: ChatBallonProps) => {
  // but this timestamp is utc how to resolve
  const date = new Date(message.timestamp);
  const hours = `${date.getHours().toString()}:${date.getMinutes()}`;

  return (
    <div className={`flex gap-1 max-w-[20rem] flex-wrap  h-fit p-2 items-end rounded-lg ${message.fromMe ? 'self-end bg-green-500 text-white' : 'self-start bg-white text-slate-800'}`}>
      <span className="text-lg">{message.body}</span>
      <span className="text-xs mt-[-15px] w-full flex items-center justify-end">{hours}
        {message.fromMe && <AckIcon ack={message.ack} />}
      </span>
    </div>
  )
}
interface AckIconProps {
  ack: number;
}
const AckIcon = ({ ack }: AckIconProps) => {

  if (ack === 1) {
    return <span className="text-xs text-gray-500"><ChevronDown /></span>
  }
  if (ack === 2) {
    return <div className="flex">
      <span className="text-xs"><ChevronDown /></span>
      <span className="ml-[-24px] mt-[5px]"><ChevronDown /></span>
    </div>
  }
  if (ack === 3 || ack === 4) {
    return <div className="flex">
      <span className="text-xs text-blue-500"><ChevronDown /></span>
      <span className="ml-[-24px] mt-[5px] text-xs text-blue-500"><ChevronDown /></span>
    </div>
  }

  return <span className="text-xs"><Clock /></span>
}


type SendMessageProps = {
  contactId: string;
  onSend: () => void;
}


const SendMessage = ({ contactId, onSend }: SendMessageProps) => {
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
          ctx.whatsapp.messagesFromContact.setData({ contactId }, (old) => old ? [...old,
          {
            id: "clq1kqig5000fi10nfdtja5ome",
            instanceId: "clo3gfc1la0000i03nwemri43p",
            from: "clq1jexhk00011i0nf3wov5pdg",
            to: "clq1jexh90000i01nfqeofsm07",
            ack: 0,
            fromMe: true,
            body: `${session.data?.user.name ?? ''}: message`,
            protocol: "3EB045EEAAFB5D0AE80230",
            timestamp: 1702339080,
            createdAt: new Date(),
            updatedAt: new Date(),
          }] :
            [
              {
                id: "clq1kqig5000fi10nfdtja5ome",
                instanceId: "clo3gfc1la0000i03nwemri43p",
                from: "clq1jexhk00011i0nf3wov5pdg",
                to: "clq1jexh90000i01nfqeofsm07",
                ack: 2,
                fromMe: true,
                body: `${session.data?.user.name ?? ''}: message`,
                protocol: "3EB045EEAAFB5D0AE80230",
                timestamp: 1702339080,
                createdAt: new Date(),
                updatedAt: new Date(),
              }
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

export { ButtonChat };

