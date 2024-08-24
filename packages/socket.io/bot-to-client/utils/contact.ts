
import { prisma } from '@morpheus/db';



interface CreateOrUpdateContactProps {
  phone: string;
  pushname: string;
  profilePicUrl?: string;
  platform?: string;

}
export const createOrUpdateContact = async ({ phone, platform, profilePicUrl, pushname }: CreateOrUpdateContactProps) => {
  const contact = await prisma.whatsappContact.findFirst({
    where: {
      phone,
    }
  });

  if (!contact)
    return await prisma.whatsappContact.create({
      data: {
        phone: phone,
        profilePicUrl: profilePicUrl,
        name: pushname,
        platform: platform,
        isGroup: platform === "group"
      }
    });

  //updated at > 2 days
  const diffTime = Math.abs(contact.updatedAt.getTime() - new Date().getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (contact && diffDays > 2)
    await prisma.whatsappContact.update({
      where: { id: contact.id },
      data: {
        phone: phone,
        profilePicUrl: profilePicUrl,
        name: pushname,
        platform: platform,
        isGroup: platform === "group",
      }
    });

  return contact;
}