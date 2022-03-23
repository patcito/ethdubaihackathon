import { gql } from "@apollo/client";

export const GET_SPONSOR_BALANCES = gql(`
    query getSponsorBalances {
      sponsorBalances {
        id
        sponsor {
          address
          verified
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
