import React, {useEffect, useRef} from 'react'
import SingleMessage from '../component/SingleMessage'

const MessageList = (props) => {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        console.log("scrollToBottom");
        messagesEndRef.current.scrollIntoView({/*behavior: "smooth"*/});
    }
    useEffect(scrollToBottom, [props.messages])
    const messages = props.messages;
    const messageDoms = messages.map( x => <SingleMessage {...x}></SingleMessage> )
    return (
        <div id="messageList" className="w-100 flex-grow-1 overflow-auto white ph4 flex flex-column justify-start">
            {messageDoms}
            <div ref={messagesEndRef}></div>
        </div>
    )
}

export default MessageList;