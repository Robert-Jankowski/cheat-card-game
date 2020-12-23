function Database() {
    this.games = []
    this.players = []

    this.createGame = (game) => {
        this.games.append(game)
    }
}
exports.Database = Database