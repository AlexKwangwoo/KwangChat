import React, { Component } from "react";
import MessageHeader from "./MessageHeader";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import firebase from "../../../firebase";

export class MainPanel extends Component {
  state = {
    messages: [],
    messagesRef: firebase.database().ref("messages"),
    //
    messagesLoading: true,
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
  };

  componentDidMount() {
    const { chatRoom } = this.props;
    console.log(this.props);

    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);
    }
  }

  handleSearchMessages = () => {
    const chatRoomMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    //g는 글로벌.. 전체적으로 찾겠음!(안녕일경우 안녕 있는거 다 찾아줌!)
    //i 는 대소문자 가지리 않고 찾아주겠다는것임!
    // match는 내가 찾는거랑 같은게 있다면 값을 반환해줌!

    //ex console.log([1,2,3].reduce((acc, currentVal) => acc + currentVal));
    // 하면 6이 나온다.. 처음acc는 없다. currentVal은 이니셜이 없으므로 1
    // 그다음 acc는 1이되고 currentVal은 2가된다!

    //ex  console.log([1,2,3].reduce((acc, currentVal) => acc + currentVal, 10));
    //하면 10이 최초 value이므로 16이 된다!

    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if (
        //content(text메세지만 찾은다음!!) //왜냐하면 content or image이기에..
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
        //if조건이 된다면.. chatRoomMessages안에있는 모든 내용을 acc에 담겠음!
      }
      return acc;
    }, []);
    //[]는 이니셜 밸류다,,ex에서는 10으로 헀었음!
    this.setState({ searchResults });
  };

  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  addMessagesListeners = (chatRoomId) => {
    //방이 많기 때문에 chatroomiD를 받아서 그방을 확인한다!
    let messagesArray = [];
    this.state.messagesRef //데이터 베이스 접근!
      .child(chatRoomId)
      .on("child_added", (DataSnapshot) => {
        messagesArray.push(DataSnapshot.val());
        //여기서 chatroomID를 통해 데이터베이스 chatroom테이블에 있는
        // 모든 메세지를 가져오며!
        //데이터 추가시 바로 적용가능!
        console.log("messageAre", messagesArray);
        this.setState({
          messages: messagesArray,
          messagesLoading: false,
        });
      });
  };

  renderMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.user} //메세지 누구껀지.. 위치 정해야해서 알아야함!
      />
    ));

  render() {
    const { messages, searchTerm, searchResults } = this.state;

    console.log("searchTerm", searchTerm);
    return (
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />

        <div
          style={{
            width: "100%",
            height: "450px",
            border: ".2rem solid #ececec",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
          }}
        >
          {searchTerm
            ? this.renderMessages(searchResults)
            : this.renderMessages(messages)}
          {/* 검색어 있으면 검색어의 배열만 보여준다! */}

          {}
        </div>

        <MessageForm />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
}; //리덕스에서 정보를 가져온다! 이걸 통해 class에서(맨위) this.props 로 받아줌!

export default connect(mapStateToProps)(MainPanel); //리덕스 연결!(클래스형)
