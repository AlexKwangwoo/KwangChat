import React, { Component } from "react";
import { FaRegSmile } from "react-icons/fa";
import firebase from "../../../firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";

export class DirectMessages extends Component {
  state = {
    usersRef: firebase.database().ref("users"), //데이터베이스 user테이블에 접근!
    users: [],
    activeChatRoom: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.addUsersListeners(this.props.user.uid);
    } //바로 변수로 넣어줌!
  }

  addUsersListeners = (currentUserId) => {
    //유저가 추가될때마다 반응함!
    const { usersRef } = this.state;
    let usersArray = [];
    usersRef.on("child_added", (DataSnapshot) => {
      if (currentUserId !== DataSnapshot.key) {
        //내이름은 DM에 뿌리면 안된다!
        //DataSnapshot.key는 추가된 상대 UID이다!
        let user = DataSnapshot.val();
        user["uid"] = DataSnapshot.key;
        user["status"] = "offline"; //접속 했는지 안했는지
        usersArray.push(user);
        this.setState({ users: usersArray });
      }
    }); //결국 user라는 변수에.. DB에있는 user내용 + UID + status를 추가해준다!
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
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };

    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setActiveChatRoom(user.uid);
    //리덕스를 이용해 현재 방이 무엇인지 알려줄것임!
    //DM은 private 룸인걸 알려줌!
  };

  setActiveChatRoom = (userId) => {
    this.setState({ activeChatRoom: userId });
  };

  renderDirectMessages = (users) =>
    users.length > 0 &&
    users.map((user) => (
      <li
        key={user.uid}
        style={{
          backgroundColor:
            user.uid === this.state.activeChatRoom && "#ffffff45",
        }} //내가 클릭한 방과 uid가 같으면 색주기!
        onClick={() => this.changeChatRoom(user)}
      >
        # {user.name}
      </li>
    ));

  render() {
    const { users } = this.state;
    return (
      <div>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaRegSmile style={{ marginRight: 3 }} /> DIRECT MESSAGES(1)
        </span>

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderDirectMessages(users)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
}; //리덕스 연결!!

export default connect(mapStateToProps)(DirectMessages);
