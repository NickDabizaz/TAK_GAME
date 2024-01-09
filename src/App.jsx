// App.jsx
import React, { useEffect, useState } from "react";
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
  handlePut,
} from "./GameFunctions";

import "../index.css";
import styled, { keyframes } from "styled-components";

const App = () => {
  // State untuk board
  const [board, setBoard] = useState(
    Array(5)
      .fill([])
      .map(() => Array(5).fill([]))
  );

  const [route, setRoute] = useState("menu");

  // State untuk pemain
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1, setPlayer1] = useState({ stones: 21, capstones: 1 });
  const [player2, setPlayer2] = useState({ stones: 21, capstones: 1 });

  // State untuk modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);
  const [initialRow, setInitialRow] = useState(null);
  const [initialCol, setInitialCol] = useState(null);
  const [movecount, setMoveCount] = useState(1);
  const [selectedCellStack, setSelectedCellStack] = useState([]);
  const [movestatus, setMoveStatus] = useState("");
  const [curGrid, setCurGrid] = useState(null);
  const [gameover, setGameover] = useState(false);

  useEffect(() => {
    alert("asd");
  }, [gameover]);

  // State untuk modal tindakan
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalContent, setActionModalContent] = useState(null);

  const zoomInOut = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

  const AnimatedText = styled.div`
    font-size: 24px;
    display: inline-block;
    animation: ${zoomInOut} 4s infinite;
    text-align: center;
    margin: auto;
  `;

  // Fungsi handler untuk membuka modal
  const openModalHandler = (row, col) => {
    //Pengecekan Mode Move
    if (currentPlayer === 3) {
      handlePut(
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
      );
    } else {
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
    }
  };

  // Fungsi handler untuk menutup modal
  const closeModalHandler = () => closeModal(setModalOpen);

  // Fungsi handler untuk membuka modal tindakan
  const openActionModalHandler = (row, col) => {
    // Pengecekan sedang dalam mode move atau tidak
    if (currentPlayer === 3) {
      handlePut(
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
      );
    } else {
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
    let move = minimax(board, 3, player1, player2, true, {}, -99999, 99999);
    console.log({ move });
    AiMove(
      board,
      setBoard,
      player2,
      setPlayer2,
      move.col,
      move.row,
      move.direction,
      move.action,
      move.status
    );

    setCurrentPlayer(1);
  }

  // Fungsi handler untuk menangani tombol aksi
  const handleActionHandler = (move) => {
    handleAction(
      selectedRow,
      selectedCol,
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
    );

    // Menutup modal setelah tombol aksi ditekan
    closeActionModalHandler();
  };

  // Fungsi untuk menampilkan papan
  const renderBoard = () => {
    const handleMouseEnter = (row, col) => {
      let temp = [...board[row][col]];
      setCurGrid(temp.reverse());
      // alert("asd");
    };

    const handleMouseLeave = () => {
      setCurGrid(null);
      // console.log(curGrid);
    };

    return (
      <div
        style={{
          display: "flex",
          flex: 4,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: "fit-content",
            width: "fit-content",
            padding: "40px",
            border: "1px solid black",
            backgroundColor: "#8f6459",
          }}
        >
          <div
            style={{
              width: "fit-content",
              padding: "20px",
              border: "1px solid black",
              backgroundColor: "#f8dbb2",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 100px)",
                gap: "10px",
                cursor: "pointer", // Set cursor default menjadi pointer
              }}
              disabled={gameover}
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
                      width: "100px",
                      height: "100px",
                      border: "2px solid black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "20px",
                      fontWeight: "bold",
                      cursor:
                        cell.length > 0 &&
                        !isPlayerTurnValid(cell[cell.length - 1].symbol)
                          ? "not-allowed"
                          : currentPlayer === 3
                          ? "pointer"
                          : "pointer",
                      position: "relative",
                      backgroundColor: "white",
                      pointerEvents: `${gameover && "none"}`,
                    }}
                  >
                    {cell.length > 0 && (
                      <div
                        className="bidak"
                        style={{
                          width: "70px",
                          height: "70px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: `${
                            cell.length > 1 ? "1px solid black" : "none"
                          }`,
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
                        onMouseEnter={() =>
                          handleMouseEnter(rowIndex, colIndex)
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <div
                          style={{
                            position: "absolute",
                            width: `${
                              cell[cell.length - 1].symbol === "CB" ||
                              cell[cell.length - 1].symbol === "CW"
                                ? "35px"
                                : "70px"
                            }`,
                            height: `${
                              cell[cell.length - 1].status === "sleeping"
                                ? "70px"
                                : cell[cell.length - 1].status === "standing"
                                ? "25px"
                                : "35px"
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
                              cell[cell.length - 1].status === "capstone"
                                ? "50%"
                                : ""
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
                        {/* 
                        <div className="popup">
                          {curGrid && curGrid.length}
                          {curGrid &&
                            curGrid.slice(0, 10).map((item, index) =>
                              item.status === "capstone" ? (
                                <div key={index}>
                                  <div
                                    style={{
                                      width: "30.5px",
                                      height: "10px",
                                      backgroundColor: `${
                                        cell[cell.length - 1].symbol === "b" ||
                                        cell[cell.length - 1].symbol === "B" ||
                                        cell[cell.length - 1].symbol === "CB"
                                          ? "#8f6459"
                                          : "#f8dbb2"
                                      }`,
                                      transform:
                                        "perspective(1.1px) rotateX(3deg)",
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
                                        cell[cell.length - 1].symbol === "b" ||
                                        cell[cell.length - 1].symbol === "B" ||
                                        cell[cell.length - 1].symbol === "CB"
                                          ? "#8f6459"
                                          : "#f8dbb2"
                                      }`,
                                      transform:
                                        "perspective(5px) rotateX(177deg)",
                                      margin: "auto",
                                      border: "1px solid black",
                                      borderBottom: "none",
                                    }}
                                  >
                                    {cell[cell.length - 1].symbol}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  key={index}
                                  style={{
                                    border: "1px solid black",
                                    backgroundColor: `${
                                      cell[cell.length - 1].symbol === "b" ||
                                      cell[cell.length - 1].symbol === "B" ||
                                      cell[cell.length - 1].symbol === "CB"
                                        ? "#8f6459"
                                        : "#f8dbb2"
                                    }`,
                                    color: `${
                                      item.symbol === "b"
                                        ? "#f8dbb2"
                                        : "#8f6459"
                                    }`,
                                    height: `${
                                      item.status === "sleeping"
                                        ? "30px"
                                        : "60px"
                                    }`,
                                    width: `${
                                      item.status === "sleeping"
                                        ? "100px"
                                        : "30px"
                                    }`,
                                    margin: "auto",
                                    marginTop: "2px",
                                  }}
                                >
                                  {cell[cell.length - 1].symbol}
                                </div>
                              )
                            )}
                        </div> */}
                      </div>
                    )}
                  </div>
                ))
              )}
              {gameover && (
                <div
                  style={{
                    position: "absolute",
                    height: "50px",
                    width: "50px",
                    backgroundColor: "red",
                  }}
                >
                  ASD
                </div>
              )}
            </div>
          </div>
        </div>
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
    <div style={{ backgroundColor: "#6ca494", height: "98vh" }}>
      {route === "menu" && (
        <div
          style={{
            display: "flex",
            height: "80vh",
            flexDirection: "column",
            fontSize: "1.2rem",
          }}
          onClick={() => setRoute("option")}
        >
          <div style={{ flex: 1 }}></div>
          <AnimatedText>
            <div style={{ width: "fit-content" }}>
              <div
                style={{
                  fontSize: "3rem",
                  width: "fit-content",
                  textAlign: "start",
                  padding: "5px",
                }}
              >
                Tak.
              </div>{" "}
              <div
                style={{
                  fontSize: "1.5rem",
                  marginTop: "-13px",
                  width: "100%",
                  textAlign: "start",
                  padding: "5px",
                }}
              >
                A Beautiful Game
              </div>
            </div>
          </AnimatedText>
          <div style={{ fontSize: "1rem", margin: "auto", marginTop: "40px" }}>
            Tap anywhere to start.
          </div>
          <div style={{ flex: 1 }}></div>
        </div>
      )}

      {route === "option" && (
        <>
          <div
            style={{ padding: "20px", cursor: "pointer" }}
            onClick={() => setRoute("menu")}
          >
            {"< Back"}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              height: "80vh",
              fontSize: "2rem",
            }}
          >
            <div style={{ flex: 1 }}></div>
            <div>Choose Difficulty</div>
            <button
              style={{
                width: "100px",
                margin: "auto",
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
              onClick={() => setRoute("game")}
            >
              Easy
            </button>
            <button
              style={{
                width: "100px",
                margin: "auto",
                fontSize: "1.2rem",
                marginBottom: "10px",
              }}
              disabled
            >
              Normal
            </button>
            <button
              style={{
                width: "100px",
                margin: "auto",
                fontSize: "1.2rem",
              }}
              disabled
            >
              Hard
            </button>
            <div style={{ flex: 1 }}></div>
          </div>
        </>
      )}

      {route === "game" && (
        <div
          style={{
            display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            height: "98vh",
          }}
        >
          {/* Tampilkan informasi pemain dan giliran */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "gray",
              padding: "0",
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: "#F8DBB2",
                opacity: `1`,
                color: `black`,
                padding: "20px",
                fontSize: "1.5rem",
              }}
            >
              Player 1:{" "}
              <div
                style={{
                  display: "flex",
                  height: "80px",
                  alignItems: "center",
                  fontSize: "1.5rem",
                }}
              >
                <div style={{ display: "block" }}>
                  <div
                    style={{
                      minWidth: "40px",
                      width: "40px",
                      minHeight: "40px",
                      textAlign: "center",
                      height: "40px",
                      backgroundColor: "bisque",
                      transform: "perspective(2.2px) rotateX(2deg)",
                      margin: "auto",
                      marginRight: "20px",
                      border: "1px solid black",
                    }}
                  ></div>
                </div>
                x {player1.stones}
              </div>
              <div
                style={{
                  display: "flex",
                  height: "80px",
                  alignItems: "center",
                  fontSize: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "block",
                    width: "40px",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  <div
                    style={{
                      minWidth: "20px",
                      width: "20px",
                      minHeight: "12px",
                      height: "12px",
                      backgroundColor: "bisque",
                      transform: "perspective(2.4px) rotateX(6deg)",
                      marginRight: "20px",
                      border: "1px solid black",
                      borderBottom: "0px",
                    }}
                  ></div>
                  <div
                    style={{
                      minWidth: "20px",
                      width: "20px",
                      minHeight: "28px",
                      height: "28px",
                      backgroundColor: "bisque",
                      transform: "perspective(3px) rotateX(176.6deg)",
                      marginTop: "6px",
                      marginRight: "20px",
                      border: "1px solid black",
                      borderBottom: "0px",
                    }}
                  ></div>
                </div>
                x {player1.capstones}
              </div>
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: "#8f6459",
                opacity: `1`,
                color: `black`,
                padding: "20px",
                fontSize: "1.5rem",
              }}
            >
              Player 2:{" "}
              <div
                style={{
                  display: "flex",
                  height: "80px",
                  alignItems: "center",
                  fontSize: "1.5rem",
                }}
              >
                <div style={{ display: "block" }}>
                  <div
                    style={{
                      minWidth: "40px",
                      width: "40px",
                      minHeight: "40px",
                      textAlign: "center",
                      height: "40px",
                      backgroundColor: "bisque",
                      transform: "perspective(2.2px) rotateX(2deg)",
                      margin: "auto",
                      marginRight: "20px",
                      border: "1px solid black",
                    }}
                  ></div>
                </div>
                x {player2.stones}
              </div>
              <div
                style={{
                  display: "flex",
                  height: "80px",
                  alignItems: "center",
                  fontSize: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "block",
                    width: "40px",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  <div
                    style={{
                      minWidth: "20px",
                      width: "20px",
                      minHeight: "12px",
                      height: "12px",
                      backgroundColor: "bisque",
                      transform: "perspective(2.3px) rotateX(6deg)",
                      marginRight: "20px",
                      border: "1px solid black",
                      borderBottom: "0px",
                    }}
                  ></div>
                  <div
                    style={{
                      minWidth: "20px",
                      width: "20px",
                      minHeight: "28px",
                      height: "28px",
                      backgroundColor: "bisque",
                      transform: "perspective(3px) rotateX(176.6deg)",
                      marginTop: "6px",
                      marginRight: "20px",
                      border: "1px solid black",
                      borderBottom: "0px",
                    }}
                  ></div>
                </div>
                x {player2.capstones}
              </div>
            </div>
            {/* <div>Current Turn: Player {currentPlayer}</div> */}
          </div>

          {/* Tampilkan board */}
          {renderBoard()}

          {/* Tampilkan info stack */}
          <div style={{ flex: 1, height: "100%" }}>
            <h1 style={{ textAlign: "center" }}> Stack Information</h1>
            {curGrid && (
              <div style={{ textAlign: "center" }}>
                Stack count: {curGrid.length}
              </div>
            )}
            {curGrid &&
              curGrid.slice(0, 10).map((item, index) =>
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
                  ></div>
                )
              )}
          </div>

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
                          color: `${
                            item.symbol === "b" ? "#f8dbb2" : "#8f6459"
                          }`,
                          height: `${
                            item.status === "sleeping" ? "30px" : "60px"
                          }`,
                          width: `${
                            item.status === "sleeping" ? "100px" : "30px"
                          }`,
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
                  style={{
                    display: "flex",
                    marginTop: "2px",
                    marginBottom: "2px",
                  }}
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
                    onClick={() => handleActionHandler(movecount)}
                    style={{ marginRight: "5px" }}
                  >
                    Ok
                  </button>
                </div>
                <button onClick={closeActionModalHandler}>Close</button>
              </div>
            </div>
          )}

          {/* Tombol untuk mengonsole log isi board */}
          {/* <div>
        <button onClick={logBoard}>Log Board</button>
      </div> */}
        </div>
      )}
    </div>
  );
};

export default App;
