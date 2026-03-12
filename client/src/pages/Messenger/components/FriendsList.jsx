import { useState, useEffect } from "react";
import { UserPlus, Bell, X, Check } from "lucide-react";
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
        if (data.requests) {
           setFriendRequests(data.requests);
        } else if (Array.isArray(data)) {
           setFriendRequests(data);
        } else {
           setFriendRequests([]);
        }
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


  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
      <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-4 text-[var(--text-tertiary)]">
        <UserPlus size={24} />
      </div>
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
        No friends yet
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-[200px]">
        Build your network by inviting friends.
      </p>
      <button
        className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
        onClick={() => setShowRequest(true)}
      >
        <UserPlus size={16} />
        <span>Invite Friends</span>
      </button>

      {showRequest && (
        <div className="mt-4 w-full flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter friend's email"
            value={requestedEmail}
            onChange={(e) => setRequestedEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
          />
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium"
            onClick={handleSendRequest}
          >
            Send
          </button>
        </div>
      )}
      {message && <p className="text-xs text-green-400 mt-2">{message}</p>}
    </div>
  );

  return (
    <div className="w-80 h-full bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col">
      {/* Header */}
      <div className="h-[72px] px-6 flex items-center justify-between border-b border-[var(--border-color)]">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Friends</h2>
        <button
          className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors"
          onClick={() => setNotification(!notification)}
        >
          <Bell size={20} />
          {friendRequests.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-secondary)]" />
          )}
        </button>
      </div>

       {/* Notifications Dropdown */}
       {notification && (
          <div className="absolute top-[70px] left-20 z-50 w-72 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]">
              <h4 className="font-semibold text-[var(--text-primary)]">Fried Requests</h4>
              <button 
                onClick={() => setNotification(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {friendRequests.length > 0 ? (
                friendRequests.map((req) => (
                  <div key={req.id} className="p-3 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-primary)] transition-colors">
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                      {req.Requester.fullname}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">
                      {req.Requester.email}
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                        onClick={() => respondToRequest(req.id, "accepted")}
                      >
                         <Check size={14} /> Accept
                      </button>
                      <button
                        className="flex-1 bg-[var(--bg-tertiary)] hover:bg-red-900/50 text-[var(--text-secondary)] hover:text-red-400 py-1.5 rounded-lg text-xs font-medium"
                        onClick={() => respondToRequest(req.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--text-secondary)] text-sm">
                  No new requests
                </div>
              )}
            </div>
          </div>
        )}

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto p-2">
        {friends.length > 0 ? (
          friends.map((f) => {
             const isRequester = f.requesterId === currentUserId;
              const friendUser = isRequester ? f.receiver : f.requester;
            if (!friendUser) return null;
            
            return (
              <div
                key={f.id}
                onClick={() => navigate(`/messenger/chat/${friendUser.userId}`)}
                className="group p-3 mb-1 rounded-xl cursor-pointer hover:bg-[var(--bg-tertiary)] transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {friendUser.fullname[0]}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-white transition-colors">
                      {friendUser.fullname}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {friendUser.email}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default FriendsList;
