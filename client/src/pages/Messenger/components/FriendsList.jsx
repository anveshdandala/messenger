import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import AnimatedList from "../components/AnimatedList.js";
import { useNavigate } from "react-router-dom";

const FriendsList = () => {
  const [showRequest, setShowRequest] = useState(false);
  const [requestedEmail, setRequestedEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [notification, setNotification] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const token = localStorage.getItem("user-own-profile");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch("/api/friends/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("available friends:", data);
        setCurrentUserId(data.userId);
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [token]);

  // Fetch incoming friend requests (notifications)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/friends/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("friend requests notifications:", data);
        setFriendRequests(data.requests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchRequests();
  }, [token]);

  const handleSendRequest = async () => {
    if (!requestedEmail) return;

    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friendEmail: requestedEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Friend request sent successfully!");
        setRequestedEmail("");
        setShowRequest(false);
      } else {
        setMessage(data.error || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setMessage("Server error");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const respondToRequest = async (requestId, action) => {
    try {
      await fetch("/api/friends/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, action }),
      });

      // Remove request from list
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));

      // If accepted, refetch friends
      if (action === "accepted") {
        const response = await fetch("/api/friends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedFriends = await response.json();
        setFriends(updatedFriends);
      }
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  const clickedFriend = (friendId) => {
    console.log("opening chat with friend id :", friendId);

    localStorage.setItem("selectedFriendId", friendId);
    window.history.pushState({}, "", `/chat/${friendId}`);

    // optional: notify any in-app listeners
    window.dispatchEvent(
      new CustomEvent("friendSelected", { detail: { friendId } })
    );
  };

  const EmptyState = () => (
    <div className="empty-state-container flex flex-col h-full">
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
        {message && <p className="text-sm text-green-400 mt-2">{message}</p>}
      </div>
    </div>
  );

  return (
    <>
      <div className="w-1/3 bg-black border-l border-gray-700 flex flex-col h-full relative text-white">
        <div className="friends-header flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h2 className="text-lg font-semibold">Friends</h2>

          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
            onClick={() => setNotification(!notification)}
          >
            ☰
          </button>
        </div>

        {/* Notifications Dropdown */}
        {notification && (
          <div className="absolute top-12 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-10 w-72">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Friend Requests</h4>
                <button onClick={() => setNotification(false)}>x</button>
              </div>
              {friendRequests.length > 0 ? (
                friendRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-gray-700 p-3 my-1 rounded-md flex flex-col"
                  >
                    <p className="text-sm">
                      {req.Requester.fullname} ({req.Requester.email})
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-green-600 px-3 py-1 rounded"
                        onClick={() => respondToRequest(req.id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-600 px-3 py-1 rounded"
                        onClick={() => respondToRequest(req.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No new friend requests</p>
              )}
            </div>
          </div>
        )}

        {/* Friends Section */}
        <div className="flex-1 overflow-y-auto">
          {friends.length > 0 ? (
            friends.map((f) => {
              const friendUser =
                f.requesterId === currentUserId ? f.receiver : f.requester;
              return (
                <div
                  onClick={() =>
                    navigate(`/messenger/chat/${friendUser.userId}`)
                  }
                  className="cursor-pointer"
                >
                  <AnimatedList
                    items={[`${friendUser.fullname} (${friendUser.email})`]}
                    onItemSelect={(item, index) => console.log(item, index)}
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                  />
                </div>
              );
            })
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
};

export default FriendsList;
