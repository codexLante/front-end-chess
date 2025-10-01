import whiteKnight from '../assets/wn.png';
import blueKnight from "../assets/bn .png";

const isOnBoard = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

const isFriendlyPiece = (x, y, board, color) => {
  const piece = board.find(p => p.x === x && p.y === y);
  return piece && piece.color === color;
};

const isEnemyPiece = (x, y, board, color) => {
  const piece = board.find(p => p.x === x && p.y === y);
  return piece && piece.color !== color;
};


function calculateValidMoves(position, board, color) {
  const movements = [];
  const x = position.x;
  const y = position.y;

  const jumps = [
    { dx: 1, dy: 2 },
    { dx: 2, dy: 1 },
    { dx: -1, dy: 2 },
    { dx: -2, dy: 1 },
    { dx: 1, dy: -2 },
    { dx: 2, dy: -1 },
    { dx: -1, dy: -2 },
    { dx: -2, dy: -1 },
  ];

  for (let i = 0; i < jumps.length; i++) {
    const newX = x + jumps[i].dx;
    const newY = y + jumps[i].dy;
    if (!isOnBoard(newX, newY)) continue;
    if (isFriendlyPiece(newX, newY, board, color)) continue;

    const type = isEnemyPiece(newX, newY, board, color) ? 'capture' : 'move';
    movements.push({ x: newX, y: newY, type });
  }

  return movements;
}

function Knight({ position, isSelected, onSelect, board, color }) {
  const handleSelect = () => {
    if (isSelected) {
      onSelect(null, []);
    } else {
      const moves = calculateValidMoves(position, board, color);
      onSelect(position, moves);
    }
  };

  return (
    <div
      className={`chessPiece knight-piece ${color} ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <img
        src={color === 'white' ? whiteKnight : blueKnight}
        alt={`${color} knight`}
        style={{
          width: '70px',
          height: '70px',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export { Knight, calculateValidMoves };
