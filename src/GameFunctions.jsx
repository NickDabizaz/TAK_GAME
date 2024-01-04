// GameFunctions.jsx
const openModal = (row, col, setModalOpen, setSelectedRow, setSelectedCol) => {
  setSelectedRow(row);
  setSelectedCol(col);
  setModalOpen(true);
};
  
  const closeModal = (setModalOpen) => {
    setModalOpen(false);
  };
  
  const selectStatus = (status, row, col, setModalOpen, setSelectedRow, setSelectedCol, setBoard, board, currentPlayer, setCurrentPlayer, setPlayer1, setPlayer2, player1, player2) => {
  
    // Menutup modal
    setModalOpen(false);
  
    // Membuat salinan papan
    const newBoard = board.map((row) => row.slice());
  
    // Menentukan simbol pion berdasarkan status dan pemain
    const getSymbol = () => {
      if (status === 'sleeping') {
        return currentPlayer === 1 ? 'w' : 'b';
      } else if (status === 'standing') {
        return currentPlayer === 1 ? 'W' : 'B';
      } else {
        return currentPlayer === 1 ? 'CW' : 'CB';
      }
    };
  
    // Tentukan simbol pion berdasarkan status dan pemain
    const symbol = getSymbol();
  
    // Tambahkan pion ke stack pada sel papan yang diklik
    newBoard[row][col] = [...newBoard[row][col], { symbol, status }];
  
    // Update state papan
    setBoard(newBoard);
  
    // Update state pemain (stone atau capstone)
    if (status === 'sleeping') {
      currentPlayer === 1
        ? setPlayer1({ ...player1, stones: player1.stones - 1 })
        : setPlayer2({ ...player2, stones: player2.stones - 1 });
    } else if (status === 'capstone') {
      currentPlayer === 1
        ? setPlayer1({ ...player1, capstones: player1.capstones - 1 })
        : setPlayer2({ ...player2, capstones: player2.capstones - 1 });
    }
  
    // Ganti giliran pemain
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  
    // Menetapkan baris dan kolom yang dipilih kembali ke null
    setSelectedRow(null);
    setSelectedCol(null);
  };
  
  
  export { openModal, closeModal, selectStatus };
  