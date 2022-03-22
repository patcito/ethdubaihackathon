import Web3 from "web3";
import { web3 } from "./web3Provider";

export const createContract = (
  abi: any,
  address: string,
  networkId: number = 1
) => {
  if (!Web3.utils.isAddress(address)) return;
  const web3Provider = web3;
  return new web3Provider.eth.Contract(abi, address);
};
