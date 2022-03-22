import { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { useAccountConnectSlice } from "../components/wallet-connect/slice";
import { useDispatch, useSelector } from "react-redux";

const useWalletConnect = () => {
  const { actions } = useAccountConnectSlice();

  const [web3Modal, setWeb3Modal] = useState<any>();
  const dispatch = useDispatch();
  const providerOptions = {};

  useEffect(() => {
    const init = async () => {
      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
        theme: {
          background: "rgba(10, 21, 55, 1)",
          main: "rgba(255, 255, 255, 0.9)",
          secondary: "rgba(255, 255, 255, 0.5)",
          border: "rgba(255, 255, 255, 0.12)",
          hover: "rgba(255, 255, 255, 0.1)",
        },
      });

      if (web3Modal.cachedProvider) {
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        const data = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        if (data && data[0]) {
          dispatch(actions.setDefault(data[0]));
        }
        if (chainId) {
          dispatch(actions.setChainId(chainId));
        }

        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts: string[]) => {
          dispatch(actions.setDefault(accounts[0]));
        });

        // Subscribe to chainId change
        provider.on("chainChanged", (chainId: number) => {
          dispatch(actions.setChainId(web3.utils.hexToNumber(chainId)));
        });

        // Subscribe to provider connection
        provider.on("connect", (info: { chainId: number }) => {
          dispatch(actions.setChainId(info.chainId));
        });
      }
      setWeb3Modal(web3Modal);
    };

    init();
  }, []);

  return web3Modal;
};

export default useWalletConnect;
