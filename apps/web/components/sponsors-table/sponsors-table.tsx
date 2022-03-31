import React, { FC } from "react";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSponsorBalances, { Balances } from "../../hooks/useSponsors";
import { shortenAddress } from "../../utils/address";
import { formatDecimal } from "../../utils/number";

import styles from "./sponsors-table.module.scss";

type Props = {
  walletChainId: number;
};

const SponsorsTable: FC<Props> = ({ walletChainId }) => {
  const balances = useSponsorBalances({
    filter: (data: Balances[]) =>
      data.filter((balance) => balance.totalAmount > 0),
  });
  return (
    <>
      {walletChainId == 1 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className="text-left">Sponsor</th>
              <th className="text-right">Deposited Balance</th>
            </tr>
          </thead>
          <tbody>
            {balances &&
              balances.length > 0 &&
              balances.map((balance, i) => (
                <tr key={`balance-${i}`}>
                  <td>
                    {balance.sponsor.verified && (
                      <span className={styles.verified}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </span>
                    )}
                    {shortenAddress(balance.sponsor.address)}{" "}
                  </td>
                  <td className="text-right">
                    {`${formatDecimal(
                      balance.totalAmount,
                      balance.token.decimals
                    )} ${balance.token.symbol}`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">Please Connect to Ethereum Network</p>
      )}
    </>
  );
};

export default SponsorsTable;
