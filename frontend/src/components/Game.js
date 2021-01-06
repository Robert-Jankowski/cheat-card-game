import React, {useEffect, useState} from 'react'
import {useStoreActions, useStoreState} from 'easy-peasy'
import ChatWindow from './ChatWindow' 
const axios = require('axios')

const Game = () => {

    const [loaded, setLoaded] = useState(false)

    const {gameState, player, gameId} = useStoreState(store => ({
        gameState: store.gameState,
        player: store.player,
        gameId: store.gameId
    }))
    const {setPath, setGameState} = useStoreActions(action => ({
        setPath: action.setPath,
        setGameState: action.setGameState
    }))

    const [selectedCards, setSelectedCards] = useState([])
    const [declared, setDeclared] = useState("2")

    useEffect(() => {
        axios.get(`http://localhost:4000/games/${gameId}/${player.id}`).then(res => {
            setGameState(res.data)
            setLoaded(true)
        }).catch(error => console.log(error))
    }, [])

    useEffect(() => {
        setSelectedCards([])
        setDeclared("2")
    }, [gameState]);

    function LeaveButton () {
        return (
            <button onClick={()=>{
                axios.patch(`http://localhost:4000/games/${gameState.id}/leave`, {player_id: player.id}).then(res => {
                    setPath('games')
                }).catch(error => console.log(error))
            }}>LEAVE GAME</button>
        )
        
    }

    function StartButton () {
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
    function Hand () {
        if(gameState.status !== 'waiting')
            return(
                <ul>
                    {gameState.hand.map(n => {
                        return(
                            <li>
                                {n} 
                                {!selectedCards.includes(n) ? <button onClick={() => setSelectedCards([...selectedCards, n])}>
                                    {'>'}
                                </button> : <button disabled>{'>'}</button>}
                            </li>
                        )
                    })}
                </ul>
            )
    }
    function Selected() {
        if(gameState.status !== 'waiting')
            return(
                <ul>
                    {selectedCards.map(n => {
                        return(
                            <li>
                                {n}
                                <button onClick={() => {
                                    setSelectedCards(selectedCards.filter(m => m !== n))
                                }}>{'<'}</button>
                            </li>
                        )
                    })}
                </ul>
            )
    }

    function Move() {
        
        function validateValues(card) {
            const possibleValues = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]
            return possibleValues.includes(card)
        }

        if(gameState.turn === gameState.players.findIndex(n => n.id === player.id))
            return(
                <button onClick={() => {
                    if(selectedCards.length >= 1 && selectedCards.length <= 4 && validateValues(declared))
                        axios.post(`http://localhost:4000/games/${gameState.id}/move`,{
                            player_index: gameState.turn,
                            cards: selectedCards,
                            declared: declared
                        }).then(res => {
                            console.log(res)
                        }).catch(error => console.log(error))
                }}>MOVE</button>
            )
        else
            return(
                <button disabled>MOVE</button>
            )
    }
    function DeclaredInput() {
        return(
            <input type={"text"} placeholder={"declared"} onChange={(e) => setDeclared(e.target.value)}/>
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
    function Pile() {
        if(gameState.status !== 'waiting')
            return(
                <div>
                    Pile: 
                    {gameState.pile}
                </div>
            )
    }
    function Draw() {
        if(gameState.turn === gameState.players.findIndex(n => n.id === player.id))
            return(
                <button onClick={() => {
                    axios.post(`http://localhost:4000/games/${gameState.id}/draw3`,{
                        player_index: gameState.turn,
                    }).then(res => {
                        console.log(res)
                    }).catch(error => console.log(error))
                }}>Draw 3</button>
            )
        else
            return(
                <button disabled>Draw 3</button>
            )
    }
    function Check() {
        const player_index = gameState.players.findIndex(n => n.id === player.id)
        if(gameState.status !== 'waiting')
            return gameState.declared.player !== player_index  && !gameState.winners.includes(gameState.players[player_index]) ? (
                <button onClick={() => {
                    axios.post(`http://localhost:4000/games/${gameState.id}/check`,{
                        player_index: player_index
                    })
                }}>
                    Check
                </button>
            ) :
            (
                <button disabled>Check</button>
            )
    }

    function render() {
        if(loaded)
            return(
                <div>
                {LeaveButton()}
                {StartButton()}
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
                {Hand()}
                {Move()}
                {Draw()}
                {Check()}
                {Selected()}
                {DeclaredInput()}
                <ChatWindow gameState={gameState} nick={player.nick}/>
                </div>
            )
        else
                return(
                    <p>Loading</p>
                )
    }

    return(
        <div>
            {render()}
        </div>
    )
}
export default Game