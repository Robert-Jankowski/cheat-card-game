import React from 'react'
const axios = require('axios')

const GamesList = ({ setGameId, setGameSpectatedId, setPath, player, games }) => {

    const JoinButton = ({ game }) => {
        if (game.status === 'waiting') {
            return (
                <button className="joinbutton" onClick={() => {
                    axios.patch(`http://localhost:4000/games/${game.id}/join`, { player_id: player.id }).then(res => {
                        setGameId(game.id)
                        setPath('game')
                    }).catch(error => {
                        console.log(error)
                    })

                }}>JOIN</button>
            )
        }
        else {
            return (
                <button disabled>JOIN</button>
            )
        }
    }

    const SpectateButton = ({ game }) => {
        return (
            <button className="spectatebutton" onClick={() => {
                setGameSpectatedId(game.id)
                setPath('spectate')
            }}>SPECTATE</button>
        )
    }

    const GameTile = ({ game }) => {
        return (
            <div className="gametile">
                <p>Players: {game.players}/8</p>
                <p>Status: {game.status}</p>
                <JoinButton game={game} />
                <SpectateButton game={game} />

            </div>
        )
    }
    const CreateGameButton = () => {
        return (
            <button id="creategamebutton" onClick={() => {
                axios.post('http://localhost:4000/games', { player_id: player.id }).then(res => {
                    setGameId(res.data)
                    setPath('game')
                }).catch(error => {
                    console.log(error)
                })
            }}>CREATE GAME</button>
        )
    }

    return (
        <div id="gameslist">
            <CreateGameButton />
            {games.map((n, i) => {
                return (
                    <GameTile game={n} key={`game${i}`} />
                )
            })}
        </div>
    )
}
export default GamesList