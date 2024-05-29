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


export interface InstanceInfo {
  platform: string;
  pushname: string;
  phone: string;
  profilePicUrl: string;
}
const VERSION_CACHE = process.env.WA_VERSION ?? "2.2412.54";

class Instance {
  client: Client;
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTED" | "OFFLINE";
  info: InstanceInfo;

  constructor() {
    this.status = "OFFLINE";
    this.client = new Client({
      webVersionCache: {
        type: "remote",
        remotePath:
          // "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html",
          `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${VERSION_CACHE}.html`,
      },
      webVersion: VERSION_CACHE,
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
    });

    this.client.on("authenticated", authenticated);

    this.client.on("auth_failure", authFailure);

    this.client.on("ready", async () => {

      const profilePicUrl = await this.client.getProfilePicUrl(
        this.client.info.wid._serialized
      );
      const { platform, pushname, wid } = this.client.info;
      this.info = { platform, pushname, phone: wid.user, profilePicUrl };

      ready(this.info);
      this.status = "CONNECTED";
    });

    this.client.on("message_revoke_everyone", (e) => {
      messageRevokeEveryone({ timestamp: e.timestamp });
    });

    this.client.on("message", async (data) => {
      if (data.to.includes("@g.us") ||
        data.from.includes("@g.us") ||
        data.id.remote.includes("@broadcast")) return;
      const contact = await this.client.getContactById(
        data.from
      );
      const contactInfo: InstanceInfo = {
        phone: contact.number,
        platform: data?.fromMe ? "" : data.deviceType,
        pushname: contact.pushname,
        profilePicUrl: await contact.getProfilePicUrl(),
      };

      const s3Uploaded = await SaveIfHaveFileS3(data);

      const response = {
        message: data,
        toInfo: this.info,
        fromInfo: contactInfo,
        mimeType: s3Uploaded?.mimeType,
        fileKey: s3Uploaded?.fileKey,
      };

      message(response);
    });

    this.client.on("message_create", async (message) => {
      if (message.to.includes("@g.us") ||
        message.from.includes("@g.us") ||
        message.id.remote.includes("@broadcast") ||
        !message.fromMe) return;

      const contact = await this.client.getContactById(
        message.to
      );
      const contactInfo: InstanceInfo = {
        phone: contact.number,
        platform: message?.fromMe ? "" : message.deviceType,
        pushname: contact.pushname,
        profilePicUrl: await contact.getProfilePicUrl(),
      };

      const s3Uploaded = await SaveIfHaveFileS3(message);

      const data = {
        message,
        toInfo: contactInfo,
        fromInfo: this.info,
        mimeType: s3Uploaded?.mimeType,
        fileKey: s3Uploaded?.fileKey,
      };
      messageCreate(data);
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
  }

}

export { Instance };
