import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import InfoBar from "../InfoBar/InfoBar";
import Messages from "../Messages/Messages";
import Input from "../Input/Input";

import "./Chat.css";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = `localhost:5000`;
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);
    //3rd parameter is a callback in server/index.js
    socket.emit("join", { name: name, room }, () => {});

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);
  //[ENDPOINT, location.search] - render only by change

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((msgs) => [...msgs, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
