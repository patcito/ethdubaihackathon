import { GET_SPONSOR_BALANCES } from "./../../apollo/queries/sponsors";
import { chainId } from "./../components/wallet-connect/slice/selectors";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { graphClient } from "../apollo-clients";

type Balances = {
  id: string;
  sponsor: {
    address: string;
  };
  token: {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  totalAmount: number;
};

const useSponsorBalances = () => {
  const [balances, setBalances] = useState<Balances[]>([]);
  const walletChainId = useSelector(chainId);

  useEffect(() => {
    async function fetchBalances() {
      const client = graphClient(walletChainId);
      if (!client) return;

      const { data } = await client.query({
        query: GET_SPONSOR_BALANCES,
      });

      setBalances(data.sponsorBalances);
    }

    if (walletChainId) fetchBalances();
  }, [walletChainId]);

  return balances;
};

export default useSponsorBalances;
