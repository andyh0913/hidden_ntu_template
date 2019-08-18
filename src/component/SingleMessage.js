import React from 'react'
import '../App.css'

const backslash2br = (text) => {
    return text.split('\\').map((item, key) => {
        return <span key={key}>{item}<br/></span>
    })
}

const displayImage = (url) => {
    return (
        <div className="img-container mw4 mh4">
            <img alt="" src={url}></img>
        </div>
    )
}

const SingleMessage = (props) => {
    return (
        <div className={`white normal mw5 br3 f5 pa2 ma1 tl ${props.isUser?"bg-blue self-end":"bg-gray self-start"}`}>
            {props.isImage?displayImage(props.text):backslash2br(props.text)}
        </div>
    )
}

export default SingleMessage;