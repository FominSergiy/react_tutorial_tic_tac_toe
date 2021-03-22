import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    return (
        <button
            className={`square ${props.winClass}`}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}


const Board = (props) => {

    const renderSquare = (props, i) => {
        let winClass;

        if (props.winCombination) {
            winClass = props.winCombination.includes(i) ?
                'square-win' : '';
        }

        return (
            <Square
                key={i}
                winClass={winClass}
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        );
    }

    const generateGrid = (props) => {
        // using index as keys, which is suboptimal
        const items = [];

        for (let i = 0; i < 9; i += 3) {
            const subItems = [];

            for (let j = 0 + i; j < i + 3; j++) {

                subItems.push(renderSquare(props, j));
            }

            items.push(
                <div key={i} className="board-row">{subItems}</div>
            );
        }

        return items;
    }


    const items = generateGrid(props);
    return (
        <div>
            {items}
        </div>
    );
}

const Game = () => {
    //hooks
    const [squares, setSquares] = React.useState(Array(9).fill(null));
    const [history, setHistory] = React.useState([squares]);
    const [xIsNext, setNextX] = React.useState(true);
    const [step, setStep] = React.useState(0);
    const [sortAsc, setsortAsc] = React.useState(true);
    const [movesList, setMoves] = React.useState(['start-move']);

    React.useEffect(() => {
        sortDOM(sortAsc, 'info-history');
        sortDOM(sortAsc, 'moves-history');
    }, [sortAsc, squares]);


    const handleClick = (i) => {
        const historyCopy = history.slice(0, step + 1);
        const current = historyCopy[historyCopy.length - 1].slice();

        // check if winner or if square is not null
        if (calculateWinner(current) || current[i]) {
            return
        }

        current[i] = xIsNext ? 'X' : 'O';

        //setting up move history
        const moveString = getMoveString(i, xIsNext);
        const moveListCopy = movesList.slice(0, step + 1);


        setSquares(current);
        setHistory(historyCopy.concat([current]))
        setStep(historyCopy.length);
        setNextX(!xIsNext);// set the xIsNext to the opposite Bool value
        setMoves(moveListCopy.concat(moveString));
    }

    const jumpTo = (step) => {
        setStep(step);

        const isStepNumEven = (step % 2) === 0;
        setNextX(isStepNumEven);
    }


    const winner = calculateWinner(squares);
    const status = checkForWinner(winner, xIsNext, step);
    const moves = getHistoryElementsList(history, jumpTo, sortAsc);
    const moveSteps = getMoveElement(movesList);


    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={history[step]}
                    onClick={(i) => handleClick(i)}
                    winCombination={winner ? winner.combination : undefined}
                />
            </div>
            <div className="game-info">
                <div className="status">
                    {status}
                    <button className="sort" onClick={() => setsortAsc(!sortAsc)}>
                        {'sort'}
                    </button>
                </div>
                <ol id='info-history'>{moves}</ol>
            </div>
            <div className="game-info moves-history">
                <ol id='moves-history'>
                    {moveSteps}
                </ol>
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

            // need to return combination to highlight winning squares
            return { won: squares[a], combination: lines[i] }
        }
    }
    return null;
}

function checkForWinner(winner, xIsNext, step) {
    let status;

    if (winner) {
        status = `Winner:${winner.won}`;
    } else if (step === 9) {
        status = 'Its a Draw!';
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'} `;
    }

    return status;

}

function getHistoryElementsList(history, jumpTo) {

    const moves = history.map((step, move) => {
        const desc = move ?
            `Go to move #${move}`
            : 'Go to game start';

        return (
            // move is an index, and we are adviced not to use it
            // we can use string of moves as the key
            <li key={move} order={move}>
                <button onClick={() => jumpTo(move)}>
                    {desc}
                </button>
            </li>
        )
    });
    return moves;

}

function sortDOM(sortAsc, elementId) {
    const list = document.getElementById(elementId);

    const items = list.childNodes;
    const itemsArr = [...items];

    if (!sortAsc) {
        itemsArr.sort((a, b) => {
            return a.attributes.order.value < b.attributes.order.value
                ? 1
                : -1
        });
    } else {
        itemsArr.sort((a, b) => {
            return a.attributes.order.value < b.attributes.order.value
                ? -1
                : 1
        });
    }

    for (let i = 0; i < itemsArr.length; ++i) {
        list.appendChild(itemsArr[i]);
    }

}

// move list
function getMoveString(i, xIsNext) {

    const columns = {
        1: [0, 3, 6],
        2: [1, 4, 7],
        3: [2, 5, 8]
    }

    const rows = {
        1: [0, 1, 2],
        2: [3, 4, 5],
        3: [6, 7, 8]
    }

    const whoMoves = xIsNext ? 'X' : 'O';
    let moveString = `${whoMoves} moved to `;
    let movePos;

    for (const prop in columns) {
        if (columns[prop].includes(i)) {
            movePos = `(col:${prop}, `;

            for (const subProp in rows) {
                if (rows[subProp].includes(i)) movePos = movePos + `row:${subProp})`;

            }
        }
    }

    return moveString + movePos;
}


function getMoveElement(movesList) {

    const stepMoves = movesList.map((moveString, index) => {
        return (
            // move is an index, and we are adviced not to use it
            // we can use string of moves as the key
            <li key={index} order={index}>
                {moveString}
            </li>
        )
    });
    return stepMoves;

}