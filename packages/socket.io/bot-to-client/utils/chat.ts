

import { prisma } from '@acme/db';

interface HasChatProps {
  contactId: string;
  instanceId: string;
}
export const getHasChat = async ({ contactId, instanceId }: HasChatProps) => {

  const hasChat = await prisma.whatsappChat.findFirst({
    where: {
      contactId,
      NOT: {
        step: 'FINISHED',
      }
    }
  });

  if (!hasChat) return await prisma.whatsappChat.create({
    data: {
      contactId,
      step: 'START',
      instanceId: instanceId,
    }
  });

  return hasChat;
}