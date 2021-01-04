import React, {useState} from 'react'
const axios = require('axios')

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