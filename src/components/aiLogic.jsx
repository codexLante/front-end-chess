import generateValidMoves from "./moveLogic";

const getAiValidMoves = (color, boardState) => {
  const moves = [];

  boardState.forEach(piece => {
    const validMoves = generateValidMoves(piece, boardState, color);
    validMoves.forEach(move => {
      moves.push({
        from: { x: piece.x, y: piece.y },
        to: { x: move.x, y: move.y },
        type: move.type || "move",
      });
    });
  });

  return moves;
};

const chooseRandomMove = (boardState) => {
  const validMoves = getAiValidMoves("blue", boardState);
  if (!validMoves.length) return null;

  const index = Math.floor(Math.random() * validMoves.length);
  return validMoves[index];
};

export default chooseRandomMove 

