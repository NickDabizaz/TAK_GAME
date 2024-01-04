// GameFunctions.jsx
const openModal = (row, col, setModalOpen, setSelectedRow, setSelectedCol) => {
  setSelectedRow(row);
  setSelectedCol(col);
  setModalOpen(true);
};

const closeModal = (setModalOpen) => {
  setModalOpen(false);
};

const selectStatus = (
  status,
  row,
  col,
  setModalOpen,
  setSelectedRow,
  setSelectedCol,
  setBoard,
  board,
  currentPlayer,
  setCurrentPlayer,
  setPlayer1,
  setPlayer2,
  player1,
  player2
) => {
  // Menutup modal
  setModalOpen(false);

  // Membuat salinan papan
  const newBoard = board.map((row) => row.slice());

  // Menentukan simbol pion berdasarkan status dan pemain
  const getSymbol = () => {
    if (status === "sleeping") {
      return currentPlayer === 1 ? "w" : "b";
    } else if (status === "standing") {
      return currentPlayer === 1 ? "W" : "B";
    } else {
      return currentPlayer === 1 ? "CW" : "CB";
    }
  };

  // Tentukan simbol pion berdasarkan status dan pemain
  const symbol = getSymbol();

  // Tambahkan pion ke stack pada sel papan yang diklik
  newBoard[row][col] = [...newBoard[row][col], { symbol, status }];

  // Update state papan
  setBoard(newBoard);

  // Update state pemain (stone atau capstone)
  if (status === "sleeping") {
    currentPlayer === 1
      ? setPlayer1({ ...player1, stones: player1.stones - 1 })
      : setPlayer2({ ...player2, stones: player2.stones - 1 });
  } else if (status === "capstone") {
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

const openActionModal = (
  row,
  col,
  setActionModalOpen,
  setActionModalContent,
  board,
  setSelectedRow,
  setSelectedCol
) => {
  const stackContent = board[row][col];
  setActionModalContent(stackContent);
  setActionModalOpen(true);
  setSelectedRow(row);
  setSelectedCol(col);
};

const closeActionModal = (setActionModalOpen) => {
  setActionModalOpen(false);
};

const handleAction = (direction, row, col, setBoard, board, currentPlayer, setCurrentPlayer) => {
  const newBoard = board.map((row) => row.slice());

  // Ambil seluruh stack pion dari cell yang dipilih
  const selectedCellStack = [...newBoard[row][col]];

  // Tentukan arah gerakan dan koordinat cell tujuan
  let targetRow = row;
  let targetCol = col;

  if (direction === 'up' && row > 0) {
    targetRow -= 1;
  } else if (direction === 'down' && row < 4) {
    targetRow += 1;
  } else if (direction === 'left' && col > 0) {
    targetCol -= 1;
  } else if (direction === 'right' && col < 4) {
    targetCol += 1;
  }

  // Periksa apakah cell tujuan kosong atau tidak
  if (newBoard[targetRow][targetCol].length === 0) {
    // Jika kosong, pindahkan seluruh stack pion dari cell yang dipilih ke cell tujuan
    newBoard[targetRow][targetCol] = [...selectedCellStack];
  } else {
    // Jika tidak kosong, ambil pion paling atas dari stack cell tujuan
    const topPiece = newBoard[targetRow][targetCol][newBoard[targetRow][targetCol].length - 1];

    // Periksa apakah pion paling atas adalah pion standing ('W' atau 'B')
    if (topPiece && (topPiece.symbol === 'W' || topPiece.symbol === 'B')) {
      // Tampilkan pesan error bahwa pion standing tidak dapat ditumpuk
      alert("Pion standing ('W' atau 'B') tidak dapat ditumpuk.");
      return;
    }

    // Jika tidak kosong, tambahkan seluruh stack pion dari cell yang dipilih ke stack yang sudah ada di cell tujuan
    newBoard[targetRow][targetCol] = [...newBoard[targetRow][targetCol], ...selectedCellStack];
  }

  // Kosongkan stack pion di cell yang dipilih
  newBoard[row][col] = [];

  // Ganti giliran pemain
  const newCurrentPlayer = currentPlayer === 1 ? 2 : 1;
  setCurrentPlayer(newCurrentPlayer);

  // Update state board setelah gerakan
  setBoard(newBoard);
};




export {
  openModal,
  closeModal,
  selectStatus,
  openActionModal,
  closeActionModal,
  handleAction,
};
