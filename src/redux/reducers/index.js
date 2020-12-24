import { combineReducers } from "redux";
import user from "./user_reducer";
import chatRoom from "./chatRoom_reducer";

const rootReducer = combineReducers({
  user,
  chatRoom,
});

export default rootReducer;

//index(동작할 부분 합체) => type => action => reducers
