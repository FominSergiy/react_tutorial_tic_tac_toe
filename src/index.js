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
    const [xIsNext, setNextX] = React.useState(true);
    const [step, setStep] = React.useState(0);

    console.log('=====');
    console.log(history);
    console.log('=====');

    console.log('++++');
    console.log(squares);
    console.log('++++');

    const handleClick = (i) => {
        const historyCopy = history.slice(0, step + 1);
        const current = historyCopy[historyCopy.length - 1].slice();
        console.log(current);
        // console.log(historyCopy.length);
        // check if winner or if square is not null
        if (calculateWinner(current) || current[i]) {
            return
        }

        current[i] = xIsNext ? 'X' : 'O';

        setSquares(current);
        setHistory(historyCopy.concat([current]));
        setStep(historyCopy.length);
        setNextX(!xIsNext);// set the xIsNext to the opposite Bool value
    }


    const jumpTo = (step) => {
        // console.log(history);
        setStep(step);
        console.log('step is:' + step);

        const isStepNumEven = (step % 2) === 0;
        setNextX(isStepNumEven);
    }


    const winner = calculateWinner(squares);
    const status = checkForWinner(winner, xIsNext);
    const moves = getHistoryElementsList(history, jumpTo);

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={history[step]}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div className="status">{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

// ======= SUPPORTING FUNCTIONS ==========
function calculateWinner(squares) {
    // console.log('-----------------');
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


function getHistoryElementsList(history, jumpTo) {
    // step is an array in history with moves in that step
    // move is the index of that arr inside history parent arr
    const moves = history.map((step, move) => {
        const desc = move ?
            `Go to move #${move}`
            : 'Go to game start';

        return (
            // move is an index, and we are adviced not to use it
            // we can use string of moves as the key
            <li key={move}>
                <button onClick={() => jumpTo(move)}>
                    {desc}
                </button>
            </li>
        )
    });
    return moves;
}