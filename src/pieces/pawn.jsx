import whitePawn from '../assets/wp.png';
import bluePawn from '../assets/bp.png';

const isOnBoard = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

const isEmpty = (x, y, board) => !board.some(p => p.x === x && p.y === y);

const isEnemy = (x, y, board, color) => {
  const p = board.find(p => p.x === x && p.y === y);
  return p && p.color !== color;
};

function calculateValidMoves(position, board, color) {
  const direction = color === 'white' ? 1 : -1;
  const startRow = color === 'white' ? 1 : 6;
  const promotionRow = color === 'white' ? 7 : 0;

  const { x, y } = position;
  const moves = [];

  const oneStepY = y + direction;
  const twoStepY = y + 2 * direction;

  if (isOnBoard(x, oneStepY) && isEmpty(x, oneStepY, board)) {
    const type = oneStepY === promotionRow ? 'promotion-move' : 'move';
    moves.push({ x, y: oneStepY, type });

    if (y === startRow && isOnBoard(x, twoStepY) && isEmpty(x, twoStepY, board)) {
      moves.push({ x, y: twoStepY, type: 'move' });
    }
  }

  [-1, 1].forEach(dx => {
    const newX = x + dx;
    const newY = y + direction;

    if (isOnBoard(newX, newY) && isEnemy(newX, newY, board, color)) {
      const type = newY === promotionRow ? 'promotion-capture' : 'capture';
      moves.push({ x: newX, y: newY, type });
    }

    const last = board.lastMove;
    if (
      last &&
      last.piece === (color === 'white' ? 'blue-pawn' : 'white-pawn') &&
      last.from.y === (color === 'white' ? 6 : 1) &&
      last.to.y === (color === 'white' ? 4 : 3) &&
      last.to.x === newX &&
      y === (color === 'white' ? 4 : 3)
    ) {
      moves.push({ x: newX, y: newY, type: 'en-passant' });
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
