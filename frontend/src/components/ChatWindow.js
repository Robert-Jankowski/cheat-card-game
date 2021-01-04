import React, {useState} from 'react'
const axios = require('axios')

const ChatWindow = ({nick, gameState}) => {

    const [messageInput, setMessageInput] = useState('')

    function handleSend() {
        if(messageInput !== "") {
            axios.post(`http://localhost:4000/games/${gameState.id}/message`, {nick: nick, message: messageInput})
                .catch(error => console.log(error))
        }
    }
    function render() {
        if(gameState !== null) {
            return(
            <div>
                <input placeholder={"message"} onChange={(e) => setMessageInput(e.target.value)}/>
                <button onClick={() => handleSend()}>SEND</button>
                <ul>
                    {gameState.messages.map((n, i) => {
                        return(
                            <li key={`message${i}`}>
                                {`${n.nick}: ${n.message}`}
                            </li>
                        )
                    })}
                </ul>
             </div>
            )
        }
    }

    return (
        <div>
            {render()}
        </div>
    )
}
export default ChatWindow