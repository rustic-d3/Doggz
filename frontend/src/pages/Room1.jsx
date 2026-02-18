import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "../styles/room.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Room1() {
    const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: { username: "system", message: "Bine ai venit!" },
      sender: "system",
    },
  ]);
  const token = localStorage.getItem('token');
  localStorage.setItem("username", jwtDecode(token).username );
  const username = localStorage.getItem("username") || "Guest";

  const [inputText, setInputText] = useState("");
  const socketRef = useRef(null);

  const goBack = ()=> navigate(-1);
  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      auth: { username },
    });

    socketRef.current.on("chat-message", (message) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: message, sender: "other" },
      ]);
    });

    
    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);


  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;


    socketRef.current.emit("send-message", inputText);


    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: { username, message: inputText }, sender: "me" },
    ]);

    setInputText("");
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <h1>Room 1 - Chat</h1>

        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-item ${msg.sender}`}>
              {msg.sender !== "system" && (
                <div className="message-header">{msg.text.username}</div>
              )}
              <div className="message-bubble">{msg.text.message}</div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Scrie un mesaj..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit">Send</button>
          <button onClick={goBack} type="button">Go back</button>
        </form>
      </div>
    </div>
  );
}
