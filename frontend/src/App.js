import './App.css';
import React, {useEffect, useState} from "react";
import Chat from './components/Chat'
import Game from './components/Game'
import Games from './components/Games'
import Login from './components/Login'
import { useStoreState, useStoreActions } from 'easy-peasy';
const mqtt = require('mqtt')
const brokerAddress = "localhost:8000/mqtt"
const client = mqtt.connect(`mqtt://${brokerAddress}`)
function App() {

  function route() {
    switch(path) {
      case 'games':
        return <Games />
      case 'game':
        return <Game spectate={false}/>
      case 'chat':
        return <Chat />
      case 'spectate':
        return <Game spectate={true}/>
      default:
        return <Login />
    }
  }
  
  const {
    setGameState, setChatState, setGames, setSubscribed} = useStoreActions(
    actions => ({
      setGameState: actions.setGameState,
      setChatState: actions.setChatState,
      setGames: actions.setGames,
      setSubscribed: actions.setSubscribed
    })
  )
  const {
    gameSpectatedId, gameId, chatId, player, path, isSubscribed} = useStoreState(
    state => ({
      gameSpectatedId: state.gameSpectatedId,
      gameId: state.gameId,
      chatId: state.chatId,
      player: state.player,
      path: state.path,
      isSubscribed: state.isSubscribed
    })
  )

  const [subscribedId, setSubscribedId] = useState(null) 

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
    if(!isSubscribed.game) {
      client.subscribe(`privatestate/${gameId}/${player.id}`)
      setSubscribed({...isSubscribed, game: true})
    }  
    else {
      client.unsubscribe(`privatestate/${subscribedId}/${player.id}`)
      setSubscribedId(null)
      setSubscribed({...isSubscribed, game: false})
    }
  },[gameId, path])

  useEffect(() => {
    
    if(!isSubscribed.chat) {
      client.subscribe(`chats/${chatId}`)
      setSubscribed({...isSubscribed, chat: true})
    }  
    else {
      client.unsubscribe(`chats/${chatId}`)
      setSubscribed({...isSubscribed, chat: false})
    }
  },[chatId])

  useEffect(() => {
    if(!isSubscribed.gameSpectated) {
      client.subscribe(`publicstate/${gameSpectatedId}`)
      setSubscribed({...isSubscribed, gameSpectated: true})
    }  
    else {
      client.unsubscribe(`publicstate/${gameSpectatedId}`)
      setSubscribed({...isSubscribed, gameSpectated: false})
    }
    
  },[gameSpectatedId, path])


  return (
    <React.Fragment>
      {route()}
    </React.Fragment>
  )
}

export default App;
