import { gql } from "@apollo/client";

export const CHARACTERS_QUERY = gql`
  query {
    characters {
      results {
        name
        status
        species
        type
        gender
      }
    }
  }
`;
