import whiteBishop from "../assets/wb .png";
import blueBishop from '../assets/bb.png';


const isOnBoard = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

const isSquareEmpty = (x, y, board) => {
  return !board.some(piece => piece.x === x && piece.y === y);
};

const isEnemyPiece = (x, y, board, color) => {
  const piece = board.find(p => p.x === x && p.y === y);
  return piece && piece.color !== color;
};

function calculateValidMoves(position, board, color) {
  const diagonals = [
    { dx: -1, dy: -1 }, // top-left
    { dx: -1, dy: 1 },  // bottom-left
    { dx: 1, dy: 1 },   // bottom-right
    { dx: 1, dy: -1 }   // top-right
  ];

  const movements = [];
  const x = position.x;
  const y = position.y;

  for (const { dx, dy } of diagonals) {
    let newX = x + dx;
    let newY = y + dy;

    while (isOnBoard(newX, newY)) {
      if (isSquareEmpty(newX, newY, board)) {
        movements.push({ x: newX, y: newY, type: 'move' });
      } else if (isEnemyPiece(newX, newY, board, color)) {
        movements.push({ x: newX, y: newY, type: 'capture' });
        break;
      } else {
        break; 
      }

      newX += dx;
      newY += dy;
    }
  }

  return movements;
}


function Bishop({ position, isSelected, onSelect, board, color }) {
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
      className={`chessPiece bishop-piece ${color} ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <img
        src={color === 'white' ? whiteBishop : blueBishop}
        alt={`${color} bishop`}
        style={{
          width: '70px',
          height: '70px',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export { Bishop, calculateValidMoves };
