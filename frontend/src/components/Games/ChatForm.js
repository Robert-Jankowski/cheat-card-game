import React, { useState } from 'react'
const axios = require('axios')

const ChatForm = ({ setPath, setChatId, player }) => {

    const [chatForm, setChatForm] = useState({ name: "", password: "" })

    function handleCreateChat() {
        axios.post('http://localhost:4000/chats/create', { userId: player.id, name: chatForm.name, password: chatForm.password }).then(res => {
            if (res.data !== "") {
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
        axios.patch(`http://localhost:4000/chats/join`, { user_id: player.id, name: chatForm.name, password: chatForm.password }).then(res => {
            if (res.data !== "") {
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

    return (
        <div id="chatform">
            <p>CHATS</p>
            <input id="nameinput" placeholder={"chatroom name"} onChange={(e) => setChatForm({ ...chatForm, name: e.target.value })} />
            <input id="passwordinput" placeholder={"chatroom password"} onChange={(e) => setChatForm({ ...chatForm, password: e.target.value })} />
            <button id="joinchatbutton" onClick={() => handleJoinChat()}>JOIN CHATROOM</button>
            <button id="createchatbutton" onClick={() => handleCreateChat()}>CREATE CHATROOM</button>
        </div>
    )
}
export default ChatForm