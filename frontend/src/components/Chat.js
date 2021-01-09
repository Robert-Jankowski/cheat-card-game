import React, { useState, useEffect } from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import '../styles/Chat.css'
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
            <button id="chatssend" onClick={() => {
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
            <button id="chatsleave" onClick={() => {
                axios.patch(`http://localhost:4000/chats/${chatState.id}/leave`, { player_id: player.id }).then(res => {
                    setPath('games')
                    setChatId(null)
                }).catch(error => console.log(error))
            }}>LEAVE CHAT</button>
        )
    }
    const Input = () => {
        return (
            <input id="chatsinput" placeholder={"send message"} onChange={(e) => setMessageInput(e.target.value)} />
        )

    }
    const Users = () => {
        return (
            <ul id="chatsusers">
                {chatState.users.map((n,i) => {
                    return (
                        <li className="chatsuser" key={`user${i}`}>
                        {n.nick}
                        </li>
                    )
                })}
            </ul>
        )
    }
    const Messages = () => {
        return (
            <ul id="chatsmessages">
                {[...chatState.messages].reverse().map((n, i) => {
                    return (
                        <li className="chatsmessage" key={`message${i}`}>
                            <p className="messageauthor">{n.user}</p>
                            <p className="messagetext">{n.message}</p>
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
        <main id="chat">
            {render()}
        </main>
    )
}
export default Chat