import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "../../../utils/@reduxjs/toolkit";
import { useInjectReducer } from "../../../utils/redux-injectors";
import { AccountConnectState } from "./types";

export const initialState: AccountConnectState = {
  default: false,
  chainId: 0,
};

const slice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setDefault(state, action: PayloadAction<string | boolean>) {
      state.default = action.payload;
    },
    setChainId(state, action: PayloadAction<number>) {
      state.chainId = action.payload;
    },
  },
});

export const { actions: accountActions } = slice;

export const useAccountConnectSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
