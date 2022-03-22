import Web3 from "web3";
declare const window: any;

const provider =
  process.browser && window !== undefined && window.ethereum !== undefined
    ? window.ethereum
    : process.env.INFURA_ENDPOINT;

const web3: any = new Web3(provider);

export { web3 };
