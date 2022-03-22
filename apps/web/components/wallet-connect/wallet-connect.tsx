import React, { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import useWalletConnect from "../../hooks/useWalletConnect";
import { defaultAccount } from "./slice/selectors";
import { useAccountConnectSlice } from "./slice";
import Web3 from "web3";
import Button from "../button";

type Props = {};

const WalletConnect: FC<Props> = () => {
  const walletConnect = useWalletConnect();
  const account = useSelector(defaultAccount);
  const { actions } = useAccountConnectSlice();
  const dispatch = useDispatch();

  const handleConnect = async () => {
    try {
      const provider = await walletConnect.connect();
      const web3 = new Web3(provider);
      const data = await web3.eth.getAccounts();
      if (data && data[0]) {
        dispatch(actions.setDefault(data[0]));

        const chainId = await web3.eth.getChainId();
        dispatch(actions.setChainId(chainId));
      }
    } catch (e) {
      console.error("ERROR(components): AccountConnect", e);
    }
  };

  const handleDisconnect = async () => {
    try {
      walletConnect.clearCachedProvider();
      dispatch(actions.setDefault(false));
    } catch (e) {
      console.log("handleDisconnect", e);
    }
  };

  return (
    <>
      {account ? (
        <Button onClick={() => handleDisconnect()}>Disconnect</Button>
      ) : (
        <Button onClick={() => handleConnect()}>
          <div className="flex flex-row gap-4 items-center">
            <img src="/images/logo.svg" width="16" height="auto" />
            <span>Connect your Wallet</span>
          </div>
        </Button>
      )}
    </>
  );
};

export default WalletConnect;
