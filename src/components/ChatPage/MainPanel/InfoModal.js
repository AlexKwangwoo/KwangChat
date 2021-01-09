// import React from "react";
// import styles from "./InfoModal.module.css";
// import { Notification } from "./Icons";
// import Popover from "react-bootstrap/Popover";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import { Scrollbars } from "react-custom-scrollbars";
// // import Button from "react-bootstrap/Button";

// const renderThumb = ({ style, ...props }) => {
//   const thumbStyle = {
//     borderRadius: 6,
//     backgroundColor: "rgba(35, 49, 86, 0.8)",
//   };
//   return <div style={{ ...style, ...thumbStyle }} {...props} />;
// };

// const renderThumb_h = ({ style, ...props }) => {
//   const thumbStyle = {
//     borderRadius: 6,
//     backgroundColor: null,
//   };
//   return <div style={{ ...style, ...thumbStyle }} {...props} />;
// };

// const CustomScrollbars = (props) => (
//   <Scrollbars
//     renderThumbHorizontal={renderThumb_h}
//     renderThumbVertical={renderThumb}
//     {...props}
//   />
// );

// // const Button = styled.button`
// //   cursor: pointer;
// //   border: none;
// //   background: none;
// //   outline: none;
// //   margin-left: -5px;
// //   margin-right: -5px;
// // `;

// // const Popzindex = styled(Popover)`
// //   z-index: 10;
// // `;

// // const PopupBox = styled.div`
// //   display: fixed;
// //   margin-top: 2vh;
// //   width: 500px;
// //   height: 300px;
// //   background-color: white;
// //   border-radius: 10px;
// //   box-shadow: 0 0 3px 2px #f2f2f2;
// // `;

// // const Div = styled.div`
// //   padding-left: 20px;
// //   height: 65px;
// //   display: flex;
// //   align-items: center;
// //   justify-content: space-between;
// //   border-bottom: 1px solid #eaeaea;
// // `;

// // const Username = styled.p`
// //   font-size: 15px;
// //   margin-right: 20px;
// //   font-weight: 700;
// // `;
// // const Date = styled.p`
// //   margin-top: 5px;
// //   font-size: 15px;
// //   margin-right: 20px;
// // `;

// // const Text = styled.div`
// //   margin-right: 240px;
// // `;

// // const ButtonProfile = styled.button`
// //   background-color: white;
// //   padding: 6px;
// //   border-radius: 4px;
// //   border: 1px solid #eaeaea;
// // `;

// // const ProfileButtonBox = styled.div`
// //   margin-left: -130px;
// // `;

// // const TextRefresh = styled.div`
// //   margin: auto;
// // `;

// // eslint-disable-next-line
// export default ({ data, loading }) => {
//   // console.log("data is!!!");
//   // console.log(data);
//   const popoverBottom = (
//     <Popzindex id="popover-positioned-bottom" title="Popover bottom">
//       <PopupBox>
//         <div>hahaha</div>
//         {/* <CustomScrollbars autoHide autoHideTimeout={500} autoHideDuration={200}>
//           {!loading &&
//             data &&
//             data.me &&
//             data.me.followers.map((followers) => (
//               <Div
//                 key={followers.id}
//                 // id={followers.id}
//                 // avatar={followers.avatar}
//                 // username={followers.username}
//                 // post={followers.post.caption}
//                 // createdAt={followers.post.createdAt}
//               >
//                 <Avatar size="smmd" url={followers.avatar} />
//                 <Text>
//                   <Username>{followers.username}</Username>
//                   <Date>started following you.</Date>
//                 </Text>
//                 <Link to={`/${followers.username}`}>
//                   <ProfileButtonBox>
//                     <ButtonProfile>Check Profile</ButtonProfile>
//                   </ProfileButtonBox>
//                 </Link>
//               </Div>
//             ))}
//           {!data && (
//             <Div>
//               <TextRefresh>Please Refresh the window</TextRefresh>
//             </Div>
//           )}
//         </CustomScrollbars> */}
//       </PopupBox>
//     </Popzindex>
//   );

//   return (
//     <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
//       <Button>
//         <Notification />
//       </Button>
//     </OverlayTrigger>
//   );
// };
