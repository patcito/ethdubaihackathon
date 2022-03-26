import type { NextPage } from "next";
import styles from "./sponsors.module.scss";

import React from "react";
import Card from "../../components/card";
import Link from "next/link";
import SponsorDeposit from "../../components/sponsor-deposit";
import SponsorRewardWinner from "../../components/sponsor-reward-winner";
import SponsorsTable from "../../components/sponsors-table";
import classNames from "classnames";
import { faBookmark, faStar } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../components/footer";

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
      <div
        className={classNames(
          styles.row,
          "animate__animated animate__fadeInUp"
        )}
      >
        <Link href="/" passHref>
          <div className={styles.backButton}>Back</div>
        </Link>
      </div>
      <div className={styles.row}>
        <div className={styles.leftCol}>
          <Card className="animate__animated animate__fadeInUp">
            <div className={styles.description}>
              <p>
                This uses a permissionless contract for sponsor to deposit their
                money and reward it to bounty winners. It allows us to prove our
                hackathon reward tvl. The contract is verified here and only a
                few lines of code
              </p>
              <div className={styles.extLinks}>
                <Link
                  href="https://etherscan.io/address/0xC13DBa0CE613008eF43D205C455de6E9fbc1C77f"
                  passHref
                >
                  <div className={styles.linkButton}>
                    <FontAwesomeIcon icon={faBookmark} />
                    <span>Etherscan</span>
                  </div>
                </Link>
                <Link
                  href="https://github.com/patcito/ethdubaihackathon"
                  passHref
                >
                  <div className={styles.linkButton}>
                    <FontAwesomeIcon icon={faGithub} />
                    <span>Source Code</span>
                  </div>
                </Link>
              </div>
              <div className={styles.extLinks}>
                <Link
                  href="https://docs.google.com/document/d/1JdO02UgeUcI0tbk4nvUsswgCJCj-MmM5HADo0PeTsgA/edit"
                  passHref
                >
                  <div className={styles.linkButton}>
                    <FontAwesomeIcon icon={faStar} />
                    <span>Hackathon Participant Registration</span>
                  </div>
                </Link>
              </div>
            </div>
          </Card>
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
      <Footer />
    </div>
  );
};

export default SponsorsPage;
