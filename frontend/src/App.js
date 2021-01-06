import './App.css';
import React, {useEffect} from "react";
import Chat from './components/Chat'
import Game from './components/Game'
import Games from './components/Games'
import Login from './components/Login'
import GameSpectated from './components/GameSpectated'
import { useStoreState, useStoreActions } from 'easy-peasy';
const mqtt = require('mqtt')
const brokerAddress = "localhost:8000/mqtt"
const axios = require('axios')
const client = mqtt.connect(`mqtt://${brokerAddress}`)
function App() {

  function route() {
    switch(path) {
      case 'games':
        return <Games />
      case 'game':
        return <Game />
      case 'chat':
        return <Chat />
      case 'spectate':
        return <GameSpectated />
      default:
        return <Login />
    }
  }
  
  const {
    setGameState, setChatState, setGames} = useStoreActions(
    actions => ({
      setGameState: actions.setGameState,
      setChatState: actions.setChatState,
      setGames: actions.setGames
    })
  )
  const {
    gameSpectatedId, gameId, chatId, player, path} = useStoreState(
    state => ({
      gameSpectatedId: state.gameSpectatedId,
      gameId: state.gameId,
      chatId: state.chatId,
      player: state.player,
      path: state.path,
    })
  )

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
  },[gameId])

  useEffect(() => {
    client.subscribe(`chats/${chatId}`)
  },[chatId])

  useEffect(() => {
    client.subscribe(`publicstate/${gameSpectatedId}`)
  },[gameSpectatedId])


  return (
    <React.Fragment>
      {route()}
    </React.Fragment>
  )
}

export default App;
