import React, { useState } from 'react'
const axios = require('axios')

const ChatWindow = ({ gameState, nick }) => {

    const [messageInput, setMessageInput] = useState('')

    const InputMessage = () => {
        return (
            <input id="inputmessage" placeholder={"message"} onChange={(e) => setMessageInput(e.target.value)} />
        )
    }
    const SendButton = () => {
        return (
            <button id="sendbutton" onClick={() => {
                if (messageInput !== "") {
                    axios.post(`http://localhost:4000/games/${gameState.id}/message`, { nick: nick, message: messageInput })
                        .catch(error => console.log(error))
                }
            }}>SEND</button>
        )
    }
    const Messages = () => {
        return (
            <ul id="messages">
                {gameState.messages.map((n, i) => {
                    return (
                        <li className="message" key={`message${i}`}>
                            {`${n.nick}: ${n.message}`}
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