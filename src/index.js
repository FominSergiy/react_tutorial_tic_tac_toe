import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}


const Board = (props) => {
    // // hooks
    // const [squares, setSquares] = React.useState(Array(9).fill(null));


    const handleClick = (squares, setSquares, i, xIsNext, setNext) => {
        squares = squares.slice();

        // check if winner or if square is not null
        if (calculateWinner(squares) || squares[i]) {
            return
        }

        squares[i] = xIsNext ? 'X' : 'O';
        setSquares(squares);
        setNext(!xIsNext); // set the xIsNext to the opposite Bool value
    }


    const renderSquare = (squares, setSquares, i, xIsNext, setNext) => {
        // where are all arguements stored
        // after this dom element was generated? 
        return (
            <Square
                value={squares[i]}
                onClick={() => handleClick(squares, setSquares, i, xIsNext, setNext)}
            />
        );
    }

    //check for winner 
    const winner = calculateWinner(squares);
    const status = checkForWinner(winner, props);

    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {renderSquare(squares, setSquares, 0, props.xIsNext, props.setNext)}
                {renderSquare(squares, setSquares, 1, props.xIsNext, props.setNext)}
                {renderSquare(squares, setSquares, 2, props.xIsNext, props.setNext)}
            </div>
            <div className="board-row">
                {renderSquare(squares, setSquares, 3, props.xIsNext, props.setNext)}
                {renderSquare(squares, setSquares, 4, props.xIsNext, props.setNext)}
                {renderSquare(squares, setSquares, 5, props.xIsNext, props.setNext)}
            </div>
            <div className="board-row">
                {renderSquare(squares, setSquares, 6, props.xIsNext, props.setNext)}
                {renderSquare(squares, setSquares, 7, props.xIsNext, props.setNext)}
                {renderSquare(squares, setSquares, 8, props.xIsNext, props.setNext)}
            </div>
        </div>
    );
}

const Game = () => {
    const [history, setHistory] = React.useState(Array(9).fill(null));
    const [xIsNext, setNext] = React.useState(true);

    // passing most recent
    const current = history[history.length - 1];
    const [squares, setSquares] = React.useState(current);

    // pass hooks to Board eleme nt
    const stateProps = {
        history: history,
        setHistory: setHistory,
        xIsNext: xIsNext,
        setNext: setNext,
        squares: squares,
        setSquares: setSquares
    };


    const winner = calculateWinner(current);
    const gameStatus = checkForWinner(winner, stateProps);


    return (
        <div className="game">
            <div className="game-board">
                <Board {...stateProps} />
            </div>
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
        </div>
    );
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function calculateWinner(squares) {
    console.log('-----------------');
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // console.log(lines[i]);
        // console.log(`%c aa ${squares[a] && squares[a]}`, 'color:purple');
        // console.log(`%c ba ${squares[b] && squares[a]}`, 'color:lightBlue');
        // console.log(`%c c ${squares[c]}`, 'color:pink');
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function checkForWinner(winner, props) {
    let status;

    if (winner) {
        status = `Winner:${winner}`;
    } else {
        status = `Next player: ${props.xIsNext ? 'X' : 'O'} `;
    }

    return status;
}