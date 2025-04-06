import React, { useState, useEffect } from "react";
import "../App.css";
import ScrollToBottom from "react-scroll-to-bottom";
import socket from "./socket";
import axios from "axios"; // For optional fallback API calls if needed

function Chat({ username, room, userId }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    console.log(currentMessage);
    if (currentMessage !== "") {
      const messageData = {
        room,
        userId,
        message: currentMessage,
      };

      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    // Fetch previous messages
    socket.emit("get_messages", room);

    // Receive past messages
    socket.on("previous_messages", (messages) => {
      const formatted = messages.map((msg) => ({
        author: msg.sender?.email || "Unknown",
        message: msg.text,
        time: new Date(msg.timestamp).toLocaleTimeString(),
      }));
      setMessageList(formatted);
    });

    // Listen for new messages
    socket.on("receive_message", (data) => {
      const incoming = {
        author: data.sender || "Unknown",
        message: data.text,
        time: new Date(data.timestamp).toLocaleTimeString(),
      };
      setMessageList((list) => [...list, incoming]);
    });

    return () => {
      socket.off("previous_messages");
      socket.off("receive_message");
    };
  }, [room]);

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
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
