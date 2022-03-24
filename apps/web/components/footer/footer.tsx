import React, { FC } from "react";

import Image from "next/image";

import styles from "./footer.module.scss";
import classNames from "classnames";
import Link from "next/link";

type Props = {};

const Footer: FC<Props> = () => {
  return (
    <div
      className={classNames(
        styles.footer,
        "animate__animated animate__fadeInUp"
      )}
    >
      <div className={styles.credit}>Built by</div>
      <div className={styles.creditLogo}>
        <Link href="https://feeder.finance" passHref>
          <Image
            src="/feeder-logo.svg"
            alt="Feeder Finance"
            width={"180px"}
            height={"60px"}
          />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
