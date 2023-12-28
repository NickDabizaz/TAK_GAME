import React, { useState } from 'react';

const App = () => {
  // Inisialisasi state untuk board
  const [board, setBoard] = useState(Array(5).fill(Array(5).fill(null)));
console.log({board});
  return (
    <div>
      {/* Tampilkan board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 50px)', gap: '4px' }}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              {cell}
            </div>
          ))
        ))}
      </div>
    </div>
  );
}

export default App;
