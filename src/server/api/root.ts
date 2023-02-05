import { createTRPCRouter } from "./trpc";
import { serviceRouter } from "./routers/service";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  service: serviceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
