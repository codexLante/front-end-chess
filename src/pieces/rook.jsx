import blueRook from '../assets/br.png';
import whiteRook from '../assets/wr.png';


const isOnBoard = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

const isSquareEmpty = (x, y, board) => {
  return !board.some(piece => piece.x === x && piece.y === y);
};

const isEnemyPiece = (x, y, board, color) => {
  const piece = board.find(p => p.x === x && p.y === y);
  return piece && piece.color !== color;
};

function calculateValidMoves(position, board, color) {
  const movements = [];
  const { x, y } = position;

  const directions = [
    { dx: 1, dy: 0 },   // right
    { dx: -1, dy: 0 },  // left
    { dx: 0, dy: -1 },  // up
    { dx: 0, dy: 1 }    // down
  ];

  for (let dir of directions) {
    for (let i = 1; i < 8; i++) {
      const newX = x + dir.dx * i;
      const newY = y + dir.dy * i;

      if (!isOnBoard(newX, newY)) break;

      if (isSquareEmpty(newX, newY, board)) {
        movements.push({ x: newX, y: newY, type: "move" });
      } else if (isEnemyPiece(newX, newY, board, color)) {
        movements.push({ x: newX, y: newY, type: "capture" });
        break;
      } else {
        break;
      }
    }
  }

  return movements;
}

function Rook({ position, isSelected, onSelect, board, color }) {
  const handleSelect = () => {
    const moves = calculateValidMoves(position, board, color);
    onSelect(isSelected ? null : position, isSelected ? [] : moves);
  };

  return (
    <div
      className={`chessPiece rook-piece ${color} ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <img
        src={color === 'white' ? whiteRook : blueRook}
        alt={`${color} rook`}
        style={{
          width: '70px',
          height: '70px',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export { Rook, calculateValidMoves };
