import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { type AppRouter } from "./src/root";

export { appRouter, type AppRouter } from "./src/root";
export { createTRPCContext } from "./src/trpc";
export * as whatsappServices from "./src/whatsappServices/";
export * as mkServices from "./src/mkServices/";

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
