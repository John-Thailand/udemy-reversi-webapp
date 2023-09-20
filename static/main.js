const EMPTY = 0
const DARK = 1
const LIGHT = 2

const boardElement = document.getElementById('board')

async function showBoard() {
    const turnCount = 0
    const response = await fetch(`/api/games/latest/turns/${turnCount}`)
    const responseBody = await response.json()
    const board = responseBody.board

    // 'board'要素に子要素があれば、全て削除する
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild)
    }

    // 子要素を作成する
    board.forEach((line) => {
        line.forEach((square) => {
            // <div class="square">
            const squareElement = document.createElement('div')
            squareElement.className = 'square'

            if (square !== EMPTY) {
                // <div class="stone dark">
                const stoneElement = document.createElement('div')
                const color = square === DARK ? 'dark' : 'light'
                stoneElement.className = `stone ${color}`

                squareElement.appendChild(stoneElement)
            }

            boardElement.appendChild(squareElement)
        })
    })
}

async function registerGame() {
    await fetch('/api/games', {
        method: 'POST'
    })
}

async function main() {
    await registerGame()
    await showBoard()
}

main()