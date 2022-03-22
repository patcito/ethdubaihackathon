import BigNumber from "bignumber.js";

import { notify } from "./notify";
import { web3 } from "./web3Provider";

export const sendTransaction = async (
  connection: string,
  from: string | boolean,
  to: string,
  abi: string,
  wei: string = `0x0`,
  callback = (hash: string) => {},
  gasPrice?: number | boolean,
  gasLimit?: number | boolean
): Promise<any> => {
  const walletConnection = window.localStorage.getItem("selectedWallet");
  if (walletConnection !== "WalletConnect") {
    if (web3) {
      try {
        let tx: any = {
          from,
          to,
          gasPrice: gasPrice
            ? web3.utils.toWei(String(gasPrice), "gwei")
            : web3.utils.toHex(await web3.eth.getGasPrice()),
          data: abi,
          value: wei,
        };

        if (gasLimit && gasLimit > 0) {
          tx = {
            ...tx,
            gasLimit,
          };
        } else {
          tx = {
            ...tx,
            gasLimit: new BigNumber(
              await web3.eth
                .estimateGas({
                  from,
                  to,
                  data: abi,
                  value: wei,
                })
                .catch((err: any) => {
                  notify.send(
                    `${JSON.parse(err.message.substring(24).trim()).message}`,
                    5000,
                    "error"
                  );
                  return;
                })
            )
              .times(1.5)
              .toFixed(0),
          };
        }

        return new Promise((resolve, reject) => {
          web3.eth
            .sendTransaction(tx)
            .on("transactionHash", (hash: any) => {
              notify.send("Waiting for network confirmations.", 30000);
              callback(hash);
            })
            .on("receipt", (receipt: any) => {
              notify.clear();
              notify.send("Transaction is confirmed.", 2500, "success");
              resolve(receipt);
            })
            .on("error", (err: any) => {
              notify.clear();
              notify.send(`${err.message}`, 5000, "error");
              reject(err);
            });
        });
      } catch (err) {
        console.log("err :>> ", err);
        return null;
      }
    } else {
      return null;
    }
  }
};
