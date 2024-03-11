import React, { useState } from "react";
import "./styles.css";
import { MdOutlineContentCopy } from "react-icons/md";

const Lobby = ({
  userName,
  setUserName,
  onNameSubmit,
  socketId,
  room,
  setRoom,
}) => {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(socketId);
    setShowCopiedMessage(true);
    setTimeout(() => {
      setShowCopiedMessage(false);
    }, 1000);
  };
  return (
    <div className="name-entry-container">
      <h2>Welcome to the YooChat</h2>
      <form className="name-entry-form">
        <div className="single_input">
          <label htmlFor="userName">Enter your name:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name"
          />
        </div>

        <div className="single_input">
          <label htmlFor="targetUserId">Enter someone else's Socket ID:</label>
          <input
            type="text"
            id="targetUserId"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Socket ID"
          />
        </div>

        {socketId && (
          <div className="socket-id-info">
            <p>Your Socket ID:</p>

            <div>
              <p id="socketId">{socketId}</p>
              {/* <div className="copy_button"> */}

              <MdOutlineContentCopy
                className="copy_button"
                onClick={handleCopyToClipboard}
              />
              {showCopiedMessage && (
                <span className="copied_message">Copied</span>
              )}
            </div>
            {/* </div> */}
          </div>
        )}
      </form>
    </div>
  );
};

export default Lobby;
