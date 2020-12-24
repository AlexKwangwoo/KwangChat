import React from "react";
import Media from "react-bootstrap/Media";
import moment from "moment";
import styles from "./Message.module.css";

function Message({ message, user }) {
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();
  //몇분전에 메세지 보냈는지 알수있다!
  //현재 시간부터..

  const isImage = (message) => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
      //hasOwnProperty image 내용을 가지고 있는지!
      //이미지라면 true반환!
    );
  };
  const isMessageMine = (message, user) => {
    if (user) {
      return message.user.id === user.uid;
    }
  };
  //메세지가 내꺼인지 아닌지 알아야한다!

  return (
    <div className={styles.bigBox}>
      <Media style={{ marginBottom: "3px" }}>
        {/* 부트스트랩.. 채팅 창 가져와서 쓰기! */}
        <img
          style={{ borderRadius: "40px" }}
          width={48}
          height={48}
          className="mr-3"
          src={message.user.image}
          alt={message.user.name}
        />
        <Media.Body
          style={{
            backgroundColor: isMessageMine(message, user) && "#363a3f",
          }} //메세지 누가 보냈는지 색깔 입력!
        >
          <h6 style={{ color: "white" }}>
            {message.user.name}
            <span
              style={{ fontSize: "10px", color: "gray", marginLeft: "7px" }}
            >
              {timeFromNow(message.timestamp)}
              {/* 몇분전에 메세지 보냈는지 알수있다! */}
            </span>
          </h6>
          {isImage(message) ? (
            <img style={{ maxWidth: "300px" }} alt="IM" src={message.image} />
          ) : (
            <p style={{ color: "#a9acb2" }}>{message.content}</p>
          )}
        </Media.Body>
      </Media>
    </div>
  );
}

export default Message;
