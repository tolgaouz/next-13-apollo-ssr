import { getRequestStorage } from "@/lib/localStorage";
import Apollo from "@/providers/Apollo";
import Link from "next/link";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Next 13+ Apollo Client + SSR</title>
      </head>
      <body>
        <Link href="/ssr">Go to SSR</Link>
        <p>
          Try navigating between the links, notice if you refresh your page at
          the `/ssr` route, then go to the CSR page, the query is cached.
        </p>
        <Apollo
          apolloState={JSON.stringify(getRequestStorage().apolloState ?? "{}")}
        >
          {children}
        </Apollo>
      </body>
    </html>
  );
}
