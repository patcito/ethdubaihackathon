import React, { FC } from "react";
import useSponsorBalances from "../../hooks/useSponsors";
import { shortenAddress } from "../../utils/address";
import { formatDecimal } from "../../utils/number";

import styles from "./sponsors-table.module.scss";

type Props = {};

const SponsorsTable: FC<Props> = () => {
  const balances = useSponsorBalances();
  console.log("balances", balances);
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className="text-left">Sponsor</th>
            <th className="text-right">Deposited Balance</th>
          </tr>
        </thead>
        <tbody>
          {balances.length > 0 &&
            balances.map((balance, i) => (
              <tr key={`balance-${i}`}>
                <td>{shortenAddress(balance.sponsor.address)}</td>
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
    </>
  );
};

export default SponsorsTable;
