import React, {useEffect, useState} from 'react'
import {useStoreState, useStoreActions} from 'easy-peasy'
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


    function handleCreateGame() {
        axios.post('http://localhost:4000/games', {player_id: player.id}).then(res => {
            setGameId(res.data)
            setPath('game')
        }).catch(error => {
            console.log(error)
        })
    }

    function handleCreateChat() {
        axios.post('http://localhost:4000/chats/create', {userId: player.id, name: chatForm.name, password: chatForm.password}).then(res => {
            if(res.data !== "") {
                setChatId(res.data)
                setPath('chat')
            }
            else {
                alert("This chat name already exists")
            }
        }).catch(error => {
            console.log(error)
        })
    }
    function handleJoinChat() {
        axios.patch(`http://localhost:4000/chats/join`, {user_id: player.id, name: chatForm.name, password: chatForm.password}).then(res => {
            if(res.data !== "") {
                setChatId(res.data)
                setPath('chat')
            }
            else {
                alert("Wrong chatroom name or password")
            }
        }).catch(error => {
            console.log(error)
        })
    }

    const [chatForm, setChatForm] = useState({name: "", password: ""})

    return(
        <div>
            {games.map(n => {
                return (
                    <div key={n.id}>
                        Game ID:{n.id} <br/>
                        Players: {n.players}/8 <br/>
                        Status: {n.status} <br/> <br/>
                        <button onClick={() => {
                            axios.patch(`http://localhost:4000/games/${n.id}/join`, {player_id: player.id}).then(res => {
                                setGameId(n.id)
                                setPath('game')
                            }).catch(error => {
                                console.log(error)
                            })
                            
                        }}>JOIN</button>
                        <button onClick={() => {
                                setGameSpectatedId(n.id)
                                setPath('spectate')
                            
                        }}>SPECTATE</button>
                    </div>
                )
            })}
            <button onClick={() => handleCreateGame()}>CREATE GAME</button>
            <div>
                CHATS
                <input placeholder={"chatroom name"} onChange={(e) => setChatForm({...chatForm, name: e.target.value})}/>
                <input placeholder={"chatroom password"} onChange={(e) => setChatForm({...chatForm, password: e.target.value})}/>
                <button onClick={() => handleJoinChat()}>JOIN CHATROOM</button>
                <button onClick={() => handleCreateChat()}>CREATE CHATROOM</button>
            </div>
        </div>
    )
}
export default Games