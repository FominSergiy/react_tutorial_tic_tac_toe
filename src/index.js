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


const Board = () => {
    const initStateArr = Array(9).fill(null);

    // hooks
    const [squares, setSquares] = React.useState(initStateArr);
    const [xIsNext, setNext] = React.useState(true);


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

    const handleClick = (squares, setSquares, i, xIsNext, setNext) => {
        squares = squares.slice();

        // check if winner or square is not null
        if (calculateWinner(squares) || squares[i]) {
            return
        }

        squares[i] = xIsNext ? 'X' : 'O';
        setSquares(squares);
        setNext(!xIsNext); // set the xIsNext to the opposite Bool value
    }


    //check for winner 
    const winner = calculateWinner(squares);
    let status;

    if (winner) {
        status = `Winner:${winner}`;
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'} `;
    }
    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {renderSquare(squares, setSquares, 0, xIsNext, setNext)}
                {renderSquare(squares, setSquares, 1, xIsNext, setNext)}
                {renderSquare(squares, setSquares, 2, xIsNext, setNext)}
            </div>
            <div className="board-row">
                {renderSquare(squares, setSquares, 3, xIsNext, setNext)}
                {renderSquare(squares, setSquares, 4, xIsNext, setNext)}
                {renderSquare(squares, setSquares, 5, xIsNext, setNext)}
            </div>
            <div className="board-row">
                {renderSquare(squares, setSquares, 6, xIsNext, setNext)}
                {renderSquare(squares, setSquares, 7, xIsNext, setNext)}
                {renderSquare(squares, setSquares, 8, xIsNext, setNext)}
            </div>
        </div>
    );
}

const Game = () => {
    return (
        <div className="game">
            <div className="game-board">
                <Board />
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