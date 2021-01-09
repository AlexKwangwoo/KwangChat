import React from "react";
import UserPanel from "./UserPanel";
import Favorited from "./Favorited";
import ChatRooms from "./ChatRooms";
import DirectMessages from "./DirectMessages";
import FindUser from "./FindUser";
import styles from "./SidePanel.module.css";
import Scrollbars from "react-custom-scrollbars";

function SidePanel() {
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

  return (
    <div className={styles.box}>
      <FindUser />
      <div className={styles.fdBox}>
        <CustomScrollbars
          style={{ width: "98%" }}
          autoHide
          autoHideTimeout={500}
          autoHideDuration={200}
        >
          <div className={styles.insideBox}>
            <Favorited />

            {/* <ChatRooms /> */}

            <DirectMessages />
          </div>
        </CustomScrollbars>
      </div>
      <div className={styles.userBox}>
        <UserPanel />
      </div>
    </div>
  );
}

export default SidePanel;
