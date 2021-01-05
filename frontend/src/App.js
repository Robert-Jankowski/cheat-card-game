import './App.css';
import React, {useState, useEffect} from "react";
import Chat from './components/Chat'
import Game from './components/Game'
import Games from './components/Games'
import Login from './components/Login'
import GameSpectated from './components/GameSpectated'
const mqtt = require('mqtt')
const brokerAddress = "localhost:8000/mqtt"
const axios = require('axios')
const client = mqtt.connect(`mqtt://${brokerAddress}`)
function App() {

  const [player, setPlayer] = useState({
    id: null,
    nick: null
  })
  const [path, setPath] = useState('login')
  const [games, setGames] = useState([])
  const [gameState, setGameState] = useState(null)
  const [gameId, setGameId] = useState(null)
  const [gameSpectatedId, setGameSpectatedId] = useState(null)
  const [chatState, setChatState] = useState(null)
  const [chatId, setChatId] = useState(null)

  useEffect(() => {
    client.on('connect', function () {
      console.log(`Connected to broker:${brokerAddress}`)
      client.subscribe('games/list')
    },[])

    client.on('message', function (topic, message) {
      const topicStr = topic.toString()
      if(topicStr === 'games/list') {
        setGames(JSON.parse(message.toString()))
      }
      else if((/privatestate\/*/).test(topicStr)) {
        setGameState(JSON.parse(message.toString()))
      }
      else if((/chats\/*/).test(topicStr)) {
        setChatState(JSON.parse(message.toString()))
      }
      else if((/publicstate\/*/).test(topicStr)) {
        setGameState(JSON.parse(message.toString()))
      }
  })},[])

  useEffect(() => {
    client.subscribe(`privatestate/${gameId}/${player.id}`)
    if(gameId !== null && player.id !== null)
    axios.get(`http://localhost:4000/games/${gameId}/${player.id}`).then(res => {
      setGameState(res.data)
    }).catch(error => console.log(error))
  },[gameId])

  useEffect(() => {
    client.subscribe(`chats/${chatId}`)
    if(chatId !== null && player.id !== null)
    axios.get(`http://localhost:4000/chats/${chatId}`).then(res => {
      setChatState(res.data)
    }).catch(error => console.log(error))
  },[chatId])

  useEffect(() => {
    client.subscribe(`publicstate/${gameSpectatedId}`)
    if(gameSpectatedId !== null && player.id !== null)
    axios.get(`http://localhost:4000/games/${gameSpectatedId}`).then(res => {
      setGameState(res.data)
    }).catch(error => console.log(error))
  },[gameSpectatedId])


  return (
    <div>
      <Routing player={player}
               setPlayer={setPlayer}
               path={path}
               setPath={setPath}
               games={games}
               setGames={setGames}
               setGameId={setGameId}
               gameState={gameState}
               chatState={chatState}
               setChatState={setChatState}
               setChatId={setChatId}
               setGameSpectatedId={setGameSpectatedId}/>
    </div>
  );
}

const Routing = (
  {player, 
  setPlayer,
  path,
  setPath,
  games,
  setGames,
  setGameId,
  gameState,
  chatState,
  setChatId,
  setGameSpectatedId}) => {

  function route() {
    switch(path) {
      case 'login':
        return (<Login setPlayer={setPlayer} setPath={setPath} setPath={setPath}/>)
      case 'games':
        return <Games player={player}
                      setGames={setGames}
                      games={games}
                      setPath={setPath}
                      setGameId={setGameId}
                      setChatId={setChatId}
                      setGameSpectatedId={setGameSpectatedId}/>
      case 'game':
        return <Game gameState={gameState} player={player} setPath={setPath}/>
      case 'chat':
        return <Chat chatState={chatState} player={player} setChatId={setChatId} setPath={setPath}/>
      case 'spectate':
        return <GameSpectated gameState={gameState} user={player} setPath={setPath}/>
    }
  }

  return(
    <div>
      {route()}
    </div>
  )
}

export default App;
