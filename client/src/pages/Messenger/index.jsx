import SideBar from "./components/SideBar.jsx";
import FriendsList from "./components/FriendsList.jsx";
import TextingArea from "../Messenger/chats/TextingArea.jsx";
import "./styles/messengerIndex.css";
import { Route, Routes } from "react-router-dom";

const Messenger = () => {
  return (
    <div className="messenger-container">
      <SideBar />
      <FriendsList />
      <Routes>
        <Route
          index
          element={
            <div className="flex h-full w-2/3 items-center justify-center bg-black border-l border-slate-700">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">
                    Select a chat to start messaging
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Choose a conversation from the sidebar to begin
                  </p>
                </div>
              </div>
            </div>
          }
        />
        <Route path="chat/:friendId" element={<TextingArea />} />
      </Routes>
    </div>
  );
};

export default Messenger;
