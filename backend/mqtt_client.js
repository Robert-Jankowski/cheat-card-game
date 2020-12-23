const mqtt = require('mqtt')
const {v4: uuid} = require('uuid')
const {Game} = require('./classes/Game')
const {Database} = require('./classes/Database')
const {Player} = require('./classes/Player')
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
    }
  })

function createGame(player_id) {
  const id = uuid()
  const player = db.players.find(n => n.id === player_id)
  const game = new Game(id, player)
  db.createGame(game)
}

function joinGame(message) {
  const [player_id, game_id] = message.split(':')
  const player = db.players.find(n => n.id === player_id)
  const game = db.games.find(n => n.id === game_id)
  game.players.append(player)
}
function createPlayer(nick) {
  const id = uuid()
  const player = new Player(nick, id)
  db.players.append(player)
}