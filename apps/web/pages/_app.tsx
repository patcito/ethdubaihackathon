import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, NETWORKS } from "@web3-ui/core";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider
      //rpcUrl={`https://mainnet.infura.io/v3/753e543666274e8f9ab27ff3a082c75c`}
      // rpcUrl={`http://localhost:8545`}
      rpcUrl="https://ropsten.infura.io/v3/753e543666274e8f9ab27ff3a082c75c"
    >
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
