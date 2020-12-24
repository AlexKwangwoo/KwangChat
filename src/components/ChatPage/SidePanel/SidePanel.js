import React from "react";
import UserPanel from "./UserPanel";
import Favorited from "./Favorited";
import ChatRooms from "./ChatRooms";
import DirectMessages from "./DirectMessages";
import FindUser from "./FindUser";
import styles from "./SidePanel.module.css";

function SidePanel() {
  return (
    <div className={styles.box}>
      <FindUser />
      <div className={styles.fdBox}>
        <Favorited />

        {/* <ChatRooms /> */}

        <DirectMessages />
      </div>
      <div className={styles.userBox}>
        <UserPanel />
      </div>
    </div>
  );
}

export default SidePanel;
