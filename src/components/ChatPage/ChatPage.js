import React from "react";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import { useSelector } from "react-redux";

function ChatPage() {
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  //리덕스 이용해서 가져오자!
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px" }}>
        <SidePanel />
      </div>
      <div style={{ width: "100%" }}>
        <MainPanel key={currentChatRoom && currentChatRoom.id} />
        {/* 체팅룸의 아이디값을 줘보자.. 키값안주니.. 자료를 잘 못받아옴! */}
      </div>
    </div>
  );
}

export default ChatPage;
