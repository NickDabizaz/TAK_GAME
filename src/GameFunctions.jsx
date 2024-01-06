/* eslint-disable no-unused-vars */
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

  // Check Win
  checkWin(newBoard, currentPlayer);
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

const handleAction = (
  direction,
  row,
  col,
  setBoard,
  board,
  currentPlayer,
  setCurrentPlayer
) => {
  const newBoard = board.map((row) => row.slice());

  // Ambil seluruh stack pion dari cell yang dipilih
  const selectedCellStack = [...newBoard[row][col]];

  // Tentukan arah gerakan dan koordinat cell tujuan
  let targetRow = row;
  let targetCol = col;

  if (direction === "up" && row > 0) {
    targetRow -= 1;
  } else if (direction === "down" && row < 4) {
    targetRow += 1;
  } else if (direction === "left" && col > 0) {
    targetCol -= 1;
  } else if (direction === "right" && col < 4) {
    targetCol += 1;
  }

  // Periksa apakah cell tujuan kosong atau tidak
  if (newBoard[targetRow][targetCol].length === 0) {
    // Jika kosong, pindahkan seluruh stack pion dari cell yang dipilih ke cell tujuan
    newBoard[targetRow][targetCol] = [...selectedCellStack];
  } else {
    const targetCellTop =
      newBoard[targetRow][targetCol][newBoard[targetRow][targetCol].length - 1];

    // Periksa apakah pion yang akan di-stack adalah 'w' atau 'b'
    if (
      ["w", "b"].includes(
        selectedCellStack[selectedCellStack.length - 1].symbol
      )
    ) {
      // Jika 'w' atau 'b', maka pion hanya bisa menumpuk pion 'w' atau 'b'
      if (["W", "B", "CB", "CW"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'W' atau 'B' atau 'CB' atau 'CW', maka tidak bisa menumpuk
        alert(
          `Pemain ${currentPlayer} hanya dapat menumpuk pion 'w' atau 'b' pada pion 'W' atau 'B'.`
        );
        return;
      }
    } else if (
      ["W"].includes(selectedCellStack[selectedCellStack.length - 1].symbol)
    ) {
      // Jika 'W', maka pion hanya bisa menumpuk pion 'W' atau 'CW'
      if (["B", "CB", "CW"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'B' atau 'CB' atau 'CW', maka tidak bisa menumpuk
        alert(
          `Pemain ${currentPlayer} hanya dapat menumpuk pion 'W' pada pion 'B' atau 'CB'.`
        );
        return;
      }
    } else if (
      ["B"].includes(selectedCellStack[selectedCellStack.length - 1].symbol)
    ) {
      // Jika 'B', maka pion hanya bisa menumpuk pion 'B' atau 'CB'
      if (["W", "CW", "CB"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'W' atau 'CW' atau 'CB', maka tidak bisa menumpuk
        alert(
          `Pemain ${currentPlayer} hanya dapat menumpuk pion 'B' pada pion 'W' atau 'CW'.`
        );
        return;
      }
    } else if (
      ["CB"].includes(selectedCellStack[selectedCellStack.length - 1].symbol)
    ) {
      // Jika 'CB', maka 'CB' tidak bisa menumpuk pion 'CW'
      if (["CW"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'CW', maka tidak bisa menumpuk
        alert(
          `Pemain ${currentPlayer} tidak dapat menumpuk pion 'CB' pada pion 'CW'.`
        );
        return;
      }
    } else if (
      ["CW"].includes(selectedCellStack[selectedCellStack.length - 1].symbol)
    ) {
      // Jika 'CW', maka 'CW' tidak bisa menumpuk pion 'CB'
      if (["CB"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'CB', maka tidak bisa menumpuk
        alert(
          `Pemain ${currentPlayer} tidak dapat menumpuk pion 'CW' pada pion 'CB'.`
        );
        return;
      }
    }

    // Jika tidak kosong, tambahkan seluruh stack pion dari cell yang dipilih ke stack yang sudah ada di cell tujuan
    newBoard[targetRow][targetCol] = [
      ...newBoard[targetRow][targetCol],
      ...selectedCellStack,
    ];
  }

  // Kosongkan stack pion di cell yang dipilih
  newBoard[row][col] = [];

  // Update state board setelah gerakan
  setBoard(newBoard);

  // Check Win
  checkWin(newBoard, currentPlayer);
  // Ganti giliran ke pemain selanjutnya
  setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
};

const checkJalan = (
  board,
  startRow,
  startCol,
  currentPlayer,
  visitedBoard,
  direction
) => {
  console.log(`Checking (${startRow}, ${startCol})`);
  console.log({ board });
  if (!visitedBoard) {
    visitedBoard = new Array(5).fill(false).map(() => new Array(5).fill(false));
  }

  if (
    startRow < 0 ||
    startRow >= 5 ||
    startCol < 0 ||
    startCol >= 5 ||
    visitedBoard[startRow][startCol]
  ) {
    return false;
  }

  visitedBoard[startRow][startCol] = true;

  // Check jika blok kosong atau blok adalah wall
  if (
    board[startRow][startCol].length === 0 ||
    ["W", "B"].includes(
      board[startRow][startCol][board[startRow][startCol].length - 1].symbol
    )
  ) {
    console.log(board[startRow][startCol].length);
    return false;
  }

  console.log("masuk");

  const currentBlock =
    board[startRow][startCol][board[startRow][startCol].length - 1].symbol;
  console.log({ currentBlock });
  if (
    (currentPlayer === 1 && currentBlock === "b") ||
    (currentPlayer === 1 && currentBlock === "B") ||
    (currentPlayer === 1 && currentBlock === "CB")
  ) {
    return false;
  }

  if (
    (currentPlayer === 2 && currentBlock === "w") ||
    (currentPlayer === 2 && currentBlock === "W") ||
    (currentPlayer === 2 && currentBlock === "CW")
  ) {
    return false;
  }

  if (
    (direction === "horizontal" && startCol === 4) ||
    (direction === "vertical" && startRow === 4)
  ) {
    return true;
  }

  // Pemanggilan rekursif untuk semua arah
  return (
    checkJalan(
      board,
      startRow,
      startCol + 1,
      currentPlayer,
      visitedBoard,
      direction
    ) || // Right
    checkJalan(
      board,
      startRow,
      startCol - 1,
      currentPlayer,
      visitedBoard,
      direction
    ) || // Left
    checkJalan(
      board,
      startRow + 1,
      startCol,
      currentPlayer,
      visitedBoard,
      direction
    ) || // Down
    checkJalan(
      board,
      startRow - 1,
      startCol,
      currentPlayer,
      visitedBoard,
      direction
    ) // Up
  );
};

const checkWin = (board, currentPlayer) => {
  for (let i = 0; i < 5; i++) {
    if (
      checkJalan(board, 0, i, currentPlayer, null, "vertical") ||
      checkJalan(board, i, 0, currentPlayer, null, "horizontal")
    ) {
      alert(`Player ${currentPlayer} Win`);
      return; // Keluar dari fungsi setelah menemukan kemenangan
    }
    console.log(
      i,
      "horizontal : ",
      checkJalan(board, i, 0, currentPlayer, null, "horizontal")
    );
    console.log(
      i,
      "vertical : ",
      checkJalan(board, 0, i, currentPlayer, null, "vertical")
    );
    console.log({ currentPlayer });
  }
};

export {
  openModal,
  closeModal,
  selectStatus,
  openActionModal,
  closeActionModal,
  handleAction,
};
