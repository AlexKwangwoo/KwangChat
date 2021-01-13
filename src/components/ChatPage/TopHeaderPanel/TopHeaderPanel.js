import React from "react";
import styles from "./TopHeaderPanel.module.css";
import logo from "../../../logo1.png";

function TopHeaderPanel() {
  return (
    <div className={styles.titleBox}>
      <img
        src={logo}
        alt="img"
        style={{ width: "11px", height: "10px", marginLeft: "3px" }}
      />
      <p className={styles.title}>KwangChat</p>
    </div>
  );
}

export default TopHeaderPanel;
