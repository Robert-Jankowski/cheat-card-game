import {action, createStore} from 'easy-peasy'

const store = createStore({
   player: {
       id: null,
       nick: null
   },
   path: 'login',
   games: [],
   chatState: null,
   gameState: null,
   gameId: null,
   gameSpectatedId: null,
   chatId: null,

   setPlayer: action((state, payload) => {
       state.player = {id: payload.id, nick: payload.nick}
   }),
   setPath: action((state, payload) => {
       state.path = payload
   }),
   setGames: action((state, payload) => {
    state.games = payload
   }),
   setGameState: action((state, payload) => {
    state.gameState = payload
   }),
   setGameId: action((state, payload) => {
    state.gameId = payload
   }),
   setGameSpectatedId: action((state, payload) => {
    state.gameSpectatedId = payload
   }),
   setChatId: action((state, payload) => {
    state.chatId = payload
   }),
   setChatState: action((state, payload) => {
    state.chatState = payload
   }),
})
export default store