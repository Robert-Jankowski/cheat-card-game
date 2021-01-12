function checkIfPreviousPlayerWinning(gameState, playerIndex) {

    gameState.players.forEach((n, i) => {
        if(i !== playerIndex) {
            if(n.hand.length === 0 && !gameState.winners.includes(n))
                gameState.winners.push(n)
        }
    })
}
exports.checkIfPreviousPlayerWinning = checkIfPreviousPlayerWinning