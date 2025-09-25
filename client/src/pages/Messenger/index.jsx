import React from "react";
import SideBar from "./components/SideBar.jsx";
import FriendsList from "./components/FriendsList.jsx";

import "./styles/messengerIndex.css";

const Messenger = () => {
  return (
    <div className="messenger-container">
      <SideBar />
      <FriendsList />
    </div>
  );
};

export default Messenger;
