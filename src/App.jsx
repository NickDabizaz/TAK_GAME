import React, { useState } from 'react';

const App = () => {
  // Inisialisasi state untuk board
  const [board, setBoard] = useState(Array(5).fill(Array(5).fill({ symbol: null, status: null })));

  // Inisialisasi state untuk pemain
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1, setPlayer1] = useState({ stones: 21, capstones: 1 });
  const [player2, setPlayer2] = useState({ stones: 21, capstones: 1 });

  // State untuk modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);

  // Event handler untuk membuka modal
  const openModal = (row, col) => {
    setSelectedRow(row);
    setSelectedCol(col);
    setModalOpen(true);
  };

  // Event handler untuk menutup modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Event handler untuk memilih status stone atau capstone
  const selectStatus = (status, row, col) => {
    setSelectedStatus(status);
    closeModal();

    // Salin state papan agar tidak merusak mutabilitas
    const newBoard = board.map(row => row.slice());

    // Pemain saat ini
    const currentPlayerInfo = currentPlayer === 1 ? player1 : player2;
    const stoneSymbol = currentPlayer === 1 ? 'w' : 'b';
    const standingStoneSymbol = currentPlayer === 1 ? 'W' : 'B';
    const capstoneSymbol = currentPlayer === 1 ? 'CW' : 'CB';

    // Cek apakah sel sudah terisi
    if (newBoard[row][col].symbol === null && currentPlayerInfo.stones > 0) {
      // Tempatkan stone atau capstone di sel papan yang diklik
      newBoard[row][col] = {
        symbol: status === 'sleeping' ? stoneSymbol : status === 'standing' ? standingStoneSymbol : capstoneSymbol,
        status: status,
      };

      // Kurangi jumlah stone atau capstone pemain
      if (status === 'capstone') {
        currentPlayer === 1
          ? setPlayer1({ ...player1, capstones: player1.capstones - 1 })
          : setPlayer2({ ...player2, capstones: player2.capstones - 1 });
      } else {
        currentPlayer === 1
          ? setPlayer1({ ...player1, stones: player1.stones - 1 })
          : setPlayer2({ ...player2, stones: player2.stones - 1 });
      }

      // Ganti giliran pemain
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

      // Update state papan
      setBoard(newBoard);
    }
  };

  // Menentukan apakah tombol capstone masih aktif atau tidak
  const isCapstoneButtonActive = () => {
    return currentPlayer === 1 ? player1.capstones > 0 : player2.capstones > 0;
  };

  // Tampilkan board
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      {/* Tampilkan informasi pemain dan giliran */}
      <div style={{ marginBottom: '10px' }}>
        <div>
          Player 1: Stones - {player1.stones}, Capstones - {player1.capstones}
        </div>
        <div>
          Player 2: Stones - {player2.stones}, Capstones - {player2.capstones}
        </div>
        <div>
          Current Turn: Player {currentPlayer}
        </div>
      </div>

      {/* Tampilkan board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 50px)', gap: '4px' }}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={cell.symbol === null ? () => openModal(rowIndex, colIndex) : null}
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: cell.symbol === null ? 'pointer' : 'not-allowed',
              }}
            >
              {cell.symbol}
            </div>
          ))
        ))}
      </div>

      {/* Modal untuk memilih status stone atau capstone */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h2>Select Stone or Capstone Status</h2>
            <button onClick={() => selectStatus('sleeping', selectedRow, selectedCol)} style={{ marginRight: '10px' }}>
              Sleeping Stone
            </button>
            <button onClick={() => selectStatus('standing', selectedRow, selectedCol)} style={{ marginRight: '10px' }}>
              Standing Stone
            </button>
            {isCapstoneButtonActive() && (
              <button onClick={() => selectStatus('capstone', selectedRow, selectedCol)}>
                Capstone
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
