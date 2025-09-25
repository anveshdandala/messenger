import { useState, useEffect } from "react";
import { UserPlus, Circle, Clock } from "lucide-react";

const FriendsList = () => {
  const [showRequest, setShowRequest] = useState(false);
  const [requestedEmail, setRequestedEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [notification, setNotification] = useState(null);
  const token = localStorage.getItem("user-own-profile");

  // 🔹 Fetch friends list
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/friends", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("API response:", data);

        // force array
        if (Array.isArray(data)) {
          setFriends(data);
        } else {
          setFriends([]);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
        setFriends([]);
      } finally {
        console.log("friends:", friends);
      }
    };

    if (token) fetchFriends();
  }, [token]);

  // 🔹 Send request
  const handleSendRequest = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friendEmail: requestedEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification(`Friend request sent to ${requestedEmail}`);
      } else {
        setNotification(`${data.message || "Something went wrong"}`);
      }

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error(error);
      setNotification("❌ Server error");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // 🔹 Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <UserPlus className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">
        No friends yet
      </h3>
      <p className="text-slate-400 text-center mb-6 max-w-xs">
        Start building your network by inviting friends to join the
        conversation.
      </p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2"
        onClick={() => setShowRequest(true)}
      >
        <UserPlus className="w-4 h-4" />
        <span>Invite Friends</span>
      </button>

      {showRequest && (
        <div className="mt-4 flex flex-row items-center space-x-2">
          <input
            type="text"
            placeholder="Enter friend's email"
            value={requestedEmail}
            onChange={(e) => setRequestedEmail(e.target.value)}
            className="px-3 py-2 border rounded-lg text-black"
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            onClick={handleSendRequest}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );

  // 🔹 Friend item
  const FriendItem = ({ friend }) => (
    <div className="flex items-center px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors group">
      <div className="relative">
        <img
          src={friend.avatar}
          alt={friend.name}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              friend.name || "User"
            )}&background=3b82f6&color=ffffff&size=48`;
          }}
        />
        {friend.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-200 truncate">
            {friend.name}
          </h4>
          {friend.unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {friend.unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center mt-0.5">
          {friend.isOnline ? (
            <div className="flex items-center text-xs text-green-600">
              <Circle className="w-2 h-2 mr-1.5 fill-current" />
              <span>Online</span>
            </div>
          ) : (
            <div className="flex items-center text-xs text-slate-500">
              <Clock className="w-3 h-3 mr-1.5" />
              <span>Last seen {friend.lastSeen || "recently"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-black border-l border-gray-700 flex flex-col h-full relative">
      {Array.isArray(friends) && friends.length > 0 ? (
        friends.map((friend) => <FriendItem key={friend.id} friend={friend} />)
      ) : (
        <EmptyState />
      )}

      {notification && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
