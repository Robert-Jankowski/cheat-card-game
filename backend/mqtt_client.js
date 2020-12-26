const mqtt = require('mqtt')
const {v4: uuid} = require('uuid')
const {Game} = require('./classes/Game')
const {Database} = require('./classes/Database')
const {Player} = require('./classes/Player')
const shuffle = require('./helpers/shuffle')
const deck = require('./helpers/deck')
const brokerAddress = "10.45.3.187:1883"
const client  = mqtt.connect(`mqtt://${brokerAddress}`)

const db = new Database()
client.on('connect', function () {
    console.log(`Połączono z brokerem o adresie: ${brokerAddress}`);
    client.subscribe('games/*')
  })
   
  client.on('message', function (topic, message) {
    switch(topic.toString()) {
      case 'games/create':
        //message: player_id
        createGame()
      case 'games/join':
        //message: player_id:game_id
        joinGame(message)
      case 'players/create':
        //message: nick
        createPlayer(message)
      case 'move':
        //message: game_id:player_index:cards:declared
        makeMove(message)
      case 'check':
        //message: game_id:player_index
        check(message)
    }
  })

function createGame(player_id) {
  const id = uuid()
  const player = db.players.find(n => n.id === player_id)
  const game = new Game(id, player, shuffle(deck))
  db.createGame(game)
}

function joinGame(message) {
  const [player_id, game_id] = message.split(':')
  const player = db.players.find(n => n.id === player_id)
  const game = db.games.find(n => n.id === game_id)
  game.players.push(player)
}
function createPlayer(nick) {
  const id = uuid()
  const player = new Player(nick, id)
  db.players.push(player)
}
function makeMove(message) {
  const [game_id, player_index, cards_string, declared] = message.split(':')
  const game = db.games.find(n => n.id === game_id)
  const cards = JSON.parse("[" + cards_string + "]")
  game.move(parseInt(player_index),cards, declared)
}
function check(message) {
  const [game_id, player_index] = message.split(':')
  const game = db.games.find(n => n.id === game_id)
  game.check(player_index)
}