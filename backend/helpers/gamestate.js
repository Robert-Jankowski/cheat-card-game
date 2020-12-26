function publicState(game) {
    const state = {
        id: game.id,
        players: [...game.players.map((n,i) => ({
            index: i,
            nick: n.nick,
            hand: n.hand.length
        }))],
        status: game.status,
        pile: game.pile.length,
        declared: game.declared,
        winners: game.winners
    }
    return state
}

function privateState(game, player_id) {
    const state = {
        id: game.id,
        players: [...game.players.map((n,i) => ({
            index: i,
            nick: n.nick,
            hand: n.hand.length
        }))],
        hand: game.players.find(n => n.id === player_id).hand,
        status: game.status,
        pile: game.pile.length,
        declared: game.declared,
        winners: game.winners
    }
    return state
}
function adminState(game) {
    const state = {
        id: game.id,
        players: [...game.players.map((n,i) => ({
            index: i,
            nick: n.nick,
            hand: n.hand
        }))],
        status: game.status,
        pile: game.pile,
        declared: game.declared,
        winners: game.winners
    }
    return state
}
module.exports = {
    publicState: publicState,
    privateState: privateState,
    adminState: adminState
}