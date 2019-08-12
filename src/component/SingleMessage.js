import React from 'react'
import '../App.css'

const SingleMessage = (props) => {
    return (
        <div className={`white normal mw5 br3 f5 pa2 ma1 tl ${props.isUser?"bg-blue self-end":"bg-gray self-start"}`}>{props.text}</div>
    )
}

export default SingleMessage;