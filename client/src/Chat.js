import React, { useState, useEffect } from "react";
import "./App.css";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

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
