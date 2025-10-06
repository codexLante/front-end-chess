import { useEffect, useState } from "react"
import "../css/index.css"
import ChessPieces from "../pieces"
// import chooseRandomMove from "./aiLogic";
import compBackground from "../assets/jason-leung-1DjbGRDh7-E-unsplash.jpg";
import playerBackground from "../assets/mesh-9iY3Sqr1UWY-unsplash.jpg";
import axios from "axios";




function ChessBoard({playerName,userId}) {
const generateInitialPieces = () => {
  const initialPieces = {};
  const backRow = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

  for (let x = 0; x < 8; x++) {

    initialPieces[`${x},0`] = `blue-${backRow[x]}`;
    initialPieces[`${x},1`] = "blue-pawn";
    

    initialPieces[`${x},6`] = "white-pawn";
    initialPieces[`${x},7`] = `white-${backRow[x]}`;
  }

  return initialPieces;
};
  const [pieces, setPieces] = useState(generateInitialPieces());
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [turn, setTurn] = useState("white");
  const [gameId, setGameId] = useState(null);
  const [hasCreatedGame, setHasCreatedGame] = useState(false)


  const coordKey = (x, y) => `${x},${y}`;
 const token = localStorage.getItem("access_token"); 

useEffect(() => {
  if (hasCreatedGame) return;
  
  if (!token) {
    console.error("No token found");
    return;
  }
  
  if (!userId) {
    console.error("No userId found");
    return;
  }

  console.log("Creating game for user:", userId);

  axios({
    method: "POST",
    url: "http://127.0.0.1:5000/game/create",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: { user_id: userId }
  })
  .then((res) => {
    const gameId = res?.data?.game_id;
    const message = res?.data?.message;
    const gameState = res?.data?.game_state;

    console.log(message === "New game created" ? "Game created:" : "Existing game resumed:", gameId);
    
    setGameId(gameId);
    setHasCreatedGame(true);

    if (gameState) {
      try {
        const parsedState = JSON.parse(gameState);
        const loadedPieces = {};
        
        parsedState.forEach(piece => {
          const key = `${piece.x},${piece.y}`;
          const value = `${piece.color}-${piece.type.toLowerCase()}`;
          loadedPieces[key] = value;
        });
        
        console.log("Loaded pieces from backend:", loadedPieces);
        setPieces(loadedPieces);
      } catch (error) {
        console.error("Error loading game state:", error);
        setPieces(generateInitialPieces());
      }
    }
  })
  .catch((e) => {
    console.error("Error creating game:", e.response?.data || e.message);
  });
}, [hasCreatedGame, token, userId]);

  const getBoardState = () => {
    return Object.entries(pieces)
      .filter(([, value]) => value && typeof value === "string" && value.includes("-"))
      .map(([key, value]) => {
        const [x, y] = key.split(",").map(Number);
        const [color, type] = value.split("-");
        return { x, y, color, type };
      });
  };

const handleSelectPiece = (position, moves) => {
  if (turn !== "white") return;

  if (!position) {
    setSelectedPosition(null);
    setValidMoves([]);
    return;
  }

  const fromKey = coordKey(position.x, position.y);
  const rawPiece = pieces[fromKey];
  const [color] = rawPiece ? rawPiece.split("-") : [];

  if (color !== turn) {
    setSelectedPosition(null);
    setValidMoves([]);
    return;
  }

  setSelectedPosition(position);
  setValidMoves(moves || []);
};


  // const handleAITurn = () => {
  //   const boardState = getBoardState();
  //   const aiMove = chooseRandomMove(boardState, "blue");

  //   if (!aiMove) return;

  //   const fromKey = coordKey(aiMove.from.x, aiMove.from.y);
  //   const toKey = coordKey(aiMove.to.x, aiMove.to.y);
  //   const movingPiece = pieces[fromKey];

  //   if (!movingPiece || !movingPiece.startsWith("blue-")) return;

  //   setPieces(prev => {
  //     const updated = { ...prev };
  //     updated[toKey] = updated[fromKey];
  //     delete updated[fromKey];
  //     return updated;
  //   });

  //   setSelectedPosition(null);
  //   setValidMoves([]);
  //   setTurn("white");
  // };



const handleMovePiece = (targetCoords) => {
  if (!selectedPosition) return;

  console.log("Moving from", selectedPosition, "to", targetCoords);

  axios({
    method: "POST",
    url: `http://127.0.0.1:5000/move/${gameId}`,
    headers: {
    Authorization: `Bearer ${token}`
    },
    data: {
      player: "white",
      from_x: selectedPosition.x + 1,
      from_y: selectedPosition.y + 1,
      to_x: targetCoords.x + 1,
      to_y: targetCoords.y + 1
    }
  })
  .then((res) => {
    console.log("backend response:", res.data);
    
    const gameState = res?.data?.game_state;
    const currentTurn = res?.data?.current_turn;
    const playerMove = res?.data?.player_move;
    const aiTurnNext = res?.data?.ai_turn_next;

    console.log("Player move:", playerMove);

    if (gameState) {
      try {
        const parsedState = JSON.parse(gameState);
        const newPieces = {};
        parsedState.forEach(piece => {
          const key = `${piece.x},${piece.y}`;
          const value = `${piece.color}-${piece.type.toLowerCase()}`;
          newPieces[key] = value;
        });

        setPieces(newPieces);
        setTurn(currentTurn);
        setSelectedPosition(null);
        setValidMoves([]);
      } catch (error) {
        console.error("Error parsing game state:", error);
        console.error("Game state string:", gameState);
      }
    } else {
      console.error("No game state in response");
    }

if (aiTurnNext) {
  console.log("Scheduling AI move...");

  setTimeout(() => {
    axios({
      method: "POST",
      url: `http://127.0.0.1:5000/move/${gameId}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        player: "blue"
      }
    })
      .then((aiRes) => {
        console.log("AI move response:", aiRes.data);
        const aiGameState = aiRes.data.game_state;
        const aiCurrentTurn = aiRes.data.current_turn;

        try {
          const parsedAIState = JSON.parse(aiGameState);
          const updatedPieces = {};
          parsedAIState.forEach(piece => {
            const key = `${piece.x},${piece.y}`;
            const value = `${piece.color}-${piece.type.toLowerCase()}`;
            updatedPieces[key] = value;
          });

          setPieces(updatedPieces);
          setTurn(aiCurrentTurn);
        } catch (error) {
          console.error("Error parsing AI game state:", error);
        }
      })
      .catch((err) => {
        console.error("AI move failed:", err.response?.data?.error || err.message);
      });
  }, 5000);
  }
  })
  .catch((error) => {
    console.error("Move failed:", error);
    console.error("Error response:", error.response?.data);
    setSelectedPosition(null);
    setValidMoves([]);
  });
};



  const handleTileClick = (coords) => {
    if (turn !== "white") return;
    if (!selectedPosition || !validMoves.length) return;

    const validMove = validMoves.find(move => move.x === coords.x && move.y === coords.y);
    if (validMove) {
      handleMovePiece(coords);
    }
  };

  const boardState = getBoardState();
  const renderBoard = () => {
    const board = [];

  
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const key = coordKey(x, y);
        const tileColor = (x + y) % 2 === 0 ? "white-tile" : "blue-tile";
        const isSelectedTile = selectedPosition?.x === x && selectedPosition?.y === y;
        const hasValidMove = validMoves.some(move => move.x === x && move.y === y);
        const moveType = hasValidMove ? validMoves.find(move => move.x === x && move.y === y)?.type : null;

        board.push(
          <div
            key={key}
            className={`tile ${tileColor} ${hasValidMove ? "valid-move" : ""} ${isSelectedTile ? "selected-tile" : ""}`}
            onClick={() => handleTileClick({ x, y })}
          >
            <ChessPieces
              piece={pieces[key]}
              position={{ x, y }}
              board={boardState}
              selectedPosition={selectedPosition}
              validMoves={validMoves}
              onSelect={handleSelectPiece}
              onMove={handleMovePiece}
            />
            {hasValidMove && <div className={`move-indicator ${moveType}`} />}
            <div className="coordinates">[{x},{y}]</div>
          </div>
        );
      }
    }

    return board;
  };

  return (
    <div className="game-container">
      <div className="player-label top-player">
        <img src={compBackground} alt="Computer" className="player-icon" />
        <span className="player-tag">Player 2 (Computer)</span>
      </div>

      <div className="gameboard">{renderBoard()}</div>

      <div className="player-label bottom-player">
        <img src={playerBackground} alt="You" className="player-icon" />
        <span className="player-tag">Player 1 ({playerName})</span>
      </div>
    </div>
  );
}

export default ChessBoard;