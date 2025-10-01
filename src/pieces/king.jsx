import whiteKing from '../assets/wk.png';
import blueKing from '../assets/bk.png';

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

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;

      const newX = x + dx;
      const newY = y + dy;

      if (!isOnBoard(newX, newY)) continue;
      if (isFriendlyPiece(newX, newY, board, color)) continue;

      const type = isEnemyPiece(newX, newY, board, color) ? 'capture' : 'move';
      movements.push({ x: newX, y: newY, type });
    }
  }

  return movements;
}

function King({ position, isSelected, onSelect, board, color }) {
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
      className={`chessPiece king-piece ${color} ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <img
        src={color === 'white' ? whiteKing : blueKing}
        alt={`${color} king`}
        style={{
          width: '70px',
          height: '70px',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export { King, calculateValidMoves };
