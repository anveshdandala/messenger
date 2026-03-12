import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Send, MoreVertical, Phone, Video } from "lucide-react";

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
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)]">
        Select a chat to start messaging
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)]">
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)] text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[var(--bg-primary)] flex flex-col h-full">
      {/* Header */}
      <div className="h-[72px] px-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
               {data.messages[0]?.Receiver?.fullname?.[0] || "?"} 
            </div>
            <div>
               <h3 className="font-semibold text-[var(--text-primary)]">
                  Chat
               </h3>
               <span className="text-xs text-green-400 flex items-center gap-1">
                  ● Online
               </span>
            </div>
         </div>
         <div className="flex gap-4 text-[var(--text-secondary)]">
            <button className="hover:text-[var(--text-primary)] transition-colors"><Phone size={20} /></button>
            <button className="hover:text-[var(--text-primary)] transition-colors"><Video size={20} /></button>
            <button className="hover:text-[var(--text-primary)] transition-colors"><MoreVertical size={20} /></button>
         </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {data?.messages?.length ? (
          data.messages.map((msg) => {
            const isMe = msg.senderId === data.currentUserId;
            return (
               <div
                  key={msg.messageId}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
               >
                  <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl break-words text-sm ${
                     isMe
                        ? "bg-[var(--accent-primary)] text-white rounded-br-none"
                        : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-bl-none"
                  }`}
                  >
                  {msg.content}
                  </div>
               </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] opacity-50">
             <p className="mb-2">No messages yet</p>
             <p className="text-xs">Say hello to start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--bg-primary)]">
         <form onSubmit={handleSend} className="flex items-center gap-3 bg-[var(--bg-tertiary)] p-2 rounded-xl border border-[var(--border-color)] focus-within:border-[var(--accent-primary)] transition-colors">
            <input
               type="text"
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               placeholder="Type a message..."
               className="flex-1 bg-transparent text-[var(--text-primary)] px-2 outline-none placeholder-[var(--text-secondary)]"
            />
            <button
               type="submit"
               disabled={!newMessage.trim()}
               className="p-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
               <Send size={18} />
            </button>
         </form>
      </div>
    </div>
  );
};

export default TextingArea;
