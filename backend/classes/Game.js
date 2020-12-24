function Game(id, player, deck) {
    this.id = id
    this.players = [player]
    this.deck = deck
    this.status = 'waiting'

    this.join = (player) => {
        if(this.status !== 'ingame')
            this.players.append(player)
    }
    this.move = (player, cards) => {
        if(cards.length <= 4) {
            this.pile = [...this.pile, ...cards]
            player.hand.filter(n => !cards.includes(n))
        }
    }
    this.start = () => {
        this.players = this.players.map(n => ({...n, hand:[]}))
        this.deck.map((n,i) => this.players[i%players.length].hand.push(n))
        this.pile = []
        const firstPlayer = this.players.find(n => n.hand.includes("hearts:2"))
        this.move(firstPlayer, ["hearts:2"])
    }
}
exports.Game = Game