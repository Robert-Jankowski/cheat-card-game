const Players = ({players, turn, winners}) => {
    return(
        <ul id="playerslist">
            {players.map((n,i) => {
                return(
                <li className="player" key={n.index}>
                    {n.nick} {turn === i ? "(turn)" : ""} {winners.some(m => m.id === n.id) ? "(finished)" : ""} <br/>
                    {n.hand} <br/>
                </li>)
            })}
        </ul>
    )
}
export default Players