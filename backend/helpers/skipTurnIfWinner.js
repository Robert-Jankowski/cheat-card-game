function skipTurnIfWinner(gameState) {
    if (gameState.winners.includes(gameState.players[gameState.turn])) {
        if (gameState.turn === gameState.players.length - 1)
        gameState.turn = 0
        else
        gameState.turn = gameState.turn + 1
    }
}
exports.skipTurnIfWinner = skipTurnIfWinner