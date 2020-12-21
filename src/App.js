import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";

import firebase from "./firebase";

import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/actions/user_action";

function App(props) {
  let history = useHistory(); //function리액트는 이렇게
  // withRouter 로 redirect시키는건 클래스형!
  let dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  //리덕스에 있는 내용을 가져올때 useSelector 쓴다!

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("user", user); //계속 유저의 상태를 지켜본다!
      //로그인이 된 상태
      if (user) {
        history.push("/");
        dispatch(setUser(user));
      } else {
        history.push("/login");
        dispatch(clearUser());
      }
    });
  }, []);

  if (isLoading) {
    return <div>...loading</div>;
  } else {
    return (
      <Switch>
        <Route exact path="/" component={ChatPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    );
  }
}

export default App;
