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

    const renderSquare = (props, i) => {
        // where are all arguements stored
        // after this dom element was generated?
        return (
            <Square
                value={props.squares[i]}
                onClick={() => props.onClick(i)} //! why I don't need to pass props here?
            />
        );
    }

    return (
        <div>
            <div className="board-row">
                {renderSquare(props, 0)}
                {renderSquare(props, 1)}
                {renderSquare(props, 2)}
            </div>
            <div className="board-row">
                {renderSquare(props, 3)}
                {renderSquare(props, 4)}
                {renderSquare(props, 5)}
            </div>
            <div className="board-row">
                {renderSquare(props, 6)}
                {renderSquare(props, 7)}
                {renderSquare(props, 8)}
            </div>
        </div>
    );
}

const Game = () => {
    //hooks
    const [squares, setSquares] = React.useState(Array(9).fill(null));
    const [history, setHistory] = React.useState([squares]);
    const [xIsNext, setNext] = React.useState(true);


    const handleClick = (i) => {
        // getting most recent from history
        const current = squares.slice();

        // check if winner or if square is not null
        if (calculateWinner(current) || current[i]) {
            return
        }

        current[i] = xIsNext ? 'X' : 'O';
        setHistory(history.concat([current]));
        setNext(!xIsNext);
        setSquares(current);// set the xIsNext to the opposite Bool value
    }


    const winner = calculateWinner(squares);
    const status = checkForWinner(winner, xIsNext);

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div className="status">{status}</div>
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

function checkForWinner(winner, xIsNext) {
    let status;

    if (winner) {
        status = `Winner:${winner}`;
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'} `;
    }

    return status;
}