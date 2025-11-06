import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

const TextingArea = () => {
  const { friendId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("user-own-profile");
  const messagesEndRef = useRef(null);

  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["messages", friendId],
    queryFn: async () => {
      if (!token) throw new Error("No auth token found");
      const response = await fetch(`/api/messages/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch messages");
      }
      return response.json();
    },
    enabled: !!friendId,
  });

  // Smooth auto-scroll to bottom on message updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!token) {
      alert("You must be logged in to send messages.");
      return;
    }

    const messageToSend = newMessage;
    setNewMessage("");

    // Optimistic UI update (optional, for instant feel)
    if (data?.messages) {
      data.messages.push({
        messageId: Date.now(), // temp ID
        senderId: data.currentUserId,
        receiverId: parseInt(friendId, 10),
        content: messageToSend,
      });
    }
    console.log("message content:", messageToSend);
    try {
      console.log("message content:", messageToSend);
      await fetch(`/api/messages/${friendId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: messageToSend }),
      });
      refetch(); // refresh from DB
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!friendId) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-400">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="w-2/3 bg-black border-l border-gray-700 flex flex-col h-full text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {data?.messages?.length ? (
          data.messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`p-2 rounded-lg max-w-xs break-words ${
                msg.senderId === data.currentUserId
                  ? "bg-blue-600 self-end ml-auto"
                  : "bg-gray-700"
              }`}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex border-t border-gray-700 p-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white p-2 rounded-lg outline-none"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default TextingArea;
