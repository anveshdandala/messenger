import React from "react";
import "../styles/messengerIndex.css";
import profileIcon from "../../../assets/profile.svg";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sidebar-container">
      <Link to="/profile">
        <button className="profile-box">
          <img className="profile-icon" src={profileIcon} alt="profile" />
        </button>
      </Link>
    </div>
  );
};

export default SideBar;
