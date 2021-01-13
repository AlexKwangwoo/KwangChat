import React, { Component } from "react";
// import { FaRegSmileWink } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import { connect } from "react-redux";
import firebase from "../../../firebase";
import styles from "./ChatRooms.module.css";
import Scrollbars from "react-custom-scrollbars";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";

export class ChatRooms extends Component {
  state = {
    show: false,
    name: "",
    description: "",
    chatRoomsRef: firebase.database().ref("chatRooms"),
    messagesRef: firebase.database().ref("messages"),
    chatRooms: [],
    firstLoad: true,
    activeChatRoomId: "",
    notifications: [],
  };

  componentDidMount() {
    this.AddChatRoomsListeners();
    //랜더 될때 한번 실행됨
  }

  componentWillUnmount() {
    //컴포넌트가 없어지기 직전에 실행시킴!
    this.state.chatRoomsRef.off(); //off가 리스너 끄는것임!
    this.state.chatRooms.forEach((chatRoom) => {
      this.state.messagesRef.child(chatRoom.id).off();
    });
  }

  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chatRooms[0];
    if (this.state.firstLoad && this.state.chatRooms.length > 0) {
      this.props.dispatch(setCurrentChatRoom(firstChatRoom)); //리덕스사용!
      //쳇룸 액션에 있음!
      this.setState({ activeChatRoomId: firstChatRoom.id });
      //처음 방이 색들어오게 하기!
    }
    this.setState({ firstLoad: false });
    //처음로그인됐을때만... 처음방을 기준으로 설정해준다!
  };

  AddChatRoomsListeners = () => {
    let chatRoomsArray = [];

    //이 리스너를 통해서.. 채팅방 만들때마다 추가됨을 확인할수있따!
    this.state.chatRoomsRef.on("child_added", (DataSnapshot) => {
      // console.log("DataSnapshot", DataSnapshot);
      // console.log("DataSnapshot val", DataSnapshot.val());
      //child_added데이터 추가됬을때..반응함!  child_removed 도 있음
      chatRoomsArray.push(DataSnapshot.val());
      this.setState({ chatRooms: chatRoomsArray }, () =>
        this.setFirstChatRoom()
      );
      // console.log("DataSnapshot.key", DataSnapshot.key);
      this.addNotificationListener(DataSnapshot.key);
      //체팅방 아이디를 이용해 각방 알림정보 리스너 작동!
      //체티방 하나하나의 ID가 안에 들어갈것임!
    });
  };

  addNotificationListener = (chatRoomId) => {
    //value는 데이터초기값줄때와, 매번변동될때 listener 작동!
    this.state.messagesRef.child(chatRoomId).on("value", (DataSnapshot) => {
      //각각의 메시지들은 어느체팅방에 속해있는지에 대한 chatRoomId가있음
      //message테이블 -> chatRoomId -> 메시지들 id -> 내용
      if (this.props.chatRoom) {
        //리덕스에서 가져온다(현재 클릭된 챗룸 값을..)
        this.handleNotification(
          chatRoomId, //사이드화면에 있는 체팅방 ID
          this.props.chatRoom.id, //현재 켜져있는 채팅방ID
          this.state.notifications,
          DataSnapshot
        );
      }
    });
  };

  handleNotification = (
    chatRoomId,
    currentChatRoomId,
    notifications,
    DataSnapshot
  ) => {
    let lastTotal = 0;

    // 이미 notifications state 안에 알림 정보가 들어있는 채팅방과 그렇지 않은 채팅방을 나눠주기
    let index = notifications.findIndex(
      //findIndex는 조건을 만족하는 가장가까운 배열위치의 인덱스를 반환
      //없으면 -1.. ex [1,2,4] x>2 라고 치면 반환은 2 인덱스가 된다!
      (notification) => notification.id === chatRoomId
    );

    //notifications state 안에 해당 채팅방의 알림 정보가 없을 때
    if (index === -1) {
      notifications.push({
        id: chatRoomId,
        total: DataSnapshot.numChildren(), //자식배열 갯수!
        lastKnownTotal: DataSnapshot.numChildren(),
        count: 0,
      });
    }
    //------------즉 자손의 갯수 저장.. 다시 전체자손(이전자손 + 새로운 자손)
    //---------저장해놓은것과 전체 자손 차이가 읽지 않은 notification의 갯수가 된다
    // 이미 해당 채팅방의 알림 정보가 있을 떄
    else {
      //상대방이 채팅 보내는 그 해당 채팅방에 있지 않을 때
      if (chatRoomId !== currentChatRoomId) {
        //현재까지 유저가 확인한 총 메시지 개수
        lastTotal = notifications[index].lastKnownTotal;
        //인덱스는..현재 방의 위치를 말함.. 그위치에 따른
        //notification의 lastKowntotal 임

        //count (알림으로 보여줄 숫자)를 구하기
        //현재 총 메시지 개수 - 이전에 확인한 총 메시지 개수 > 0
        //현재 총 메시지 개수가 10개이고 이전에 확인한 메시지가 8개 였다면 2개를 알림으로 보여줘야함.
        if (DataSnapshot.numChildren() - lastTotal > 0) {
          notifications[index].count = DataSnapshot.numChildren() - lastTotal;
        }
      }
      //total property에 현재 전체 메시지 개수를 넣어주기
      notifications[index].total = DataSnapshot.numChildren();
    }
    //목표는 방 하나 하나의 맞는 알림 정보를 notifications state에  넣어주기
    this.setState({ notifications });
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, description } = this.state;

    if (this.isFormValid(name, description)) {
      this.addChatRoom();
    }
  };

  addChatRoom = async () => {
    const key = this.state.chatRoomsRef.push().key;
    //.push().key를 통해 자동으로 key를 생성한다!! 그냥 공식임!

    const { name, description } = this.state;
    const { user } = this.props;
    // 맨밑에 connect를 통해여 리덕스에서
    //가져왔음!
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };

    try {
      await this.state.chatRoomsRef.child(key).update(newChatRoom);
      //방생성!!
      this.setState({
        name: "",
        description: "",
        show: false, //모달 닫기
      });
    } catch (error) {
      alert(error);
    }
  };

  isFormValid = (name, description) => name && description;

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    //DM에서 넘어오면 private를 false로 리덕스 통해 바꿔줌!
    this.setState({ activeChatRoomId: room.id });
    this.clearNotification();
  };

  clearNotification = () => {
    let index = this.state.notifications.findIndex(
      (notification) => notification.id === this.props.chatRoom.id
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].lastKnownTotal = this.state.notifications[
        index
      ].total;
      //child갯수와(총매세지 갯수와) lastKnownTOtal과 같게 해준다..
      //count는 Total과 lastKnownTotal의 차이가 될것이기에..
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  getNotificationCount = (room) => {
    //해당 채팅방의 count수를 구하는 중입니다.
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === room.id) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
  };

  renderChatRooms = (chatRooms) =>
    chatRooms.length > 0 &&
    chatRooms.map((room) => (
      <li
        className={styles.li}
        key={room.id}
        // style={{
        //   backgroundColor:
        //     room.id === this.state.activeChatRoomId && "#ffffff45",
        // }}
        //룸아이디와 셀랙된게 같으면 색깔을 변화하겠음!
        onClick={() => this.changeChatRoom(room)} //현재 체팅방 설정!
      >
        <img
          style={{
            borderRadius: room.id === this.state.activeChatRoomId && "10px",
          }}
          className={styles.avatar}
          src={room.createdBy.image}
          alt="img"
        />
        <span className={styles.name}> {room.name}</span>

        <Badge className={styles.badge} variant="danger">
          {this.getNotificationCount(room)}
        </Badge>
      </li>
    ));

  render() {
    const renderThumb = ({ style, ...props }) => {
      const thumbStyle = {
        borderRadius: 6,
        backgroundColor: "black",
      };
      return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };

    const renderThumb_h = ({ style, ...props }) => {
      const thumbStyle = {
        borderRadius: 6,
        backgroundColor: "black",
        // overflowX: "none",
      };
      return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };

    const CustomScrollbars = (props) => (
      <Scrollbars
        renderView={(props) => (
          <div {...props} style={{ ...props.style, overflowX: "hidden" }} />
        )}
        renderThumbVertical={renderThumb}
        {...props}
      />
    );
    // console.log("this.state.chatRooms", this.state.chatRooms);
    return (
      <div>
        <div className={styles.list}>
          <CustomScrollbars
            style={{ width: "98%" }}
            autoHide
            autoHideTimeout={500}
            autoHideDuration={200}
          >
            <ul
              className={styles.ul}
              style={{ listStyleType: "none", padding: 0 }}
            >
              {this.renderChatRooms(this.state.chatRooms)}
            </ul>
          </CustomScrollbars>
        </div>
        <div className={styles.plusBox} onClick={this.handleShow}>
          {/* <FaRegSmileWink style={{ marginRight: 3 }} />
          CHAT ROOMS (1) */}
          <FaPlus className={styles.plus} />
        </div>

        {/* ADD CHAT ROOM MODAL */}

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#363a3f", color: "white" }}
          >
            <Modal.Title>Create a chat room</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#363a3f", color: "white" }}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Room name</Form.Label>
                <Form.Control
                  onChange={(e) => this.setState({ name: e.target.value })}
                  type="text"
                  placeholder="Enter a chat room name"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                  type="text"
                  placeholder="Enter a chat room description"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#363a3f" }}>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};

export default connect(mapStateToProps)(ChatRooms);
//connect...클래스 컴포넌트에서 리덕스 쓰는 방법!
