import React, {useState, useEffect} from 'react'
const axios = require('axios')

const Board = ({ gameState, player, spectator }) => {

    const [selectedCards, setSelectedCards] = useState([])
    const [declared, setDeclared] = useState("2")

        useEffect(() => {
        setSelectedCards([])
        setDeclared(gameState.declared.value)
    }, [gameState]);

    function nameToCard(name) {
        const [color, value] = name.split(':')
        return `cards/${color}-${value}.png`
    }

    const Hand = () => {
        return (
            <ul id="hand">
                {gameState.hand.map((n, i) => {
                    return (
                        <li className="card" key={`card${i}`}>
                            <img src={nameToCard(n)}
                            alt={n}
                            height={100}
                            onClick={() => {
                                if(!selectedCards.includes(n))
                                    setSelectedCards([...selectedCards, n])
                                else
                                setSelectedCards(selectedCards.filter(m => m !== n))
                            }}
                            style={{border: selectedCards.includes(n) ? "solid 2px red": "none"}}/>
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
                <button id="movebutton" className="gamebuttons" onClick={() => {
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
                <button id="movebutton" className="disabledgamebuttons" disabled>MOVE</button>
            )
    }

    const DeclaredInput = () => {

        function mapDeclared(card) {
            return card === "J" ? 11 :
            card === "Q" ? 12 :
            card === "K" ? 13 :
            card === "A" ? 14 :
            parseInt(card)
        }
        const options = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]
        const filtered = [...options].filter(n => mapDeclared(n) >= mapDeclared(gameState.declared.value))

        return(
            <select id="declareoptions" onChange={(e) => setDeclared(e.target.value)}
                    defaultValue={'default'}>
                    <option value='default' disabled>--- DECLARE VALUE ---</option>
                {filtered.map(n => {
                    return(
                        <option key={n} className={n} className="declareoption" value={n}>{n}</option>
                    )
                })}
            </select>
        )
    }
    
    const Declared = () => {
            return(
                <div id="declared">
                    <ul id="declaredcards">
                        {[...Array.from(Array(gameState.declared.number).keys())].map((n,i) => {
                            return(
                                <li key={`declated${i}`} className="declaredcard">
                                    <img src="cards/red-back.png" alt="declared" height={100}/>
                                </li>
                            )
                        })}
                    </ul>
                    <p>Value: {gameState.declared.value}</p>
                </div>
            )
    }
    const Pile = () => {
            return(
                <div id="pile">
                    <p>Cards: {gameState.pile}</p>
                    <img src={gameState.pile === 1 ? "cards/hearts-2.png" : "cards/red-back.png"} alt={gameState.pile} height={250}/>
                </div>
            )
    }
    const Draw = () => {
        if(gameState.turn === gameState.players.findIndex(n => n.id === player.id))
            return(
                <button className="drawbutton" className="gamebuttons" onClick={() => {
                    axios.post(`http://localhost:4000/games/${gameState.id}/draw3`,{
                        player_index: gameState.turn,
                    }).catch(error => console.log(error))
                }}>Draw 3</button>
            )
        else
            return(
                <button disabled id="drawbutton" className="disabledgamebuttons">Draw 3</button>
            )
    }
    const Check = () => {
        const player_index = gameState.players.findIndex(n => n.id === player.id)
            return gameState.declared.player !== player_index  && !gameState.winners.includes(gameState.players[player_index]) ? (
                <button id="checkbutton" className="gamebuttons" onClick={() => {
                    axios.post(`http://localhost:4000/games/${gameState.id}/check`,{
                        player_index: player_index
                    }).catch(error => console.log(error))
                }}>
                    Check
                </button>
            ) :
            (
                <button disabled id="checkbutton" className="disabledgamebuttons">Check</button>
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