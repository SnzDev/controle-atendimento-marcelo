import { type WhatsappMessages } from "@acme/db";
import { ChevronDown, Clock, MessageSquare, X } from "lucide-react";
import { useDiscloseSelect } from "~/hooks";
import { type DiscloseSelect } from "~/hooks/useDiscloseSelect";
import useScrollToEnd from "~/hooks/useScrollToEnd";
import { api } from "~/utils/api";

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
  const messages = api.whatsapp.messagesFromContact.useQuery({ contactId });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
      <div className="flex items-center justify-center">
        <div ref={disclose.ref} className="bg-white dark:bg-slate-600 min-h-[20.6rem] min-w-[40.2rem] rounded-lg shadow-md dark:shadow-slate-600">
          <div id="header">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 dark:border-gray-200">
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
    <div className={`flex gap-1 max-w-[20rem] flex-wrap min-h-[2rem] px-2 items-end rounded-lg ${message.fromMe ? 'self-end bg-green-500 text-white' : 'self-start bg-white text-slate-800'}`}>
      <span className="text-lg">{message.body}</span>
      <span className="text-xs self-end">{hours}</span>
      {message.fromMe && <AckIcon ack={message.ack} />}
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
      <span className="text-xs text-blue-500"><ChevronDown /></span>
      <span className="ml-[-10px]"><ChevronDown /></span>
    </div>
  }
  if (ack === 3 || ack === 4) {
    return <div className="flex">
      <span className="text-xs text-blue-500"><ChevronDown /></span>
      <span className="ml-[-28px] text-xs text-blue-500"><ChevronDown /></span>
    </div>
  }

  return <span className="text-xs text-gray-500"><Clock /></span>
}

export { ButtonChat };

