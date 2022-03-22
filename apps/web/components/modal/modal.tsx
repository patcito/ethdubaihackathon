import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import styles from "./modal.module.scss";

interface Props {
  visible: boolean;
  toggle: () => void;
  children: any;
  size?: string;
  autoWidth?: boolean;
  noPadding?: boolean;
  showCloseButton?: boolean;
}

function getSizeClass(size: string) {
  let className = "";
  switch (size) {
    case "lg":
      className = styles.sizeLg;
      break;
    case "xl":
      className = styles.sizeXl;
      break;
    default:
      break;
  }
  return className;
}

const Modal = ({
  visible = false,
  toggle,
  children,
  size = "base",
  autoWidth = false,
  noPadding = false,
  showCloseButton = false,
}: Props) => {
  return (
    <AnimatePresence>
      {visible && (
        <div className={styles.modalContainer}>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onTap={() => toggle()}
          />
          <motion.div
            className={classNames(
              styles.modal,
              getSizeClass(size),
              autoWidth && styles.modalAutoWidth,
              noPadding && styles.modalNoPadding
            )}
            initial={{ opacity: 0, scale: 0.75, translateY: 200 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            exit={{ opacity: 0, scale: 1, translateY: 0 }}
          >
            {children}
          </motion.div>
          {showCloseButton && (
            <div className={styles.closeButton} onClick={() => toggle()}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
