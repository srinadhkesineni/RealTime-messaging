import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
const socket = io("http://localhost:3001");

function RoomSelector() {
  const location = useLocation();
  const { username } = location.state || {};
  
  const [roomToJoin, setRoomToJoin] = useState("");
  const [roomToCreate, setRoomToCreate] = useState("");
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

  const createRoom = () => {
    if (roomToCreate.trim()) {
      socket.emit("create_room", roomToCreate);
      socket.emit("join_room", roomToCreate);
      navigate("/chat", { state: { username, room: roomToCreate } });
    }
  };

  const joinRoom = () => {
    if (roomToJoin.trim()) {
      socket.emit("join_room", roomToJoin);
      // console.log(roomToJoin)
      navigate("/chat", { state: { username, room: roomToJoin } });
    }
  };

  const handleJoinFromList = (room) => {
    socket.emit("join_room", room);
    navigate("/chat", { state: { username, room } });
  };

  return (
    <div>
      <h2>Create a Room</h2>
      <input
        type="text"
        placeholder="Enter room name"
        value={roomToCreate}
        onChange={(e) => setRoomToCreate(e.target.value)}
      />
      <button onClick={createRoom}>Create</button>

      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Enter room name"
        value={roomToJoin}
        onChange={(e) => setRoomToJoin(e.target.value)}
      />
      <button onClick={joinRoom}>Join</button>

      <h3>Active Rooms</h3>
      {rooms.length === 0 ? (
        <p>No rooms available</p>
      ) : (
        <ul>
          {rooms.map((room, index) => (
            <li key={index}>
              {room}{" "}
              <button onClick={() => handleJoinFromList(room)}>Join</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoomSelector;
