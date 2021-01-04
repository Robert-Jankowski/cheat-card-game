function publicState(game) {
    const state = {
        id: game.id,
        players: [...game.players.map((n,i) => ({
            index: i,
            nick: n.nick,
            hand: n.hand.length,
            id: n.id
        }))],
        status: game.status,
        turn: game.turn,
        pile: game.pile.length,
        declared: game.declared,
        winners: game.winners,
        messages: game.messages
    }
    return state
}

function privateState(game, player_id) {
    const state = {
        id: game.id,
        players: [...game.players.map((n,i) => ({
            index: i,
            nick: n.nick,
            hand: n.hand.length,
            id: n.id
        }))],
        player: player_id,
        hand: game.players.find(n => n.id === player_id).hand,
        status: game.status,
        turn: game.turn,
        pile: game.pile.length,
        declared: game.declared,
        winners: game.winners,
        messages: game.messages
    }
    return state
}
function adminState(game) {
    const state = {
        id: game.id,
        players: [...game.players.map((n,i) => ({
            index: i,
            nick: n.nick,
            hand: n.hand,
            id: n.id
        }))],
        status: game.status,
        turn: game.turn,
        pile: game.pile,
        declared: game.declared,
        winners: game.winners,
        messages: game.messages
    }
    return state
}
module.exports = {
    publicState: publicState,
    privateState: privateState,
    adminState: adminState
}