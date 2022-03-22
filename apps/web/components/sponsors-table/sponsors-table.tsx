import React, { FC } from "react";

import styles from "./sponsors-table.module.scss";

type Props = {};

const SponsorsTable: FC<Props> = () => {
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
            <td>ETH</td>
            <td>5 ETH</td>
          </tr> */}
        </tbody>
      </table>
    </>
  );
};

export default SponsorsTable;
