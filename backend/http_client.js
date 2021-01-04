const {v4: uuid} = require('uuid')
const {Game} = require('./classes/Game')
const {Database} = require('./classes/Database')
const {Player} = require('./classes/Player')
const {Chat} = require('./classes/Chat')
const {shuffle} = require('./helpers/shuffle')
const {deck} = require('./helpers/deck')
const {publicState, privateState, adminState} = require('./helpers/gamestate')
const {sendStates} = require('./mqtt_client')
const {sendPrivateState, sendPublicState, sendAdminState, sendGamesList, sendChatState} = sendStates

const express = require('express')
const app = express()
const port = 4000
app.use(express.json())

const cors = require('cors')
app.use(cors())

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
    sendGamesList(db.games)
    return res.send(id)
  })

//get games list
app.get('/games', (req, res) => {
    const message = db.games.map(n => ({id: n.id, players: n.players.length, status: n.status}))
    return res.send(message)
  })

//get private gamestate
app.get('/games/:gameId/:playerId', (req, res) => {
    const game = db.games.find(n => n.id === req.params.gameId)
    const state = privateState(game, req.params.playerId)
    return res.send(state)
})
//get public gamestate
app.get('/games/:gameId', (req, res) => {
    const game = db.games.find(n => n.id === req.params.gameId)
    const state = publicState(game)
    return res.send(state)
})

//move
app.post('/games/:gameId/move', (req, res) => {
    const game_id = req.params.gameId
    const {player_index, cards, declared} = req.body
    const game = db.games.find(n => n.id === game_id)
    game.move(parseInt(player_index),cards, declared)
    sendGameStates(game.id)
    return res.send('success')
})

//draw3
app.post('/games/:gameId/draw3', (req, res) => {
    const game = db.games.find(n => n.id === req.params.gameId)
    game.draw3(req.body.player_index)
    sendGameStates(game.id)
    return res.send('success')
})

//check
app.post('/games/:gameId/check', (req, res) => {
    const game = db.games.find(n => n.id === req.params.gameId)
    game.check(req.body.player_index)
    sendGameStates(game.id)
    return res.send('success')
})

//send ingame message
app.post('/games/:gameId/message', (req, res) => {
    const {nick, message} = req.body
    const game = db.games.find(n => n.id === req.params.gameId)
    game.sendMessage(nick, message)
    sendGameStates(game.id)
    return res.send('success')
})

//join game
app.patch('/games/:gameId/join', (req, res) => {
    const player = db.players.find(n => n.id === req.body.player_id)
    const game = db.games.find(n => n.id === req.params.gameId)
    game.players.push(player)
    sendGameStates(game.id)
    sendGamesList(db.games)
    return res.send('success')
})

//start game
app.patch('/games/:gameId/start', (req, res) => {
    const game = db.games.find(n => n.id === req.params.gameId)
    game.start()
    sendGameStates(game.id)
    sendGamesList(db.games)
    return res.send('success')
})

//create chat
app.post('/chats/create', (req, res) => {
    const {userId, name, password} = req.body
    if(!db.chats.some(n => n.name === name)) {
        const user = db.players.find(n => n.id === userId)
        const id = uuid()
        const chat = new Chat(id, user, name, password)
        db.chats.push(chat)
        return res.send(chat.id)
    }
    else {
        return res.send(null)
    }
})
//send message in chat
app.post('/chats/:chatId/message', (req, res) => {
    const chat = db.chats.find(n => n.id === req.params.chatId)
    const {nick, message} = req.body
    chat.sendMessage(nick, message)
    sendChatState(chat)
    return res.send('success')
})
//join chat
app.patch('/chats/join', (req, res) => {
    const id = db.logToChat(req.body.name, req.body.password)
    if(id !== null) {
        const user = db.players.find(n => n.id === req.body.user_id) 
        db.joinChat(id, user)
        return res.send(id)
    }
    else {
        return res.send(null)
    }
    
})
//get chat state
app.get('/chats/:chatId', (req, res) => {
    const chat = db.chats.find(n => n.id === req.params.chatId)
    const response = {id: chat.id, users: chat.users, messages: chat.messages}
    return res.send(response)
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