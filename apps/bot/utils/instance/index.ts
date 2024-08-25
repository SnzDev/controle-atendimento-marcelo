import type WAWebJS from "whatsapp-web.js";
import {
  Client,
  LocalAuth,
  type Message,
  type MessageAck,
} from "whatsapp-web.js";
import { SaveIfHaveFileS3 } from "../saveFile";
import { socket } from "~/socket";
import { qr } from "~/socket/pub/qr";
import { authenticated } from "~/socket/pub/authenticated";
import { authFailure } from "~/socket/pub/auth-failure";
import { ready } from "~/socket/pub/ready";
import { messageRevokeEveryone } from "~/socket/pub/message-revoke-everyone";
import { message } from "~/socket/pub/message";
import { messageCreate } from "~/socket/pub/message-create";
import { disconnected } from "~/socket/pub/disconnected";
import { changeBattery } from "~/socket/pub/change-battery";
import { changeState } from "~/socket/pub/change_state";
import { changeProfilePic } from "~/socket/pub/change-profile-pic";
import { changeStatus } from "~/socket/pub/change-status";
import { messageAck } from "~/socket/pub/message-ack";
import { getWid } from "./getWid";
import { messageSend } from "~/socket/sub/message-send";
import { logout } from "~/socket/sub/logout";
import { messageGroup } from "~/socket/pub/messageGroup";
import { deleteMessageEveryone } from "~/socket/sub/delete-message-everyone";


export interface InstanceInfo {
  platform: string;
  pushname: string;
  phone: string;
  profilePicUrl: string;
}
class Instance {
  client: Client;
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTED" | "OFFLINE";
  info: InstanceInfo;

  constructor() {
    this.status = "OFFLINE";
    this.client = new Client({
      // webVersionCache: {
      //   type: "remote",
      //   remotePath:
      //     // "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html",
      //     `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${VERSION_CACHE}.html`,
      // },
      // webVersion: VERSION_CACHE,
      authStrategy: new LocalAuth(),
      puppeteer: {
        executablePath: process.env.CHROME_PATH,
        headless: true,
        args: [
          "--no-sandbox",
          // "--no-first-run",
          // "--no-zygote",
          // "--disable-gpu",
          // "--disable-setuid-sandbox",
          // "--disable-dev-shm-usage",
          // "--disable-accelerated-2d-canvas",
          // "--disable-extensions",
        ],
      },
    });

    this.addSocketListeners();

    this.addListeners();
  }

  start = async () => {
    disconnected("NAVIGATION");
    this.status = "OFFLINE";
    console.log("Starting instance...");
    await this.client.initialize();

  };
  closeInstance = async () => {
    disconnected("NAVIGATION");

    this.status = "OFFLINE";
    await this.client.destroy();
  };

  logout = async () => {

    this.status = "OFFLINE";
    await this.client.logout();
    await this.restartInstance();
  };

  restartInstance = async () => {

    this.status = "OFFLINE";
    await this.closeInstance();
    this.closeListeners();
    this.addListeners();
    await this.start();
  };

  closeListeners = () => {
    this.client.removeAllListeners("qr");
    this.client.removeAllListeners("authenticated");
    this.client.removeAllListeners("auth_failure");
    this.client.removeAllListeners("ready");
    this.client.removeAllListeners("message");
    this.client.removeAllListeners("disconnected");
    this.client.removeAllListeners("change_battery");
    this.client.removeAllListeners("change_state");
    this.client.removeAllListeners("change_profile_pic");
    this.client.removeAllListeners("change_status");
  };

  getContact = async (number: string) => {
    const contact = await this.client.getNumberId(getWid(number));
    return contact;
  };

  addListeners = () => {
    this.client.on("qr", (data) => {
      qr(data);
      this.status = "DISCONNECTED";
      console.log("qr");
    });

    this.client.on("authenticated", authenticated);

    this.client.on("auth_failure", authFailure);

    this.client.on("ready", async () => {

      const profilePicUrl = await this.client.getProfilePicUrl(
        this.client.info.wid._serialized
      ).catch(() => "");
      const { platform, pushname, wid } = this.client.info;
      this.info = { platform, pushname, phone: wid.user, profilePicUrl };

      ready(this.info);
      this.status = "CONNECTED";
    });

    this.client.on("message_revoke_everyone", (e) => {
      messageRevokeEveryone({ timestamp: e.timestamp });
    });

    this.client.on("message", async (data) => {

      if (
        !data.id.remote.includes("@c.us")
      )
        return;

      const chat = await data.getChat();

      const contact = await chat.getContact();

      const contactInfo: InstanceInfo = {
        phone: chat.id._serialized,
        platform: data.deviceType,
        pushname: contact.pushname ?? contact.name,
        profilePicUrl: await contact.getProfilePicUrl().catch(() => ""),
      };
      const s3Uploaded = await SaveIfHaveFileS3(data);

      const response = {
        message: data,
        toInfo: this.info,
        fromInfo: contactInfo,
        mimeType: s3Uploaded?.mimeType,
        fileKey: s3Uploaded?.fileKey,
      };


      return message(response);

    });

    this.client.on("message_create", async (data) => {
      console.log('message_create');
      console.log(!data.id.remote.includes("@c.us") &&
        !data.id.remote.includes("@g.us"), { remote: data.id.remote });
      if (
        !data.id.remote.includes("@c.us") &&
        !data.id.remote.includes("@g.us")
      )
        return;

      const chat = await data.getChat();
      const isGroup = chat.isGroup;

      console.log({ from: data.from, author: data.author, isGroup, to: data.to, fromMe: data.fromMe });
      const contact = await this.client.getContactById(
        data.id.remote
      );

      const contactInfo: InstanceInfo = {
        phone: contact.isGroup ? data.id.remote : contact.number,
        platform: contact.isGroup ? 'group' : data.deviceType,
        pushname: contact.isGroup ? contact.pushname ?? contact.name : contact.pushname,
        profilePicUrl: await contact.getProfilePicUrl().catch(() => ""),
      };
      const s3Uploaded = await SaveIfHaveFileS3(data);

      const response = {
        message: data,
        toInfo: data.fromMe ? contactInfo : this.info,
        fromInfo: data.fromMe ? this.info : contactInfo,
        mimeType: s3Uploaded?.mimeType,
        fileKey: s3Uploaded?.fileKey,
        authorInfo: null as null | InstanceInfo,
      };
      if (isGroup) {
        if (data.author) {
          const author = await this.client.getContactById(
            data.author?.replace(/:(.*?)@/, "@")
          );
          const authorInfo: InstanceInfo = {
            phone: author.number,
            platform: data.deviceType,
            pushname: author.pushname,
            profilePicUrl: await author.getProfilePicUrl().catch(() => ""),
          };
          response.authorInfo = authorInfo;
        }
        console.log(response)

        return messageGroup(response);
      }


      if (data.id.remote.includes("@c.us")) return messageCreate(response);

    });

    this.client.on("disconnected", async (reason) => {
      disconnected(reason);
      console.log({ disconnected: reason })
      await this.restartInstance();
    });

    this.client.on("change_battery", (batteryInfo) => {
      // Battery percentage for attached device has changed
      const { battery, plugged } = batteryInfo;
      console.log(`Battery: ${battery}% - Charging? ${plugged}`);
      changeBattery(batteryInfo);
    });

    this.client.on("change_state", changeState);

    this.client.on("change_profile_pic", changeProfilePic);

    this.client.on("change_status", changeStatus);

    this.client.on("message_ack", (msg, ack) => {
      messageAck({ protocol: msg.id.id, ack });
    });
  };
  addSocketListeners = () => {
    logout(this.logout);
    messageSend(this.client);
    deleteMessageEveryone(this.client);
  }

}

export { Instance };
