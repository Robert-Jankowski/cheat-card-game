import React, {useState, useEffect} from 'react'
import {useStoreActions, useStoreState} from 'easy-peasy'
import ChatWindow from './ChatWindow'
const axios = require('axios')

const GameSpectated = () => {

    const [loaded, setLoaded] = useState(false)

    const {gameState, user, gameSpectatedId} = useStoreState(store => ({
        gameState: store.gameState,
        user: store.player,
        gameSpectatedId: store.gameSpectatedId
    }))
    const {setPath, setGameState} = useStoreActions(action => ({
        setPath: action.setPath,
        setGameState: action.setGameState
    }))

    useEffect(() => {
        axios.get(`http://localhost:4000/games/${gameSpectatedId}`).then(res => {
            console.log(res.data)
            setGameState(res.data)
            setLoaded(true)
        }).catch(error => console.log(error))
    },[gameSpectatedId])

    function LeaveButton () {
        return (
            <button onClick={()=>{
                setPath('games')
            }}>LEAVE GAME</button>
        )
        
    }

    function Pile() {
        if(gameState.status !== 'waiting')
            return(
                <div>
                    Pile: 
                    {gameState.pile}
                </div>
            )
    }
    function Declared() {
        if(gameState.status !== 'waiting')
            return(
                <div>
                    Declared value: {gameState.declared.value} <br/>
                    Quantity of cards:  {gameState.declared.number} <br/>
                </div>
            )
    }
    function render() {
        if(loaded)
        return(
            <React.Fragment>
            {LeaveButton()}
            {Declared()}
            {Pile()}
            <ul>
            {gameState.players.map((n,i) => {
                return(
                <li key={n.index}>
                    {n.nick} {gameState.turn === i ? "(turn)" : ""} <br/>
                    {n.hand} <br/>
                </li>)
            })}
            </ul>
            <ChatWindow gameState={gameState} nick={user.nick}/>
            </React.Fragment>
        )
    }

    return(
        <main className="game">
            {render()}
        </main>
    )
}
export default GameSpectated