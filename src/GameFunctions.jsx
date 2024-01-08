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
  if (status === "sleeping" || status === "standing") {
    currentPlayer === 1
      ? setPlayer1({ ...player1, stones: player1.stones - 1 })
      : setPlayer2({ ...player2, stones: player2.stones - 1 });
  } else if (status === "capstone") {
    currentPlayer === 1
      ? setPlayer1({ ...player1, capstones: player1.capstones - 1 })
      : setPlayer2({ ...player2, capstones: player2.capstones - 1 });
  }
  // Check Win
  if (checkWin(newBoard, currentPlayer) === 1) {
    alert("Player 1 Win");
    window.location.reload();
  } else if (checkWin(newBoard, currentPlayer) === 2) {
    alert("Player 2 Win");
    window.location.reload();
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

const handleAction = (
  row,
  col,
  board,
  setBoard,
  move,
  setMoveCount,
  currentPlayer,
  setCurrentPlayer,
  selectedCellStack,
  setSelectedCellStack,
  initialRow,
  setInitialRow,
  initialCol,
  setInitialCol
) => {
  const newBoard = board.map((row) => row.slice());
  let tempArray = [];

  console.log(newBoard[row][col].length);
  console.log(move);
  // Cek banyak stack
  if (move > newBoard[row][col].length) {
    console.log(newBoard[row][col]);
    alert("Jumlah stack tidak sebanyak itu!");
    setMoveCount(1);
    return;
  }

  //ini belum ada pengecekan, kalo misalnya sleeping mau nindih standing kan gabisa
  //jadi habis alert, yang mau dipindah malah hilang
  for (
    let i = newBoard[row][col].length - move;
    i < newBoard[row][col].length;
    i++
  ) {
    tempArray.push(newBoard[row][col][i]);
  }

  for (let i = 0; i < move; i++) {
    newBoard[row][col].pop();
  }

  // Update state board setelah gerakan
  setBoard(newBoard);
  setSelectedCellStack(tempArray);
  setInitialRow(row);
  setInitialCol(col);

  setCurrentPlayer(3);
  alert("Sekarang dalam status move");
};

const handlePut = (
  row,
  col,
  board,
  setBoard,
  currentPlayer,
  setCurrentPlayer,
  selectedCellStack,
  setSelectedCellStack,
  initialRow,
  setInitialRow,
  initialCol,
  setInitialCol,
  movestatus,
  setMoveStatus
) => {
  // Tentukan arah gerakan dan koordinat cell tujuan
  let targetRow = row;
  let targetCol = col;
  let tempStack = [];

  console.log(selectedCellStack);

  if (movestatus == "") {
    if (targetRow == initialRow - 1 && targetCol == initialCol) {
      setMoveStatus("top");
    } else if (targetRow == initialRow && targetCol == initialCol + 1) {
      setMoveStatus("right");
    } else if (targetRow == initialRow + 1 && targetCol == initialCol) {
      setMoveStatus("bottom");
    } else if (targetRow == initialRow && targetCol == initialCol - 1) {
      setMoveStatus("left");
    } else {
      alert("Invalid move");
      return;
    }
  } else {
    if (movestatus == "top") {
      if (
        targetRow < initialRow - 1 ||
        targetRow > initialRow ||
        targetCol != initialCol
      ) {
        alert("Invalid move ke atas");
        return;
      }
    } else if (movestatus == "right") {
      if (
        targetCol > initialCol + 1 ||
        targetCol < initialCol ||
        targetRow != initialRow
      ) {
        alert("Invalid move ke kanan");
        return;
      }
    } else if (movestatus == "bottom") {
      if (
        targetRow > initialRow + 1 ||
        targetRow < initialRow ||
        targetCol != initialCol
      ) {
        alert("Invalid move ke bawah");
        return;
      }
    } else if (movestatus == "left") {
      if (
        targetCol < initialCol - 1 ||
        targetCol > initialCol ||
        targetRow != initialRow
      ) {
        alert("Invalid move ke kiri");
        return;
      }
    } else {
      alert("Move status salah");
      return;
    }
  }

  const newBoard = board.map((row) => row.slice());

  // Periksa apakah cell tujuan kosong atau tidak
  if (newBoard[targetRow][targetCol].length === 0) {
    // Jika kosong, pindahkan seluruh stack pion dari cell yang dipilih ke cell tujuan
    newBoard[targetRow][targetCol] = [selectedCellStack[0]];

    tempStack = selectedCellStack;
    tempStack.shift();
    if (tempStack.length > 0) {
      setSelectedCellStack(tempStack);
    } else {
      setSelectedCellStack([]);
    }
    setInitialRow(targetRow);
    setInitialCol(targetCol);
  } else {
    const targetCellTop =
      newBoard[targetRow][targetCol][newBoard[targetRow][targetCol].length - 1];

    // Periksa apakah pion yang akan di-stack adalah 'w' atau 'b'
    if (["w", "b"].includes(selectedCellStack[0].symbol)) {
      // Jika 'w' atau 'b', maka pion hanya bisa menumpuk pion 'w' atau 'b'
      if (["W", "B", "CB", "CW"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'W' atau 'B' atau 'CB' atau 'CW', maka tidak bisa menumpuk
        alert(`Sleeping stone hanya dapat menumpuk sleeping stone.`);
        return;
      }
    } else if (["W"].includes(selectedCellStack[0].symbol)) {
      // Jika 'W', maka pion hanya bisa menumpuk pion 'W' atau 'CW'
      if (["B", "W", "CB", "CW"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'B' atau 'CB' atau 'CW', maka tidak bisa menumpuk
        alert(`Standing stone hanya dapat menumpuk sleeping stone.`);
        return;
      }
    } else if (["B"].includes(selectedCellStack[0].symbol)) {
      // Jika 'B', maka pion hanya bisa menumpuk pion 'B' atau 'CB'
      if (["W", "B", "CW", "CB"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'W' atau 'CW' atau 'CB', maka tidak bisa menumpuk
        alert(`Standing stone hanya dapat menumpuk sleeping stone.`);
        return;
      }
    } else if (["CB"].includes(selectedCellStack[0].symbol)) {
      // Jika 'CB', maka 'CB' tidak bisa menumpuk pion 'CW'
      if (["CW"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'CW', maka tidak bisa menumpuk
        alert(`Capstone tidak bisa menumpuk capstone.`);
        return;
      }
      //jika 'CB', maka 'W' berubah menjadi 'w'

      if (["B"].includes(targetCellTop.symbol)) {
        newBoard[targetRow][targetCol][
          newBoard[targetRow][targetCol].length - 1
        ].symbol = "b";
        newBoard[targetRow][targetCol][
          newBoard[targetRow][targetCol].length - 1
        ].status = "sleeping";
      }
      if (["W"].includes(targetCellTop.symbol)) {
        newBoard[targetRow][targetCol][
          newBoard[targetRow][targetCol].length - 1
        ].symbol = "w";
        newBoard[targetRow][targetCol][
          newBoard[targetRow][targetCol].length - 1
        ].status = "sleeping";
      }
    } else if (["CW"].includes(selectedCellStack[0].symbol)) {
      // Jika 'CW', maka 'CW' tidak bisa menumpuk pion 'CB'
      if (["CB"].includes(targetCellTop.symbol)) {
        // Jika target pion adalah 'CB', maka tidak bisa menumpuk
        alert(`Capstone tidak bisa menumpuk capstone.`);
        return;
      }
      //jika 'CW', maka 'B' berubah menjadi 'b'
      if (["B"].includes(targetCellTop.symbol)) {
        newBoard[targetRow][targetCol][
          newBoard[targetRow][targetCol].length - 1
        ].symbol = "b";
        newBoard[targetRow][targetCol][
          newBoard[targetRow][targetCol].length - 1
        ].status = "sleeping";
      }
      if (["W"].includes(targetCellTop.symbol)) {
        newBoard[targetRow][targetCol][
          newBoard[targetRow][targetCol].length - 1
        ].symbol = "w";
        newBoard[targetRow][targetCol][
          newBoard[targetRow][targetCol].length - 1
        ].status = "sleeping";
      }
    }

    // Jika tidak kosong, tambahkan seluruh stack pion dari cell yang dipilih ke stack yang sudah ada di cell tujuan
    newBoard[targetRow][targetCol] = [
      ...newBoard[targetRow][targetCol],
      selectedCellStack[0],
    ];

    tempStack = selectedCellStack;
    tempStack.shift();
    if (tempStack.length > 0) {
      setSelectedCellStack(tempStack);
    } else {
      setSelectedCellStack([]);
    }
    setInitialRow(targetRow);
    setInitialCol(targetCol);
  }

  // Update state board setelah gerakan
  setBoard(newBoard);

  if (tempStack.length < 1) {
    // Check Win
    if (checkWin(newBoard, currentPlayer) === 1) {
      alert("Player 1 Win");
      window.location.reload();
    } else if (checkWin(newBoard, currentPlayer) === 2) {
      alert("Player 2 Win");
      window.location.reload();
    }

    // Ganti giliran AI
    setCurrentPlayer(2);

    setMoveStatus("");
    setInitialRow(null);
    setInitialCol(null);
  }
};

const checkJalan = (
  board,
  startRow,
  startCol,
  currentPlayer,
  visitedBoard,
  direction
) => {
  // console.log(`Checking (${startRow}, ${startCol})`);
  // console.log({ board });
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
    // console.log(board[startRow][startCol].length);
    return false;
  }

  // console.log("masuk");

  const currentBlock =
    board[startRow][startCol][board[startRow][startCol].length - 1].symbol;
  // console.log({ currentBlock });
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
      return currentPlayer;
    }
    // console.log(
    //   i,
    //   "horizontal : ",
    //   checkJalan(board, i, 0, currentPlayer, null, "horizontal")
    // );
    // console.log(
    //   i,
    //   "vertical : ",
    //   checkJalan(board, 0, i, currentPlayer, null, "vertical")
    // );
    // console.log({ currentPlayer });
  }

  let isAvailable = false;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (board[i][j].length == 0) isAvailable = true;
    }
  }

  if (!isAvailable) {
    let whiteStoneCount = 0;
    let blackStoneCount = 0;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (board[i][j][board[i][j].length - 1] == "w") whiteStoneCount++;
        else if (board[i][j][board[i][j].length - 1] == "b") blackStoneCount++;
      }
    }

    if (whiteStoneCount > blackStoneCount) return 1;
    else return 2;
  } else return;
};

const AiMove = (
  board,
  setBoard,
  player2,
  setPlayer2,
  col,
  row,
  direction,
  action,
  status
) => {
  console.log({ board });
  console.log({ col });
  console.log({ row });
  console.log({ direction });
  console.log({ action });
  console.log({ status });

  const newBoard = board.map((row) => row.slice());
  let randomCol = col;
  let randomRow = row;
  let randomDirection;
  if (direction === "up") {
    randomDirection = 0;
  } else if (direction === "down") {
    randomDirection = 1;
  } else if (direction === "left") {
    randomDirection = 2;
  } else if (direction === "right") {
    randomDirection = 3;
  }

  let randomAction = action === "put" ? 0 : 1;

  if (randomAction === 0 && player2.stones > 0) {
    // Place
    // console.log("test");
    let isPlaced = false;
    while (!isPlaced) {
      // randomRow = Math.floor(Math.random() * 5);
      // randomCol = Math.floor(Math.random() * 5);
      if (newBoard[randomRow][randomCol].length === 0) {
        let randomStatus;
        if (player2.capstones === 0) {
          randomStatus = Math.floor(Math.random() * 2);
        } else if (player2.capstones > 0) {
          randomStatus = Math.floor(Math.random() * 3);
        }
        // var status = ["sleeping", "standing", "capstone"][randomStatus];
        const symbol =
          status === "sleeping" ? "b" : status === "standing" ? "B" : "CB";
        newBoard[randomRow][randomCol] = [
          ...newBoard[randomRow][randomCol],
          { symbol, status },
        ];
        isPlaced = true;
      }
    }
    // Update state AI (stone atau capstone)
    if (status === "sleeping" || status === "standing") {
      setPlayer2({ ...player2, stones: player2.stones - 1 });
    } else if (status === "capstone") {
      setPlayer2({ ...player2, capstones: player2.capstones - 1 });
    }
  } else if (newBoard[row][col].length > 0) {
    // Move
    const selectedCellStack = [...newBoard[randomRow][randomCol]];
    let targetRow = randomRow;
    let targetCol = randomCol;

    if (randomDirection === 0 && randomRow > 0) {
      targetRow -= 1;
    } else if (randomDirection === 1 && randomRow < 4) {
      targetRow += 1;
    } else if (randomDirection === 2 && randomCol > 0) {
      targetCol -= 1;
    } else if (randomDirection === 3 && randomCol < 4) {
      targetCol += 1;
    }

    if (newBoard[targetRow][targetCol].length === 0) {
      newBoard[targetRow][targetCol] = [...selectedCellStack];
      newBoard[randomRow][randomCol] = [];
    } else {
      const targetCellTop =
        newBoard[targetRow][targetCol][
          newBoard[targetRow][targetCol].length - 1
        ];

      if (
        ["w", "b"].includes(
          selectedCellStack[selectedCellStack.length - 1].symbol
        )
      ) {
        if (["W", "B", "CB", "CW"].includes(targetCellTop.symbol)) {
          return AiMove(
            board,
            setBoard,
            player2,
            setPlayer2,
            col,
            row,
            direction,
            action,
            status
          );
        }
      } else if (
        ["W"].includes(selectedCellStack[selectedCellStack.length - 1].symbol)
      ) {
        if (["B", "CB", "CW"].includes(targetCellTop.symbol)) {
          return AiMove(
            board,
            setBoard,
            player2,
            setPlayer2,
            col,
            row,
            direction,
            action,
            status
          );
        }
      } else if (
        ["B"].includes(selectedCellStack[selectedCellStack.length - 1].symbol)
      ) {
        if (["W", "CW", "CB"].includes(targetCellTop.symbol)) {
          return AiMove(
            board,
            setBoard,
            player2,
            setPlayer2,
            col,
            row,
            direction,
            action,
            status
          );
        }
      }
      newBoard[targetRow][targetCol] = [
        ...newBoard[targetRow][targetCol],
        ...selectedCellStack,
      ];
      newBoard[randomRow][randomCol] = [];
    }
  } else {
    return AiMove(board, setBoard, player2, setPlayer2);
  }

  if (checkWin(newBoard, 2) === 1) {
    alert("Player 1 Win");
    window.location.reload();
  } else if (checkWin(newBoard, 2) === 2) {
    alert("Player 2 Win");
    window.location.reload();
  }
  setBoard(newBoard);
  console.log({ newBoard });
};

// const minimax = (board, player2) => {
//   const availableMove = [];
//   for (let i = 0; i < 5; i++) {
//     for (let j = 0; j < 5; j++) {
//       // Cari Available untuk di taruh
//       if (board[i][j].length === 0) {
//         const tempBoard = board.map((row) => row.slice());
//         console.log({ player2 });
//         for (let k = 0; k < (player2.capstones == 0 ? 2 : 3); k++) {
//           tempBoard[i][j] = [
//             {
//               symbol: k == 0 ? "b" : k == 1 ? "B" : "CB",
//               status: k == 0 ? "sleeping" : k == 1 ? "standing" : "capstone",
//             },
//           ];
//           availableMove.push({
//             status: tempBoard[i][j][tempBoard[i][j].length - 1].status,
//             action: "put",
//             row: i,
//             col: j,
//             sbe: sbe(tempBoard, i, j),
//           });
//           tempBoard[i][j] = [];
//         }
//       } else if (
//         board[i][j][board[i][j].length - 1].symbol == "b" ||
//         board[i][j][board[i][j].length - 1].symbol == "B" ||
//         board[i][j][board[i][j].length - 1].symbol == "CB"
//       ) {
//         console.log("masuk lain");
//         // Cari Available untuk di pindah
//         if (i > 0) {
//           const tempBoard = board.map((row) => row.slice());
//           const selectedCell = [...tempBoard[i][j]];
//           tempBoard[i - 1][j] = [selectedCell];
//           availableMove.push({
//             action: "move",
//             row: i,
//             col: j,
//             direction: "up",
//             sbe: sbe(tempBoard, i, j),
//           });
//           tempBoard[i - 1][j] = [];
//         }
//         if (i < 4) {
//           const tempBoard = board.map((row) => row.slice());
//           const selectedCell = [...tempBoard[i][j]];
//           tempBoard[i + 1][j] = [selectedCell];
//           availableMove.push({
//             action: "move",
//             row: i,
//             col: j,
//             direction: "down",
//             sbe: sbe(tempBoard, i, j),
//           });
//           tempBoard[i + 1][j] = [];
//         }
//         if (j > 0) {
//           const tempBoard = board.map((row) => row.slice());
//           const selectedCell = [...tempBoard[i][j]];
//           tempBoard[i][j - 1] = [selectedCell];
//           availableMove.push({
//             action: "move",
//             row: i,
//             col: j,
//             direction: "left",
//             sbe: sbe(tempBoard, i, j),
//           });
//           tempBoard[i][j - 1] = [];
//         }
//         if (j < 4) {
//           const tempBoard = board.map((row) => row.slice());
//           const selectedCell = [...tempBoard[i][j]];
//           tempBoard[i][j + 1] = [selectedCell];
//           availableMove.push({
//             action: "move",
//             row: i,
//             col: j,
//             direction: "right",
//             sbe: sbe(tempBoard, i, j),
//           });
//           tempBoard[i][j + 1] = [];
//         }
//       }
//     }
//   }
//   let maxSbe = -Infinity;
//   let maxSbeIndex;
//   for (let i = 0; i < availableMove.length; i++) {
//     if (maxSbe < availableMove[i].sbe) {
//       maxSbe = availableMove[i].sbe;
//       maxSbeIndex = i;
//     }
//   }
//   console.log({ availableMove });
//   console.log({ availableMove: availableMove[maxSbeIndex] });
//   return availableMove[maxSbeIndex];
// };

const minimax = (board, depth, player1, player2, isMaximize, lastMove) => {
  if (depth === 1) {
    console.log("ini ply1");
  } else {
    console.log("ini ply2");
  }

  const availableMove = [];
  let bestMove = {};
  if (depth === 0) {
    bestMove.sbe = sbe(board, isMaximize ? 1 : 2);
    bestMove.col = lastMove.col;
    bestMove.row = lastMove.row;
    bestMove.direction = lastMove.direction;
    bestMove.action = lastMove.action;
    bestMove.status = lastMove.status;
    return bestMove;
  }

  if (isMaximize) {
    bestMove.sbe = -Infinity;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        // Cari Available untuk di taruh
        if (board[i][j].length === 0) {
          const tempBoard = board.map((row) => row.slice());
          for (let k = 0; k < (player2.capstones == 0 ? 2 : 3); k++) {
            tempBoard[i][j] = [
              {
                symbol: k == 0 ? "b" : k == 1 ? "B" : "CB",
                status: k == 0 ? "sleeping" : k == 1 ? "standing" : "capstone",
              },
            ];
            bestMove = minimax(
              tempBoard,
              depth - 1,
              player1,
              player2,
              !isMaximize,
              {
                status: tempBoard[i][j][tempBoard[i][j].length - 1].status,
                action: "put",
                row: i,
                col: j,
              }
            );
            availableMove.push(bestMove);
            tempBoard[i][j] = [];
          }
        } else if (
          board[i][j][board[i][j].length - 1].symbol == "b" ||
          board[i][j][board[i][j].length - 1].symbol == "B" ||
          board[i][j][board[i][j].length - 1].symbol == "CB"
        ) {
          // Cari Available untuk di pindah
          if (i > 0) {
            const tempBoard = board.map((row) => row.slice());
            const selectedCell = [...tempBoard[i][j]];
            if (tempBoard[i - 1][j].length === 0) {
              tempBoard[i - 1][j] = [selectedCell];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                !isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "up",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i - 1][j] = [];
            } else {
              if (
                ["w", "b"].includes(
                  selectedCell[selectedCell.length - 1].symbol
                )
              ) {
                if (
                  ["W", "B", "CB", "CW"].includes(
                    tempBoard[i - 1][j][tempBoard[i - 1][j].length - 1].symbol
                  )
                ) {
                  return;
                }
              } else if (
                ["W"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["B", "CB", "CW"].includes(
                    tempBoard[i - 1][j][tempBoard[i - 1][j].length - 1].symbol
                  )
                ) {
                  return;
                }
              } else if (
                ["B"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["W", "CW", "CB"].includes(
                    tempBoard[i - 1][j][tempBoard[i - 1][j].length - 1].symbol
                  )
                ) {
                  return;
                }
              }
              tempBoard[i - 1][j] = [...tempBoard[i - 1][j], ...selectedCell];
              tempBoard[i][j] = [];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                !isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "up",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i - 1][j] = [];
            }
          }
          if (i < 4) {
            const tempBoard = board.map((row) => row.slice());
            const selectedCell = [...tempBoard[i][j]];
            if (tempBoard[i + 1][j].length === 0) {
              tempBoard[i + 1][j] = [selectedCell];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                !isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "down",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i + 1][j] = [];
            } else {
              if (
                ["w", "b"].includes(
                  selectedCell[selectedCell.length - 1].symbol
                )
              ) {
                if (
                  ["W", "B", "CB", "CW"].includes(
                    tempBoard[i + 1][j][tempBoard[i + 1][j].length - 1].symbol
                  )
                ) {
                  return;
                }
              } else if (
                ["W"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["B", "CB", "CW"].includes(
                    tempBoard[i + 1][j][tempBoard[i + 1][j].length - 1].symbol
                  )
                ) {
                  return;
                }
              } else if (
                ["B"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["W", "CW", "CB"].includes(
                    tempBoard[i + 1][j][tempBoard[i + 1][j].length - 1].symbol
                  )
                ) {
                  return;
                }
              }
              tempBoard[i + 1][j] = [...tempBoard[i + 1][j], ...selectedCell];
              tempBoard[i][j] = [];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                !isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "down",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i + 1][j] = [];
            }
          }
          if (j > 0) {
            const tempBoard = board.map((row) => row.slice());
            const selectedCell = [...tempBoard[i][j]];
            if (tempBoard[i][j - 1].length === 0) {
              tempBoard[i][j - 1] = [selectedCell];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                !isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "left",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i][j - 1] = [];
            } else {
              if (
                ["w", "b"].includes(
                  selectedCell[selectedCell.length - 1].symbol
                )
              ) {
                if (
                  ["W", "B", "CB", "CW"].includes(
                    tempBoard[i][j - 1][tempBoard[i][j - 1].length - 1].symbol
                  )
                ) {
                  return;
                }
              } else if (
                ["W"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["B", "CB", "CW"].includes(
                    tempBoard[i][j - 1][tempBoard[i][j - 1].length - 1].symbol
                  )
                ) {
                  return;
                }
              } else if (
                ["B"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["W", "CW", "CB"].includes(
                    tempBoard[i][j - 1][tempBoard[i][j - 1].length - 1].symbol
                  )
                ) {
                  return;
                }
              }
              tempBoard[i][j - 1] = [...tempBoard[i][j - 1], ...selectedCell];
              tempBoard[i][j] = [];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                !isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "left",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i][j - 1] = [];
            }
          }
          if (j < 4) {
            const tempBoard = board.map((row) => row.slice());
            const selectedCell = [...tempBoard[i][j]];
            if (tempBoard[i][j + 1].length === 0) {
              tempBoard[i][j + 1] = [selectedCell];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                !isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "right",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i][j + 1] = [];
            } else {
              if (
                ["w", "b"].includes(
                  selectedCell[selectedCell.length - 1].symbol
                )
              ) {
                if (
                  ["W", "B", "CB", "CW"].includes(
                    tempBoard[i][j + 1][tempBoard[i][j + 1].length - 1].symbol
                  )
                ) {
                  return;
                }
              } else if (
                ["W"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["B", "CB", "CW"].includes(
                    tempBoard[i][j + 1][tempBoard[i][j + 1].length - 1].symbol
                  )
                ) {
                  return;
                }
              } else if (
                ["B"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["W", "CW", "CB"].includes(
                    tempBoard[i][j + 1][tempBoard[i][j + 1].length - 1].symbol
                  )
                ) {
                  return;
                }
              }
              tempBoard[i][j + 1] = [...tempBoard[i][j + 1], ...selectedCell];
              tempBoard[i][j] = [];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                !isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "right",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i][j + 1] = [];
            }
          }
        }
      }
    }
    console.log({bestSBE : bestMove.sbe});
    for (let i = 0; i < availableMove.length; i++) {
      console.log({availableMoveSekarang : availableMove[i]});
      if (bestMove.sbe < availableMove[i].sbe) {
        bestMove = availableMove[i];
      }
    }
    return bestMove;
  } else {
    bestMove.sbe = Infinity;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        // Cari Available untuk di taruh
        if (board[i][j].length === 0) {
          const tempBoard = board.map((row) => row.slice());
          for (let k = 0; k < (player2.capstones == 0 ? 2 : 3); k++) {
            tempBoard[i][j] = [
              {
                symbol: k == 0 ? "w" : k == 1 ? "W" : "CW",
                status: k == 0 ? "sleeping" : k == 1 ? "standing" : "capstone",
              },
            ];
            bestMove = minimax(
              tempBoard,
              depth - 1,
              player1,
              player2,
              isMaximize,
              {
                status: tempBoard[i][j][tempBoard[i][j].length - 1].status,
                action: "put",
                row: i,
                col: j,
              }
            );
            availableMove.push(bestMove);
            tempBoard[i][j] = [];
          }
        } else if (
          board[i][j][board[i][j].length - 1].symbol == "w" ||
          board[i][j][board[i][j].length - 1].symbol == "W" ||
          board[i][j][board[i][j].length - 1].symbol == "CW"
        ) {
          // Cari Available untuk di pindah
          if (i > 0) {
            const tempBoard = board.map((row) => row.slice());
            const selectedCell = [...tempBoard[i][j]];
            if (tempBoard[i - 1][j].length === 0) {
              tempBoard[i - 1][j] = [selectedCell];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "up",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i - 1][j] = [];
            } else {
              if (
                ["w", "b"].includes(
                  selectedCell[selectedCell.length - 1].symbol
                )
              ) {
                if (
                  ["W", "B", "CB", "CW"].includes(
                    tempBoard[i - 1][j][tempBoard[i - 1][j].length - 1].symbol
                  )
                ) {
                  break
                }
              } else if (
                ["W"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["B", "CB", "CW"].includes(
                    tempBoard[i - 1][j][tempBoard[i - 1][j].length - 1].symbol
                  )
                ) {
                  break;
                }
              } else if (
                ["B"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["W", "CW", "CB"].includes(
                    tempBoard[i - 1][j][tempBoard[i - 1][j].length - 1].symbol
                  )
                ) {
                  break;
                }
              }
              tempBoard[i - 1][j] = [...tempBoard[i - 1][j], ...selectedCell];
              tempBoard[i][j] = [];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "up",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i - 1][j] = [];
            }
          }
          if (i < 4) {
            const tempBoard = board.map((row) => row.slice());
            const selectedCell = [...tempBoard[i][j]];
            if (tempBoard[i + 1][j].length === 0) {
              tempBoard[i + 1][j] = [selectedCell];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "down",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i + 1][j] = [];
            } else {
              if (
                ["w", "b"].includes(
                  selectedCell[selectedCell.length - 1].symbol
                )
              ) {
                if (
                  ["W", "B", "CB", "CW"].includes(
                    tempBoard[i + 1][j][tempBoard[i + 1][j].length - 1].symbol
                  )
                ) {
                  break;
                }
              } else if (
                ["W"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["B", "CB", "CW"].includes(
                    tempBoard[i + 1][j][tempBoard[i + 1][j].length - 1].symbol
                  )
                ) {
                  break;
                }
              } else if (
                ["B"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["W", "CW", "CB"].includes(
                    tempBoard[i + 1][j][tempBoard[i + 1][j].length - 1].symbol
                  )
                ) {
                  break;
                }
              }
              tempBoard[i + 1][j] = [...tempBoard[i + 1][j], ...selectedCell];
              tempBoard[i][j] = [];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "down",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i + 1][j] = [];
            }
          }
          if (j > 0) {
            const tempBoard = board.map((row) => row.slice());
            const selectedCell = [...tempBoard[i][j]];
            if (tempBoard[i][j - 1].length === 0) {
              tempBoard[i][j - 1] = [selectedCell];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "left",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i][j - 1] = [];
            } else {
              if (
                ["w", "b"].includes(
                  selectedCell[selectedCell.length - 1].symbol
                )
              ) {
                if (
                  ["W", "B", "CB", "CW"].includes(
                    tempBoard[i][j - 1][tempBoard[i][j - 1].length - 1].symbol
                  )
                ) {
                  break;
                }
              } else if (
                ["W"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["B", "CB", "CW"].includes(
                    tempBoard[i][j - 1][tempBoard[i][j - 1].length - 1].symbol
                  )
                ) {
                  break;
                }
              } else if (
                ["B"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["W", "CW", "CB"].includes(
                    tempBoard[i][j - 1][tempBoard[i][j - 1].length - 1].symbol
                  )
                ) {
                  break;
                }
              }
              tempBoard[i][j - 1] = [...tempBoard[i][j - 1], ...selectedCell];
              tempBoard[i][j] = [];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "left",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i][j - 1] = [];
            }
          }
          if (j < 4) {
            const tempBoard = board.map((row) => row.slice());
            const selectedCell = [...tempBoard[i][j]];
            if (tempBoard[i][j + 1].length === 0) {
              tempBoard[i][j + 1] = [selectedCell];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "right",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i][j + 1] = [];
            } else {
              if (
                ["w", "b"].includes(
                  selectedCell[selectedCell.length - 1].symbol
                )
              ) {
                if (
                  ["W", "B", "CB", "CW"].includes(
                    tempBoard[i][j + 1][tempBoard[i][j + 1].length - 1].symbol
                  )
                ) {
                  break;
                }
              } else if (
                ["W"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["B", "CB", "CW"].includes(
                    tempBoard[i][j + 1][tempBoard[i][j + 1].length - 1].symbol
                  )
                ) {
                  break;
                }
              } else if (
                ["B"].includes(selectedCell[selectedCell.length - 1].symbol)
              ) {
                if (
                  ["W", "CW", "CB"].includes(
                    tempBoard[i][j + 1][tempBoard[i][j + 1].length - 1].symbol
                  )
                ) {
                  break;
                }
              }
              tempBoard[i][j + 1] = [...tempBoard[i][j + 1], ...selectedCell];
              tempBoard[i][j] = [];
              bestMove = minimax(
                tempBoard,
                depth - 1,
                player1,
                player2,
                isMaximize,
                {
                  action: "move",
                  row: i,
                  col: j,
                  direction: "right",
                }
              );
              availableMove.push(bestMove);
              tempBoard[i][j + 1] = [];
            }
          }
        }
      }
    }
    for (let i = 0; i < availableMove.length; i++) {
      if (bestMove.sbe > availableMove[i].sbe) {
        bestMove = availableMove[i];
      }
    }
    return bestMove;
  }
};

const sbe = (board, currentPlayer) => {
  let playerScore = 0;
  let aiScore = 0;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      //setiap kontrol atas stack +2 poin
      if (board[i][j].length > 0) {
        if (
          board[i][j][board[i][j].length - 1].symbol === "b" &&
          board[i][j][board[i][j].length - 1].status === "sleeping"
        )
          aiScore += 1;
        else if (
          board[i][j][board[i][j].length - 1].symbol === "w" &&
          board[i][j][board[i][j].length - 1].status === "sleeping"
        )
          playerScore += 1;
      }
    }
  }

  const totalConnectPlayer = (board) => {
    let maxCount = 0;
    const visited = Array.from({ length: 5 }, () =>
      Array(board[0].length).fill(false)
    );

    const dfs = (i, j) => {
      if (
        i < 0 ||
        i >= 5 ||
        j < 0 ||
        j >= 5 ||
        visited[i][j] ||
        board[i][j].length === 0 || // Check if the cell is empty
        !(
          board[i][j][board[i][j].length - 1].symbol === "w" ||
          board[i][j][board[i][j].length - 1].symbol === "CW"
        )
      ) {
        return 0;
      }

      visited[i][j] = true;

      let count = 1;
      count += dfs(i - 1, j) + dfs(i + 1, j) + dfs(i, j - 1) + dfs(i, j + 1);

      return count;
    };

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (
          !visited[i][j] &&
          board[i][j].length > 0 && // Check if the cell is not empty
          (board[i][j][board[i][j].length - 1].symbol === "w" ||
            board[i][j][board[i][j].length - 1].symbol === "CW")
        ) {
          const count = dfs(i, j);
          maxCount = Math.max(maxCount, count);
        }
      }
    }

    return maxCount;
  };

  const totalConnectAi = (board) => {
    let maxCount = 0;
    const visited = Array.from({ length: 5 }, () =>
      Array(board[0].length).fill(false)
    );

    const dfs = (i, j) => {
      if (
        i < 0 ||
        i >= 5 ||
        j < 0 ||
        j >= 5 ||
        visited[i][j] ||
        board[i][j].length === 0 || // Check if the cell is empty
        !(
          board[i][j][board[i][j].length - 1].symbol === "b" ||
          board[i][j][board[i][j].length - 1].symbol === "CB"
        )
      ) {
        return 0;
      }

      visited[i][j] = true;

      let count = 1;
      count += dfs(i - 1, j) + dfs(i + 1, j) + dfs(i, j - 1) + dfs(i, j + 1);

      return count;
    };

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (
          !visited[i][j] &&
          board[i][j].length > 0 && // Check if the cell is not empty
          (board[i][j][board[i][j].length - 1].symbol === "b" ||
            board[i][j][board[i][j].length - 1].symbol === "CB")
        ) {
          const count = dfs(i, j);
          maxCount = Math.max(maxCount, count);
        }
      }
    }

    return maxCount;
  };

  console.log({ totalConnectAi: totalConnectAi(board) });
  console.log({ totalConnectPlayer: totalConnectPlayer(board) });

  aiScore += totalConnectAi(board);
  playerScore += totalConnectPlayer(board);

  return aiScore - playerScore;
};

// const sbe = (board, row, col) => {
//   let playerScore = 0;
//   let aiScore = 0;

//   for (let i = 0; i < 5; i++) {
//     for (let j = 0; j < 5; j++) {
//       //setiap kontrol atas stack +2 poin
//       if (board[i][j].length > 0) {
//         if (
//           board[i][j][board[i][j].length - 1].symbol === "b" &&
//           board[i][j][board[i][j].length - 1].status === "sleeping"
//         )
//           aiScore += 1;
//         else if (
//           board[i][j][board[i][j].length - 1].symbol === "w" &&
//           board[i][j][board[i][j].length - 1].status === "sleeping"
//         )
//           playerScore += 1;
//       }
//     }
//   }

//   const totalConnectPlayer = (board) => {
//     let maxCount = 0;
//     const visited = Array.from({ length: 5 }, () =>
//       Array(board[0].length).fill(false)
//     );

//     const dfs = (i, j) => {
//       if (
//         i < 0 ||
//         i >= 5 ||
//         j < 0 ||
//         j >= 5 ||
//         visited[i][j] ||
//         board[i][j].length === 0 || // Check if the cell is empty
//         !(
//           board[i][j][board[i][j].length - 1].symbol === "w" ||
//           board[i][j][board[i][j].length - 1].symbol === "CW"
//         )
//       ) {
//         return 0;
//       }

//       visited[i][j] = true;

//       let count = 1;
//       count += dfs(i - 1, j) + dfs(i + 1, j) + dfs(i, j - 1) + dfs(i, j + 1);

//       return count;
//     };

//     for (let i = 0; i < 5; i++) {
//       for (let j = 0; j < board[i].length; j++) {
//         if (
//           !visited[i][j] &&
//           board[i][j].length > 0 && // Check if the cell is not empty
//           (board[i][j][board[i][j].length - 1].symbol === "w" ||
//             board[i][j][board[i][j].length - 1].symbol === "CW")
//         ) {
//           const count = dfs(i, j);
//           maxCount = Math.max(maxCount, count);
//         }
//       }
//     }

//     return maxCount;
//   };

//   const totalConnectAi = (board) => {
//     let maxCount = 0;
//     const visited = Array.from({ length: 5 }, () =>
//       Array(board[0].length).fill(false)
//     );

//     const dfs = (i, j) => {
//       if (
//         i < 0 ||
//         i >= 5 ||
//         j < 0 ||
//         j >= 5 ||
//         visited[i][j] ||
//         board[i][j].length === 0 || // Check if the cell is empty
//         !(
//           board[i][j][board[i][j].length - 1].symbol === "b" ||
//           board[i][j][board[i][j].length - 1].symbol === "CB"
//         )
//       ) {
//         return 0;
//       }

//       visited[i][j] = true;

//       let count = 1;
//       count += dfs(i - 1, j) + dfs(i + 1, j) + dfs(i, j - 1) + dfs(i, j + 1);

//       return count;
//     };

//     for (let i = 0; i < 5; i++) {
//       for (let j = 0; j < board[i].length; j++) {
//         if (
//           !visited[i][j] &&
//           board[i][j].length > 0 && // Check if the cell is not empty
//           (board[i][j][board[i][j].length - 1].symbol === "b" ||
//             board[i][j][board[i][j].length - 1].symbol === "CB")
//         ) {
//           const count = dfs(i, j);
//           maxCount = Math.max(maxCount, count);
//         }
//       }
//     }

//     return maxCount;
//   };

//   console.log({ totalConnectAi: totalConnectAi(board) });
//   console.log({ totalConnectPlayer: totalConnectPlayer(board) });

//   aiScore += totalConnectAi(board);
//   playerScore += totalConnectPlayer(board);

//   return aiScore - playerScore;
// };

export {
  openModal,
  closeModal,
  selectStatus,
  openActionModal,
  closeActionModal,
  handleAction,
  AiMove,
  checkWin,
  minimax,
  handlePut,
};
