"use client";

// import { type AppRouter } from "@acme/api";
import type { inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
// import { GifVideoExpand, ImageExpand } from "~/components/ImageExpand";
import Link from "next/link";
import { Check } from "iconsax-react";
// import { AckIcon } from "./Ack";
import { Ban, ExternalLink, FileText } from "lucide-react";

import type { RouterOutputs } from "@morpheus/api";
import { AppRouter } from "@morpheus/api";

import { AckIcon } from "./Ack";
import { GifVideoExpand, ImageExpand } from "~/components/ImageExpand";

export type Message = RouterOutputs["chat"]["getMessagesByChatId"][number];

interface BalloonProps {
  message: Message;
}
export const Balloon = ({ message }: BalloonProps) => {
  // but this timestamp is utc how to resolve
  const date = Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(message.createdAt ?? new Date());

  const isImage = message.type === "image" || message.type === "sticker";
  const isVideo = message.type === "video" && !message.isGif;
  const isGif = message.type === "video" && !!message.isGif;
  const isAudio = message.type === "ptt";
  const isLocation = message.type === "location";
  const isDocument = message.type === "document";
  //body can be \n to break line
  //body can be *bold* to bold
  //body can be _italic_ to italic
  //body can be ~strikethrough~ to strikethrough
  //body can be `monospace` to monospace and
  //whitout any of this it will be a paragraph
  const messageHtml = message.body
    .replace(/\*(.*?)\*/g, "<b>$1</b>")
    .replace(/_(.*?)_/g, "<i>$1</i>")
    .replace(/~(.*?)~/g, "<s>$1</s>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/"(.*?)"/g, "<p>$1</p>");

  return (
    <div
      className={`flex h-fit max-w-[20rem] flex-col flex-wrap items-end gap-1 rounded-lg p-2 ${message.fromMe ? "self-end bg-primary pl-4 text-white" : "self-start bg-primary/75 pr-4 text-white"}`}
    >
      {message.isRevoked && (
        <p className="text-gray-500 mb-1 flex flex-row items-center gap-2">
          <Ban size={15} /> Mensagem apagada
        </p>
      )}

      <div
        dangerouslySetInnerHTML={{ __html: messageHtml }}
        className="text-gray-500 dont-break-out w-full items-center gap-2 whitespace-pre-wrap break-words"
      />
      {/* {message.fileUrl && isImage && <ImageBody fileUrl={message.fileUrl} />}
      {message.fileUrl && isVideo && (
        <VideoBody mimeType={message.mimetype} fileUrl={message.fileUrl} />
      )}
      {message.fileUrl && isGif && (
        <GifBody mimeType={message.mimetype} fileUrl={message.fileUrl} />
      )}
      {message.fileUrl && isAudio && (
        <AudioBody mimeType={message.mimetype} fileUrl={message.fileUrl} />
      )}
      {message.location && isLocation && (
        <LocationBody location={message.location as Location} />
      )}
      {message.fileUrl && isDocument && (
        <DocumentBody documentUrl={message.fileUrl} />
      )} */}

      {/* <div
        className="w-full break-words"
        dangerouslySetInnerHTML={{ __html: messageHtml }}
      ></div> */}

      <span className="mt-[-3px] flex w-full items-center justify-end text-xs">
        {date}
        {message.fromMe && <AckIcon ack={message.ack} />}
      </span>
    </div>
  );
};

interface ImageBodyProps {
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
          className="h-56 max-h-[300px] w-56 max-w-[300px] rounded-md transition-all delay-100 hover:z-50 hover:rotate-2"
        />
      </ImageExpand>
    </div>
  );
};

interface VideoBodyProps {
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
  );
};

interface GifBodyProps {
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
  );
};

interface AudioBodyProps {
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
  );
};

interface Location {
  latitude: number;
  longitude: number;
  description?: string;
}
interface LocationBodyProps {
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

      <div className="mt-2 flex items-center justify-center">
        <Link
          className="flex flex-row items-center gap-2 text-blue-400 transition-all hover:underline"
          href={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}`}
          rel="noreferrer"
          target="_blank"
        >
          Abrir no Maps <ExternalLink size={22} />
        </Link>
      </div>
    </div>
  );
};

interface DocumentBodyProps {
  documentUrl: string;
}

export const DocumentBody = ({ documentUrl }: DocumentBodyProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <FileText size={64} />

      <div className="mt-2 flex items-center justify-center">
        <Link
          className="flex flex-row items-center gap-2 text-blue-400 transition-all hover:underline"
          href={documentUrl}
          rel="noreferrer"
          target="_blank"
        >
          Abrir documento <ExternalLink size={22} />
        </Link>
      </div>
    </div>
  );
};
