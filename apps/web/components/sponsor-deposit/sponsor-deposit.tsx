import React, { FC, useEffect, useState } from "react";
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
import { formatDecimal } from "../../utils/number";

interface Asset {
  symbol: string;
  address: string;
  balance: number;
}
interface Product {
  assets: Asset[];
}
interface Balance {
  products: Product[];
}

type Props = {};

const SponsorDeposit: FC<Props> = () => {
  const { register, handleSubmit, watch, setValue } = useForm();
  const watchForm = watch();
  const [zapperBalances, setZapperBalances] = useState<Product>();
  const [native, setNative] = useState<string>();
  const walletChainId = useSelector(chainId);
  const account = useSelector(defaultAccount);
  const approveStatus = useIsApproved(
    walletChainId,
    account,
    watchForm.tokenAddress,
    contractAddresses.hackathon[walletChainId],
    native ? true : false
  );
  const status = useStatus();

  const hackathon = createContract(
    HackathonAbi,
    contractAddresses.hackathon[walletChainId],
    walletChainId
  );

  useEffect(() => {
    async function getBalance() {
      const data = await fetch(
        `https://api.zapper.fi/v1/protocols/tokens/balances?api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241&addresses[]=${account}`
      );
      const balance: Object = await data.json();
      const balances = balance[String(account).toLowerCase()] || [];

      setZapperBalances(
        balances.products.length > 0 ? balances.products[0] : []
      );
    }

    if (account) getBalance();
  }, [account]);

  const handleDeposit = async (tokenAddress, amount) => {
    if (account) {
      const tokenContract = createContract(
        ERC20Abi,
        tokenAddress,
        walletChainId
      );
      const decimals = await tokenContract.methods.decimals().call();
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
          native ? `0x${new BigNumber(amount).times(1e18).toString(16)}` : "",
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

  const onTokenChange = async (value) => {
    const address = value.target.value;
    setNative(null);
    if (address === "0x0000000000000000000000000000000000000000") {
      const nativeAddress = await hackathon.methods.native().call();
      setNative(nativeAddress);
      setValue("tokenAddress", nativeAddress);
    } else {
      if (Web3.utils.isAddress(address)) setValue("tokenAddress", address);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Token</label>
        <select className={styles.select} onChange={onTokenChange}>
          <option>Select a Token</option>
          {zapperBalances &&
            zapperBalances.assets.map((balance, i) => (
              <option key={`balance-${i}`} value={balance.address}>
                {formatDecimal(balance.balance, 0, 4, 4)} {balance.symbol}
              </option>
            ))}
        </select>
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
