import type { NextPage } from "next";
import styles from "../../styles/Home.module.scss";

import React from "react";
import classNames from "classnames";
import WalletConnect from "../components/wallet-connect";
import { useSelector } from "react-redux";
import { defaultAccount } from "../components/wallet-connect/slice/selectors";
import Button from "../components/button";
import Link from "next/link";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const Home: NextPage = () => {
  const account = useSelector(defaultAccount);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1
          className={classNames(
            styles.leading,
            "animate__animated animate__fadeInUp"
          )}
        >
          Welcome to
        </h1>
        <h2
          className={classNames(
            styles.title,
            "animate__animated animate__fadeInUp animate__slow"
          )}
        >
          ETHDubai Hackathon
        </h2>
        <div className="animate__animated animate__fadeInUp animate__slower">
          {account ? (
            <div className={"gap-4 flex flex-row justify-center items-center"}>
              <Link href="/sponsors" passHref>
                <Button>Sponsors &amp; Prizes</Button>
              </Link>
              <WalletConnect />
            </div>
          ) : (
            <WalletConnect />
          )}
        </div>
      </main>
      <div className={styles.globeBackground}>
        <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          // backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          backgroundColor="rgba(10, 10, 10, 0)"
        />
      </div>
    </div>
  );
};

export default Home;
