import React, {useEffect} from 'react'
const axios = require('axios')

const Games = ({player, games, setGames, setPath, setGameId}) => {
    useEffect(() => {
        axios.get('http://localhost:4000/games').then(res => {
            setGames(res.data)
        }).catch(error => {
            console.log(error)
        })
    },[])


    function handleCreateGame() {
        axios.post('http://localhost:4000/games', {player_id: player.id}).then(res => {
            setGameId(res.data)
            setPath('game')
        }).catch(error => {
            console.log(error)
        })
    }
    return(
        <div>
            {games.map(n => {
                return (
                    <div key={n.id}>
                        Game ID:{n.id} <br/>
                        Players: {n.players}/8 <br/>
                        Status: {n.status} <br/> <br/>
                        <button onClick={() => {
                            axios.patch(`http://localhost:4000/games/${n.id}/join`, {player_id: player.id}).then(res => {
                                setGameId(n.id)
                                setPath('game')
                            }).catch(error => {
                                console.log(error)
                            })
                            
                        }}>JOIN</button>
                    </div>
                )
            })}
            <button onClick={() => handleCreateGame()}>CREATE GAME</button>
        </div>
    )
}
export default Games