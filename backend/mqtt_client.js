const mqtt = require('mqtt')
const {v4: uuid} = require('uuid')
const {Game} = require('./classes/Game')
const {Database} = require('./classes/Database')
const {Player} = require('./classes/Player')
const shuffle = require('./helpers/shuffle')
const deck = require('./helpers/deck')
const {publicState, privateState, adminState} = require('./helpers/gamestate')
const brokerAddress = "10.45.3.187:1883"
const client  = mqtt.connect(`mqtt://${brokerAddress}`)

const db = new Database()
client.on('connect', function () {
    console.log(`Połączono z brokerem o adresie: ${brokerAddress}`);
    client.subscribe('games/*')
    client.subscribe('players/*')
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
      case 'games/start':
        //message: game_id
        startGame(message)
      case 'games/move':
        //message: game_id:player_index:cards:declared
        makeMove(message)
      case 'games/check':
        //message: game_id:player_index
        check(message)
      case 'games/draw3':
        //message: game_id:player_index
        draw3(message)
      case 'games/publicstate':
        //message: game_id
        providePublicState()
      case 'games/privatestate':
        //message: game_id:player_id
        providePrivateState()
      case 'games/adminstate':
        //message: game_id
        provideAdminState()
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
function startGame(game_id) {
  const game = db.games.find(n => n.id === game_id)
  game.start()
}
function check(message) {
  const [game_id, player_index] = message.split(':')
  const game = db.games.find(n => n.id === game_id)
  game.draw(player_index, 3)
}
function providePublicState(game_id) {
  const game = db.games.find(n => n.id === game_id)
  const state = publicState(game)
  client.publish(`state:${game_id}`, JSON.stringify(state))
}
function providePrivateState(message) {
  const [game_id, player_id] = message.split(':')
  const game = db.games.find(n => n.id === game_id)
  const state = privateState(game, player_id)
  client.publish(`state:${game_id}:${player_id}`, JSON.stringify(state))
}
function provideAdminState(game_id) {
  const game = db.games.find(n => n.id === game_id)
  const state = adminState(game)
  client.publish(`adminstate:${game_id}`, JSON.stringify(state))
}