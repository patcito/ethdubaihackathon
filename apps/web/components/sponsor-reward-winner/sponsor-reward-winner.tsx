import React, { FC } from "react";
import BigNumber from "bignumber.js";
import Button from "../button";
import { useSelector } from "react-redux";
import { chainId, defaultAccount } from "../wallet-connect/slice/selectors";

import styles from "./sponsor-reward-winner.module.scss";
import { contractAddresses } from "../../data/constant";
import ERC20Abi from "../../../abis/ERC20.json";
import HackathonAbi from "../../../abis/Hackathon.json";
import useStatus from "../../hooks/useStatus";
import { createContract } from "../../utils/contract";
import { sendTransaction } from "../../utils/transaction";
import { useForm } from "react-hook-form";
import Web3 from "web3";

type Props = {};

const SponsorRewardWinner: FC<Props> = () => {
  const { register, handleSubmit, watch } = useForm();
  const watchForm = watch();

  const walletChainId = useSelector(chainId);
  const account = useSelector(defaultAccount);
  const status = useStatus();

  const hackathon = createContract(
    HackathonAbi,
    contractAddresses.hackathon[walletChainId],
    walletChainId
  );

  const handleWithdraw = async (tokenAddress, amount, winner, title) => {
    if (account) {
      const tokenContract = createContract(
        ERC20Abi,
        tokenAddress,
        walletChainId
      );
      const decimals = await tokenContract.methods.decimals().call();
      const encodedAbi = hackathon.methods
        .withdraw(
          tokenAddress,
          `0x${new BigNumber(
            new BigNumber(amount).times(
              new BigNumber(10).exponentiatedBy(decimals)
            )
          ).toString(16)}`,
          winner,
          title
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
        console.log("handleWithdraw", e.stack);
        status.setIdle();
      }
    }
  };

  const onSubmit = ({ tokenAddress, amount, winner, title }) =>
    handleWithdraw(tokenAddress, amount, winner, title);

  return (
    <div className={styles.wrapper}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Token Contract Address</label>
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
        <label className={styles.label}>Winner Address</label>
        <input
          {...register("winner", { required: true })}
          type="text"
          className={styles.input}
          placeholder="0x0000000000000000000000000000000000000000"
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Bounty Title</label>
        <input
          {...register("title", { required: true })}
          type="text"
          className={styles.input}
          placeholder="Hackathon Bounty Topic"
        />
      </div>
      <div className={styles.formGroup}>
        <Button
          size="sm"
          onClick={handleSubmit(onSubmit)}
          disabled={
            !watchForm.tokenAddress ||
            !watchForm.amount ||
            !watchForm.winner ||
            !watchForm.title ||
            !Web3.utils.isAddress(watchForm.tokenAddress)
          }
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default SponsorRewardWinner;
