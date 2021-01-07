import React from 'react'

const Ended = ({winners}) => {
    return(
        <div id="ended">
            <ul id="winnerslist">
            {winners.map((n,i) => {
                return(
                    <li className="winner" key={`winner${i}`}>
                        <p>{i+1}</p>
                        <p>{n.nick}</p>
                    </li>
                )
            })}
            </ul>
        </div>
    )
}
export default Ended