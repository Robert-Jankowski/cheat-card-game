function Game(id, player, deck) {
    this.id = id
    this.players = [player]
    this.deck = deck
    this.status = 'waiting'
    this.pile = []
    this.turn = null
    this.declared = {
        value: "2",
        number: null,
        player: null
    }
    this.winners = []

    this.join = (player) => {
        if(this.status !== 'ingame')
            this.players.push(player)
    }
    this.move = (playerIndex, cards, declared) => {
        //cards verification in frontend
        if(this.status === 'ingame' &&
        cards.length <= 4 &&
         this.turn === playerIndex &&
          declared >= this.declared.value &&
           !this.winners.includes(this.players[playerIndex])) {
            this.pile = [...cards, ...this.pile]
            this.players[playerIndex].hand = this.players[playerIndex].hand.filter(n => !cards.includes(n))
            this.declared = {value: declared, number: cards.length, player: playerIndex}
            this.turn = this.turn === this.players.length - 1 ? 0 : this.turn + 1
            if(this.winners.includes(this.players[this.turn])) {
                if(this.turn === this.players.length - 1)
                    this.turn = 0
                else
                    this.turn = this.turn + 1
            }
            if(playerIndex < 1) {
                if(this.players[this.players.length - 1].hand.length === 0) {
                    this.winners.push(this.players[playerIndex - 1])
                }
            }
            else {
                if(this.players[playerIndex - 1].hand.length === 0) {
                    this.winners.push(this.players[playerIndex - 1])
                }
            }
        }
    }
    this.start = () => {
        this.status = 'ingame'
        this.deck.map((n,i) => this.players[i%this.players.length].hand.push(n))
        const firstPlayerIndex = this.players.findIndex(n => n.hand.includes("hearts:2"))
        this.turn = firstPlayerIndex
        this.move(firstPlayerIndex, ["hearts:2"], "2")
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
    this.check = (playerIndex) => {
        if(this.declared.number !== null) {
            const cardsToCheck = [...this.pile.slice(0, this.declared.number)]
            if(cardsToCheck.every(n => n.split(':')[1] === this.declared.value)) {
                this.draw(playerIndex, this.pile.length)
            }
            else {
                this.draw(this.declared.player, this.pile.length)
            }
            this.declared = {value: '2', number: null, player: null}
        } 
    }
}
exports.Game = Game