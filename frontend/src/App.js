import './App.css';
import React, {useState, useEffect} from "react";
import Chat from './components/Chat'
import Game from './components/Game'
import Games from './components/Games'
import Login from './components/Login'
const mqtt = require('mqtt')
const brokerAddress = "localhost:8000/mqtt"


function App() {

  const [player, setPlayer] = useState({
    id: null,
    nick: null
  })
  const [path, setPath] = useState('login')
  const [games, setGames] = useState([])

  useEffect(() => {
    const client = mqtt.connect(`mqtt://${brokerAddress}`)
    client.on('connect', function () {
      console.log(`Connected to broker:${brokerAddress}`)
      client.subscribe('games/list')
    },[])

    client.on('message', function (topic, message) {
      console.log("GOT MESSAGE: ",topic, message)
      switch(topic.toString()) {
        case 'games/list':
          setGames(JSON.parse(message.toString()))
          break
        default:
          console.log("default")
          break
      }
    }) 
  },[])

  

  return (
    <div>
      <Routing player={player}
               setPlayer={setPlayer}
               path={path}
               setPath={setPath}
               games={games}
               setGames={setGames}/>
    </div>
  );
}

const Routing = ({player, setPlayer, path, setPath, games, setGames}) => {

  function route() {
    switch(path) {
      case 'login':
        return (<Login setPlayer={setPlayer} setPath={setPath} setPath={setPath}/>)
      case 'games':
        return <Games player={player} setGames={setGames} games={games}/>
      case 'game':
        return <Game />
      case 'chat':
        return <Chat />
    }
  }

  return(
    <div>
      {route()}
    </div>
  )
}

export default App;
