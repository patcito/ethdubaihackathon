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
      <div className={styles.credit}>
        Contract by{" "}
        <Link href="https://twitter/patcito" passHref>
          @patcito
        </Link>{" "}
        and the amazing{" "}
        <Link href="https://twitter/financefeeder" passHref>
          @financefeeder
        </Link>{" "}
        with contribs by the great{" "}
        <Link href="https://twitter/qdqd___" passHref>
          @qdqd___
        </Link>
        (make sure to follow them!)
      </div>
      <div className={classNames(styles.footerLogo)}>
        <div className={styles.credit}>
          Smooth UI, tests and more also by the awesome{" "}
        </div>
        <div className={styles.creditLogo}>
          <Link href="https://feeder.finance" passHref>
            <Image
              src="/feeder-logo.svg"
              alt="Feeder Finance"
              width={"140px"}
              height={"60px"}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
