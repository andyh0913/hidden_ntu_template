import React from 'react'
import '../App.css'

const ChatBar = () => {
    return (
        <div className="w-100 h3 bg-black o-80 flex flex-row justify-between items-center">
            <input type="text" placeholder="說點什麼吧..." className="br-pill h-50 ml4 ph2 bg-gray ba b--gray ph-silver white flex-grow-1 fw2"/>
            <button className="mh3"></button>
        </div>
    )
}

export default ChatBar;