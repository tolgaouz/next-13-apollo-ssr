"use client";
import { useQuery } from "@apollo/client";
import { CHARACTERS_QUERY } from "../graphql/queries/characters";

export default function Characters() {
  const { data, loading, error } = useQuery(CHARACTERS_QUERY);
  return (
    <>
      {loading && <p>Loading...</p>}
      <h1>Characters</h1>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </>
  );
}
