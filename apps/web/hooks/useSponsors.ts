import { GET_SPONSOR_BALANCES } from "./../../apollo/queries/sponsors";
import { chainId } from "./../components/wallet-connect/slice/selectors";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { graphClient } from "../apollo-clients";

export type Balances = {
  id: string;
  sponsor: {
    address: string;
    verified: boolean;
  };
  token: {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  totalAmount: number;
};

const useSponsorBalances = ({ filter = (data: Balances[]) => data } = {}) => {
  const [balances, setBalances] = useState<Balances[]>([]);
  const walletChainId = useSelector(chainId);

  useEffect(() => {
    async function fetchBalances() {
      const client = graphClient(walletChainId);
      if (!client) return;

      let { data } = await client.query({
        query: GET_SPONSOR_BALANCES,
      });

      if (filter) {
        data = filter(data.sponsorBalances);
      }

      setBalances(data);
    }

    if (walletChainId) fetchBalances();
  }, [walletChainId, filter]);

  return balances;
};

export default useSponsorBalances;
