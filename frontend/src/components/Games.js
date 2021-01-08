import '../styles/Games.css'
import React, {useEffect, useState} from 'react'
import {useStoreState, useStoreActions} from 'easy-peasy'
import GamesList from './Games/GamesList'
import ChatForm from './Games/ChatForm'
const axios = require('axios')

const Games = () => {

    const {games, player} = useStoreState(store => ({
        games: store.games,
        player: store.player
    }))
    const {setGames, setPath, setGameId, setChatId, setGameSpectatedId} = useStoreActions(actions => ({
        setGames: actions.setGames,
        setPath: actions.setPath,
        setGameId: actions.setGameId,
        setChatId: actions.setChatId,
        setGameSpectatedId: actions.setGameSpectatedId
    }))

    useEffect(() => {
        axios.get('http://localhost:4000/games').then(res => {
            setGames(res.data)
        }).catch(error => {
            console.log(error)
        })
    },[])

    return(
        <main id="games">
            <GamesList games={games} setGameSpectatedId={setGameSpectatedId} setGameId={setGameId} player={player} setPath={setPath}/>
            <ChatForm setPath={setPath} setChatId={setChatId} player={player} />
        </main>
    )
}
export default Games