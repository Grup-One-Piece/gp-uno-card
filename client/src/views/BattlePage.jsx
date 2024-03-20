import logo from '../assets/logo.png'
import backcard from "../assets/Deck.png";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import queryString from 'query-string'
import io from "socket.io-client";

let socket
const ENDPOINT = "http://localhost:3000";

function BattlePage() {
    const location = useLocation();
    const data = queryString.parse(location.search);

    const [room, setRoom] = useState(data.roomCode);
    const [roomFull, setRoomFull] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isChatBoxHidden, setChatBoxHidden] = useState(true);

    useEffect(() => {
        if (!room) {
            console.error("Room code not found");
            return;
        }

        const connectionOptions = {
            forceNew: true,
            reconnectionAttempts: "Infinity",
            timeout: 10000,
            transports: ["websocket"],
        };
        socket = io.connect(ENDPOINT, connectionOptions);

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        socket.emit("join", { room: room }, (error) => {
            if (error) {
                console.error("Error joining room:", error);
                setRoomFull(true);
            }
        });

        return function cleanup() {
            socket.disconnect();
        };
    }, [room]);

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });

        socket.on("currentUserData", ({ name }) => {
            setCurrentUser(name);
        });

        socket.on("message", (message) => {
            setMessages((messages) => [...messages, message]);

            const chatBody = document.querySelector(".chat-body");
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    }, []);

    const toggleChatBox = () => {
        const chatBody = document.querySelector(".chat-body");
        if (isChatBoxHidden) {
            chatBody.style.display = "block";
            setChatBoxHidden(false);
        } else {
            chatBody.style.display = "none";
            setChatBoxHidden(true);
        }
    };

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit("sendMessage", { message: message }, () => {
                setMessage("");
            });
        }
    };

    return (
        <div >
            {!roomFull ? (
                <>
                    <div className='topInfo'>
                        <img src={logo} />
                        <h1>Game Code: {room}</h1>
                    </div>
                    {/* PLAYER LEFT MESSAGES */}
                    {users.length === 1 && currentUser === "Player 2" && (
                        <h1 className="topInfoText">Player 1 has left the game.</h1>
                    )}
                    {users.length === 1 && currentUser === "Player 1" && (
                        <h1 className="topInfoText">
                            Waiting for Player 2 to join the game.
                        </h1>
                    )}

                    {users.length === 2 && (
                        <>
                            {false ? (
                                <div>
                                    {winner !== "" && (
                                        <>
                                            <h1>GAME OVER</h1>
                                            <h2>{winner} wins!</h2>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {/* PLAYER 1 VIEW */}
                                    {currentUser === "Player 1" && (
                                        <>
                                            <div className="chatBoxWrapper">
                                                <div className="chat-box chat-box-player1">
                                                    <div className="chat-head">
                                                        <h2 className='text-xl ml-2'>Chat Box</h2>
                                                        {!isChatBoxHidden ? (
                                                            <span
                                                                onClick={toggleChatBox}
                                                                className="material-icons"
                                                            >
                                                                🔽
                                                            </span>
                                                        ) : (
                                                            <span
                                                                onClick={toggleChatBox}
                                                                className="material-icons"
                                                            >
                                                                🔼
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="chat-body">
                                                        <div className="msg-insert">
                                                            {messages.map((msg) => {
                                                                if (msg.user === "Player 2")
                                                                    return (
                                                                        <div className="msg-receive">
                                                                            {msg.text}
                                                                        </div>
                                                                    );
                                                                if (msg.user === "Player 1")
                                                                    return (
                                                                        <div className="msg-send">{msg.text}</div>
                                                                    );
                                                            })}
                                                        </div>
                                                        <div className="chat-text">
                                                            <input
                                                                type="text"
                                                                placeholder="Type a message..."
                                                                value={message}
                                                                onChange={(event) =>
                                                                    setMessage(event.target.value)
                                                                }
                                                                onKeyPress={(event) =>
                                                                    event.key === "Enter" && sendMessage(event)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* PLAYER 2 VIEW */}
                                    {currentUser === "Player 2" && (
                                        <>
                                            <div className="chatBoxWrapper">
                                                <div className="chat-box chat-box-player1">
                                                    <div className="chat-head">
                                                        <h2 className='text-xl ml-2'>Chat Box</h2>
                                                        {!isChatBoxHidden ? (
                                                            <span
                                                                onClick={toggleChatBox}
                                                                className="material-icons"
                                                            >
                                                                🔽
                                                            </span>
                                                        ) : (
                                                            <span
                                                                onClick={toggleChatBox}
                                                                className="material-icons"
                                                            >
                                                                🔼
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="chat-body">
                                                        <div className="msg-insert">
                                                            {messages.map((msg) => {
                                                                if (msg.user === "Player 1")
                                                                    return (
                                                                        <div className="msg-receive">
                                                                            {msg.text}
                                                                        </div>
                                                                    );
                                                                if (msg.user === "Player 2")
                                                                    return (
                                                                        <div className="msg-send">{msg.text}</div>
                                                                    );
                                                            })}
                                                        </div>
                                                        <div className="chat-text">
                                                            <input
                                                                type="text"
                                                                placeholder="Type a message..."
                                                                value={message}
                                                                onChange={(event) =>
                                                                    setMessage(event.target.value)
                                                                }
                                                                onKeyPress={(event) =>
                                                                    event.key === "Enter" && sendMessage(event)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <h1>Room full</h1>
            )}

            <br />
            <Link to="/">
                <button className="btn btn-error text-white">QUIT</button>
            </Link>
        </div>
    );
}

export default BattlePage;
