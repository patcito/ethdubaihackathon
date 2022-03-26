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
    1: "0x89b9c96d1b0024e929bfc76f898a4478a527a88c",
    250: "0xcdaD183b98fC22C83895855fFfa7CF28e00E907d",
    31337: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
};
