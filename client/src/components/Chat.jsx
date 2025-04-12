import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import ScrollToBottom from "react-scroll-to-bottom";
import socket from "./socket";
import { useLocation } from "react-router-dom";

function Chat() {
  const location = useLocation();
  const { username, room } = location.state || {};

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const currentMessageRef = useRef(currentMessage);

  useEffect(() => {
    currentMessageRef.current = currentMessage;
  }, [currentMessage]);

  // Join room and set up socket listeners
  useEffect(() => {
    if (!room) return;

    // Join the room and fetch previous messages
    socket.emit("join_room", room);
    socket.emit("get_messages", room);

    const handlePreviousMessages = (messages) => {
      const formatted = messages.map((msg) => ({
        author: msg.senderId?.email || "Unknown",
        message: msg.text,
        time: new Date(msg.timestamp).toLocaleTimeString(),
      }));
      setMessageList(formatted);
    };

    const handleReceiveMessage = (data) => {
      const incoming = {
        author: data.sender || "Unknown",
        message: data.text,
        time: new Date(data.timestamp).toLocaleTimeString(),
      };
      setMessageList((prev) => [...prev, incoming]);
    };

    socket.on("previous_messages", handlePreviousMessages);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("previous_messages", handlePreviousMessages);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [room]);

  const sendMessage = async () => {
    const message = currentMessageRef.current.trim();
    if (message === "") return;

    const messageData = {
      room,
      userId: username,
      message,
    };

    await socket.emit("send_message", messageData);
    setCurrentMessage(""); // clear input
  };

  return (
    <div className="chatContainer">
      <ScrollToBottom className="chatBox">
        {messageList.map((msg, index) => (
          <div
            key={index}
            className={`chatMessage ${
              msg.author === username ? "right" : "left"
            }`}
          >
            <p>
              <strong>{msg.author}</strong> <span>{msg.time}</span>
            </p>
            <p>{msg.message}</p>
          </div>
        ))}
      </ScrollToBottom>

      <div className="messageInput">
        <input
          type="text"
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
