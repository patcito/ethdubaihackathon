import React, { FC, useState } from "react";
import useIsApproved from "../../hooks/useIsApproved";
import Button from "../button";
import { useSelector } from "react-redux";
import { chainId, defaultAccount } from "../wallet-connect/slice/selectors";
import ERC20Abi from "../../../abis/ERC20.json";
import HackathonAbi from "../../../abis/Hackathon.json";

import styles from "./sponsor-deposit.module.scss";
import { contractAddresses } from "../../data/constant";
import WalletConnect from "../wallet-connect";
import { createContract } from "../../utils/contract";
import useStatus from "../../hooks/useStatus";
import { sendTransaction } from "../../utils/transaction";
import BigNumber from "bignumber.js";
import { useForm } from "react-hook-form";
import Web3 from "web3";

type Props = {};

const SponsorDeposit: FC<Props> = () => {
  const { register, handleSubmit, watch } = useForm();
  const [decimals, setDecimals] = useState<number>(18);
  const watchForm = watch();

  const walletChainId = useSelector(chainId);
  const account = useSelector(defaultAccount);
  const approveStatus = useIsApproved(
    walletChainId,
    account,
    watchForm.tokenAddress,
    contractAddresses.hackathon[walletChainId],
    new BigNumber(
      new BigNumber(watchForm.amount).times(
        new BigNumber(10).exponentiatedBy(decimals)
      )
    ).toFixed(0)
  );
  const status = useStatus();

  const hackathon = createContract(
    HackathonAbi,
    contractAddresses.hackathon[walletChainId],
    walletChainId
  );

  const handleDeposit = async (tokenAddress, amount) => {
    if (account) {
      const tokenContract = createContract(
        ERC20Abi,
        tokenAddress,
        walletChainId
      );
      const tokenDecimals = await tokenContract.methods.decimals().call();
      setDecimals(tokenDecimals);
      const encodedAbi = hackathon.methods
        .deposit(
          tokenAddress,
          `0x${new BigNumber(
            new BigNumber(amount).times(
              new BigNumber(10).exponentiatedBy(decimals)
            )
          ).toString(16)}`
        )
        .encodeABI();
      try {
        status.setPending();
        await sendTransaction(
          "metamask",
          account,
          hackathon.options.address,
          encodedAbi,
          "",
          function (hash) {
            status.setSending();
          }
        );
        status.setIdle();
      } catch (e) {
        console.log("handleDeposit", e.stack);
        status.setIdle();
      }
    }
  };

  const onSubmit = ({ tokenAddress, amount }) =>
    handleDeposit(tokenAddress, amount);

  return (
    <div className={styles.wrapper}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Token</label>
        <input
          {...register("tokenAddress", { required: true })}
          type="text"
          className={styles.input}
          placeholder="0x0000000000000000000000000000000000000000"
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Amount</label>
        <input
          {...register("amount", { required: true })}
          type="text"
          className={styles.input}
          placeholder="0.0"
        />
      </div>
      <div className={styles.formGroup}>
        {!account ? (
          <WalletConnect />
        ) : approveStatus.approved ? (
          <Button
            size="sm"
            onClick={handleSubmit(onSubmit)}
            loading={status.status !== "idle"}
            disabled={
              !watchForm.tokenAddress ||
              !watchForm.amount ||
              !Web3.utils.isAddress(watchForm.tokenAddress)
            }
          >
            Deposit
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => approveStatus.handleApprove()}
            disabled={
              !watchForm.tokenAddress ||
              !watchForm.amount ||
              !Web3.utils.isAddress(watchForm.tokenAddress)
            }
          >
            Approve
          </Button>
        )}
      </div>
    </div>
  );
};

export default SponsorDeposit;
