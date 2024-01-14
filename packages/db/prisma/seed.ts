import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  const whatsPassword = bcrypt.hashSync("whatsapp12345678", 10);

  await prisma.user.create({
    data: {
      password: whatsPassword,
      userName: "whatsapp@morpheus.com.br",
      name: "whatsapp",
      role: "USER",
    },
  });

  const service = await prisma.service.findFirst({
    where: {
      name: { contains: "WhatsApp" }
    }
  });

  if (!service) {
    await prisma.service.create({
      data: {
        name: "WhatsApp",
      }
    });
  }

  const region = await prisma.region.findFirst({
    where: {
      name: { contains: "piripiri" }
    }
  });

  if (!region) {
    await prisma.region.create({
      data: {
        name: "Piripiri",
      }
    });
  }

  const shop = await prisma.shop.findFirst({
    where: {
      name: { contains: "piripiri" }
    }
  });

  if (!shop) {
    await prisma.shop.create({
      data: {
        name: "Piripiri",
      }
    });
  }

  const existsUser = await prisma.user.findFirst({
    where: {
      userName: "admin@gmail.com",
    }
  });
  if (!existsUser) {
    const password = bcrypt.hashSync("12345678", 10);

    await prisma.user.create({
      data: {
        password: password,
        userName: "admin@gmail.com",
        name: "Admin",
        role: "ADMIN",
      },
    });
  }


}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
