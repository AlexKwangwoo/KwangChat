import React from "react";
import styles from "./FindUser.module.css";

function FindUser() {
  return (
    <div>
      <div className={styles.box}>
        <input
          className={styles.inputBox}
          placeholder={"Find or start a conversation"}
        />
      </div>
      <div className={styles.line} />
    </div>
  );
}

export default FindUser;
