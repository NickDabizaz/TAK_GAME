// App.jsx
import React, { useState } from "react";
import {
  openModal,
  closeModal,
  selectStatus,
  openActionModal,
  closeActionModal,
  handleAction,
  AiMove,
  checkWin,
  minimax,
} from "./GameFunctions";

const App = () => {
  // State untuk board
  const [board, setBoard] = useState(
    Array(5)
      .fill([])
      .map(() => Array(5).fill([]))
  );

  // State untuk pemain
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1, setPlayer1] = useState({ stones: 21, capstones: 1 });
  const [player2, setPlayer2] = useState({ stones: 21, capstones: 1 });

  // State untuk modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);
  const [movecount, setMoveCount] = useState(1);

  // State untuk modal tindakan
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalContent, setActionModalContent] = useState(null);

  // Fungsi handler untuk membuka modal
  const openModalHandler = (row, col) => {
    if (
      currentPlayer === 1 &&
      player2.stones === 21 &&
      player2.capstones === 1 &&
      player1.stones === 21 &&
      player1.capstones === 1
    ) {
      const isiBoard = {
        symbol: "b",
        status: "sleeping",
      };

      const isiBoardAi = {
        symbol: "w",
        status: "sleeping",
      };

      let tempBoard = [...board];
      tempBoard[row][col] = [isiBoard];

      let randomRow = Math.floor(Math.random() * 5);
      let randomCol = Math.floor(Math.random() * 5);
      let isPlaced = false;
      while (!isPlaced) {
        if (randomCol !== col && randomRow !== row) {
          if (tempBoard[randomRow][randomCol].length === 0) {
            tempBoard[randomRow][randomCol] = [isiBoardAi];
            isPlaced = true;
          }
        } else {
          randomRow = Math.floor(Math.random() * 5);
          randomCol = Math.floor(Math.random() * 5);
        }
      }

      setBoard(tempBoard);

      setPlayer2({ ...player2, stones: player2.stones - 1 });
      setPlayer1({ ...player1, stones: player1.stones - 1 });
      setCurrentPlayer(1);
    } else {
      openModal(row, col, setModalOpen, setSelectedRow, setSelectedCol);
    }
  };

  // Fungsi handler untuk menutup modal
  const closeModalHandler = () => closeModal(setModalOpen);

  // Fungsi handler untuk membuka modal tindakan
  const openActionModalHandler = (row, col) => {
    // Pengecekan pemain dan pion yang dapat diklik
    const selectedCell = board[row][col];
    const playerSymbol =
      currentPlayer === 1 ? ["w", "W", "CW"] : ["b", "B", "CB"];

    // Jika pemain mengklik pion yang sesuai dengan giliran, buka modal
    if (
      selectedCell.length > 0 &&
      playerSymbol.includes(selectedCell[selectedCell.length - 1].symbol)
    ) {
      openActionModal(
        row,
        col,
        setActionModalOpen,
        setActionModalContent,
        board,
        setSelectedRow,
        setSelectedCol
      );
    }
  };

  // Fungsi handler untuk menutup modal tindakan
  const closeActionModalHandler = () => closeActionModal(setActionModalOpen);

  // Fungsi handler untuk memilih status
  const selectStatusHandler = (status, row, col) =>
    selectStatus(
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
    );
  if (currentPlayer === 2 && player2.stones !== 21 && player1.stones !== 21) {
    AiMove(board, setBoard, player2, setPlayer2);
    console.log({minimax: minimax(board, 2,3)});
    checkWin(board, 2);
    setCurrentPlayer(1);
  }

  // Fungsi handler untuk menangani tombol aksi
  const handleActionHandler = (direction, move) => {
    handleAction(
      direction,
      selectedRow,
      selectedCol,
      setBoard,
      board,
      currentPlayer,
      setCurrentPlayer,
      move,
      setMoveCount
    );

    // Menutup modal setelah tombol aksi ditekan
    closeActionModalHandler();
  };

  // Fungsi untuk menampilkan papan
  const renderBoard = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 70px)",
          gap: "4px",
          cursor: "pointer", // Set cursor default menjadi pointer
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() =>
                cell.length > 0
                  ? openActionModalHandler(rowIndex, colIndex)
                  : openModalHandler(rowIndex, colIndex)
              }
              style={{
                width: "70px",
                height: "70px",
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
                fontWeight: "bold",
                cursor:
                  cell.length > 0 &&
                  !isPlayerTurnValid(cell[cell.length - 1].symbol)
                    ? "not-allowed"
                    : "pointer",
                position: "relative",
              }}
            >
              {cell.length > 0 && (
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: `${cell.length > 1 ? "1px solid black" : "none"}`,
                    backgroundColor: `${
                      cell.length > 1
                        ? cell[cell.length - 2].symbol === "b" ||
                          cell[cell.length - 2].symbol === "B" ||
                          cell[cell.length - 2].symbol === "CB"
                          ? "#8f6459"
                          : "#f8dbb2"
                        : ""
                    }`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: `${
                        cell[cell.length - 1].symbol === "CB" ||
                        cell[cell.length - 1].symbol === "CW"
                          ? "30px"
                          : "60px"
                      }`,
                      height: `${
                        cell[cell.length - 1].status === "sleeping"
                          ? "60px"
                          : cell[cell.length - 1].status === "standing"
                          ? "20px"
                          : "30px"
                      }`,
                      backgroundColor: `${
                        cell[cell.length - 1].symbol === "b" ||
                        cell[cell.length - 1].symbol === "B" ||
                        cell[cell.length - 1].symbol === "CB"
                          ? "#8f6459"
                          : "#f8dbb2"
                      }`,
                      color: `${
                        cell[cell.length - 1].symbol === "b" ||
                        cell[cell.length - 1].symbol === "B" ||
                        cell[cell.length - 1].symbol === "CB"
                          ? "white"
                          : "black"
                      }`,
                      border: "1px solid black",
                      borderRadius: `${
                        cell[cell.length - 1].status === "capstone" ? "50%" : ""
                      }`,
                      transform: `${
                        cell[cell.length - 1].status === "standing"
                          ? "rotate(45deg)"
                          : "rotate(0deg)"
                      }`,
                    }}
                  >
                    {/* {cell[cell.length - 1].symbol} */}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  // Fungsi untuk menentukan apakah pemain dapat mengklik pion tersebut berdasarkan giliran
  const isPlayerTurnValid = (symbol) => {
    const playerSymbol =
      currentPlayer === 1 ? ["w", "W", "CW"] : ["b", "B", "CB"];
    return playerSymbol.includes(symbol);
  };

  // Menentukan apakah tombol capstone masih aktif atau tidak
  const isCapstoneButtonActive = () => {
    return currentPlayer === 1 ? player1.capstones > 0 : player2.capstones > 0;
  };

  // Fungsi untuk mengonsole log isi board
  const logBoard = () => {
    console.log({ board });
  };

  // Tampilkan board
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* Tampilkan informasi pemain dan giliran */}
      <div style={{ marginBottom: "10px" }}>
        <div>
          Player 1: Stones - {player1.stones}, Capstones - {player1.capstones}
        </div>
        <div>
          Player 2: Stones - {player2.stones}, Capstones - {player2.capstones}
        </div>
        <div>Current Turn: Player {currentPlayer}</div>
      </div>
      {/* Tampilkan board */}
      {renderBoard()}

      {/* Modal untuk memilih status stone atau capstone */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>Select Stone or Capstone Status</h2>
            <button
              onClick={() =>
                selectStatusHandler("sleeping", selectedRow, selectedCol)
              }
              style={{ marginRight: "10px" }}
            >
              Sleeping Stone
            </button>
            <button
              onClick={() =>
                selectStatusHandler("standing", selectedRow, selectedCol)
              }
              style={{ marginRight: "10px" }}
            >
              Standing Stone
            </button>
            {isCapstoneButtonActive() && (
              <button
                onClick={() =>
                  selectStatusHandler("capstone", selectedRow, selectedCol)
                }
              >
                Capstone
              </button>
            )}
            <button onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal untuk tindakan stack */}
      {isActionModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2>Stack Information</h2>
            <div>
              {[...actionModalContent].reverse().map((item, index) =>
                item.status === "capstone" ? (
                  <div key={index}>
                    <div
                      style={{
                        width: "30.5px",
                        height: "10px",
                        backgroundColor: `${
                          item.symbol === "b" ? "#8f6459" : "#f8dbb2"
                        }`,
                        transform: "perspective(1.1px) rotateX(3deg)",
                        margin: "auto",
                        marginBottom: "11px",
                        border: "1px solid black",
                        borderBottom: "none",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "30px",
                        height: "50px",
                        backgroundColor: `${
                          item.symbol === "b" ? "#8f6459" : "#f8dbb2"
                        }`,
                        transform: "perspective(5px) rotateX(177deg)",
                        margin: "auto",
                        border: "1px solid black",
                        borderBottom: "none",
                      }}
                    ></div>
                  </div>
                ) : (
                  <div
                    key={index}
                    style={{
                      border: "1px solid black",
                      backgroundColor: `${
                        item.symbol === "b" ? "#8f6459" : "#f8dbb2"
                      }`,
                      color: `${item.symbol === "b" ? "#f8dbb2" : "#8f6459"}`,
                      height: `${item.status === "sleeping" ? "30px" : "60px"}`,
                      width: `${item.status === "sleeping" ? "100px" : "30px"}`,
                      margin: "auto",
                      marginTop: "2px",
                    }}
                  >
                    {/* {item.symbol} - {item.status} */}
                  </div>
                )
              )}
            </div>
            <div
              style={{ display: "flex", marginTop: "2px", marginBottom: "2px" }}
            >
              <span style={{ height: "20px", marginRight: "3px" }}>
                How Many Stack?
              </span>
              <input
                type="number"
                value={movecount}
                max={5}
                min={1}
                onChange={(e) => {
                  setMoveCount(e.target.value);
                }}
                style={{ width: "20%", height: "20px" }}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => handleActionHandler("up", movecount)}
                style={{ marginRight: "5px" }}
                disabled={selectedRow === 0}
              >
                Up
              </button>
              <button
                onClick={() => handleActionHandler("down", movecount)}
                style={{ marginRight: "5px" }}
                disabled={selectedRow === 4}
              >
                Down
              </button>
              <button
                onClick={() => handleActionHandler("left", movecount)}
                style={{ marginRight: "5px" }}
                disabled={selectedCol === 0}
              >
                Left
              </button>
              <button
                onClick={() => handleActionHandler("right", movecount)}
                disabled={selectedCol === 4}
              >
                Right
              </button>
            </div>
            <button onClick={closeActionModalHandler}>Close</button>
          </div>
        </div>
      )}

      {/* Tombol untuk mengonsole log isi board */}
      <div>
        <button onClick={logBoard}>Log Board</button>
      </div>
    </div>
  );
};

export default App;
