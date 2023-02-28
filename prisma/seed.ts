import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.create({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data: {
      password: "$2b$10$wMFsVv4ayIA8JHNoQ6BGqui3tEoYXtVAAFxqPn0cRXXHN2oIPY2mq",
      userName: "admin@gmail.com",
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log({ user });
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
