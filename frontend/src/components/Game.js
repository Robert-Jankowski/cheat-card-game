import React, {useEffect} from 'react'

const Game = ({gameState}) => {
    
    function render() {
        if(gameState !==null)
        return(
            <ul>
            {gameState.players.map(n => {
                return(
                <li key={n.index}>
                    {n.nick} <br/>
                    {n.hand} <br/>
                </li>)
            })}
            </ul>
        )
    }

    return(
        <div>
            {render()}
        </div>
    )
}
export default Game