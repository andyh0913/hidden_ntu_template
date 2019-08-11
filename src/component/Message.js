import React from 'react'

const Message = (props) => {
    return (
        <div className={`h2 black ${props.isUser?"bg-light-gray self-end":"bg-blue self-start"}`}>{props.text}</div>
    )
}

export default Message;