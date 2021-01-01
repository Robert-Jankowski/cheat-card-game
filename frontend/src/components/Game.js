import React, {useEffect, useState} from 'react'
const axios = require('axios')

const Game = ({gameState, player}) => {

    const [selectedCards, setSelectedCards] = useState([])
    const [declared, setDeclared] = useState("2")
    
    useEffect(() => {
        setSelectedCards([])
        setDeclared("2")
    }, [gameState]);

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
        if(gameState.turn === gameState.players.findIndex(n => n.id === player.id))
            return(
                <button onClick={() => {
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
        if(gameState.status !== 'waiting')
            return gameState.declared.player !== gameState.players.findIndex(n => n.id === player.id) ? (
                <button onClick={() => {
                    axios.post(`http://localhost:4000/games/${gameState.id}/check`,{
                        player_index: gameState.players.findIndex(n => n.id === player.id)
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
        if(gameState !==null)
        return(
            <div>
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