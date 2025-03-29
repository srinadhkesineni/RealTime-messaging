import io from "socket.io-client";
import "./App.css";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [isRoomJoined, setIsRoomJoined] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setIsRoomJoined(true); 
    }
  };

  return (
    <div className="App">
      {!isRoomJoined ? (
        <div className="joinRoomContainer">
          <h3>Join a Chat Room</h3>
          <input
            type="text"
            placeholder="Enter your name..."
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="text"
            placeholder="Enter room ID..."
            onChange={(event) => setRoom(event.target.value)}
          />
          <button onClick={joinRoom}>Enter Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
