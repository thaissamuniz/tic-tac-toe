(function app() {
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
            setWinner(X)
            return true
        } else if (contaO === 3) {
            setWinner(O);
            return true
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
                    setWinner(X);
                    return true
                } else {
                    setWinner(O);
                    return true
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
            if (rows[1][1] == X) {
                setWinner(X);
                return true
            } else {
                setWinner(O);
                return true
            }
        }
    }

    function tie() {
        if (clicks === 0) {
            result.innerText = 'deu velha!';
            results.style.display = 'block';
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

    function updateTimeResult(winner) {
        let endGame = new Date().getTime();
        let timeGame = endGame - startGame;
        let min = Math.floor((timeGame / 1000 / 60) << 0);
        let sec = Math.floor((timeGame / 1000) % 60);
        durationTimeEl.innerText = `${min}m : ${sec}s`;

        if (timeGame < bestTimeGame) {
            bestTimeGame = timeGame;
            bestTimeEl.innerHTML = `jogador ${winner} ${min}m : ${sec}s`;
        }
    }


    function getUserPoints(user) {
        let counter = 0;
        for (const row of rows) {
            for (const column of row) {
                if (column == user) {
                    counter++;
                }
            }
        }
        if (counter <= 4) {
            return 2;
        }
        return 1;
    }

    const setWinner = (winner) => {

        results.style.display = 'block';
        container.classList.add('tile__ocupped');
        result.innerHTML = winnerText + winner;

        updateTimeResult(winner);

        if (winner == X) {
            const points = getUserPoints(X);
            scorePlayerX = scorePlayerX + points
            scoreX.innerText = scorePlayerX;

        } else if (winner == O) {
            const points = getUserPoints(O);
            scorePlayerO = scorePlayerO + points
            scoreO.innerText = scorePlayerO;
        }
    }

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', (e) => {
            const nextRound = getNextRound(currentRound);
            const tile = e.target;
            const tileRow = tile.parentNode;
            tile.innerHTML = nextRound;
            currentRound = nextRound;

            h2.innerHTML = getNextRound(currentRound);
            tile.classList.add('tile__ocupped');
            clicks--;
            addValue(tileRow, i);

            if (verifyLine(tileRow) || verifyColumn(rows) || verifyDiagonal(rows)) {
                return;
            }
            tie();
        })
    }

    reloadButton.addEventListener('click', restart);
}());
