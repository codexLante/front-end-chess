import { useEffect, useState } from "react"
import "../css/index.css"
import ChessPieces from "../pieces"
import chooseRandomMove from "./aiLogic";
import compBackground from "../assets/jason-leung-1DjbGRDh7-E-unsplash.jpg";
import playerBackground from "../assets/mesh-9iY3Sqr1UWY-unsplash.jpg";




function ChessBoard({}) {
  const generateInitialPieces = () => {
    const initialPieces = {};
    const backRow = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

    for (let x = 0; x < 8; x++) {
      initialPieces[`${x},7`] = `blue-${backRow[x]}`;
      initialPieces[`${x},6`] = "blue-pawn";
      initialPieces[`${x},0`] = `white-${backRow[x]}`;
      initialPieces[`${x},1`] = "white-pawn";
    }

    return initialPieces;
  };

  const [pieces, setPieces] = useState(generateInitialPieces());
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [turn, setTurn] = useState("white");

  const coordKey = (x, y) => `${x},${y}`;

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


  const handleAITurn = () => {
    const boardState = getBoardState();
    const aiMove = chooseRandomMove(boardState, "blue");

    if (!aiMove) return;

    const fromKey = coordKey(aiMove.from.x, aiMove.from.y);
    const toKey = coordKey(aiMove.to.x, aiMove.to.y);
    const movingPiece = pieces[fromKey];

    if (!movingPiece || !movingPiece.startsWith("blue-")) return;

    setPieces(prev => {
      const updated = { ...prev };
      updated[toKey] = updated[fromKey];
      delete updated[fromKey];
      return updated;
    });

    setSelectedPosition(null);
    setValidMoves([]);
    setTurn("white");
  };

  const handleMovePiece = (targetCoords) => {
    if (!selectedPosition) return;

    const updatedPieces = { ...pieces };
    const fromKey = coordKey(selectedPosition.x, selectedPosition.y);
    const toKey = coordKey(targetCoords.x, targetCoords.y);

    updatedPieces[toKey] = updatedPieces[fromKey];
    delete updatedPieces[fromKey];

    setPieces(updatedPieces);
    setSelectedPosition(null);
    setValidMoves([]);
    setTurn("blue");

    setTimeout(() => {
      handleAITurn();
    }, 500);
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

  for (let y = 7; y >= 0; y--) {
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
        <span className="player-tag">Player 1 (You)</span>
      </div>
    </div>
  );
}

export default ChessBoard;