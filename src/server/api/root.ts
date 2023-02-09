import { createTRPCRouter } from "./trpc";
import { serviceRouter } from "./routers/service";
import { technicRouter } from "./routers/technic";
import { shopRouter } from "./routers/shop";
import { clientRouter } from "./routers/client";
import { assignmentRouter } from "./routers/assignment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  service: serviceRouter,
  technic: technicRouter,
  shop: shopRouter,
  client: clientRouter,
  assignment: assignmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
