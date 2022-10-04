const tileRow = document.querySelector('.tile_row');
const tiles = document.querySelectorAll('.tile');
const h2 = document.getElementById('sJogadorDaVez');
const result = document.querySelector('.result');
const reloadButton = document.querySelector('.reload');
const container = document.querySelector('.container');
const scoreX = document.querySelector('.score__x');
const scoreO = document.querySelector('.score__o');
const durationTimeEl = document.getElementById('duration-time');
const results = document.querySelector('.results');
const bestTimeEl = document.querySelector('.best-time');
const columnLength = 3;
const X = "X";
const O = "O";
const initialPlayer = O;
let clicks = 9;
let currentRound = initialPlayer;
const winnerText = `o ganhador foi o jogador: `;
let scorePlayerX = 0;
let scorePlayerO = 0;
let bestTimeGame = Number.POSITIVE_INFINITY;

let rows = [
    [],
    [],
    []
];
let startGame = new Date().getTime();

function verifyLine(el) {
    let contaX = 0;
    let contaO = 0;
    let rowChildren = el.children;

    for (i = 0; i < rowChildren.length; i++) {
        let rowFirtsChild = rowChildren[i].firstChild;
        if (rowFirtsChild == null) {
            continue;
        }
        if (rowFirtsChild.textContent == X) {
            contaX++;
        } else if (rowFirtsChild.textContent == O) {
            contaO++
        }
    }

    if (contaX === 3) {
        return X
    } else if (contaO === 3) {
        return O;
    }
}


function getRowIndexByTileIndex(tileIndex) {
    return (Math.ceil((tileIndex + 1) / columnLength)) - 1;
}

function addValue(element, tileIndex) {
    let tileRowChildren = element.children;

    for (i = 0; i < tileRowChildren.length; i++) {
        const tileRowFirstChild = tileRowChildren[i].firstChild;
        const rowIndex = getRowIndexByTileIndex(tileIndex);

        if (tileRowFirstChild === null) {
            continue;
        } else {
            rows[rowIndex][i] = tileRowFirstChild.textContent;
        }
    }
}

function getNextRound(currentRound) {
    if (currentRound === O) {
        return X;
    } else {
        return O;
    }
}


function verifyColumn(rows) {
    for (i = 0; i < rows.length; i++) {
        if ((rows[0][i] == null) || (rows[1][i] == null) || (rows[2][i] == null)) {
            continue;
        } else if (rows[0][i] === rows[1][i] && rows[1][i] === rows[2][i]) {
            // console.log('vc ganhou');
            if (rows[0][i] == X) {
                return X;
            } else {
                return O;
            }

        }
    }
}

function verifyDiagonal(rows) {
    if (((rows[0][0] != null && (rows[0][0] == rows[1][1])) &&
        (rows[1][1] != null && rows[1][1] == rows[2][2])
        ||
        (rows[0][2] != null && rows[0][2] == rows[1][1]) &&
        (rows[1][1] != null && rows[1][1] == rows[2][0]))) {
        // console.log('ganhou na diagonal');
        if (rows[1][1] == X) {
            return X;
        } else {
            return O;
        }
    }
}

function tie() {
    if (clicks === 0) {
        result.innerText = 'deu velha!'
        console.log('deu velha');
    }
}


const restart = () => {
    console.log('restart');
    for (const tile of tiles) {
        tile.innerText = '';
        tile.classList.remove('tile__ocupped');
    }

    rows = [[], [], []];
    result.innerText = '';
    container.classList.remove('tile__ocupped');
    currentRound = initialPlayer;
    h2.innerHTML = getNextRound(currentRound);
    clicks = 9;
    startGame = new Date().getTime();
    durationTimeEl.innerText = '';
    results.style.display = 'none';

}

const setWinner = (winner) => {

    results.style.display = 'block';
    container.classList.add('tile__ocupped');
    result.innerHTML = winnerText + winner;
    let point = 1;
    let xCounter = 0;
    let oCounter = 0;

    //timer();

    let endGame = new Date().getTime();
    let timeGame = endGame - startGame;
    let min = Math.floor((timeGame / 1000 / 60) << 0);
    let sec = Math.floor((timeGame / 1000) % 60);
    durationTimeEl.innerText = `${min}m : ${sec}s`

    if (timeGame < bestTimeGame) {
        bestTimeGame = timeGame;
        bestTimeEl.innerHTML = `jogador ${winner} ${min}m : ${sec}s`
    }

    if (winner == X) {

        for (const row of rows) {
            for (const column of row) {
                if (column == X) {
                    xCounter++;
                }
            }
        }
        if (xCounter <= 4) {
            point++;
        }
        scorePlayerX = scorePlayerX + point
        scoreX.innerText = scorePlayerX;

    } else if (winner == O) {

        for (const row of rows) {
            for (const column of row) {
                if (column == O) {
                    oCounter++;
                }
            }

        }

        if (oCounter <= 4) {
            point++;
        }
        scorePlayerO = scorePlayerO + point
        scoreO.innerText = scorePlayerO;
    }
}

// function timer() {
//     let endGame = new Date().getTime();
//     let timeGame = endGame - startGame;
//     let min = Math.floor((timeGame / 1000 / 60) << 0);
//     let sec = Math.floor((timeGame / 1000) % 60);
//     durationTimeEl.innerText = `${min}m : ${sec}s`

//     if (timeGame < bestTimeGame) {
//         bestTimeGame = timeGame;
//         bestTimeEl.innerHTML =  `${min}m : ${sec}s`;
//     }

// }

for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];

    tile.addEventListener('click', (e) => {
        const nextRound = getNextRound(currentRound);
        const tile = e.target;
        const tileRow = tile.parentNode;
        tile.innerHTML = nextRound;
        currentRound = nextRound;

        h2.innerHTML = getNextRound(currentRound);
        tile.classList.add('tile__ocupped');
        clicks--;
        addValue(tileRow, i);

        let lWinner = verifyLine(tileRow);
        if (lWinner) {
            setWinner(lWinner);
            return;
        }

        let cWinner = verifyColumn(rows);
        if (cWinner) {
            setWinner(cWinner);
            return;
        }

        let dWinner = verifyDiagonal(rows);
        if (dWinner) {
            setWinner(dWinner);
            return;
        }

        tie();

        console.log(rows);

    })
}

reloadButton.addEventListener('click', restart);



