import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function RoomSelector({ username }) {
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("active_rooms", (activeRooms) => {
      setRooms(activeRooms);
    });

    socket.emit("get_active_rooms");

    return () => {
      socket.off("active_rooms");
    };
  }, []);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      navigate("/chat", { state: { username, room, socket } });
    }
  };

  return (
    <div>
      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Enter room name"
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join</button>

      <h3>Active Rooms</h3>
      <ul>
        {rooms.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

export default RoomSelector;
