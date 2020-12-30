import React, {useEffect} from 'react'
const axios = require('axios')

const Games = ({player, games, setGames}) => {
    useEffect(() => {
        axios.get('http://localhost:4000/games').then(res => {
            console.log(res);
            setGames(res.data)
        }).catch(error => {
            console.log(error)
        })
    },[])
    return(
        <div>
            {games.map(n => {
                return (
                    <div>
                        {n.id}
                        {n.players}
                        {n.status}
                    </div>
                )
            })}
        </div>
    )
}
export default Games