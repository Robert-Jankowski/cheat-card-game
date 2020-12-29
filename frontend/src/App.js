import './App.css';
import React, {useState} from "react";
import Chat from './components/Chat'
import Game from './components/Game'
import Games from './components/Games'
import Login from './components/Login'

function App() {

  const [player, setPlayer] = useState({
    id: null,
    nick: null
  })
  const [path, setPath] = useState('login')

  return (
    <div>
      <Routing player={player}
               setPlayer={setPlayer}
               path={path}
               setPath={setPath}/>
    </div>
  );
}

const Routing = ({player, setPlayer, path, setPath}) => {

  function route() {
    switch(path) {
      case 'login':
        return (<Login setPlayer={setPlayer} setPath={setPath} setPath={setPath}/>)
      case 'games':
        return <Games player={player}/>
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
