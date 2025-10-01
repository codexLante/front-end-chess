
import { calculateValidMoves as rookMoves } from "../pieces/rook";
import { calculateValidMoves as queenMoves } from "../pieces/queen";
import { calculateValidMoves as knightMoves } from "../pieces/knight";
import { calculateValidMoves as pawnMoves } from "../pieces/pawn";
import { calculateValidMoves as kingMoves} from "../pieces/king";
import { calculateValidMoves as bishopMoves} from "../pieces/bishop";


const pieceLogic= {
  bishop: bishopMoves,
  rook: rookMoves,
  queen: queenMoves,
  knight: knightMoves,
  pawn: pawnMoves,
  king: kingMoves,
};


const generateValidMoves = (piece, board, color) => {
  if (piece.color !== color) return [];

  const position = { x: piece.x, y: piece.y };
  const logicFunction = pieceLogic[piece.type];

  return logicFunction ? logicFunction(position, board, color) : [];
};

export default generateValidMoves