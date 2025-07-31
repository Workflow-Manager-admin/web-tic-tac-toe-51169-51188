import React, { useState } from 'react';
import './App.css';

// Color variables for theme (aligned with project, see also App.css)
const PRIMARY_COLOR = '#1976d2';
const ACCENT_COLOR = '#e91e63';
const SECONDARY_COLOR = '#ffffff';

// PUBLIC_INTERFACE
function App() {
  // State for the board (9 squares)
  const [squares, setSquares] = useState(Array(9).fill(null));
  // true = X's turn; false = O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // State to track move history
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  // Step index of current move
  const [stepNumber, setStepNumber] = useState(0);

  // PUBLIC_INTERFACE
  // Helper: find winner and line
  function calculateWinner(squares) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6] // diags
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  }

  const current = history[stepNumber];
  const result = calculateWinner(current.squares);
  const winner = result ? result.winner : null;
  const isDraw = !winner && current.squares.every(Boolean);

  // PUBLIC_INTERFACE
  // On square click
  function handleClick(i) {
    // if already winner or already filled or not current step, ignore
    if (winner || current.squares[i] || stepNumber !== history.length - 1) {
      return;
    }
    const nextSquares = current.squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    const nextHistory = history.slice(0, stepNumber + 1);
    setHistory(nextHistory.concat([{ squares: nextSquares }]));
    setStepNumber(nextHistory.length);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  // Reset game
  function handleReset() {
    setSquares(Array(9).fill(null));
    setHistory([{ squares: Array(9).fill(null) }]);
    setStepNumber(0);
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE
  // Jump to move for basic move history
  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  // Generate status message
  let status;
  if (winner) {
    status = (
      <span style={{ color: ACCENT_COLOR }}>
        Winner: {winner} 🎉
      </span>
    );
  } else if (isDraw) {
    status = (
      <span style={{ color: PRIMARY_COLOR }}>Draw! 🤝</span>
    );
  } else {
    status = (
      <span>
        Next player: <span style={{ color: PRIMARY_COLOR }}>{xIsNext ? 'X' : 'O'}</span>
      </span>
    );
  }

  // Make bolded colored cell if part of win line
  const winLine = result ? result.line : [];

  return (
    <div
      className="ttt-root"
      style={{
        minHeight: '100vh',
        backgroundColor: SECONDARY_COLOR,
        color: PRIMARY_COLOR,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui,sans-serif'
      }}
    >
      <div>
        <h1 style={{
          fontWeight: 700,
          letterSpacing: '1px',
          fontSize: '2.2rem',
          color: PRIMARY_COLOR,
          marginBottom: 0,
        }}>
          Tic Tac Toe
        </h1>
        <div style={{ margin: '10px 0 32px 0', fontSize: '1.15rem', color: '#333' }}>
          Classic player-vs-player game
        </div>
      </div>
      {/* Game board */}
      <Board
        squares={current.squares}
        onClick={handleClick}
        winLine={winLine}
      />
      {/* Controls / Status */}
      <div style={{
        width: 320,
        marginTop: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.2rem', marginBottom: 10, minHeight: 32 }}>
          {status}
        </div>
        <button
          onClick={handleReset}
          style={{
            background: PRIMARY_COLOR,
            color: SECONDARY_COLOR,
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.09)',
            marginBottom: 20,
            marginTop: 4,
            transition: 'background 0.2s'
          }}
        >
          Restart Game
        </button>
        <div style={{ width: '100%', fontSize: 14, color: '#555', textAlign: 'left' }}>
          <MoveHistory
            history={history}
            jumpTo={jumpTo}
            stepNumber={stepNumber}
          />
        </div>
      </div>
      <footer style={{
        marginTop: 33,
        color: '#666',
        fontSize: 12,
        opacity: 0.65,
      }}>
        Built with <span style={{color: ACCENT_COLOR}}>React</span> &middot; Enjoy playing!
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onClick, winLine }) {
  // Render a 3x3 grid
  function renderSquare(i) {
    // Highlight if in winline
    const isWin = winLine.includes(i);
    return (
      <button
        key={i}
        className="ttt-square"
        style={{
          width: 84,
          height: 84,
          border: `2.5px solid ${isWin ? '#e91e63' : '#e0e0e0'}`,
          background: SECONDARY_COLOR,
          color: squares[i] === 'X' ? PRIMARY_COLOR : squares[i] === 'O' ? ACCENT_COLOR : '#bbb',
          fontSize: 40,
          fontWeight: isWin ? 900 : 700,
          borderRadius: 12,
          margin: 4,
          transition: 'all 0.2s cubic-bezier(.4,0,.2,1)'
        }}
        onClick={() => onClick(i)}
        aria-label={`cell ${i%3+1},${Math.floor(i/3)+1}${squares[i] ? ' - filled' : ''}`}
      >
        {squares[i]}
      </button>
    );
  }
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 0 16px rgba(25,118,210,0.07)'
    }}>
      {[0,3,6].map(row =>
        <div key={row} style={{ display: 'flex' }}>
          { [0,1,2].map(col => renderSquare(row + col)) }
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function MoveHistory({ history, jumpTo, stepNumber }) {
  // Only show if more than starting move
  return (
    <div>
      <div style={{ fontWeight: 600, margin: '10px 0 2px 2px' }}>Move History:</div>
      <ol style={{ margin: 0, paddingLeft: 18, listStyle: 'decimal' }}>
        {history.map((_, move) => {
          const desc = move ?
            'Go to move #' + move :
            'Go to game start';
          return (
            <li key={move} style={{marginBottom: 3}}>
              <button
                onClick={() => jumpTo(move)}
                style={{
                  background: move === stepNumber ? ACCENT_COLOR : 'transparent',
                  color: move === stepNumber ? SECONDARY_COLOR : '#444',
                  fontWeight: move === stepNumber ? 700 : 500,
                  border: 'none',
                  borderRadius: 6,
                  padding: '3px 9px',
                  cursor: move === stepNumber ? 'default' : 'pointer',
                  fontSize: 13,
                  outline: 'none',
                  marginLeft: -5,
                  marginRight: 2,
                  transition: 'all 0.14s'
                }}
                disabled={move === stepNumber}
                tabIndex="0"
                aria-current={move === stepNumber ? "step" : undefined}
              >
                {desc}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  )
}

export default App;
