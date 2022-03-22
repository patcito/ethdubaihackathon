import { ApolloClient, InMemoryCache, UriFunction } from "@apollo/client";

export const getClientUrl = (chainId: number): string | UriFunction => {
  let url: string;
  switch (chainId) {
    case 1:
      url = process.env.NEXT_PUBLIC_THE_GRAPH_ETHEREUM;
      break;
    case 250:
      url = process.env.NEXT_PUBLIC_THE_GRAPH_FANTOM;
      break;
  }

  return url;
};

export const graphClient = (chainId: number): ApolloClient<any> => {
  return new ApolloClient({
    uri: getClientUrl(Number(chainId)),
    cache: new InMemoryCache(),
  });
};
