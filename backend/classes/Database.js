function Database() {
    this.games = []
    this.players = []

    this.createGame = (game) => {
        this.games.push(game)
    }
}
exports.Database = Database