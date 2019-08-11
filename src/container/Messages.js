import React from 'react'
import Message from '../component/Message'

const Messages = (props) => {
    const messages = props.messages;
    const messageDoms = messages.map( x => <Message {...x}></Message> )
    return (
        <div className="w-100 flex-grow-1 overflow-auto white">
            {messageDoms}
        </div>
    )
}

export default Messages;