import blueQueen from '../assets/bq.png';
import whiteQueen from '../assets/wq.png';
import { calculateValidMoves as bishopMoves } from './bishop';
import { calculateValidMoves as rookMoves } from './rook';

function calculateValidMoves(position, board, color) {
  const { x, y } = position;
  const bishop = bishopMoves({ x, y }, board, color);
  const rook = rookMoves({ x, y }, board, color);
  return [...bishop, ...rook];
}

function Queen({ position, isSelected, onSelect, board, color }) {
  const handleSelect = () => {
    const moves = calculateValidMoves(position, board, color);
    onSelect(isSelected ? null : position, isSelected ? [] : moves);
  };

  return (
    <div
      className={`chessPiece queen-piece ${color} ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <img
        src={color === 'white' ? whiteQueen : blueQueen}
        alt={`${color} queen`}
        style={{
          width: '70px',
          height: '70px',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export { Queen, calculateValidMoves };
