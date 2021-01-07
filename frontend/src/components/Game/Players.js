const Players = ({players, turn}) => {
    return(
        <ul id="playerslist">
            {players.map((n,i) => {
                return(
                <li className="player" key={n.index}>
                    {n.nick} {turn === i ? "(turn)" : ""} <br/>
                    {n.hand} <br/>
                </li>)
            })}
        </ul>
    )
}
export default Players