"use client";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@/lib/apolloClient";

export default function Apollo({
  children,
  apolloState,
}: {
  children: React.ReactNode;
  apolloState?: string;
}) {
  console.log("apolloStaet", apolloState);
  const apolloClient = useApollo(JSON.parse(apolloState ?? "{}"));
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
