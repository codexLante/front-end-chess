import whitePawn from '../assets/wp.png';
import bluePawn from '../assets/bp.png';

const isOnBoard = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

const isEmpty = (x, y, board) => !board.some(p => p.x === x && p.y === y);

const isEnemy = (x, y, board, color) => {
  const p = board.find(p => p.x === x && p.y === y);
  return p && p.color !== color;
};

function calculateValidMoves(position, board, color) {
  // Updated coordinate system:
  // Row 0-1: Blue pieces (top)
  // Row 6-7: White pieces (bottom)
  
  // White moves UP (decreasing Y: 7 -> 6 -> 5...)
  // Blue moves DOWN (increasing Y: 0 -> 1 -> 2...)
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  const promotionRow = color === 'white' ? 0 : 7;

  const { x, y } = position;
  const moves = [];

  // One step forward
  const oneStepY = y + direction;
  if (isOnBoard(x, oneStepY) && isEmpty(x, oneStepY, board)) {
    const type = oneStepY === promotionRow ? 'promotion-move' : 'move';
    moves.push({ x, y: oneStepY, type });

    // Two steps forward from starting position
    const twoStepY = y + 2 * direction;
    if (y === startRow && isOnBoard(x, twoStepY) && isEmpty(x, twoStepY, board)) {
      moves.push({ x, y: twoStepY, type: 'move' });
    }
  }

  // Diagonal captures
  [-1, 1].forEach(dx => {
    const newX = x + dx;
    const newY = y + direction;

    if (isOnBoard(newX, newY) && isEnemy(newX, newY, board, color)) {
      const type = newY === promotionRow ? 'promotion-capture' : 'capture';
      moves.push({ x: newX, y: newY, type });
    }

    // En passant
    const last = board.lastMove;
    if (last) {
      const enemyPawn = color === 'white' ? 'blue-pawn' : 'white-pawn';
      const enemyStartRow = color === 'white' ? 1 : 6;
      const enemyDoubleStepRow = color === 'white' ? 3 : 4;
      const currentRow = color === 'white' ? 3 : 4;

      if (
        last.piece === enemyPawn &&
        last.from.y === enemyStartRow &&
        last.to.y === enemyDoubleStepRow &&
        last.to.x === newX &&
        y === currentRow
      ) {
        moves.push({ x: newX, y: newY, type: 'en-passant' });
      }
    }
  });

  return moves;
}

function Pawn({ position, isSelected, onSelect, board, color }) {
  const handleSelect = () => {
    const moves = calculateValidMoves(position, board, color);
    onSelect(isSelected ? null : position, isSelected ? [] : moves);
  };

  return (
    <div
      className={`chessPiece pawn-piece ${color} ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <img
        src={color === 'white' ? whitePawn : bluePawn}
        alt={`${color} pawn`}
        style={{ width: '70px', height: '70px', pointerEvents: 'none' }}
      />
    </div>
  );
}

export { Pawn, calculateValidMoves };
