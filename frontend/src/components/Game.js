import React, {useEffect} from 'react'
const axios = require('axios')

const Game = ({gameState, player}) => {
    
    function StartButton () {
        console.log(gameState.players[0].id, player.id)
        if(gameState.players[0].id === player.id && gameState.status === 'waiting')
            return (
            <button onClick={() => {
                axios.patch(`http://localhost:4000/games/${gameState.id}/start`).then(res => {
                    console.log(res)
                }).catch(error => console.log(error))
            }}>
                START GAME
            </button>)
        else
            return (
                <button disabled>START GAME</button>
            )
    }

    function render() {
        if(gameState !==null)
        return(
            <div>
            {StartButton()}
            <ul>
            {gameState.players.map((n,i) => {
                return(
                <li key={n.index}>
                    {n.nick} {gameState.turn === i ? "(turn)" : ""} <br/>
                    {n.hand} <br/>
                </li>)
            })}
            </ul>
            </div>
        )
    }

    return(
        <div>
            {render()}
        </div>
    )
}
export default Game