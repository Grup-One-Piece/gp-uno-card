import logo from "../assets/logo.png";
import backcard from "../assets/Deck.png";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import shuffleArray from "../utils/shuffleArray";
import PACK_OF_CARDS from "../utils/packOfCards";
import zeroB from "../assets/cards-front/0B.png";
import zeroG from "../assets/cards-front/0G.png";
import zeroY from "../assets/cards-front/0Y.png";
import zeroR from "../assets/cards-front/0R.png";
import oneB from "../assets/cards-front/1B.png";
import oneG from "../assets/cards-front/1G.png";
import oneY from "../assets/cards-front/1Y.png";
import oneR from "../assets/cards-front/1R.png";
import twoB from "../assets/cards-front/2B.png";
import twoG from "../assets/cards-front/2G.png";
import twoY from "../assets/cards-front/2Y.png";
import twoR from "../assets/cards-front/2R.png";
import threeB from "../assets/cards-front/3B.png";
import threeG from "../assets/cards-front/3G.png";
import threeY from "../assets/cards-front/3Y.png";
import threeR from "../assets/cards-front/3R.png";
import fourB from "../assets/cards-front/4B.png";
import fourG from "../assets/cards-front/4G.png";
import fourY from "../assets/cards-front/4Y.png";
import fourR from "../assets/cards-front/4R.png";
import fiveB from "../assets/cards-front/5B.png";
import fiveG from "../assets/cards-front/5G.png";
import fiveY from "../assets/cards-front/5Y.png";
import fiveR from "../assets/cards-front/5R.png";
import sixB from "../assets/cards-front/6B.png";
import sixG from "../assets/cards-front/6G.png";
import sixY from "../assets/cards-front/6Y.png";
import sixR from "../assets/cards-front/6R.png";
import seventhB from "../assets/cards-front/7B.png";
import seventhG from "../assets/cards-front/7G.png";
import seventhY from "../assets/cards-front/7Y.png";
import seventhR from "../assets/cards-front/7R.png";
import eightB from "../assets/cards-front/8B.png";
import eightG from "../assets/cards-front/8G.png";
import eightY from "../assets/cards-front/8Y.png";
import eightR from "../assets/cards-front/8R.png";
import nineB from "../assets/cards-front/9B.png";
import nineG from "../assets/cards-front/9G.png";
import nineY from "../assets/cards-front/9Y.png";
import nineR from "../assets/cards-front/9R.png";
import Swal from "sweetalert2";

let socket;
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

  useEffect(() => {
    if (!room) {
      console.error("Room code not provided in query parameters");
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

  const cardImages = {
    "0B": zeroB,
    "0G": zeroG,
    "0R": zeroR,
    "0Y": zeroY,
    "1B": oneB,
    "1G": oneG,
    "1R": oneR,
    "1Y": oneY,
    "2B": twoB,
    "2G": twoG,
    "2R": twoR,
    "2Y": twoY,
    "3B": threeB,
    "3G": threeG,
    "3R": threeR,
    "3Y": threeY,
    "4B": fourB,
    "4G": fourG,
    "4R": fourR,
    "4Y": fourY,
    "5B": fiveB,
    "5G": fiveG,
    "5R": fiveR,
    "5Y": fiveY,
    "6B": sixB,
    "6G": sixG,
    "6R": sixR,
    "6Y": sixY,
    "7B": seventhB,
    "7G": seventhG,
    "7R": seventhR,
    "7Y": seventhY,
    "8B": eightB,
    "8G": eightG,
    "8R": eightR,
    "8Y": eightY,
    "9B": nineB,
    "9G": nineG,
    "9R": nineR,
    "9Y": nineY,
  };
  const [gameOver, setGameOver] = useState(true);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState("");
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [playedCardsPile, setPlayedCardsPile] = useState([]);
  const [drawCardPile, setDrawCardPile] = useState([]);

  const [isChatBoxHidden, setChatBoxHidden] = useState(true);
  const [isUnoButtonPressed, setUnoButtonPressed] = useState(false);

  useEffect(() => {
    const shuffledCards = shuffleArray(PACK_OF_CARDS);

    const player1Deck = shuffledCards.splice(0, 7);

    const player2Deck = shuffledCards.splice(0, 7);

    let startingCardIndex;
    while (true) {
      startingCardIndex = Math.floor(Math.random() * 80);
      break;
    }

    const playedCardsPile = shuffledCards.splice(startingCardIndex, 1);

    const drawCardPile = shuffledCards;

    socket.emit("initGameState", {
      gameOver: false,
      turn: "Player 1",
      player1Deck: player1Deck ? [...player1Deck] : [],
      player2Deck: player2Deck ? [...player2Deck] : [],
      currentColor:
        playedCardsPile && playedCardsPile.length > 0
          ? playedCardsPile[0].charAt(playedCardsPile[0].length - 1)
          : "",
      currentNumber:
        playedCardsPile && playedCardsPile.length > 0
          ? playedCardsPile[0].charAt(0)
          : "",
      playedCardsPile: playedCardsPile ? [...playedCardsPile] : [],
      drawCardPile: drawCardPile ? [...drawCardPile] : [],
    });
  }, []);

  useEffect(() => {
    socket.on(
      "initGameState",
      ({
        gameOver,
        turn,
        player1Deck,
        player2Deck,
        currentColor,
        currentNumber,
        playedCardsPile,
        drawCardPile,
      }) => {
        setGameOver(gameOver);
        setTurn(turn);
        setPlayer1Deck(player1Deck);
        setPlayer2Deck(player2Deck);
        setCurrentColor(currentColor);
        setCurrentNumber(currentNumber);
        setPlayedCardsPile(playedCardsPile);
        setDrawCardPile(drawCardPile);
      }
    );

    socket.on(
      "updateGameState",
      ({
        gameOver,
        winner,
        turn,
        player1Deck,
        player2Deck,
        currentColor,
        currentNumber,
        playedCardsPile,
        drawCardPile,
      }) => {
        gameOver && setGameOver(gameOver);
        winner && setWinner(winner);
        turn && setTurn(turn);
        player1Deck && setPlayer1Deck(player1Deck);
        player2Deck && setPlayer2Deck(player2Deck);
        currentColor && setCurrentColor(currentColor);
        currentNumber && setCurrentNumber(currentNumber);
        playedCardsPile && setPlayedCardsPile(playedCardsPile);
        drawCardPile && setDrawCardPile(drawCardPile);
        setUnoButtonPressed(false);
      }
    );

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

  const checkGameOver = (arr) => {
    return arr.length === 1;
  };

  const checkWinner = (arr, player) => {
    return arr.length === 1 ? player : "";
  };

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

  const HandleOnCardPlayed = (played_card) => {
    const cardPlayedBy = turn;
    switch (played_card) {
      case "0R":
      case "1R":
      case "2R":
      case "3R":
      case "4R":
      case "5R":
      case "6R":
      case "7R":
      case "8R":
      case "9R":
      case "0G":
      case "1G":
      case "2G":
      case "3G":
      case "4G":
      case "5G":
      case "6G":
      case "7G":
      case "8G":
      case "9G":
      case "0B":
      case "1B":
      case "2B":
      case "3B":
      case "4B":
      case "5B":
      case "6B":
      case "7B":
      case "8B":
      case "9B":
      case "0Y":
      case "1Y":
      case "2Y":
      case "3Y":
      case "4Y":
      case "5Y":
      case "6Y":
      case "7Y":
      case "8Y":
      case "9Y": {
        const numberOfPlayedCard = played_card.charAt(0);
        const colorOfPlayedCard = played_card.charAt(played_card.length - 1);
        if (currentColor === colorOfPlayedCard) {
          console.log("colors matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(played_card);
            if (player1Deck.length === 2 && !isUnoButtonPressed) {
              Swal.fire({
                icon: "error",
                title:
                  "Oops! You forgot to press UNO. You drew 1 cards as penalty.",
              });
              const copiedDrawCardPileArray = [...drawCardPile];
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer1Deck = [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ];
              updatedPlayer1Deck.push(drawCard1);
              updatedPlayer1Deck.push(drawCard2);
              socket.emit("updateGameState", {
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                turn: "Player 2",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [...updatedPlayer1Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              socket.emit("updateGameState", {
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                turn: "Player 2",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, removeIndex),
                  ...player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              });
            }
          } else {
            const removeIndex = player2Deck.indexOf(played_card);
            if (player2Deck.length === 2 && !isUnoButtonPressed) {
              Swal.fire({
                icon: "error",
                title:
                  "Oops! You forgot to press UNO. You drew 1 cards as penalty.",
              });

              const copiedDrawCardPileArray = [...drawCardPile];
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer2Deck = [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ];
              updatedPlayer2Deck.push(drawCard1);
              updatedPlayer2Deck.push(drawCard2);
              socket.emit("updateGameState", {
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                turn: "Player 1",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [...updatedPlayer2Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              socket.emit("updateGameState", {
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                turn: "Player 1",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, removeIndex),
                  ...player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              });
            }
          }
        } else if (currentNumber === numberOfPlayedCard) {
          console.log("numbers matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(played_card);
            if (player1Deck.length === 2 && !isUnoButtonPressed) {
              Swal.fire({
                icon: "error",
                title:
                  "Oops! You forgot to press UNO. You drew 1 cards as penalty.",
              });
              const copiedDrawCardPileArray = [...drawCardPile];
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer1Deck = [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ];
              updatedPlayer1Deck.push(drawCard1);
              updatedPlayer1Deck.push(drawCard2);
              socket.emit("updateGameState", {
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                turn: "Player 2",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [...updatedPlayer1Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              socket.emit("updateGameState", {
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                turn: "Player 2",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, removeIndex),
                  ...player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              });
            }
          } else {
            const removeIndex = player2Deck.indexOf(played_card);
            if (player2Deck.length === 2 && !isUnoButtonPressed) {
              Swal.fire({
                icon: "error",
                title:
                  "Oops! You forgot to press UNO. You drew 1 cards as penalty.",
              });
              const copiedDrawCardPileArray = [...drawCardPile];
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer2Deck = [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ];
              updatedPlayer2Deck.push(drawCard1);
              updatedPlayer2Deck.push(drawCard2);
              socket.emit("updateGameState", {
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                turn: "Player 1",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [...updatedPlayer2Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              socket.emit("updateGameState", {
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                turn: "Player 1",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, removeIndex),
                  ...player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              });
            }
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Invalid Move! Tolol.",
          });
        }
        break;
      }
    }
  };

  const handleOnCardDraw = () => {
    const cardDrawnBy = turn;
    if (cardDrawnBy === "Player 1") {
      const copiedDrawCardPileArray = [...drawCardPile];
      const drawCard = copiedDrawCardPileArray.pop();
      const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
      let numberOfDrawnCard = drawCard.charAt(0);
      if (
        numberOfDrawnCard === currentNumber ||
        colorOfDrawnCard === currentColor
      ) {
        Swal.fire({
          title: `You drew ${drawCard}. It was played for you.`,
          icon: "success",
        });
        socket.emit("updateGameState", {
          turn: "Player 2",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          currentColor: colorOfDrawnCard,
          currentNumber: numberOfDrawnCard,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      } else {
        socket.emit("updateGameState", {
          turn: "Player 2",
          player1Deck: [
            ...player1Deck.slice(0, player1Deck.length),
            drawCard,
            ...player1Deck.slice(player1Deck.length),
          ],
          drawCardPile: [...copiedDrawCardPileArray],
        });
      }
    } else {
      const copiedDrawCardPileArray = [...drawCardPile];
      const drawCard = copiedDrawCardPileArray.pop();
      const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
      let numberOfDrawnCard = drawCard.charAt(0);
      if (
        numberOfDrawnCard === currentNumber ||
        colorOfDrawnCard === currentColor
      ) {
        Swal.fire({
          icon: "success",
          title: `You drew ${drawCard}. It was played for you.`,
        });

        socket.emit("updateGameState", {
          turn: "Player 1",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          currentColor: colorOfDrawnCard,
          currentNumber: numberOfDrawnCard,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      } else {
        socket.emit("updateGameState", {
          turn: "Player 1",
          player2Deck: [
            ...player2Deck.slice(0, player2Deck.length),
            drawCard,
            ...player2Deck.slice(player2Deck.length),
          ],
          drawCardPile: [...copiedDrawCardPileArray],
        });
      }
    }
  };

  const midleCardP1 = `/src/assets/cards-front/${
    playedCardsPile[playedCardsPile.length - 1]
  }.png`;
  const midleCardP2 = `/src/assets/cards-front/${
    playedCardsPile[playedCardsPile.length - 1]
  }.png`;

  return (
    <div>
      {!roomFull ? (
        <>
          <div className="topInfo">
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
              {gameOver ? (
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
                      <div
                        className="player2Deck"
                        style={{ pointerEvents: "none" }}
                      >
                        <p className="playerDeckText">Player 2</p>
                        {player2Deck.map((item, i) => (
                          <img
                            key={i}
                            className="Card"
                            onClick={() => HandleOnCardPlayed(item)}
                            src={backcard}
                          />
                        ))}
                        {turn === "Player 2"}
                      </div>
                      <br />
                      <div
                        className="middleInfo"
                        style={
                          turn === "Player 2" ? { pointerEvents: "none" } : null
                        }
                      >
                        <button
                          className="game-button"
                          disabled={turn !== "Player 1"}
                          onClick={handleOnCardDraw}
                        >
                          DRAW CARD
                        </button>
                        {playedCardsPile && playedCardsPile.length > 0 && (
                          <img
                            className="Card"
                            src={midleCardP1}
                            alt={playedCardsPile[playedCardsPile.length - 1]}
                          />
                        )}
                        <button
                          className="game-button orange"
                          disabled={player1Deck.length !== 2}
                          onClick={() => {
                            setUnoButtonPressed(!isUnoButtonPressed);
                          }}
                        >
                          UNO
                        </button>
                      </div>
                      <br />
                      <div
                        className="player1Deck"
                        style={
                          turn === "Player 1" ? null : { pointerEvents: "none" }
                        }
                      >
                        <p className="playerDeckText">Player 1</p>
                        {player1Deck.map((item, i) => (
                          <img
                            key={i}
                            className="Card"
                            onClick={() => HandleOnCardPlayed(item)}
                            src={cardImages[item]}
                            alt={item}
                          />
                        ))}
                      </div>

                      <div className="chatBoxWrapper">
                        <div className="chat-box chat-box-player1">
                          <div className="chat-head">
                            <h2 className="text-xl ml-2">Chat Box</h2>
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
                      <div
                        className="player1Deck"
                        style={{ pointerEvents: "none" }}
                      >
                        <p className="playerDeckText">Player 1</p>
                        {player1Deck.map((item, i) => (
                          <img
                            key={i}
                            className="Card"
                            onClick={() => HandleOnCardPlayed(item)}
                            src={backcard}
                          />
                        ))}
                        {turn === "Player 1"}
                      </div>
                      <br />
                      <div
                        className="middleInfo"
                        style={
                          turn === "Player 1" ? { pointerEvents: "none" } : null
                        }
                      >
                        <button
                          className="game-button"
                          disabled={turn !== "Player 2"}
                          onClick={handleOnCardDraw}
                        >
                          DRAW CARD
                        </button>
                        {playedCardsPile && playedCardsPile.length > 0 && (
                          <img className="Card" src={midleCardP2} />
                        )}
                        <button
                          className="game-button orange"
                          disabled={player2Deck.length !== 2}
                          onClick={() => {
                            setUnoButtonPressed(!isUnoButtonPressed);
                          }}
                        >
                          UNO
                        </button>
                      </div>
                      <br />
                      <div
                        className="player2Deck"
                        style={
                          turn === "Player 1" ? { pointerEvents: "none" } : null
                        }
                      >
                        <p className="playerDeckText">Player 2</p>
                        {player2Deck.map((item, i) => (
                          <img
                            key={i}
                            className="Card"
                            onClick={() => HandleOnCardPlayed(item)}
                            src={cardImages[item]}
                          />
                        ))}
                      </div>

                      <div className="chatBoxWrapper">
                        <div className="chat-box chat-box-player1">
                          <div className="chat-head">
                            <h2 className="text-xl ml-2">Chat Box</h2>
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
