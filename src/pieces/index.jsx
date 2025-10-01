import {Pawn}  from "./pawn";
import {Rook} from "./rook";
import {Knight} from "./knight";
import {Bishop} from "./bishop";
import {Queen} from "./queen";
import {King} from "./king";

const pieceComponents = {
  pawn: Pawn,
  rook: Rook,
  knight:Knight,
  bishop: Bishop,
  queen: Queen,
  king: King
};

function AddingPieces({ piece, position, board, selectedPosition, validMoves, onSelect, onMove }) {
  if (!piece) return null;

  const { x, y } = position;
  const [color, type] = piece.split("-");

  const isSelected =
    selectedPosition &&
    selectedPosition.x === x &&
    selectedPosition.y === y;

  const Component = pieceComponents[type];
  if (!Component) return null;

  return (
    
    <Component
      position={{ x, y }}
      board={board}
      color={color}
      isSelected={isSelected}
      onSelect={onSelect}
      onMove={onMove}
    />
  );
}

export default AddingPieces