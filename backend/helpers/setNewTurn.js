function setNewTurn(gameState) {
    gameState.turn = gameState.turn === gameState.players.length - 1 ? 0 : gameState.turn + 1
}
exports.setNewTurn = setNewTurn