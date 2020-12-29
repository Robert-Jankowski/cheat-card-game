const {v4: uuid} = require('uuid')
const {Game} = require('./classes/Game')
const {Database} = require('./classes/Database')
const {Player} = require('./classes/Player')
const shuffle = require('./helpers/shuffle')
const deck = require('./helpers/deck')
const {publicState, privateState, adminState} = require('./helpers/gamestate')
const {sendPrivateState, sendPublicState, sendAdminState, sendGameList} = require('./mqtt_client')

const express = require('express')
const app = express()
const port = 4000
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
const db = new Database()

//create player
app.post('/players', (req, res) => {
    const id = uuid()
    const player = new Player(req.body.nick, id)
    db.players.push(player)
    return res.send(player)
})

//create game
app.post('/games', (req, res) => {
    const id = uuid()
    const player = db.players.find(n => n.id === req.body.player_id)
    const game = new Game(id, player, shuffle(deck))
    db.createGame(game)
    sendGameStates(game.id)
    sendGameList(db.games)
  })

//move
app.post('/games/:gameId/move', (req, res) => {
    const game_id = req.params.gameId
    const [player_index, cards_json, declared] = req.body
    const game = db.games.find(n => n.id === game_id)
    const cards = JSON.parse(cards_json)
    game.move(parseInt(player_index),cards, declared)
    sendGameStates(game.id)
})

//draw3
app.post('/games/:gameId/draw3', (req, res) => {
    const game = db.games.find(n => n.id === req.params.gameId)
    game.draw(req.body.player_index, 3)
    sendGameStates(game.id)
})

//check
app.post('/games/:gameId/check', (req, res) => {
    const game = db.games.find(n => n.id === req.params.gameId)
    game.check(req.body.player_index)
    sendGameStates(game.id)
})


//join game
app.patch('/games/:gameId/join', (req, res) => {
    const player = db.players.find(n => n.id === req.body.player_id)
    const game = db.games.find(n => n.id === req.params.game_id)
    game.players.push(player)
    sendGameStates(game.id)
})
    

//start game
app.patch('/games/:gameId/start', (req, res) => {
    const game = db.games.find(n => n.id === req.params.gameId)
    game.start()
    sendGameStates(game.id)
})

app.listen(port, () => {
  console.log(`HTTP client listening at http://localhost:${port}`)
})

function sendGameStates(game_id) {
    const game = db.games.find(n => n.id === game_id)
    sendPublicState(publicState(game))
    game.players.forEach(player => {
        sendPrivateState(privateState(game, player.id))
    });
    sendAdminState(adminState(game))
}