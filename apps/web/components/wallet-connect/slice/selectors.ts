import { RootState } from "../../../types";

export const defaultAccount = (state: RootState) =>
  state && state.account && state.account.default;
export const chainId = (state: RootState) => state && state.account.chainId;
