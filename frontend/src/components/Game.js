import React, {useEffect, useState} from 'react'
import {useStoreActions, useStoreState} from 'easy-peasy'
import ChatWindow from './Game/ChatWindow'
import Waiting from './Game/Waiting'
import Board from './Game/Board'
import Players from './Game/Players'
import Ended from './Game/Ended'
import '../styles/Game.css'
const axios = require('axios')

const Game = ({spectate}) => {

    const [loaded, setLoaded] = useState(false)

    const {gameState, player, gameId, gameSpectatedId} = useStoreState(store => ({
        gameState: store.gameState,
        player: store.player,
        gameId: store.gameId,
        gameSpectatedId: store.gameSpectatedId
    }))
    const {setPath, setGameState, setGameId} = useStoreActions(action => ({
        setPath: action.setPath,
        setGameState: action.setGameState,
        setGameId: action.setGameId
    }))

//    window.addEventListener("beforeunload", (e) => {
//        console.log("LEAVING");
//        if(!spectate)
//        axios.patch(`http://localhost:4000/games/${gameState.id}/leave`, {player_id: player.id})
//             .catch(error => console.log(error))
//    })

    useEffect(() => {
        if(spectate) {
            axios.get(`http://localhost:4000/games/${gameSpectatedId}`).then(res => {
                setGameState(res.data)
                setLoaded(true)
            }).catch(error => console.log(error))
        }
        else {
            axios.get(`http://localhost:4000/games/${gameId}/${player.id}`).then(res => {
            setGameState(res.data)
            setLoaded(true)
        }).catch(error => console.log(error))
        }
    }, [])

    const LeaveButton = () => {
        return (
            <button id="leavebutton" onClick={()=>{
                if(spectate) {
                    setGameId(null)
                    setPath('games')
                }
                else {
                    axios.patch(`http://localhost:4000/games/${gameState.id}/leave`, {player_id: player.id}).then(res => {
                    setGameId(null)
                    setPath('games')
                    }).catch(error => console.log(error))
                }
                
            }}>LEAVE GAME</button>
        )
        
    }

    function gameWindow () {
        if(gameState.status === 'waiting')
            return(
            <Waiting players={gameState.players.length}
                     playerIndex={gameState.players.findIndex(n => n.id === player.id)}
                     gameId={gameState.id}/>
            )
        else if(gameState.status === 'ingame')
            return(
                <Board   gameState={gameState} player={player} spectator={spectate}/>
            )
        else
            return(
                <Ended winners={gameState.winners}/>
            )
    }

    function render() {
        if(loaded)
            return(
                <React.Fragment>
                    <LeaveButton />
                    <Players players={gameState.players} turn={gameState.turn} winners={gameState.winners}/>
                    {gameWindow()}
                    <ChatWindow gameState={gameState} nick={player.nick}/>
                </React.Fragment>
            )
    }

    return(
        <main id="game">
            {render()}
        </main>
    )
}
export default Game