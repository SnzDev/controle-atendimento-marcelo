import fs from "fs";
import mime from "mime-types";
import { type Message } from "whatsapp-web.js";
import { uploadBase64S3 } from "./fileUploadS3";

export async function SaveIfHaveFileLocal(msg: Message) {
  if (!msg.hasMedia) return null;

  const folder = `./public/`;
  if (!fs.existsSync(folder)) {
    try {
      fs.mkdirSync(folder);
    } catch (e) {
      console.log("error to create a file");
    }
  }
  const media = await msg.downloadMedia();
  if (media) {
    const format = mime.extension(media.mimetype);

    try {
      fs.writeFileSync(`${folder}/${msg.id.id}.${format}`, media.data, {
        encoding: "base64",
      });
      return `${folder}/${msg.id.id}.${format}`;
    } catch (e) {
      console.log("error to save file");
    }
  }
}

export async function SaveIfHaveFileS3(msg: Message) {
  if (!msg.hasMedia) return { fileKey: undefined, mimeType: undefined };

  try {
    const media = await msg.downloadMedia();
    if (!media) return { fileKey: undefined, mimeType: undefined };
    const format = mime.extension(media.mimetype);

    let path = "";

    if (media.mimetype.startsWith("image")) {
      path = "image";
    } else if (media.mimetype.startsWith("video")) {
      path = "video";
    } else if (media.mimetype.startsWith("audio")) {
      path = "audio";
    } else {
      path = "file";
    }

    path += `/${msg.id.id}.${format}`;

    const fileKey = uploadBase64S3(media.data, path);


    return { fileKey, mimeType: media.mimetype };
  } catch (e) {
    console.log("error to save file", e);
    return { fileKey: undefined, mimeType: undefined };
  }
}
