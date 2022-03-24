import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";

import { sendTransaction } from "../utils/transaction";
import ERC20Abi from "../../abis/ERC20.json";
import { createContract } from "../utils/contract";
import Web3 from "web3";

const STATUS_APPROVE_IDLE = "idle";
const STATUS_APPROVE_PENDING = "pending";
const STATUS_APPROVE_LOADING = "loading";
const STATUS_APPROVE_SENDING = "sending";

const useIsApproved = (
  networkId: number,
  account: string | boolean,
  tokenAddress: string,
  spenderAddress: string,
  approveAmount: string | null
) => {
  const [status, setStatus] = useState(STATUS_APPROVE_IDLE);
  const [isApproved, setIsApproved] = useState<boolean>();
  const [allowance, setAllowance] = useState<BigNumber>(new BigNumber(0));
  const tokenContract = createContract(ERC20Abi, tokenAddress, networkId);

  const fetchAllowance = useCallback(async () => {
    if (!Web3.utils.isAddress(tokenAddress)) return;
    if (networkId && account && tokenAddress && spenderAddress) {
      try {
        setStatus(STATUS_APPROVE_LOADING);
        const amount = await tokenContract.methods
          .allowance(account, spenderAddress)
          .call();
        const allowAmount = new BigNumber(amount);
        if (allowAmount.gt(0) && allowAmount.gte(approveAmount)) {
          setAllowance(allowAmount);
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
        setStatus(STATUS_APPROVE_IDLE);
      } catch (error) {
        console.log(error);
        setStatus(STATUS_APPROVE_IDLE);
      }
    }
  }, [networkId, account, tokenAddress, spenderAddress, approveAmount]);

  useEffect(() => {
    if (networkId && account && tokenAddress && spenderAddress)
      fetchAllowance();
  }, [
    networkId,
    account,
    tokenAddress,
    spenderAddress,
    fetchAllowance,
    approveAmount,
  ]);

  const handleApprove = async () => {
    if (account) {
      const amount = approveAmount
        ? approveAmount
        : new BigNumber(1).multipliedBy(new BigNumber(2).pow(256)).minus(1);
      const encodedAbi = tokenContract.methods
        .approve(spenderAddress, amount)
        .encodeABI();

      try {
        setStatus(STATUS_APPROVE_PENDING);
        await sendTransaction(
          "metamask",
          account,
          tokenAddress,
          encodedAbi,
          "",
          function () {
            setStatus(STATUS_APPROVE_SENDING);
          }
        ).then(async () => {
          fetchAllowance();
        });
        setStatus(STATUS_APPROVE_IDLE);
      } catch {
        setStatus(STATUS_APPROVE_IDLE);
      }
    }
  };

  return {
    allowance,
    approved: isApproved,
    status,
    handleApprove,
  };
};

export default useIsApproved;
