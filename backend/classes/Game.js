function Game(id, player) {
    this.id = id
    this.players = [player]

    this.join = (player) => {
        this.players.append(player)
    }
}
exports.Game = Game