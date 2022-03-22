import classNames from "classnames";
import React, { FC } from "react";

import styles from "./card.module.scss";

type Props = {
  title?: string;
  children?: any;
  className?: any;
};

const Card: FC<Props> = ({ title, children, className }) => {
  return (
    <div className={classNames(styles.card, className)}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
