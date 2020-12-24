import React from "react";
import styles from "./TopHeaderPanel.module.css";

function TopHeaderPanel() {
  return (
    <div className={styles.titleBox}>
      <p className={styles.title}>KwangChat</p>
    </div>
  );
}

export default TopHeaderPanel;
