import React, { useState, useRef } from "react";
// import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import firebase from "../../../firebase";
import { useSelector } from "react-redux";
import mime from "mime-types";
import styles from "./MessageForm.module.css";
import { FaPlusCircle } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
function MessageForm() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  //리덕스를 이용하여 chat룸의 id를 가져온다!
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  //다시 send 못누르게 하기위해!
  const [percentage, setPercentage] = useState(0);
  const inputOpenImageRef = useRef();

  const messagesRef = firebase.database().ref("messages");
  //ref는 database중 종류가 messages라는 뜻임

  const storageRef = firebase.storage().ref();
  //파베 스토리지 접근!
  const typingRef = firebase.database().ref("typing");
  const isPrivateChatRoom = useSelector(
    (state) => state.chatRoom.isPrivateChatRoom
  );
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const createMessage = (fileUrl = null) => {
    //createMssage() 안에 인자없으면 null임!
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }
    return message;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content) {
      setErrors((prev) =>
        prev.indexOf("Type contents first") < 0
          ? prev.concat("Type contents first")
          : prev
      );
      //prev는 월래 있던 애러에다가 concat으로 단어 붙어줌!
      return;
    }
    setLoading(true);
    //firebase에 메시지를 저장하는 부분
    try {
      await messagesRef.child(chatRoom.id).push().set(createMessage());
      //체팅방 id를 넣고!
      //매세지 보내줬으면.. 다시 refresh해줘야함!!

      typingRef.child(chatRoom.id).child(user.uid).remove();

      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors((pre) => pre.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000); //5초 정도후에 setError 없에줌!
    }
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const getPath = () => {
    if (isPrivateChatRoom) {
      return `/message/private/${chatRoom.id}`;
      //private은 다른경로 로 넣어준다!
    } else {
      return `/message/public`;
    }
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];

    const filePath = `${getPath()}/${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) };
    // 밈을 쓰면 확장자를 바로 찾아줌!
    setLoading(true);
    try {
      //파일을 먼저 스토리지에 저장
      let uploadTask = storageRef.child(filePath).put(file, metadata);
      //await 빼야함.. 왜냐하면..await은 파일이 전송끝나면 변수에 내용을담는데
      // uploadTask는 상시 변하는걸 체크 당할거기 떄문!
      //파일 저장되는 퍼센티지 구하기
      uploadTask.on(
        //------------첫번쨰 인자는 무엇이 변할때 listen할것인지!!
        "state_changed", //상태가 변할때마다 리스너가 작용한다!

        //----------- 두번째 인자는 파일전송상황
        (UploadTaskSnapshot) => {
          const percentage = Math.round(
            (UploadTaskSnapshot.bytesTransferred /
              UploadTaskSnapshot.totalBytes) *
              100
          ); //bytesTransferred 얼마나 전송됐는지 알려줌!
          setPercentage(percentage);
        },
        //-------------세번째 인자는 파일전송시 에러 발생!
        (err) => {
          console.error(err);
          setLoading(false);
        },
        //--------------네번째 인자는 파일전송 다된걸 어떻게 할것인지!
        () => {
          //저장이 다 된 후에 파일 메시지 전송 (데이터베이스에 저장) 해야
          //그래야 다른사람도 방안의 사진을 볼수있다!

          //저장된 파일을 다운로드 받을 수 있는 URL 가져오기
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            //getDownloadURL() 의 결과를 downloadURL에 담는다!

            messagesRef //데이터베이스 message테이블 접근!!
              .child(chatRoom.id) //어떤방인지 넣어주고!
              .push() // 정보를 넣는거니깐 push
              .set(createMessage(downloadURL));
            setLoading(false);
          });
        }
      );
    } catch (error) {
      alert(error);
    }
  };

  //리덕스에 갈필요없다.. db까지만 정보 수정 한후 listener통해 정보 보여주면됨!
  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
      handleSubmit();
    } //컨트롤 + 엔터는 메세지를 보낼수있다!
    if (content) {
      typingRef.child(chatRoom.id).child(user.uid).set(user.displayName);
    } else {
      typingRef.child(chatRoom.id).child(user.uid).remove();
    }
  };

  return (
    <div className={styles.bigBox}>
      {!(percentage === 0 || percentage === 100) && (
        <ProgressBar
          variant="warning"
          label={`${percentage}%`}
          now={percentage}
        />
      )}

      <div>
        {errors.map((errorMsg) => (
          <p style={{ color: "red" }} key={errorMsg}>
            {errorMsg}
          </p>
        ))}
      </div>
      <div className={styles.inputBox}>
        <div className={styles.inputLeft}>
          <FaPlusCircle
            onClick={handleOpenImageRef}
            style={{ color: "white" }}
            disabled={loading ? true : false}
          />
        </div>
        <form className={styles.formBox} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            onKeyDown={handleKeyDown}
            //  키를 누를때!
            value={content}
            onChange={handleChange}
            placeholder="Message"
          />
        </form>
        <div className={styles.inputRight}>
          <FiSend
            onClick={handleSubmit}
            style={{ color: "white" }}
            disabled={loading ? true : false}
          />
        </div>
      </div>
      {/* <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control
            onKeyDown={handleKeyDown}
            //  키를 누를때!
            value={content}
            onChange={handleChange}
            as="textarea"
            rows={2}
          />
        </Form.Group>
      </Form> */}

      {/* {console.log("percentage", percentage)} */}

      {/* <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className="message-form-button"
            style={{ width: "100%" }}
            disabled={loading ? true : false}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            onClick={handleOpenImageRef}
            // 이걸로 인풋 파일 업로드 대신 실행한다!
            className="message-form-button"
            style={{ width: "100%" }}
            disabled={loading ? true : false}
          >
            UPLOAD
          </button>
        </Col>
      </Row> */}

      <input
        accept="image/jpeg, image/png"
        // accept를 통해 어떤 파일형식만 지원할지 정할수있다!
        style={{ display: "none" }}
        type="file"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
      {/* 업로드 버튼눌러서 실행하게끔 해준다! input버튼이아닌!
      그러기 위해선 ref를 사용해야한다! */}
    </div>
  );
}

export default MessageForm;
