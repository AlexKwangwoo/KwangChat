import React, { Component } from "react";
// import { FaRegSmile } from "react-icons/fa";
import firebase from "../../../firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";
import styles from "./DirectMessages.module.css";

export class DirectMessages extends Component {
  state = {
    usersRef: firebase.database().ref("users"), //데이터베이스 user테이블에 접근!
    users: [],
    activeChatRoom: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.addUsersListeners(this.props.user.uid); //리덕스user는 여기서 사용!
    } //바로 변수로 넣어줌!
  }

  //여기로 인해 favorite 갯수 자꾸 바뀌는거 고쳤음!!
  componentWillUnmount() {
    if (this.props.user) {
      this.removeListener();
    }
  }

  removeListener = () => {
    this.state.usersRef.off();
  };

  addUsersListeners = (currentUserId) => {
    //유저가 추가될때마다 반응함!
    const { usersRef } = this.state;
    let usersArray = [];
    usersRef.on("child_added", (DataSnapshot) => {
      // console.log("add로 올지");
      if (currentUserId !== DataSnapshot.key) {
        // console.log("DataSnapshot새로?", DataSnapshot.val());
        //내이름은 DM에 뿌리면 안된다!
        //DataSnapshot.key는 추가된 상대 UID이다!
        let user = DataSnapshot.val();
        user["uid"] = DataSnapshot.key;
        // user["status"] = "offline"; //접속 했는지 안했는지
        usersArray.push(user);
        this.setState({ users: usersArray });
        // console.log("users", this.state.users);
      }
    }); //결국 user라는 변수에.. DB에있는 user내용 + UID + status를 추가해준다!
    usersRef.on("child_changed", (DataSnapshot) => {
      let usersArray = this.state.users;
      if (currentUserId !== DataSnapshot.key) {
        // console.log("usersArray", usersArray);
        // console.log("changed로 올지", DataSnapshot.val());
        let newUserState = DataSnapshot.val();

        for (var i in usersArray) {
          // console.log("usersArray[i]", usersArray[i]);
          // console.log("newUserState.uid", newUserState.uid);
          if (usersArray[i].image === newUserState.image) {
            usersArray[i] = newUserState;
            this.setState({ users: usersArray });
            // console.log("한번보자", this.state.users);
          }
        }
      }
    });
  };

  getChatRoomId = (userId) => {
    const currentUserId = this.props.user.uid;

    //상대방과 나의 ID를 합쳐 DMROOMID를 만들건데.. 순서가
    //똑같아야하기때문에...
    //ex A:1234    B:1234
    // DmroomID = A:1234/B:1234 가 되어야한다!! 바뀌면 안됨!
    return userId > currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  changeChatRoom = (user) => {
    console.log("user", user);
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
      image: user.image,
    };

    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setActiveChatRoom(user.uid);
    //리덕스를 이용해 현재 방이 무엇인지 알려줄것임!
    //DM은 private 룸인걸 알려줌!
  };

  // <li
  //   key={user.uid}
  //   style={{
  //     backgroundColor:
  //       user.uid === this.state.activeChatRoom && "#ffffff45",
  //   }} //내가 클릭한 방과 uid가 같으면 색주기!
  //   onClick={() => this.changeChatRoom(user)}
  // >
  //   # {user.name}
  // </li>
  // addStateListeners = (users) =>
  //   users.length > 0 &&
  //   users.map((user) =>
  //     user.state === "online" ? <li>online</li> : <li>offline</li>
  //   );

  setActiveChatRoom = (userId) => {
    this.setState({ activeChatRoom: userId });
  };

  renderDirectMessages = (users, currentChat) =>
    users.length > 0 &&
    users.map((user) => (
      <li
        className={styles.li}
        key={user.uid}
        style={{
          backgroundColor: user.name === currentChat && "#40444c",
          color: user.name === currentChat && " white",
          marginBottom: "4px",
          paddingLeft: "5px",
          height: "46px",
          display: "flex",
          alignItems: "center",
        }} //내가 클릭한 방과 uid가 같으면 색주기!
        onClick={() => this.changeChatRoom(user)}
      >
        <img className={styles.avatar} src={user.image} alt="img" />
        {user.state === "online" ? (
          <div className={styles.online}></div>
        ) : (
          <div className={styles.offline}>
            {/* <div className={styles.offline}></div> */}
            <div className={styles.offlintwo}></div>
          </div>
        )}
        <span className={styles.name}>{user.name}</span>
      </li>
    ));

  renderDirectMessagesJust = (users) =>
    users.length > 0 &&
    users.map((user) => (
      <li
        className={styles.li}
        key={user.uid}
        style={{
          marginBottom: "4px",
          paddingLeft: "5px",
          height: "46px",
          display: "flex",
          alignItems: "center",
        }} //내가 클릭한 방과 uid가 같으면 색주기!
        onClick={() => this.changeChatRoom(user)}
      >
        <img className={styles.avatar} src={user.image} alt="img" />
        <span className={styles.name}>{user.name}</span>
        {user.state === "online" ? (
          <div className={styles.online}></div>
        ) : (
          <div className={styles.offline}>
            {/* <div className={styles.offline}></div> */}
            <div className={styles.offlintwo}></div>
          </div>
        )}
      </li>
    ));

  render() {
    // console.log("currentChat", currentChat);
    // console.log("users", users);
    const { users } = this.state;
    // if (this.props.currentChat) {
    //   console.log("currentChat", this.props.currentChat);
    //   console.log("users있다", users);
    // } else {
    //   console.log("users", users);
    // }
    return (
      <div>
        <div className={styles.titlebox}>DIRECT MESSAGES({users.length})</div>

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.props.currentChat !== null
            ? this.renderDirectMessages(users, this.props.currentChat)
            : this.renderDirectMessagesJust(users)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log("state.chatRoom.currentChatRoom", state.chatRoom.currentChatRoom);
  if (state.chatRoom.currentChatRoom !== null) {
    return {
      user: state.user.currentUser,
      currentChat: state.chatRoom.currentChatRoom.name,
    };
  } else {
    return {
      user: state.user.currentUser,
    };
  }
}; //리덕스 연결!!

export default connect(mapStateToProps)(DirectMessages);
