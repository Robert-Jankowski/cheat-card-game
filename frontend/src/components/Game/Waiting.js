import React from 'react'
const axios = require('axios')

const Waiting = ({players, gameId, playerIndex}) => {

    function isOwner() {
        if(playerIndex === 0 && players > 1)
            return(
                <button id="startbutton" onClick={() => {
                    axios.patch(`http://localhost:4000/games/${gameId}/start`)
                    .catch(error => console.log(error))
                }}>
                    START GAME
                </button>
            )
        else if(playerIndex === 0)
            return(
                <button id="startbuttondisabled" disabled>
                    START GAME
                </button>
            )
        else
            return(
                <p>WAITING FOR GAME OWNER TO START</p>
            )
    }

    return(
        <div id="waiting">
            <p>{`${players}/8`}</p>
            {isOwner()}
        </div>
    )
}
export default Waiting