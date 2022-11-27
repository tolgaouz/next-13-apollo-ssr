/**
 * This file makes sure that we can get a storage that us unique to the current request context
 */
import { NormalizedCacheObject } from "@apollo/client";
import { AsyncLocalStorage } from "async_hooks";

// https://github.com/vercel/next.js/blob/canary/packages/next/client/components/request-async-storage.ts
export const asyncStorage:
  | AsyncLocalStorage<{ apolloState?: NormalizedCacheObject }>
  | {} = require("next/dist/client/components/request-async-storage").requestAsyncStorage;

export function getRequestStorage(): { apolloState?: NormalizedCacheObject } {
  if ("getStore" in asyncStorage) {
    return asyncStorage.getStore() ?? {};
  }

  return asyncStorage;
}
