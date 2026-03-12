import SideBar from "./components/SideBar.jsx";
import FriendsList from "./components/FriendsList.jsx";
import TextingArea from "../Messenger/chats/TextingArea.jsx";
import "./styles/messengerIndex.css";
import { Route, Routes } from "react-router-dom";

const Messenger = () => {
  return (
    <div className="flex h-screen w-screen bg-[var(--bg-primary)] overflow-hidden">
      <SideBar />
      <FriendsList />
      <div className="flex-1 flex flex-col h-full bg-[var(--bg-primary)]">
        <Routes>
          <Route
            index
            element={
              <div className="flex flex-col h-full items-center justify-center text-[var(--text-secondary)]">
                <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--border-color)] text-center max-w-md">
                   <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Welcome to Messenger
                  </h2>
                  <p>
                    Select a conversation from the sidebar to start chatting.
                  </p>
                </div>
              </div>
            }
          />
          <Route path="chat/:friendId" element={<TextingArea />} />
        </Routes>
      </div>
    </div>
  );
};

export default Messenger;
