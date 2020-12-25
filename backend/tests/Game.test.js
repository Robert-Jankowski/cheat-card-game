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
const game = new Game("efgh",player, deck)

test('correct player values', () => {
    expect({id: player.id, nick:player.nick}).toEqual({id: "abcd", nick:"Player"})
})

test('correct game values', () => {
    expect({id: game.id, players: game.players, deck: game.deck, status: game.status})
    .toEqual({id:"efgh", players: [player], deck: deck, status: 'waiting'})
})