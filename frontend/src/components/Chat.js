import React, { useState, useEffect } from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
const axios = require('axios')

const Chat = () => {

    const [loaded, setLoaded] = useState(false)

    const { chatState, player, chatId } = useStoreState(store => ({
        chatState: store.chatState,
        player: store.player,
        chatId: store.chatId
    }))
    const { setChatId, setPath, setChatState } = useStoreActions(actions => ({
        setChatId: actions.setChatId,
        setPath: actions.setPath,
        setChatState: actions.setChatState
    }))

    const [messageInput, setMessageInput] = useState('')

    useEffect(() => {
        axios.get(`http://localhost:4000/chats/${chatId}`).then(res => {
            setChatState(res.data)
            setLoaded(true)
        }).catch(error => console.log(error))
    }, [])

    const SendButton = () => {
        return (
            <button onClick={() => {
                if (messageInput !== "") {
                    axios.post(`http://localhost:4000/chats/${chatState.id}/message`, { nick: player.nick, message: messageInput })
                        .catch(error => console.log(error))
                }
            }}>SEND
            </button>
        )

    }

    const LeaveButton = () => {
        return (
            <button onClick={() => {
                axios.patch(`http://localhost:4000/chats/${chatState.id}/leave`, { player_id: player.id }).then(res => {
                    setPath('games')
                    setChatId(null)
                }).catch(error => console.log(error))
            }}>LEAVE CHAT</button>
        )
    }
    const Input = () => {
        return (
            <input placeholder={"send message"} onChange={(e) => setMessageInput(e.target.value)} />
        )

    }
    const Users = () => {
        return (
            <ul>
                {chatState.users.map((n,i) => {
                    return (
                        <li key={`user${i}`}>
                        {n.nick}
                        </li>
                    )
                })}
            </ul>
        )
    }
    const Messages = () => {
        return (
            <ul>
                {chatState.messages.map((n, i) => {
                    return (
                        <li key={`message${i}`}>
                            {`${n.user}: ${n.message}`}
                        </li>
                    )
                })}
            </ul>
        )
    }


    function render() {
        if (loaded) {
            return (
                <React.Fragment>
                    <LeaveButton />
                    <Users />
                    {Input()}
                    <SendButton />
                    <Messages />
                </React.Fragment>
            )
        }
    }

    return (
        <main className="chat">
            {render()}
        </main>
    )
}
export default Chat