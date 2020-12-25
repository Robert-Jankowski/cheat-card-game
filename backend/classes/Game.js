function Game(id, player, deck) {
    this.id = id
    this.players = [player]
    this.deck = deck
    this.status = 'waiting'
    this.pile = []
    this.turn = null

    this.join = (player) => {
        if(this.status !== 'ingame')
            this.players.push(player)
    }
    this.move = (playerIndex, cards) => {
        if(cards.length <= 4 && this.turn === playerIndex ) {
            this.pile = [...this.pile, ...cards]
            this.players[playerIndex].hand = this.players[playerIndex].hand.filter(n => !cards.includes(n))
            this.turn = this.turn + 1 < this.players.length - 1 ? this.turn + 1 : 0
        }
    }
    this.start = () => {
        this.status = 'ingame'
        this.players = this.players.map(n => ({...n, hand:[]}))
        this.deck.map((n,i) => this.players[i%this.players.length].hand.push(n))
        const firstPlayerIndex = this.players.findIndex(n => n.hand.includes("hearts:2"))
        this.turn = firstPlayerIndex
        this.move(firstPlayerIndex, ["hearts:2"])
    }
}
exports.Game = Game