import React from "react";
import UserPanel from "./UserPanel";
import Favorited from "./Favorited";
import ChatRooms from "./ChatRooms";
import DirectMessages from "./DirectMessages";
import styles from "./VerySidePanel.module.css";

function VerySidePanel() {
  return (
    <div className={styles.box}>
      {/* <UserPanel /> */}

      {/* <Favorited /> */}

      <ChatRooms />

      {/* <DirectMessages /> */}
    </div>
  );
}

export default VerySidePanel;
