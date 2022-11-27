import { useMemo } from "react";
import {
  ApolloClient,
  ApolloQueryResult,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { getCookies } from "./utils/getCookies";
import { getRequestStorage } from "./localStorage";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`, // Server URL (must be absolute)
      credentials: "include", // Additional fetch() options like `credentials` or `headers`
      headers:
        typeof window === "undefined"
          ? {} // No need to set anything here because we use apolloClient.server on SSR,
          : // although we still need to check if window is undefined because of Next.js
            { authorization: getCookies(document.cookie).token }, // CSR
    }),
    cache: new InMemoryCache({
      // typePolicies is not required to use Apollo with Next.js - only for doing pagination.
      typePolicies: {
        Query: {
          fields: {
            posts: relayStylePagination(),
          },
        },
      },
    }),
  });
};

export const mergeCaches = (
  sourceCache: NormalizedCacheObject,
  destinationCache: NormalizedCacheObject
): NormalizedCacheObject => {
  // Merge the existing cache into data passed from getStaticProps/getServerSideProps
  const data = merge(sourceCache, destinationCache, {
    // combine arrays using object equality (like in sets)
    arrayMerge: (destinationArray, sourceArray) => [
      ...sourceArray,
      ...destinationArray.filter((d) =>
        sourceArray.every((s) => !isEqual(d, s))
      ),
    ],
  });
  return data;
};

export const initializeApollo = (initialState?: NormalizedCacheObject) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    const data = mergeCaches(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined" && !apolloClient) {
    // Override apolloClient query method to persist cache into the request storage
    const originalQuery = _apolloClient.query;
    _apolloClient.query = async function <
      T = unknown,
      TVariables = OperationVariables
    >(options: QueryOptions<TVariables, T>): Promise<ApolloQueryResult<T>> {
      const r = await originalQuery.apply(originalQuery, [options]);
      const currentCache = _apolloClient.cache.extract();
      // Put the cache into local storage specific to this request.
      getRequestStorage().apolloState = mergeCaches(
        getRequestStorage().apolloState ?? {},
        currentCache
      );
      return r as ApolloQueryResult<T>;
    };
    return _apolloClient;
  }
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const useApollo = (state: NormalizedCacheObject) => {
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
};
