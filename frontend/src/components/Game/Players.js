const Players = ({players, turn, winners}) => {
    return(
        <ul id="playerslist">
            {players.map((n,i) => {
                return(
                <li className="player"
                    key={n.index} 
                    style={{border: turn === i ? "solid 4px red" : "solid 1px black",
                            opacity: winners.some(m => m.id === n.id) ? "0.5" : "1"}}>
                   <p> {n.nick} </p>
                    <p> {n.hand} cards </p>
                </li>)
            })}
        </ul>
    )
}
export default Players