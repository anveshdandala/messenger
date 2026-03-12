import React from "react";
import { Link } from "react-router-dom";
import profileIcon from "../../../assets/profile.svg";

const SideBar = () => {
  return (
    <div className="w-[72px] h-full flex flex-col items-center py-6 bg-[var(--bg-secondary)] border-r border-[var(--border-color)]">
      <Link to="/profile">
         <div className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-[var(--accent-primary)] transition-all duration-300">
          <img 
            className="w-full h-full object-cover" 
            src={profileIcon} 
            alt="profile" 
          />
        </div>
      </Link>
    </div>
  );
};

export default SideBar;


