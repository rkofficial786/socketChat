import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import Chat from "./chat";
import Lobby from "./lobby";
import "./App.css";

const App = () => {
  // const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [chattingWith, setChattingWith] = useState([]);
  // const [userId, setUserId] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [socketId, setSockedId] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = io("http://localhost:3000");
  useEffect(() => {
    socket.on("connect", () => {
      setSockedId(socket.id);
      console.log("connected");
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("userJoined", (user) => {
      console.log(user, "user ");
      console.log(socketId, "sockeyt");

      setChattingWith((prev) => [...prev, { user: user.name, id: user.id }]);
      setMessages((messages) => [
        ...messages,
        {
          message: `${user.name} has joined the chat`,
          id: socketId,
          isJoined: true,
        },
      ]);
    });
    socket.on("receive", (s) => {
      setMessages((messages) => [
        ...messages,
        { message: s?.message, id: s?.id, name: s?.sender },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim().length < 1) {
      return;
    }
    setMessages((messages) => [
      ...messages,
      { message: message, id: socketId },
    ]);
    // setMessages((messages) => [...messages, message:message,id:socketId]);
    socket.emit("message", { message, room, id: socketId, sender: userName });
    setMessage("");
  };

  const handleRegistration = (e) => {
    e.preventDefault();

    if (userName.trim() == "" || room.trim() == "") {
      return;
    }

    setIsRegistered(true);

    socket.emit("register", { id: socketId, name: userName });
  };

  console.log(chattingWith, "chatting bwith");
  const messageContainerRef = useRef();
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  console.log(messages, "message");

  return (
    <div className="container">
      {isRegistered ? (
        <div className="chat-container">
          <div className="header">
            <h1>YooChat</h1>
            {chattingWith.map((user) => (
              <div key={user.id}>
                {user.id !== socketId && (
                  <p>
                    Chatting with:{" "}
                    <span className="chatWith"> {user.user}</span>
                  </p>
                )}
              </div>
            ))}
            {chattingWith.every((user) => user.id === socketId) && (
              <p>Waiting for someone to join...</p>
            )}
          </div>

          <div ref={messageContainerRef} className="message-container">
            {messages.map((value, key) => (
              <div
                key={key}
                style={
                  value.id !== socketId && !value?.isJoined
                    ? { flexDirection: "row" }
                    : { flexDirection: "column" }
                }
              >
                {value.id !== socketId && !value?.isJoined && (
                  <div className="avatar-container">
                    <div className="avatar">{value?.name?.substring(0, 1)}</div>
                  </div>
                )}
                <div
                  className={`message ${
                    value.id === socketId ? "sent" : "received"
                  } ${value?.isJoined && "joined"}`}
                >
                  {value.message}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="input-container">
            <input
              className="chatInput"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
            />

            {/* <button type="submit">Send</button> */}

            <button type="submit">
              <div class="svg-wrapper-1">
                <div class="svg-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      fill="currentColor"
                      d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                    ></path>
                  </svg>
                </div>
              </div>
              <span>Send</span>
            </button>
          </form>
        </div>
      ) : (
        <div style={{}} className="lobby_container">
          <Lobby
            userName={userName}
            setUserName={setUserName}
            socketId={socketId}
            room={room}
            setRoom={setRoom}
          />
          <button
            className="joinButton"
            style={{ width: "100px" }}
            onClick={handleRegistration}
          >
            Join
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
