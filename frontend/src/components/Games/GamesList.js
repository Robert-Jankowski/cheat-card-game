import React from 'react'
const axios = require('axios')

const GamesList = ({ setGameId, setGameSpectatedId, setPath, player, games }) => {

    const JoinButton = ({ game }) => {
        if (game.status === 'waiting' && game.players < 8) {
            return (
                <div className="joinbutton" onClick={() => {
                    axios.patch(`http://localhost:4000/games/${game.id}/join`, { player_id: player.id }).then(res => {
                        setGameId(game.id)
                        setPath('game')
                    }).catch(error => {
                        console.log(error)
                    })

                }}><img src="join-game.png" alt="JOIN" width={50} height={50}/></div>
            )
        }
        else {
            return (
                <div className="joinbutton"><img src="closed-game.png" alt="JOIN" width={50} height={50}/></div>
            )
        }
    }

    const SpectateButton = ({ game }) => {
        return (
            <div className="spectatebutton" onClick={() => {
                setGameSpectatedId(game.id)
                setPath('spectate')
            }}><img src="spectate-game.png" alt="SPECTATE" width={50} height={50}/></div>
        )
    }

    const GameTile = ({ game }) => {
        return (
            <div className="gametile">
                <div className="gamesinfo">
                <p>{game.players}/8</p>
                <p>{game.status}</p>
                </div>
                <JoinButton game={game} />
                <SpectateButton game={game} />
            </div>
        )
    }
    const CreateGameButton = () => {
        return (
            <button id="creategamebutton" className="gametile" onClick={() => {
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