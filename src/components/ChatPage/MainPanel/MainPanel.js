import React, { Component } from "react";
import MessageHeader from "./MessageHeader";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import firebase from "../../../firebase";
import { setUserPosts } from "../../../redux/actions/chatRoom_action";
import Skeleton from "../../../commons/components/Skeleton";
import styles from "./MainPanel.module.css";
import Scrollbars from "react-custom-scrollbars";
// import ScrollBars from "react-scrollbar";

export class MainPanel extends Component {
  messageEndRef = React.createRef();

  state = {
    messages: [],
    messagesRef: firebase.database().ref("messages"),
    messagesLoading: true,
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
    typingRef: firebase.database().ref("typing"),
    typingUsers: [],
    listenerLists: [],
  };

  componentDidMount() {
    const { chatRoom } = this.props;
    // console.log(this.props);
    this.userPostsCount(this.state.messages);
    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);
      this.addTypingListeners(chatRoom.id);
    }
  } //컴포넌트 랜더 전에 한번실행!

  componentDidUpdate() {
    if (this.messageEndRef) {
      this.messageEndRef.scrollIntoView();
    }
  } //타이핑 할때마다 실행! 자동으로 스크롤 위치 가주기!!

  componentWillUnmount() {
    this.state.messagesRef.off();
    this.removeListeners(this.state.listenerLists);
  } //컴포넌트 죽기전에 실행!

  removeListeners = (listeners) => {
    listeners.forEach((listner) => {
      listner.ref.child(listner.id).off(listner.event);
    });
  };

  addTypingListeners = (chatRoomId) => {
    let typingUsers = [];
    //typing이 새로 들어올 때
    this.state.typingRef.child(chatRoomId).on("child_added", (DataSnapshot) => {
      if (DataSnapshot.key !== this.props.user.uid) {
        typingUsers = typingUsers.concat({
          //typingUsers오른쪽껀 위에꺼임!
          id: DataSnapshot.key,
          name: DataSnapshot.val(),
        });
        this.setState({ typingUsers });
      }
    });

    //listenersList state에 등록된 리스너를 넣어주기
    this.addToListenerLists(chatRoomId, this.state.typingRef, "child_added");

    //typing을 지워줄 때
    this.state.typingRef
      .child(chatRoomId)
      .on("child_removed", (DataSnapshot) => {
        const index = typingUsers.findIndex(
          (user) => user.id === DataSnapshot.key
        );
        if (index !== -1) {
          typingUsers = typingUsers.filter(
            (user) => user.id !== DataSnapshot.key
            //현재 치고 있는 사람만 제거! 왜냐하면 현재 안치고있는사람만
            // 필터 했기 때문에!
          );
          this.setState({ typingUsers });
        }
      });
    //listenersList state에 등록된 리스너를 넣어주기
    this.addToListenerLists(chatRoomId, this.state.typingRef, "child_removed");
    //다른 사람이 동시에 typing중일수 있으므로.. 함부러 listener를 다 끄면 안된다!
  };

  // 리스너 배열에 담기!!
  addToListenerLists = (id, ref, event) => {
    //이미 등록된 리스너인지 확인
    // 조건 3개 비교해서 같은지..
    const index = this.state.listenerLists.findIndex((listener) => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    //없을시 새로 추가를 해준다!!
    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({
        listenerLists: this.state.listenerLists.concat(newListener),
      });
    }
  };

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
        // console.log("messageAre DataSnapshot val", DataSnapshot.val());
        messagesArray.push(DataSnapshot.val());
        //여기서 chatroomID를 통해 데이터베이스 chatroom테이블에 있는
        // 모든 메세지를 가져오며!
        //데이터 추가시 바로 적용가능!
        // console.log("messageAre", messagesArray);
        this.setState({
          messages: messagesArray,
          messagesLoading: false,
        });
        this.userPostsCount(messagesArray);
      });
  };

  userPostsCount = (messages) => {
    //   let userPosts = messages.reduce((acc, message) => {
    //     if (message.user.name in acc) {
    //       //이름이 있다면 count+1
    //       acc[message.user.name].count += 1;
    //     } else {
    //       //이름이 없다면.. 1
    //       acc[message.user.name] = {
    //         image: message.user.image,
    //         count: 1,
    //       };
    //     }
    //     return acc;
    //   }, {});
    //   this.props.dispatch(setUserPosts(userPosts));
    //   //여길통해 리덕스로 보내준다!
    // };

    if (messages.length === 0) {
      // console.log("here");
      this.props.dispatch(setUserPosts(null));
    } else {
      // console.log("messages", messages);
      // console.log("notnull");
      let userPosts = messages.reduce((acc, message) => {
        if (message.user.name in acc) {
          //이름이 있다면 count+1
          acc[message.user.name].count += 1;
        } else {
          //이름이 없다면.. 1
          acc[message.user.name] = {
            image: message.user.image,
            count: 1,
          };
        }
        return acc;
      }, {});
      this.props.dispatch(setUserPosts(userPosts));
    }
  };

  renderMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.user} //메세지 누구껀지.. 위치 정해야해서 알아야함!
      /> // 내 매시지면.. 색줄려고.. 하지만 없앴음
    ));

  renderTypingUsers = (typingUsers) =>
    typingUsers.length > 0 &&
    typingUsers.map((user) => (
      <span className={styles.typing}>{user.name} is typing now..</span>
    ));

  renderMessageSkeleton = (loading, messages) => {
    // console.log("hahaha");
    if (messages.length < 10) {
      loading && (
        <>
          {/* [1,2,3,4,5,6,7,8,9,10] 이랑 똑같음.. 10개 넣음*/}
          {[...Array(messages.length)].map((v, i) => (
            <Skeleton key={i} />
          ))}
        </>
      );
    } else {
      loading && (
        <>
          {/* [1,2,3,4,5,6,7,8,9,10] 이랑 똑같음.. 10개 넣음*/}
          {[...Array(10)].map((v, i) => (
            <Skeleton key={i} />
          ))}
        </>
      );
    }
  };

  renderNewMessage = (messages) => {
    const { chatRoom } = this.props;
    // console.log("chatRoom", chatRoom);
    if (chatRoom) {
      if (chatRoom.createdBy) {
        console.log("createdBy");
        return (
          chatRoom && (
            <>
              <img
                className={styles.newMessageImage}
                src={chatRoom.createdBy.image}
                alt={chatRoom.createdBy.image}
              />
              <div className={styles.newMessage}>{chatRoom.name}</div>
              <div className={styles.text}>
                This is the beginning of a message history with @{chatRoom.name}
                .
              </div>
              <div className={styles.line}></div>
            </>
          )
        );
      } else {
        return (
          chatRoom && (
            <>
              <img
                className={styles.newMessageImage}
                src={chatRoom.image}
                alt={chatRoom.image}
              />
              <div className={styles.newMessage}>{chatRoom.name}</div>
              <div className={styles.text}>
                This is the beginning of your direct message history with @
                {chatRoom.name}.
              </div>
              <div className={styles.line}></div>
            </>
          )
        );
      }
    }
  };

  // renderThumb = ({ style, ...props }) => {
  //   const thumbStyle = {
  //     borderRadius: 6,
  //     backgroundColor: "rgba(35, 49, 86, 0.8)",
  //   };
  //   return <div style={{ ...style, ...thumbStyle }} {...props} />;
  // };

  // CustomScrollbars = (props) => (
  //   <Scrollbars
  //     renderThumbHorizontal={renderThumb}
  //     renderThumbVertical={renderThumb}
  //     {...props}
  //   />
  // );

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
        renderThumbHorizontal={renderThumb_h}
        renderView={(props) => (
          <div {...props} style={{ ...props.style, overflowX: "hidden" }} />
        )}
        renderThumbVertical={renderThumb}
        {...props}
      />
    );

    const {
      messages,
      searchTerm,
      searchResults,
      typingUsers,
      messagesLoading,
    } = this.state;

    // console.log("this.state", this.state);
    // console.log("messages", messages);
    return (
      <div className={styles.mainBox}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />

        <div className={styles.outBox}>
          <CustomScrollbars
            style={{ width: "98%" }}
            autoHide
            autoHideTimeout={500}
            autoHideDuration={200}
          >
            <div className={styles.scrollbox}>
              {messages.length > 0
                ? this.renderMessageSkeleton(messagesLoading, messages)
                : this.renderNewMessage(messagesLoading, messages)}
              {searchTerm
                ? this.renderMessages(searchResults)
                : this.renderMessages(messages)}
              {/* 검색어 있으면 검색어의 배열만 보여준다! */}

              {this.renderTypingUsers(typingUsers)}
              <div ref={(node) => (this.messageEndRef = node)} />
              {/* node => <div></div> 현재 div>를 가리킴!! */}
            </div>
          </CustomScrollbars>
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
