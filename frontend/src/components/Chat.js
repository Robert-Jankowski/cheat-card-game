import React, {useState} from 'react'
const axios = require('axios')

const Chat = ({chatState, player, setChatId, setPath}) => {

    const [messageInput, setMessageInput] = useState('')

    function handleSend() {
        if(messageInput !== "") {
            axios.post(`http://localhost:4000/chats/${chatState.id}/message`, {nick: player.nick, message: messageInput})
                .catch(error => console.log(error))
        }
    }
    function handleLeave() {
        axios.patch(`http://localhost:4000/chats/${chatState.id}/leave`, {player_id: player.id}).then(res => {
            setPath('games')
            setChatId(null)
        })
                .catch(error => console.log(error))
    }

    function render() {
        if(chatState !== null) {
            return(
                <div>
                    <button onClick={() => handleLeave()}>LEAVE CHAT</button>
                    <p>
                    Users in chat: 
                    </p>
                    <ul>
                        {console.log(chatState.users)}
                        {chatState.users.map(n => {
                            return(
                                <li>{n.nick}</li>
                            )
                        })}
                    </ul>
                    <input placeholder={"send message"} onChange={(e) => setMessageInput(e.target.value)}/>
                    <button onClick={() => handleSend()}>SEND</button>
                    <ul>
                    {chatState.messages.map((n,i) => {
                        return(
                            <li key={`message${i}`}>
                                {`${n.user}: ${n.message}`}
                            </li>
                        )
                    })}
                    </ul>
                </div>
            )
        }
    }

    return(
        <div>
        {render()}
        </div>
    )
}
export default Chat