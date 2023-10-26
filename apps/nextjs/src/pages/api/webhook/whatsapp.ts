import { prisma } from '@acme/db';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { string, z } from 'zod';

export enum Events {
  READY = 'ready',
  MESSAGE_RECEIVED = 'message',
  MESSAGE_ACK = 'message_ack',
  QR_RECEIVED = 'qr',
  DISCONNECTED = 'disconnected'
}

const schema = z.object({
  api_token: z.string(),
  event_type: z.enum([Events.READY, Events.QR_RECEIVED, Events.MESSAGE_RECEIVED, Events.MESSAGE_ACK, Events.DISCONNECTED]),
  qr: z.string().optional(),
  phone: z.string().optional(),
  pushname: z.string().optional(),
  platform: z.string().optional(),
  profilePicUrl: z.string().optional(),
  message: z.object({
    id: z.object({
      id: z.string()
    }),
    ack: z.number(),
    body: z.string(),
    from: z.string(),
    to: z.string(),
    timestamp: z.number(),
    fromMe: z.boolean()
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

type IBody = z.infer<typeof schema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const input = schema.safeParse(req.body);

  if (!input.success) {
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

  let fromInfo = await prisma.whatsappContact.findFirst({
    where: {
      phone: data.fromInfo.phone
    }
  });
  if (!fromInfo) {
    fromInfo = await prisma.whatsappContact.create({
      data: {
        phone: data.fromInfo.phone,
        profilePicUrl: data.fromInfo.profilePicUrl,
        name: data.fromInfo.pushname,
        platform: data.fromInfo.platform
      }
    });
  } else {
    await prisma.whatsappContact.update({
      where: { id: fromInfo.id },
      data: {
        phone: data.fromInfo.phone,
        profilePicUrl: data.fromInfo.profilePicUrl,
        name: data.fromInfo.pushname,
        platform: data.fromInfo.platform
      }
    });
  }

  let toInfo = await prisma.whatsappContact.findFirst({
    where: {
      phone: data.toInfo.phone
    }
  });
  if (!toInfo) {
    toInfo = await prisma.whatsappContact.create({
      data: {
        phone: data.toInfo.phone,
        profilePicUrl: data.toInfo.profilePicUrl,
        name: data.toInfo.pushname,
        platform: data.toInfo.platform
      }
    });
  } else {
    await prisma.whatsappContact.update({
      where: { id: toInfo.id },
      data: {
        phone: data.toInfo.phone,
        profilePicUrl: data.toInfo.profilePicUrl,
        name: data.toInfo.pushname,
        platform: data.toInfo.platform
      }
    });
  }

  if (!data.message.id.id) return;

  const message = await prisma.whatsappMessages.findFirst({
    where: {
      protocol: data.message.id.id
    }
  });

  if (message) await prisma.whatsappMessages.update({
    where: { id: message.id },
    data: {
      protocol: data.message.id.id,
      ack: data.message.ack,
      body: data.message.body,
      from: fromInfo.id,
      to: toInfo.id,
      fromMe: data.message.fromMe,
      instanceId: data.api_token,
      timestamp: data.message.timestamp
    }
  });

  await prisma.whatsappMessages.create({
    data: {
      protocol: data.message.id.id,
      ack: data.message.ack,
      body: data.message.body,
      from: fromInfo.id,
      to: toInfo.id,
      fromMe: data.message.fromMe,
      instanceId: data.api_token,
      timestamp: data.message.timestamp
    }
  });

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

  console.log('messageAcked', data.message.id.id, data.message.ack)
  if (!messageAcked) return;

  await prisma.whatsappMessages.update({
    where: { id: messageAcked.id },
    data: {
      protocol: data.message.id.id,
      ack: data.message.ack,
      body: data.message.body,
      from: data.message.from,
      to: data.message.to,
      fromMe: data.message.fromMe,
      instanceId: data.api_token,
      timestamp: data.message.timestamp
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


