import classNames from "classnames";
import React, { FC } from "react";

import styles from "./button.module.scss";

type Props = {
  onClick?: () => void;
  size?: "sm";
  loading?: boolean;
  disabled?: boolean;
  children: any;
};

const Button: FC<Props> = ({
  onClick,
  size,
  children,
  loading = false,
  disabled = false,
}) => {
  function getSizeClass(size: string) {
    let className = "";
    switch (size) {
      case "sm":
        className = styles.sizeSm;
        break;
      default:
        break;
    }
    return className;
  }

  return (
    <button
      onClick={onClick}
      className={classNames(styles.button, getSizeClass(size))}
      disabled={loading || disabled}
    >
      {children}
    </button>
  );
};

export default Button;
