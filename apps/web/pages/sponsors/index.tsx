import type { NextPage } from "next";
import styles from "./sponsors.module.scss";

import React from "react";
import Card from "../../components/card";
import Link from "next/link";
import SponsorDeposit from "../../components/sponsor-deposit";
import SponsorRewardWinner from "../../components/sponsor-reward-winner";
import SponsorsTable from "../../components/sponsors-table";
import classNames from "classnames";

const SponsorsPage: NextPage = () => {
  return (
    <div className={styles.wrapper}>
      <div
        className={classNames(
          styles.row,
          "animate__animated animate__fadeInUp"
        )}
      >
        <div className={styles.title}>Sponsors &amp; Prizes</div>
      </div>
      <div className={styles.row}>
        <Link href="/" passHref>
          <div className={styles.backButton}>Back</div>
        </Link>
      </div>
      <div className={styles.row}>
        <div className={styles.leftCol}>
          <Card
            title="Rewards by Sponsors"
            className="animate__animated animate__fadeInUp"
          >
            <SponsorsTable />
          </Card>
        </div>
        <div className={styles.rightCol}>
          <Card
            title="Sponsor Prize Deposit"
            className="animate__animated animate__fadeInUp"
          >
            <SponsorDeposit />
          </Card>
          <Card
            title="Sponsor Reward Winner"
            className="animate__animated animate__fadeInUp"
          >
            <SponsorRewardWinner />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SponsorsPage;
