const { checkIfPreviousPlayerWinning } = require('../helpers/checkIfPreviousPlayerWinning')
const { skipTurnIfWinner } = require('../helpers/skipTurnIfWinner')
const { setNewTurn } = require('../helpers/setNewTurn')

function Game(id, player, deck) {
    this.id = id
    this.players = [player]
    this.deck = deck
    this.status = 'waiting'
    this.pile = []
    this.turn = null
    this.declared = {
        value: "2",
        number: 1,
        player: null
    }
    this.winners = []
    this.messages = []

    this.join = (player) => {
        if (this.status !== 'ingame')
            this.players.push(player)
    }

    this.start = () => {
        this.status = 'ingame'
        this.deck.map((n, i) => this.players[i % this.players.length].hand.push(n))
        const firstPlayerIndex = this.players.findIndex(n => n.hand.includes("hearts:2"))
        this.turn = firstPlayerIndex
        this.move(firstPlayerIndex, ["hearts:2"], "2")
    }

    this.move = (playerIndex, cards, declared) => {
        this.pile = [...cards, ...this.pile]
        this.players[playerIndex].hand = this.players[playerIndex].hand.filter(n => !cards.includes(n))
        this.declared = { value: declared, number: cards.length, player: playerIndex }
        setNewTurn(this)
        skipTurnIfWinner(this)
        checkIfPreviousPlayerWinning(this, playerIndex)
    }

    this.draw3 = (playerIndex) => {
        this.draw(playerIndex, 3)
        this.declared = { value: '2', number: null, player: null }
        setNewTurn(this)
        skipTurnIfWinner(this)
        checkIfPreviousPlayerWinning(this, playerIndex)
    }

    this.check = (playerIndex) => {
        if (this.declared.number !== null) {
            const cardsToCheck = [...this.pile.slice(0, this.declared.number)]
            if (cardsToCheck.every(n => n.split(':')[1] === this.declared.value)) {
                this.draw(playerIndex, this.pile.length)
            }
            else {
                this.draw(this.declared.player, this.pile.length)
            }
            this.declared = { value: '2', number: null, player: null }
        }
    }

    this.sendMessage = (nick, message) => {
        this.messages.push({ nick, message })
    }

    this.leave = (playerIndex) => {
        const player = this.players.find(n => n.id === playerIndex)
        this.pile = [...this.pile, ...player.hand]
        player.hand = []
        if (this.turn === playerIndex) {
            setNewTurn(this)
            skipTurnIfWinner(this)
        }
        this.declared = { value: "2", number: 1, player: null }
        this.players = this.players.filter(n => n.id !== playerIndex)
    }

    this.draw = (playerIndex, number) => {
        if (number >= this.pile.length) {
            this.players[playerIndex].hand = [...this.pile.splice(0, this.pile.length - 1), ...this.players[playerIndex].hand]
            this.pile = [this.pile[this.pile.length - 1]]
        }
        else {
            this.players[playerIndex].hand = [...this.pile.splice(0, number), ...this.players[playerIndex].hand]
            this.pile = this.pile.splice(0, number + 1)
        }
    }

    this.checkEnded = () => {
        if (this.winners.length >= this.players.length - 1 && this.status === 'ingame')
            this.status = 'ended'

    }
}
exports.Game = Game