const grid = document.querySelector(".grid")

let timerId

const gridWidth = 600
const gridHeight = 300

const blockWidth = 100
const blockHeight = 20

const ballRadius = 20

let user
const userStep = 10
const currentUserPos = [gridWidth / 2 - blockWidth / 2, 0]

const blocks = []

let ball
const ballStep = 2
const ballDirection = [1, 1]
const currentBallPos = [currentUserPos[0] + blockWidth / 2 - ballRadius / 2, currentUserPos[1] + blockHeight]

class Block {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

function addBlocks() {
    for (let x = 0; x < gridWidth; x += blockWidth) {
        for (let y = 10 * blockHeight; y < gridHeight; y += blockHeight) {
            blocks.push(new Block(x, y))
        }
    }

    blocks.forEach(block => {
        const blockElement = document.createElement('div')
        block.element = blockElement
        blockElement.classList.add('block')
        blockElement.style.left = block.x + 'px'
        blockElement.style.bottom = block.y + 'px'
        grid.appendChild(blockElement)
    })
}

function addUser() {
    user = document.createElement('div')
    user.classList.add('user')
    drawUser()
    grid.appendChild(user)
}

function drawUser() {
    user.style.left = currentUserPos[0] + 'px'
    user.style.bottom = currentUserPos[1] + 'px'
}

function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentUserPos[0] - userStep >= 0) {
                currentUserPos[0] -= userStep
            }
            break;
        case 'ArrowRight':
            if (currentUserPos[0] + blockWidth + userStep <= gridWidth) {
                currentUserPos[0] += userStep
            }
            break;
    }
    drawUser()
}

function addBall() {
    ball = document.createElement('div')
    ball.classList.add('ball')
    drawBall()
    grid.appendChild(ball)
}

function drawBall() {
    ball.style.left = currentBallPos[0] + 'px'
    ball.style.bottom = currentBallPos[1] + 'px'
}

function moveBall() {

    if (blocks.length === 0) {
        alert('YOU WON!')
        clearInterval(timerId)
    }

    if (currentBallPos[1] <= 0) {
        alert('YOU LOST!')
        clearInterval(timerId)
    }

    currentBallPos[0] += ballStep * ballDirection[0]
    currentBallPos[1] += ballStep * ballDirection[1]
    checkForCollisions()
    drawBall()
}

function checkForCollisions() {
    checkUserCollision()
    checkWallCollision()
    checkBlockCollision()
}

function checkWallCollision() {
    if (currentBallPos[0] <= 0 || currentBallPos[0] + ballRadius >= gridWidth) {
        ballDirection[0] = ballDirection[0] * -1
    }

    if (currentBallPos[1] <= 0 || currentBallPos[1] + ballRadius >= gridHeight) {
        ballDirection[1] = ballDirection[1] * -1
    }
}

function checkUserCollision() {
    if (currentBallPos[1] <= currentUserPos[1] + blockHeight
        && currentBallPos[0] >= currentUserPos[0]
        && currentBallPos[0] <= currentUserPos[0] + blockWidth
    ) {
        ballDirection[1] = ballDirection[1] * -1
    }
}

function checkBlockCollision() {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (intersects(block, currentBallPos[0] + ballStep, currentBallPos[1])
            || intersects(block, currentBallPos[0] - ballStep, currentBallPos[1])) {
            ballDirection[0] *= -1
            blocks[i].element.classList.remove('block')
            blocks.splice(i, 1)
            break
        }

        if (intersects(block, currentBallPos[0], currentBallPos[1] + ballStep)
        || intersects(block, currentBallPos[0], currentBallPos[1] - ballStep)) {
            ballDirection[1] *= -1
            blocks[i].element.classList.remove('block')
            blocks.splice(i, 1)
            break
        }
    }
}

function intersects(block, x, y) {
    return y <= block.y + blockHeight
        && y + ballRadius >= block.y
        && x + ballRadius >= block.x
        && x <= block.x + blockWidth
}

addBlocks()
addUser()
addBall()

document.addEventListener('keydown', moveUser)
timerId = setInterval(moveBall, 20)

