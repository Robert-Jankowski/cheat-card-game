import React, {useState} from 'react'
import ChatWindow from './ChatWindow' 

const GameSpectated = ({gameState, user}) => {

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
        if(gameState !==null)
        return(
            <div>
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
            </div>
        )
    }

    return(
        <div>
            {render()}
        </div>
    )
}
export default GameSpectated