import React, { useState } from 'react'
import { useStoreActions } from 'easy-peasy'
import 'axios'
import axios from 'axios'
const Login = () => {

    const { setPlayer, setPath } = useStoreActions(actions => ({
        setPlayer: actions.setPlayer,
        setPath: actions.setPath
    }))

    const [nickInput, setNickInput] = useState('')

    const EnterButton = () => {
        return (
            <button id="enterbutton" onClick={() => {
                axios.post('http://localhost:4000/players', { nick: nickInput }).then(res => {
                    const player = { ...res.data }
                    setPlayer(player)
                    setPath('games')
                })
            }}>Enter</button>
        )
    }
    const NickInput = () => {
        return (
            <input id="nickinput" placeholder={'Your nick'} onChange={(e) => setNickInput(e.target.value)} />
        )
    }

    return (
        <main id="login">
            <EnterButton />
            {NickInput()}
        </main>
    )
}
export default Login