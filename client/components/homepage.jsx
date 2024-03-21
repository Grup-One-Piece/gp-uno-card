import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import logo from "../src/assets/logo.png";
import landingPage from "../src/assets/Landing-Page.gif";

function Homepage() {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div className="Homepage bg-cover bg-center h-screen" style={{backgroundImage: `url(${landingPage})`}}>
      <div className="homepage-menu">
        <img src={logo} width="200px" />
        <div className="homepage-form">
          <div className="homepage-join">
            <input
              type="text"
              placeholder="Game Code"
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Link to={`/play?roomCode=${roomCode}`}>
              <button className="game-button green">JOIN GAME</button>
            </Link>
          </div>
          <h1>OR</h1>
          <div className="homepage-create">
            <Link to={`/play?roomCode=${uuidv4()}`}>
              <button className="game-button orange">CREATE GAME</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
