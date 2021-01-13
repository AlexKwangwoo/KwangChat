import React, { Component } from "react";
// import { FaRegSmileBeam } from "react-icons/fa";
import firebase from "../../../firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";
import styles from "./Favorited.module.css";

export class Favorited extends Component {
  state = {
    favoritedChatRooms: [],
    usersRef: firebase.database().ref("users"),
    activeChatRoomId: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.addListeners(this.props.user.uid);
    }
  }

  componentWillUnmount() {
    if (this.props.user) {
      this.removeListener(this.props.user.uid);
    }
  }

  removeListener = (userId) => {
    this.state.usersRef.child(`${userId}/favorited`).off();
  };

  addListeners = (userId) => {
    const { usersRef } = this.state;

    usersRef
      .child(userId)
      .child("favorited")
      .on("child_added", (DataSnapshot) => {
        //데이터가 추가될때 반응한다!!
        const favoritedChatRoom = {
          id: DataSnapshot.key,
          ...DataSnapshot.val(),
        };
        this.setState({
          favoritedChatRooms: [
            ...this.state.favoritedChatRooms,
            favoritedChatRoom,
          ],
        });
      });

    usersRef
      .child(userId)
      .child("favorited")
      .on("child_removed", (DataSnapshot) => {
        const chatRoomToRemove = {
          id: DataSnapshot.key,
          ...DataSnapshot.val(),
        };
        const filteredChatRooms = this.state.favoritedChatRooms.filter(
          (chatRoom) => {
            return chatRoom.id !== chatRoomToRemove.id;
          } //chatRoom.id !== chatRoomToRemove.id;같지 않는걸 리턴한다!!
          // 즉 removed될 방 뺴고 다 리턴될것임!
        );
        this.setState({ favoritedChatRooms: filteredChatRooms });
      });
  };

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
  };

  renderFavoritedChatRooms = (favoritedChatRooms, currentChat) =>
    favoritedChatRooms.length > 0 &&
    favoritedChatRooms.map((chatRoom) => (
      <li
        className={styles.li}
        key={chatRoom.id}
        onClick={() => this.changeChatRoom(chatRoom)}
        style={{
          backgroundColor: chatRoom.id === currentChat && " #40444c",
          color: chatRoom.id === currentChat && " white",
          marginBottom: "4px",
          paddingLeft: "5px",
          height: "46px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          className={styles.avatar}
          src={chatRoom.createdBy.image}
          alt="img"
        />
        <span className={styles.name}> {chatRoom.name}</span>
      </li>
    ));

  renderFavoritedChatRoomsJust = (favoritedChatRooms) =>
    favoritedChatRooms.length > 0 &&
    favoritedChatRooms.map((chatRoom) => (
      <li
        className={styles.li}
        key={chatRoom.id}
        onClick={() => this.changeChatRoom(chatRoom)}
        style={{
          // backgroundColor:
          //   chatRoom.id === this.state.activeChatRoomId && " #40444c",
          // color: chatRoom.id === this.state.activeChatRoomId && " white",
          marginBottom: "4px",
          paddingLeft: "5px",
          height: "46px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          className={styles.avatar}
          src={chatRoom.createdBy.image}
          alt="img"
        />
        <span className={styles.name}> {chatRoom.name}</span>
      </li>
    ));

  render() {
    const { favoritedChatRooms } = this.state;
    // console.log("favoritedChatRooms", favoritedChatRooms);
    return (
      <div>
        <span className={styles.titlebox}>
          FAVORITED({favoritedChatRooms.length})
        </span>
        <ul className={styles.ul}>
          {/* {this.renderFavoritedChatRooms(favoritedChatRooms)} */}
          {this.props.currentChat !== null
            ? this.renderFavoritedChatRooms(
                favoritedChatRooms,
                this.props.currentChat
              )
            : this.renderFavoritedChatRoomsJust(favoritedChatRooms)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  if (state.chatRoom.currentChatRoom !== null) {
    return {
      user: state.user.currentUser,
      currentChat: state.chatRoom.currentChatRoom.id,
    };
  } else {
    return {
      user: state.user.currentUser,
    };
  }
};

export default connect(mapStateToProps)(Favorited);
