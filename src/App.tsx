import React, { useState } from 'react';
import './App.css';

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  isWinnerSquare?: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onSquareClick, isWinnerSquare }) => {
  return (
    <button
      className={`square ${isWinnerSquare ? 'winner' : ''}`}
      onClick={onSquareClick}
      aria-label={`Square ${value}`}
    >
      {value}
    </button>
  );
};

interface BoardProps {
  xIsNext: boolean;
  squares: Array<string | null>;
  onPlay: (nextSquares: Array<string | null>) => void;
  winnerLine?: number[] | null;
}

const Board: React.FC<BoardProps> = ({ xIsNext, squares, onPlay, winnerLine }) => {
  const handleClick = (i: number) => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  };

  const renderSquare = (i: number) => {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinnerSquare={winnerLine !== null && winnerLine !== undefined && winnerLine.includes(i)}
      />
    );
  };

  return (
    <>
      <div className="board-row">
        {[0, 1, 2].map((i) => renderSquare(i))}
      </div>
      <div className="board-row">
        {[3, 4, 5].map((i) => renderSquare(i))}
      </div>
      <div className="board-row">
        {[6, 7, 8].map((i) => renderSquare(i))}
      </div>
    </>
  );
};

interface GameProps {}

const Game: React.FC<GameProps> = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares: Array<string | null>) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove);
  };

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const winner = calculateWinner(currentSquares);
  let status;
  let winnerLine;

  if (winner) {
    status = 'Winner: ' + winner;
    winnerLine = calculateWinnerLine(currentSquares);
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winnerLine={winnerLine}
        />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

function calculateWinner(squares: Array<string | null>): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] as string;
    }
  }
  return null;
}

function calculateWinnerLine(squares: Array<string | null>): number[] | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

export default Game;
