import { prisma } from '@acme/db';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { string, z } from 'zod';
import { whatsappServices } from '@acme/api';
import { sendStepLogin, sendStepStart } from '@acme/api/src/whatsappServices/chat';
import { mkGetToken } from '@acme/api/src/router/mk';
import { getClientInfoCpf } from '../../../../../../packages/mk';
import { sendMessageQueue } from '@acme/api/src/whatsappServices/api/sendMessage';

export enum Events {
  READY = 'ready',
  MESSAGE_RECEIVED = 'message',
  MESSAGE_ACK = 'message_ack',
  QR_RECEIVED = 'qr',
  DISCONNECTED = 'disconnected',
  MESSAGE_REVOKED_EVERYONE = 'message_revoke_everyone',
}

const typeMessageSchema = z.enum(['chat', 'revoked', 'image', 'video', 'audio', 'ptt', 'document', 'sticker', 'location', 'vcard', 'liveLocation', 'call']);

const schema = z.object({
  api_token: z.string(),
  event_type: z.enum([Events.READY, Events.QR_RECEIVED, Events.MESSAGE_RECEIVED, Events.MESSAGE_ACK, Events.DISCONNECTED, Events.MESSAGE_REVOKED_EVERYONE]),
  qr: z.string().optional(),
  phone: z.string().optional(),
  pushname: z.string().optional(),
  platform: z.string().optional(),
  profilePicUrl: z.string().optional(),
  fileKey: z.string().optional(),
  mimeType: z.string().optional(),
  message: z.object({
    id: z.object({
      id: z.string()
    }),
    isGif: z.boolean().optional(),
    type: typeMessageSchema,
    vCards: z.array(z.string()).optional(),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
      description: z.string().optional()
    }).optional(),
    ack: z.number(),
    body: z.string(),
    from: z.string(),
    to: z.string(),
    timestamp: z.number(),
    fromMe: z.boolean(),
  }).optional(),
  toInfo: z.object({
    pushname: z.string(),
    platform: z.string().optional(),
    profilePicUrl: z.string().optional(),
    phone: string()
  }).optional(),
  fromInfo: z.object({
    pushname: z.string(),
    platform: z.string().optional(),
    profilePicUrl: z.string().optional(),
    phone: string()
  }).optional(),
})

export type IBody = z.infer<typeof schema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const input = schema.safeParse(req.body);

  if (!input.success) {
    console.log({ error: input.error })

    return res.status(400).json(input.error);
  }


  try {
    const body = req.body as IBody;
    switch (body.event_type) {
      case Events.QR_RECEIVED:
        await qrCodeReceived(body);
        break;
      case Events.READY:
        await isReady(body);
        break;
      case Events.MESSAGE_RECEIVED:
        await messageReceived(body);
        break;
      case Events.MESSAGE_ACK:
        await messageAck(body);
        break;
      case Events.MESSAGE_REVOKED_EVERYONE:
        await messageRevokeEveryone(body);
        break;
      case Events.DISCONNECTED:
        await disconnected(body);
        break;
    }
    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function qrCodeReceived(data: IBody) {
  const instance = await prisma.whatsappInstance.findUnique({
    where: {
      id: data.api_token
    }
  });

  console.log('qrCodeReceived', data.qr);
  if (!instance) return;

  await prisma.whatsappInstance.update({
    where: {
      id: data.api_token
    },
    data: {
      qrCode: data.qr,
      status: 'DISCONNECTED',
      phone: null,
      instanceName: null,
      platform: null,
      profilePicUrl: null
    }
  });
}

async function isReady(data: IBody) {

  const instance = await prisma.whatsappInstance.findUnique({
    where: {
      id: data.api_token
    }
  });

  if (!instance) return;

  await prisma.whatsappInstance.update({
    where: {
      id: data.api_token
    },
    data: {
      qrCode: null,
      status: 'CONNECTED',
      phone: data.phone,
      instanceName: data.pushname,
      platform: data.platform,
      profilePicUrl: data.profilePicUrl
    }
  });
}


async function messageReceived(data: IBody) {

  console.info('messageReceived');
  const instance = await prisma.whatsappInstance.findUnique({
    where: {
      id: data.api_token
    }
  });

  if (!instance || !data.message || !data.toInfo || !data.fromInfo) return;


  const fromInfo = await whatsappServices.createOrUpdateContact(data.fromInfo);
  const toInfo = await whatsappServices.createOrUpdateContact(data.toInfo);

  const hasChat = await whatsappServices.getHasChat({ contactId: data.message.fromMe ? fromInfo.id : toInfo.id, instanceId: instance.id })

  await whatsappServices.createOrUpdateMessage({
    id: {
      id: data.message.id.id
    },
    ack: data.message.ack,
    body: data.message.body,
    fromMe: data.message.fromMe,
    timestamp: data.message.timestamp,
    vCards: data.message.vCards,
    location: data.message.location,
    fileKey: data.fileKey,
    type: data.message.type,
    fromContactId: fromInfo.id,
    toContactId: toInfo.id,
    chatId: hasChat.id,
    mimeType: data.mimeType,
    isGif: data.message.isGif
  });


  if (hasChat.step === 'START' && !data.message.fromMe)
    await sendStepStart({
      chatId: hasChat.id,
      phone: toInfo.phone,
      url: instance.url,
    })

  if (hasChat.step === 'LOGIN' && !data.message.fromMe) {
    const token = await mkGetToken();
    const client = await getClientInfoCpf({
      cpfCnpj: data.message.body?.replace(/\D/g, ''),
      token: token.personCode
    });

    if (!client?.Nome) return await sendMessageQueue({
      message: `CPF não encontrado. Por favor, digite novamente.`,
      phone: toInfo.phone,
      url: instance.url
    });

    await sendStepLogin({
      chatId: hasChat.id,
      phone: toInfo.phone,
      url: instance.url,
      mk: {
        externalId: client?.CodigoPessoa.toString(),
        clientName: client?.Nome,
      },
      cpf: data.message.body?.replace(/\D/g, ''),
    })
  }

  if (!data.message.id.id) return;
}

async function messageAck(data: IBody) {
  const instance = await prisma.whatsappInstance.findUnique({
    where: {
      id: data.api_token
    }
  });

  if (!instance || !data.message) return;

  const messageAcked = await prisma.whatsappMessages.findFirst({
    where: {
      protocol: data.message.id.id
    }
  })

  if (!messageAcked) return;

  await prisma.whatsappMessages.update({
    where: { id: messageAcked.id },
    data: {
      ack: data.message.ack,
    }
  })
}

async function disconnected(data: IBody) {
  const instance = await prisma.whatsappInstance.findUnique({
    where: {
      id: data.api_token
    }
  });

  if (!instance) return;

  await prisma.whatsappInstance.update({
    where: {
      id: data.api_token
    },
    data: {
      qrCode: null,
      status: 'DISCONNECTED'
    }
  });
}

async function messageRevokeEveryone(data: IBody) {

  console.log("MESSAGE REVOKED");

  if (!data.message) return;

  const message = await prisma.whatsappMessages.findFirst({
    where: {
      timestamp: data.message.timestamp
    }
  });

  if (!message) return;

  await prisma.whatsappMessages.update({
    where: { id: message.id },
    data: {
      isRevoked: true
    }
  })

}

