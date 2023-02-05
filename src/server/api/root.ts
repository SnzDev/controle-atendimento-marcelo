import { createTRPCRouter } from "./trpc";
import { labelRouter } from "./routers/label";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  label: labelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
