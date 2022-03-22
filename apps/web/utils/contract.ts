import Web3 from "web3";
import { web3 } from "./web3Provider";

export const createContract = (
  abi: any,
  address: string,
  networkId: number = 1
) => {
  if (!Web3.utils.isAddress(address)) return;
  let web3Provider;
  if (
    web3.currentProvider &&
    Number(web3.currentProvider.networkVersion) != networkId &&
    networkId == 250
  ) {
    web3Provider = new Web3("https://rpc.ftm.tools/");
  } else if (
    web3.currentProvider &&
    Number(web3.currentProvider.networkVersion) != networkId &&
    networkId == 1
  ) {
    web3Provider = new Web3(process.env.INFURA_ENDPOINT);
  } else {
    web3Provider = web3;
  }
  return new web3Provider.eth.Contract(abi, address);
};
