import React, { useState } from 'react'
const axios = require('axios')

const ChatWindow = ({ gameState, nick }) => {

    const [messageInput, setMessageInput] = useState('')

    const InputMessage = () => {
        return (
            <input id="inputmessage" placeholder={"message"} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
        )
    }
    const SendButton = () => {
        return (
            <button id="sendbutton" onClick={() => {
                if (messageInput !== "") {
                    axios.post(`http://localhost:4000/games/${gameState.id}/message`, { nick: nick, message: messageInput })
                        .catch(error => console.log(error))
                        setMessageInput('')
                }
            }}>SEND</button>
        )
    }
    const Messages = () => {
        return (
            <ul id="gamemessages">
                {[...gameState.messages].reverse().map((n, i) => {
                    return (
                        <li className="gamemessage" key={`message${i}`}>
                            <p className="gamemessageauthor">{n.nick}</p>
                            <p className="gamemessagetext">{n.message}</p>
                            <p></p>
                        </li>
                    )
                })}
            </ul>
        )
    }

    function render() {
        if (gameState !== null) {
            return (
                <React.Fragment>
                    {InputMessage()}
                    <SendButton />
                    <Messages />
                </React.Fragment>
            )
        }
    }

    return (
        <div id="chatwindow">
            {render()}
        </div>
    )
}
export default ChatWindow