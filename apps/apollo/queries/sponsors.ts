import { gql } from "@apollo/client";

export const GET_SPONSOR_BALANCES = gql(`
    query getSponsorBalances {
      sponsorBalances {
        id
        sponsor {
          address
        }
        token {
          symbol
          address
          name
          decimals
        }
        totalAmount
      }
    }
  `);
