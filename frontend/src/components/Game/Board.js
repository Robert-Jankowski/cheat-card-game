import React, {useState, useEffect} from 'react'
const axios = require('axios')

const Board = ({ gameState, player, spectator }) => {

    const [selectedCards, setSelectedCards] = useState([])
    const [declared, setDeclared] = useState("2")

        useEffect(() => {
        setSelectedCards([])
        setDeclared("2")
    }, [gameState]);

    const Hand = () => {
        return (
            <ul id="hand">
                {gameState.hand.map((n, i) => {
                    return (
                        <li className="card" key={`card${i}`}>
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
    const Selected = () => {
        return (
            <ul id="selected">
                {selectedCards.map((n, i) => {
                    return (
                        <li className="selectedcard" key={`selected${i}`}>
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
    const Move = () => {
        
        function validateValues(card) {
            const possibleValues = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]
            return possibleValues.includes(card)
        }

        if(gameState.turn === gameState.players.findIndex(n => n.id === player.id))
            return(
                <button id="movebutton" onClick={() => {
                    if(selectedCards.length >= 1 && selectedCards.length <= 4 && validateValues(declared))
                        axios.post(`http://localhost:4000/games/${gameState.id}/move`,{
                            player_index: gameState.turn,
                            cards: selectedCards,
                            declared: declared
                        }).catch(error => console.log(error))
                }}>MOVE</button>
            )
        else
            return(
                <button id="movebutton" disabled>MOVE</button>
            )
    }

    const DeclaredInput = () => {
        return(
            <input id="declaredinput" type={"text"} placeholder={"declared"} onChange={(e) => setDeclared(e.target.value)}/>
        )
    }
    const Declared = () => {
            return(
                <div id="declared">
                    Declared value: {gameState.declared.value} <br/>
                    Quantity of cards:  {gameState.declared.number} <br/>
                </div>
            )
    }
    const Pile = () => {
            return(
                <div id="pile">
                    Pile: 
                    {gameState.pile}
                </div>
            )
    }
    const Draw = () => {
        if(gameState.turn === gameState.players.findIndex(n => n.id === player.id))
            return(
                <button className="drawbutton" onClick={() => {
                    axios.post(`http://localhost:4000/games/${gameState.id}/draw3`,{
                        player_index: gameState.turn,
                    }).catch(error => console.log(error))
                }}>Draw 3</button>
            )
        else
            return(
                <button disabled>Draw 3</button>
            )
    }
    const Check = () => {
        const player_index = gameState.players.findIndex(n => n.id === player.id)
            return gameState.declared.player !== player_index  && !gameState.winners.includes(gameState.players[player_index]) ? (
                <button id="checkbutton" onClick={() => {
                    axios.post(`http://localhost:4000/games/${gameState.id}/check`,{
                        player_index: player_index
                    }).catch(error => console.log(error))
                }}>
                    Check
                </button>
            ) :
            (
                <button disabled>Check</button>
            )
    }

    function selectBoard() {
        if(spectator)
            return(
                <React.Fragment>
                    <Declared />
                    <Pile />
                </React.Fragment>
            )
        else
            return(
                <React.Fragment>
                    <Declared />
                    <Pile />
                    <Hand />
                    <Selected />
                    {DeclaredInput()}
                    <Move />
                    <Draw />
                    <Check />
                </React.Fragment>  
            )
    }

    return (
        <div id="board">
            {selectBoard()}
        </div>
    )
}
export default Board