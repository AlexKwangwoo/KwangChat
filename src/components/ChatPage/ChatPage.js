import React from "react";
import SidePanel from "./SidePanel/SidePanel";
import VerySidePanel from "./VerySidePanel/VerySidePanel";
import MainPanel from "./MainPanel/MainPanel";
import TopHeaderPanel from "./TopHeaderPanel/TopHeaderPanel";
import styles from "./ChatPage.module.css";
import { useSelector } from "react-redux";

function ChatPage() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  //리덕스 이용해서 가져오자!
  return (
    <div className={styles.OutsideBox}>
      <div className={styles.topBox}>
        <TopHeaderPanel />
      </div>
      <div className={styles.bigBox}>
        <div className={styles.veryBox}>
          <VerySidePanel key={currentUser && currentUser.uid} />
          {/* key없으면 dm창이 한번에 불러오질 못함.. */}
        </div>
        <div className={styles.sideMainBox}>
          <div className={styles.side}>
            <SidePanel key={currentUser && currentUser.uid} />
            {/* key없으면 dm창이 한번에 불러오질 못함.. */}
          </div>
          <div className={styles.main}>
            <MainPanel key={currentChatRoom && currentChatRoom.id} />
            {/* 체팅룸의 아이디값을 줘보자.. 키값안주니.. 자료를 잘 못받아옴! */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
