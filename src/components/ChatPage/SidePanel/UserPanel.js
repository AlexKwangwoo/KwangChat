import React, { useRef } from "react";
// import { IoIosChatboxes } from "react-icons/io";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../../../firebase";
import mime from "mime-types";
import { setPhotoURL } from "../../../redux/actions/user_action";
import styles from "./UserPanel.module.css";
// import moment from "moment";

function UserPanel() {
  const user = useSelector((state) => state.user.currentUser);
  const userImage = user && user.photoURL;
  const dispatch = useDispatch();
  const inputOpenImageRef = useRef();

  const handleLogout = () => {
    firebase.database().ref("users").child(user.uid).update({
      state: "offline",
    });
    firebase.auth().signOut(); //로그아웃하기!
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    var today = new Date();
    const time =
      today.getMonth() +
      today.getDate() +
      today.getHours() +
      today.getMinutes() +
      today.getSeconds();
    const metadata = { contentType: mime.lookup(file.name) };
    // mime을 통해 파일 확장자를 바로 알수있다!

    try {
      //스토리지에 파일 저장하기
      let uploadTaskSnapshot = await firebase
        .storage()
        .ref()
        .child(`user_image/${time}`) //user_image폴더 안에 넣겠음 storage의
        .put(file, metadata); //데이터를 file에 넣고 metadata 에 확장자를 넣어준다

      let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
      //메소드로 주소 가져옴

      // 프로필 이미지 수정
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL,
      });

      dispatch(setPhotoURL(downloadURL));
      //리덕스에 저장된 프로필사진 바꿔주기!

      //데이터베이스 유저 이미지 수정
      await firebase
        .database()
        .ref("users")
        .child(user.uid) //유저 찾고!!
        .update({ image: downloadURL }); //이미지 수정하기!

      // console.log('uploadTaskSnapshot', uploadTaskSnapshot)
    } catch (error) {
      alert(error);
    }
  };
  console.log("user", user);
  const dropstyle = {
    background: "transparent",
    border: "none",
    marginLeft: "5px",
  };
  return userImage !== null ? (
    <div className={styles.UserBox}>
      {/* Logo */}
      {/* <h3 style={{ color: "white" }}>
        <IoIosChatboxes /> Chat App
      </h3> */}

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Image
          src={user && userImage}
          style={{ width: "30p", height: "30px", marginTop: "3px" }}
          roundedCircle
        />
        {/* {user.displayName} */}
        <Dropdown>
          <Dropdown.Toggle
            style={dropstyle}
            variant="secondary"
            // className={styles.dropdown}
            id="dropdown-basic"
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.menu}>
            <Dropdown.Item
              // style={{
              //   backgroundColor: "black",
              // }}
              className={styles.item}
              onClick={handleOpenImageRef}
            >
              Change the profile Photo
            </Dropdown.Item>
            <Dropdown.Item className={styles.item} onClick={handleLogout}>
              LogOut
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <input
        onChange={handleUploadImage}
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        ref={inputOpenImageRef}
        type="file"
      />
      {/* 숨겨져있다.. ref통해서 클릭시킬것임! 
      accept 통해서 파일 속성 정할수있음!*/}
    </div>
  ) : (
    <div className={styles.userBoxTwo}>
      {/* Logo */}
      {/* <h3 style={{ color: "white" }}>
        <IoIosChatboxes /> Chat App
      </h3> */}

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        {/* {user.displayName} */}
        <Dropdown>
          <Dropdown.Toggle
            style={dropstyle}
            variant="secondary"
            // className={styles.dropdown}
            id="dropdown-basic"
          >
            <div className={styles.change}>{"Change Your Profile Photo"}</div>
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.menu}>
            <Dropdown.Item
              // style={{
              //   backgroundColor: "black",
              // }}
              className={styles.item}
              onClick={handleOpenImageRef}
            >
              Change the profile Photo
            </Dropdown.Item>
            <Dropdown.Item className={styles.item} onClick={handleLogout}>
              LogOut
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <input
        onChange={handleUploadImage}
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        ref={inputOpenImageRef}
        type="file"
      />
      {/* 숨겨져있다.. ref통해서 클릭시킬것임! 
      accept 통해서 파일 속성 정할수있음!*/}
    </div>
  );
}

export default UserPanel;
