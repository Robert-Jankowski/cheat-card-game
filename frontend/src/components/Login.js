import React, {useState} from 'react'
import {useStoreActions} from 'easy-peasy'
import 'axios'
import axios from 'axios'
const Login = () => {

    const {setPlayer, setPath} = useStoreActions(actions => ({
        setPlayer: actions.setPlayer,
        setPath: actions.setPath
    }))

    const [nickInput, setNickInput] = useState('')

    function handleSubmit(nick) {
        axios.post('http://localhost:4000/players', {nick: nick}).then(res => {
            const player = {...res.data}
            setPlayer(player)
            setPath('games')
        })
        
    }

    return(
        <div>
            <input placeholder={'Your nick'} onChange={(e) => setNickInput(e.target.value)}/>
            <button onClick={() => {handleSubmit(nickInput)}}>Enter</button>
        </div>
    )
}
export default Login