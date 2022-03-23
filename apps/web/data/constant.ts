export interface NetworkContractInterface {
  1: string;
  250?: string;
  31337?: string;
}

export interface ContractAddressesInterface {
  [key: string]: NetworkContractInterface;
}

export const contractAddresses: ContractAddressesInterface = {
  hackathon: {
    1: "0xC13DBa0CE613008eF43D205C455de6E9fbc1C77f",
    250: "0xcdaD183b98fC22C83895855fFfa7CF28e00E907d",
    31337: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
};
