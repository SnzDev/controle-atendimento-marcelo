import { type AppRouter } from "@morpheus/api";
import { type inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
import { AckIcon } from "./Ack";
import { Ban, ExternalLink, FileText } from "lucide-react";
import { GifVideoExpand, ImageExpand } from "~/components/ImageExpand";
import Link from "next/link";

type Message = inferRouterOutputs<AppRouter>['whatsapp']['messagesFromContact'][number]


type BalloonProps = {
  message: Message;
}
export const Balloon = ({ message }: BalloonProps) => {
  // but this timestamp is utc how to resolve
  const date = Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(message.createdAt));

  const isImage = message.type === 'image' || message.type === 'sticker';
  const isVideo = message.type === 'video' && !message.isGif;
  const isGif = message.type === 'video' && !!message.isGif;
  const isAudio = message.type === 'ptt';
  const isLocation = message.type === 'location';
  const isDocument = message.type === 'document';
  //body can be \n to break line
  //body can be *bold* to bold
  //body can be _italic_ to italic
  //body can be ~strikethrough~ to strikethrough
  //body can be `monospace` to monospace and 
  //whitout any of this it will be a paragraph


  const messageHtml = message.body
    .replace(/\n/g, '<br>')
    .replace(/\*(.*?)\*/g, '<b>$1</b>')
    .replace(/_(.*?)_/g, '<i>$1</i>')
    .replace(/~(.*?)~/g, '<s>$1</s>')
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/"(.*?)"/g, "<p>$1</p>")

  console.log({ messageHtml })
  return (
    <div className={`flex relative  gap-1 max-w-[20rem] h-fit flex-col flex-wrap p-2 items-end rounded-lg ${message.fromMe ? 'self-end bg-green-300 text-black' : 'self-start bg-white text-slate-800'}`}>
      {message.isRevoked &&
        <div>
          <p className="text-gray-500 flex flex-row gap-2 items-center">
            <Ban size={18} /> Mensagem apagada</p>
        </div>
      }

      {message.fileUrl && isImage && <ImageBody fileUrl={message.fileUrl} />}
      {message.fileUrl && isVideo && <VideoBody mimeType={message.mimetype} fileUrl={message.fileUrl} />}
      {message.fileUrl && isGif && <GifBody mimeType={message.mimetype} fileUrl={message.fileUrl} />}
      {message.fileUrl && isAudio && <AudioBody mimeType={message.mimetype} fileUrl={message.fileUrl} />}
      {message.location && isLocation && <LocationBody location={message.location as Location} />}
      {message.fileUrl && isDocument && <DocumentBody documentUrl={message.fileUrl} />}


      <div className="w-full break-words" dangerouslySetInnerHTML={{ __html: messageHtml }}></div>

      <span className="text-xs mt-[-5px] w-full flex items-center justify-end gap-1" >
        {date}
        {message.fromMe && <AckIcon ack={message.ack} />}
      </span>
    </div>
  )
}

type ImageBodyProps = {
  fileUrl: string;
}

export const ImageBody = ({ fileUrl }: ImageBodyProps) => {
  return (
    <div className="relative">
      <ImageExpand
        imageUrl={fileUrl}
      >
        <Image
          src={fileUrl}
          width={600}
          height={600}
          alt="file"
          className="max-w-[300px] max-h-[300px] w-56 h-56 hover:z-50 hover:rotate-2 transition-all delay-100 rounded-md"
        />
      </ImageExpand>
    </div>
  )
}

type VideoBodyProps = {
  fileUrl: string;
  mimeType: string | null;
}

export const VideoBody = ({ fileUrl, mimeType }: VideoBodyProps) => {
  return (
    <div className="relative">
      <video controls width="100%">
        <source src={fileUrl} type={mimeType ?? "application/mp4"} />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

type GifBodyProps = {
  fileUrl: string;
  mimeType: string | null;
}

export const GifBody = ({ fileUrl, mimeType }: GifBodyProps) => {
  return (
    <div className="relative">
      <GifVideoExpand
        videoUrl={fileUrl}
        mimeType={mimeType ?? undefined}
      >
        <video width="100%" autoPlay loop>
          <source src={fileUrl} type={mimeType ?? "application/mp4"} />
          Your browser does not support the video tag.
        </video>
      </GifVideoExpand>
    </div>
  )
}

type AudioBodyProps = {
  fileUrl: string;
  mimeType: string | null;
}

export const AudioBody = ({ fileUrl, mimeType }: AudioBodyProps) => {
  return (
    <div className="relative">
      <audio controls>
        <source src={fileUrl} type={mimeType ?? "audio/mpeg"} />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}


type Location = {
  latitude: number;
  longitude: number;
  description?: string;
}
type LocationBodyProps = {
  location: Location;
}

export const LocationBody = ({ location }: LocationBodyProps) => {
  return (
    <div className="relative">
      <iframe
        src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
        width="100%"
        height="300"
      ></iframe>

      <div className="flex justify-center items-center mt-2">
        <Link
          className="text-blue-400 flex flex-row gap-2 items-center hover:underline transition-all"
          href={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}`}
          rel="noreferrer"
          target="_blank"
        >
          Abrir no Maps <ExternalLink size={22} />
        </Link>
      </div>
    </div>
  )
}


type DocumentBodyProps = {
  documentUrl: string;
}

export const DocumentBody = ({ documentUrl }: DocumentBodyProps) => {
  return (
    <div className="relative flex flex-col justify-center items-center">

      <FileText size={64} />

      <div className="flex justify-center items-center mt-2">
        <Link
          className="text-blue-400 flex flex-row gap-2 items-center hover:underline transition-all"
          href={documentUrl}
          rel="noreferrer"
          target="_blank"
        >
          Abrir documento <ExternalLink size={22} />
        </Link>
      </div>
    </div>
  )
}

