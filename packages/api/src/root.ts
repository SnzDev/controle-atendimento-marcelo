import { assignmentRouter } from "./router/assignment";
import { authRouter } from "./router/auth";
import { clientRouter } from "./router/client";
import { mkRouter } from "./router/mk";
import { observationRouter } from "./router/observation";
import { regionRouter } from "./router/region";
import { serviceRouter } from "./router/service";
import { shopRouter } from "./router/shop";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";
import { whatsappRouter } from "./router/whatsapp";
import { chatRouter } from "./router/chat";

export const appRouter = createTRPCRouter({
  service: serviceRouter,
  shop: shopRouter,
  clients: clientRouter,
  assignment: assignmentRouter,
  user: userRouter,
  observation: observationRouter,
  region: regionRouter,
  auth: authRouter,
  mk: mkRouter,
  whatsapp: whatsappRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
