import './App.css';
import React, {useState} from "react";
import Chat from './components/Chat'
import Game from './components/Game'
import Games from './components/Games'
import Login from './components/Login'



function App() {

  const mqtt = require('mqtt')
  const brokerAddress = "10.45.3.187:1883"
  const client  = mqtt.connect(`mqtt://${brokerAddress}`)
  client.subscribe('games')

  client.on('connect', function () {
    console.log(`Connected to broker:${brokerAddress}`)
  })

  client.on('message', function (topic, message) {
    switch(topic.toString) {
      case 'games':
        setGames(message)
    }
  })

  const [player, setPlayer] = useState({
    id: null,
    nick: null
  })
  const [path, setPath] = useState('login')
  const [games, setGames] = useState([])

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
