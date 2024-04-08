import { MessageSquare, X } from "lucide-react";
import { Portal } from "~/components/Portal";
import { useDiscloseSelect } from "~/hooks";
import { type DiscloseSelect } from "~/hooks/useDiscloseSelect";
import useScrollToEnd from "~/hooks/useScrollToEnd";
import { api } from "~/utils/api";
import { Balloon } from "./Balloon";
import { SendMessage } from "./SendMessage";
import Image from "next/image";
import { ImageExpand } from "~/components/ImageExpand";
import { useEffect, useState } from "react";
import { type MessageData, messageRoom, messageRoomOff } from "~/utils/socket/sub/message-room";

interface ButtonQrCodeProps {
  contactId: string;
  chatId?: string;
}
const ButtonChat = ({ contactId, chatId }: ButtonQrCodeProps) => {
  const disclose = useDiscloseSelect();
  return (<>
    <button
      onClick={disclose.onOpen}
      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ">
      <MessageSquare />
    </button>

    {disclose.isVisible && <ModalChat contactId={contactId} chatId={chatId} disclose={disclose} />}
  </>)
}

interface ModalChatProps {
  disclose: DiscloseSelect;
  contactId: string;
  chatId?: string;
}
const ModalChat = ({ disclose, contactId, chatId }: ModalChatProps) => {
  const scrollToEnd = useScrollToEnd();
  const queryClient = api.useContext();

  const dbMessages = api.whatsapp.messagesFromContact.useQuery({ contactId, chatId });
  const { data: contact } = api.whatsapp.getContactById.useQuery({ id: contactId });



  useEffect(() => {
    console.log(contact?.phone);

    if (!contact?.phone) return;

    messageRoom(contact?.phone, (data) => {
      console.log("message received");
      const info = {
        ack: data.message.ack,
        body: data.message.body,
        fileKey: data.fileKey ?? null,
        from: data.message.from,
        fromMe: data.message.fromMe,
        id: data.message.id.id,
        isGif: data.message.isGif ?? false,
        isRevoked: false,
        location: data.message.location ?? {},
        timestamp: data.message.timestamp,
        to: data.message.to,
        type: data.message.type,
        vcard: data.message.vCards ?? [],
        protocol: data.message.id.id ?? 0,
        chatId: "",
        mimetype: data.mimeType ?? null,
        fileUrl: data.fileKey ?? null,
        createdAt: new Date(data.message.timestamp * 1000),
        updatedAt: new Date(data.message.timestamp * 1000),

      };
      queryClient.whatsapp.messagesFromContact.setData({ contactId, chatId }, (prev) =>
        prev ? [...prev, info] : [info]
      );

    });

    return () => {
      messageRoomOff(contact?.phone)
    }
  }, [contact?.phone])

  return (
    <Portal>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-50 backdrop-blur-sm">
        <div ref={disclose.ref} className="bg-white dark:bg-slate-600 h-[70%] w-[60%] flex flex-col  justify-between rounded-lg shadow-md dark:shadow-slate-600">
          <div id="header" className="flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 dark:border-gray-200 w-full">
              <div className=" flex items-center gap-2">
                <ImageExpand imageUrl={contact?.profilePicUrl ?? '/whatsapp_logo.png'} >
                  <Image className="rounded-full" src={contact?.profilePicUrl ?? '/whatsapp_logo.png'} alt='avatar' width={70} height={70} />
                </ImageExpand>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">{contact?.name}</h2>
                  <p className="text-md text-gray-700 dark:text-gray-300">{contact?.phone}</p>
                </div>
              </div>

              <button
                onClick={disclose.onClose}
                className="p-1 rounded-lg hover:scale-125 placeholder:text-slate-700 hover:text-slate-800 dark:text-white hover:bg-gray-300 transition-all ">
                <X />
              </button>


            </div>

          </div>


          <div ref={scrollToEnd.ref} className="flex flex-col gap-2 overflow-auto mt-2 p-10">
            {dbMessages.data?.map(message => <Balloon key={message.id} message={message} />)}

          </div>


          {contact?.phone && <SendMessage phone={contact?.phone} />}
        </div>

      </div>
    </Portal>
  )
}

export { ButtonChat };

