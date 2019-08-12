import React from 'react'
import SingleMessage from '../component/SingleMessage'

const MessageList = (props) => {
    const messages = props.messages;
    const messageDoms = messages.map( x => <SingleMessage {...x}></SingleMessage> )
    return (
        <div className="w-100 flex-grow-1 overflow-auto white pa4 flex flex-column justify-start">
            {messageDoms}
        </div>
    )
}

export default MessageList;