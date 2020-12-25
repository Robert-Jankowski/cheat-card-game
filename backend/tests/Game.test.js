const {Game} = require('../classes/Game')
const {Player} = require('../classes/Player')
const player = new Player("Player", "abcd")
const deck = [
    'spades:8',    'spades:J',  'spades:A',   'diamonds:6',
    'clubs:6',     'clubs:8',   'diamonds:J', 'clubs:7',
    'spades:5',    'hearts:6',  'hearts:9',   'clubs:10',
    'hearts:K',    'hearts:Q',  'diamonds:9', 'hearts:5',
    'diamonds:Q',  'clubs:3',   'spades:Q',   'clubs:9',
    'hearts:8',    'clubs:Q',   'clubs:J',    'clubs:5',
    'hearts:3',    'spades:10', 'hearts:J',   'diamonds:4',
    'clubs:K',     'spades:6',  'diamonds:2', 'diamonds:A',
    'diamonds:7',  'spades:K',  'diamonds:5', 'diamonds:K',
    'hearts:4',    'hearts:A',  'spades:4',   'spades:2',
    'diamonds:10', 'hearts:10', 'spades:9',   'diamonds:3',
    'spades:3',    'clubs:A',   'clubs:2',    'hearts:2',
    'diamonds:8',  'spades:7',  'hearts:7',   'clubs:4'
]
beforeEach(() => {
    
return game = new Game("efgh",player, deck)
})

test('correct player values', () => {
    expect({id: player.id, nick:player.nick}).toEqual({id: "abcd", nick:"Player"})
})

test('correct game values', () => {
    expect({id: game.id, players: game.players, deck: game.deck, status: game.status, pile: game.pile})
    .toEqual({id:"efgh", players: [player], deck: deck, status: 'waiting', pile: []})
})
test('join to game(correct player)', () => {
    const player2 = new Player("Player2", "ijkl")
    game.join(player2)
    expect(game.players[1]).toEqual(new Player("Player2", "ijkl"))
})
test('join to game(players length)', () => {
    const player2 = new Player("Player2", "ijkl")
    game.join(player2)
    expect(game.players.length).toEqual(2)
})
test('join to game(game started)', () => {
    const player2 = new Player("Player2", "ijkl")
    game.join(player2)
    game.start()
    const player3 = new Player("Player3", "mnop")
    game.join(player3)
    expect(game.players.length).toEqual(2)
})
test('two players hand(equal values)', () => {
    const player2 = new Player("Player2", "ijkl")
    game.join(player2)
    game.start()
    expect(game.players.map(n => n.hand)).toEqual([[
        'spades:8',    'spades:A',
        'clubs:6',     'diamonds:J',
        'spades:5',    'hearts:9',
        'hearts:K',    'diamonds:9',
        'diamonds:Q',  'spades:Q',
        'hearts:8',    'clubs:J',
        'hearts:3',    'hearts:J',
        'clubs:K',     'diamonds:2',
        'diamonds:7',  'diamonds:5',
        'hearts:4',    'spades:4',
        'diamonds:10', 'spades:9',
        'spades:3',    'clubs:2',
        'diamonds:8',  'hearts:7'
      ],[
        'spades:J',   'diamonds:6',
        'clubs:8',    'clubs:7',
        'hearts:6',   'clubs:10',
        'hearts:Q',   'hearts:5',
        'clubs:3',    'clubs:9',
        'clubs:Q',    'clubs:5',
        'spades:10',  'diamonds:4',
        'spades:6',   'diamonds:A',
        'spades:K',   'diamonds:K',
        'hearts:A',   'spades:2',
        'hearts:10',  'diamonds:3',
        'clubs:A',
        'spades:7',   'clubs:4'
      ]])
})
test('divisible players hand (lengths)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.start()
    expect(game.players.map(n => n.hand.length)).toEqual([13,13,13,12])
})

test('indivisible players hand (lengths)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    const player5 = new Player("Player5", "pcop")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.join(player5)
    game.start()
    expect(game.players.map(n => n.hand.length)).toEqual([11,11,9,10,10])
})
test('correct turn index after first move (last array index to first)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.start()
    expect(game.turn).toEqual(0)
})
test('correct turn index after first move (next array index)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    const player5 = new Player("Player5", "pcop")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.join(player5)
    game.start()
    expect(game.turn).toEqual(3)
})
test('pile after start', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    game.join(player2)
    game.join(player3)
    game.start()
    expect(game.pile[0]).toEqual("hearts:2")
})
test('move (1 card)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.start()
    game.move(0, ["spades:3"], 3)
    expect(game.pile[0]).toEqual("spades:3")
})
test('move (2 cards)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.start()
    game.move(0, ["spades:3","spades:5"], 5)
    expect([game.pile[0], game.pile[1]]).toEqual(["spades:3", "spades:5"])
})
test('move (4 cards)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.start()
    game.move(0, ["spades:3","spades:5", "hearts:3", "diamonds:7"], 3)
    expect(game.pile.length).toEqual(5)
})
test('move (invalid number of cards)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.start()
    game.move(0, ["spades:3","spades:5", "hearts:3", "diamonds:7","clubs:K"], 3)
    expect(game.pile.length).toEqual(1)
})
test('move (game not started)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.move(0, ["spades:3"], 3)
    expect(game.pile.length).toEqual(0)
})
test('move (wrong player turn)', () => {
    const player2 = new Player("Player2", "ijkl")
    const player3 = new Player("Player3", "mnop")
    const player4 = new Player("Player4", "vcnm")
    game.join(player2)
    game.join(player3)
    game.join(player4)
    game.start()
    game.move(1, ["spades:3"], 3)
    expect(game.pile.length).toEqual(1)
})