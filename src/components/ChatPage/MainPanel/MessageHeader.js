import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import firebase from "../../../firebase";
import { Media } from "react-bootstrap";
import styles from "./MessageHeader.module.css";

function MessageHeader({ handleSearchChange }) {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const isPrivateChatRoom = useSelector(
    (state) => state.chatRoom.isPrivateChatRoom
  );
  const [isFavorited, setIsFavorited] = useState(false);
  const usersRef = firebase.database().ref("users");
  const user = useSelector((state) => state.user.currentUser);
  const userPosts = useSelector((state) => state.chatRoom.userPosts);

  //데이터 베이스 한번가져옴.. 나머지 는 데베에서 결과 바껴도.. 저장되고..
  // 다시 킬때 최종결과 데베에서 다시 가져옴!
  useEffect(() => {
    if (chatRoom && user) {
      addFavoriteListener(chatRoom.id, user.uid);
    }
  }, []);

  const addFavoriteListener = (chatRoomId, userId) => {
    //여기서는 좋아요가 눌어져있는지 아닌지 체크 해서.. null이 아닌경우
    //즉 체크 되어있을때 setIsFavorited 에 참or거짓을 넣어준다
    usersRef
      .child(userId)
      .child("favorited")
      .once("value")
      .then((data) => {
        console.log("data초기", data.val());
        if (data.val() !== null) {
          const chatRoomIds = Object.keys(data.val());
          //이렇게 하면 좋아요 누른 방의 id가 chatRoomIds에 들어간다

          console.log("data.val()", data.val());
          console.log("chatRoomIds", chatRoomIds);
          const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
          //여기서 포함됬는지 안했는지 알아본다!
          console.log("isAlreadyFavorited", isAlreadyFavorited);
          setIsFavorited(isAlreadyFavorited);
        }
      });
  };

  const handleFavorite = () => {
    if (isFavorited) {
      usersRef
        .child(`${user.uid}/favorited`)
        .child(chatRoom.id)
        .remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
      setIsFavorited((prev) => !prev);
    } else {
      usersRef.child(`${user.uid}/favorited`).update({
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          },
        },
      });
      setIsFavorited((prev) => !prev);
      //setIsFavorited 의 isFavorited 의 요소를 반대로 바꿔주기!
    }
  };

  //post count 뿌려줘야한다!
  //userPosts 리덕스를통해 가져옴! mainpanel에서 준정보!
  const renderUserPosts = (userPosts) =>
    //sort 쓰기위해선 키값 , value 하나 인배열로 바꿔줘야한다!
    //userPosts는 객체이므로..   Object.entries(userPosts)를 통해
    // [[0:"username1", 1:[count:2, image:"~~"],[0:"username1", 1:[count:2, image:"~~"]]
    // 되어서 나온다.. 그래서 각 배열속의 배열의 1인덱스의 count가 필요!
    Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      //여기까지 카운트가 큰순으로 정렬된다.. a-b는 작은순에서큰순!!
      .map(([key, val], i) => (
        <Media key={i}>
          <img
            style={{ borderRadius: 25 }}
            width={48}
            height={48}
            className="mr-3"
            src={val.image}
            alt={val.name}
          />
          <Media.Body>
            <h6>{key}</h6>
            <p>{val.count} 개</p>
          </Media.Body>
        </Media>
      ));

  return (
    <div className={styles.bigBox}>
      {/* 모든건 부트스트랩 활용하여 UI만들었음! */}

      <div className={styles.chatName}>
        {isPrivateChatRoom ? (
          <FaLock style={{ marginBottom: "10px" }} />
        ) : (
          // 열쇠 아이콘!!
          <FaLockOpen style={{ marginBottom: "10px" }} />
        )}

        {chatRoom && chatRoom.name}
        {!isPrivateChatRoom && (
          <span style={{ cursor: "pointer" }} onClick={handleFavorite}>
            {isFavorited ? (
              <MdFavorite style={{ marginBottom: "10px" }} />
            ) : (
              <MdFavoriteBorder style={{ marginBottom: "10px" }} />
            )}
          </span>
        )}
      </div>

      <div className={styles.des}>Description</div>
      <div className={styles.count}>Posts Count</div>
      <div className={styles.input}>
        {/* <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">
              <AiOutlineSearch />
            </InputGroup.Text>
          </InputGroup.Prepend> */}
        <form>
          <input
            className={styles.input}
            onChange={handleSearchChange}
            placeholder="Search Messages.."
          />
        </form>
        {/* </InputGroup> */}
      </div>
      {/* {!isPrivateChatRoom && (
        <div>
          <p>
            <Image
              src={chatRoom && chatRoom.createdBy.image}
              roundedCircle
              style={{ width: "30px", height: "30px" }}
            />
            {chatRoom && chatRoom.createdBy.name}
          </p>
        </div>
      )} */}
    </div>
  );
}

export default MessageHeader;

// <Container>
// <Accordion>
//   <Card>
//     <Card.Header>
//       {/* <Card.Header style={{ height: "25px", padding: "0 1rem" }}> */}
//       <Accordion.Toggle as={Button} variant="link" eventKey="0">
//         Description
//       </Accordion.Toggle>
//     </Card.Header>
//     <Accordion.Collapse eventKey="0">
//       <Card.Body>{chatRoom && chatRoom.description}</Card.Body>
//     </Accordion.Collapse>
//   </Card>
// </Accordion>
// </div>
// <div>
// <Accordion>
//   <Card>
//     <Card.Header style={{ padding: "0 1rem" }}>
//       <Accordion.Toggle as={Button} variant="link" eventKey="0">
//         Posts Count
//       </Accordion.Toggle>
//     </Card.Header>
//     <Accordion.Collapse eventKey="0">
//       <Card.Body>{userPosts && renderUserPosts(userPosts)}</Card.Body>
//     </Accordion.Collapse>
//   </Card>
// </Accordion>
// </Container>
