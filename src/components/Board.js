import { useEffect, useState } from "react";

const Board = ({ user, play, gameMove, leaveGame }) => {
    // const [player, setPlayer] = useState(user);
    // const [playerRed, setPlayerRed] = useState();
    // const [playerYellow, setPlayerYellow] = useState();
    // const [currPlayer, setCurrPlayer] = useState(playerRed);
    const [turnToPlay, setTurnToPlay] = useState(user.turn);

    const [winner, setWinner] = useState();
    const [gameOver, setGameOver] = useState(false);

    const [board, setBoard] = useState([]);
    const [currColumns, setCurrColumns] = useState([]);

    const [rows] = useState(6);
    const [columns] = useState(7);

    useEffect(() => {
        setGame();
        setHtmlBoard();
    }, []);
    
    useEffect(() => {
        if (gameMove) {
            if(user.color == gameMove.color){
                setTurnToPlay(false);
            } else {
                setTurnToPlay(true);
            }
            fillColors(gameMove);
        }
    }, [gameMove]);

    const setGame = () => {
        // JS
        setBoard([]);
        setCurrColumns([5, 5, 5, 5, 5, 5, 5]);
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < columns; c++) {
                row.push(" ");
            }
            setBoard((current => [...current, row]));
        }
    }

    const [structure, setStructure] = useState();

    const setHtmlBoard = () => {
        // HTML
        let tiles = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                tiles.push(
                    <div key={`${r}-${c}`} id={`${r}-${c}`}
                        onClick={e => setPiece(e)}
                        className="tile" ></div>
                );
            }
        }
        setStructure(tiles);
    }

    const setPiece = (e) => {
        if (gameOver) {
            return;
        }
        play(e.target.id);
    }

    const fillColors = (gameMove) => {
        let coords = gameMove.coord.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        r = currColumns[c];
        if (r < 0) {
            return;
        }


        board[r][c] = gameMove.user;
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        if (gameMove.color === "red") {
            tile.classList.add("red-piece");
        } else {
            tile.classList.add("yellow-piece");
        }

        r -= 1; // updating the row heigh for the column
        let oldCurrColumns = currColumns;
        oldCurrColumns[c] = r;
        setCurrColumns(oldCurrColumns);

        checkWinner();
    }

    const checkWinner = () => {
        // Horizontally
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns - 3; c++) {
                if (board[r][c] != " ") {
                    if (board[r][c] == board[r][c + 1] && board[r][c + 1] == board[r][c + 2] && board[r][c + 2] == board[r][c + 3]) {
                        setWinnerFun(r, c);
                        return;
                    }
                }
            }
        }

        // Vertically
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows - 3; r++) {
                if (board[r][c] != " ") {
                    if (board[r][c] == board[r + 1][c] && board[r + 1][c] == board[r + 2][c] && board[r + 2][c] == board[r + 3][c]) {
                        setWinnerFun(r, c);
                        return;
                    }
                }
            }
        }

        // Anti Diagonally
        for (let r = 0; r < rows - 3; r++) {
            for (let c = 0; c < columns - 3; c++) {
                if (board[r][c] != " ") {
                    if (board[r][c] == board[r + 1][c + 1] && board[r + 1][c + 1] == board[r + 2][c + 2] && board[r + 2][c + 2] == board[r + 3][c + 3]) {
                        setWinnerFun(r, c);
                        return;
                    }
                }
            }
        }

        // Diagonally
        for (let r = 3; r < rows; r++) {
            for (let c = 0; c < columns - 3; c++) {
                if (board[r][c] != " ") {
                    if (board[r][c] == board[r - 1][c + 1] && board[r - 1][c + 1] == board[r - 2][c + 2] && board[r - 2][c + 2] == board[r - 3][c + 3]) {
                        setWinnerFun(r, c);
                        return;
                    }
                }
            }
        }

    }

    const setWinnerFun = (r, c) => {
        let winner = board[r][c];
        setWinner(winner);
        setGameOver(true);
        setTimeout(() => {
            leaveGame();
        }, 3000);
    }

    return <div className="row justify-content-center">

        {winner &&
            <div>
                <h2>Winner is: <b>{winner}</b></h2>
            </div>
        }
        {!winner &&
            <div className="d-flex justify-content-end p-0 mb-2" style={{ width: "610px" }}>
                <button onClick={() => leaveGame()} className="btn btn-danger">Leave game</button>
            </div>
        }
        <div id="board" className={`${gameOver == true ? "gameOver" : ""} ${turnToPlay == false ? "turnToPlay" : ""}`}>
            {structure}
        </div>
    </div>
}

export default Board;