import { createTRPCRouter } from "./trpc";
import { serviceRouter } from "./routers/service";
import { shopRouter } from "./routers/shop";
import { clientRouter } from "./routers/client";
import { assignmentRouter } from "./routers/assignment";
import { userRouter } from "./routers/user";
import { observationRouter } from "./routers/observation";
import { regionRouter } from "./routers/region";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  service: serviceRouter,
  shop: shopRouter,
  clients: clientRouter,
  assignment: assignmentRouter,
  user: userRouter,
  observation: observationRouter,
  region: regionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
