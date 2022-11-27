import { CHARACTERS_QUERY } from "@/graphql/queries/characters";
import { initializeApollo } from "@/lib/apolloClient";
import { cookies } from "next/headers";
import Apollo from "@/providers/Apollo";
import Link from "next/link";
import { getRequestStorage } from "@/lib/localStorage";

export default async function SSRLayout({
  children,
}: {
  children: JSX.Element;
}) {
  // Set up SSR headers here.
  const apolloClient = initializeApollo({
    headers: {
      authorization: cookies().get("authToken")?.value ?? "",
    },
  });
  // Calling query here will cause the query to be executed on the server,
  // and persist into requestStorage.
  await apolloClient.query({ query: CHARACTERS_QUERY });
  return (
    <Apollo apolloState={JSON.stringify(getRequestStorage().apolloState ?? {})}>
      <Link href="/">Go to CSR</Link>
      {children}
    </Apollo>
  );
}
