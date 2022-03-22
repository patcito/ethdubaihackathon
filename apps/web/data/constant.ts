export interface NetworkContractInterface {
  1: string;
  31337?: string;
}

export interface NetworkStatusInterface {
  1: boolean;
  31337?: boolean;
}

export interface ContractAddressesInterface {
  [key: string]: NetworkContractInterface;
}

export const contractAddresses: ContractAddressesInterface = {
  hackathon: {
    1: "",
    31337: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
};
