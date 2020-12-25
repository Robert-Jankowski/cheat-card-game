function Game(id, player, deck) {
    this.id = id
    this.players = [player]
    this.deck = deck
    this.status = 'waiting'
    this.pile = []
    this.turn = null
    this.declared = {
        value: 2,
        number: null
    }

    this.join = (player) => {
        if(this.status !== 'ingame')
            this.players.push(player)
    }
    this.move = (playerIndex, cards, declared) => {
        //cards verification in frontend
        if(this.status === 'ingame' && cards.length <= 4 && this.turn === playerIndex && declared >= this.declared.value) {
            this.pile = [...cards, ...this.pile]
            this.players[playerIndex].hand = this.players[playerIndex].hand.filter(n => !cards.includes(n))
            this.declared = {value: declared, number: cards.length}
            this.turn = this.turn === this.players.length - 1 ? 0 : this.turn + 1
        }
    }
    this.start = () => {
        this.status = 'ingame'
        this.players = this.players.map(n => ({...n, hand:[]}))
        this.deck.map((n,i) => this.players[i%this.players.length].hand.push(n))
        const firstPlayerIndex = this.players.findIndex(n => n.hand.includes("hearts:2"))
        this.turn = firstPlayerIndex
        this.move(firstPlayerIndex, ["hearts:2"], 2)
    }
    this.draw = (playerIndex, number) => {
        if(number >= this.pile.length) {
            this.players[playerIndex].hand = [...this.pile.splice(0, this.pile.length - 1), ...this.players[playerIndex].hand]
            this.pile = [this.pile[this.pile.length - 1]]
        }
        else {
            this.players[playerIndex].hand = [...this.pile.splice(0, number), ...this.players[playerIndex].hand]
            this.pile = this.pile.splice(0, number + 1)
        }
    }
}
exports.Game = Game