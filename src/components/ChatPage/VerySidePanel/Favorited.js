import React, { Component } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import firebase from "../../../firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";

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

    // usersRef
    // .child(userId)
    // .child("state")
    // .on("child_updated", (DataSnapshot) => {
    //   //데이터가 추가될때 반응한다!!
    //   const favoritedChatRoom = {
    //     id: DataSnapshot.key,
    //     ...DataSnapshot.val(),
    //   };
    //   this.setState({
    //     favoritedChatRooms: [
    //       ...this.state.favoritedChatRooms,
    //       favoritedChatRoom,
    //     ],
    //   });
    // });

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

  renderFavoritedChatRooms = (favoritedChatRooms) =>
    favoritedChatRooms.length > 0 &&
    favoritedChatRooms.map((chatRoom) => (
      <li
        key={chatRoom.id}
        onClick={() => this.changeChatRoom(chatRoom)}
        style={{
          backgroundColor:
            chatRoom.id === this.state.activeChatRoomId && "#ffffff45",
        }}
      >
        # {chatRoom.name}
      </li>
    ));

  render() {
    const { favoritedChatRooms } = this.state;
    return (
      <div>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaRegSmileBeam style={{ marginRight: "3px" }} />
          FAVORITED (1)
        </span>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {this.renderFavoritedChatRooms(favoritedChatRooms)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(Favorited);
