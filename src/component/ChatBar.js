import React from 'react'
import '../App.css'

const ChatBar = (props) => {
    return (
        <div className="w-100 h3 bg-black o-80 flex flex-row justify-between items-center">
            <input type="text" placeholder="說點什麼吧..." className="br-pill h-50 ml4 ph2 bg-gray ba b--gray ph-silver white flex-grow-1 fw2"/>
            <button id="chatButton" className="bg-transparent h2 w2 border-none ma3 grow"></button>
        </div>
    )
}

export default ChatBar;