import React from 'react'
import '../App.css'

// speaker:
// 0: user
// 1: 漢森‧丹尼斯
// 2: 系統訊息
// 3: 喬伊
const speaker = {
    1: '丹尼斯',
    3: '喬伊'
}

const backslash2br = (text) => {
    return text.split('\\').map((item, key) => {
        return <span key={key}>{item}<br/></span>
    })
}

const displayImage = (url, setImageUrl) => {
    return (
        <div className="img-container mw4 mh4">
            <img alt="" src={url} onClick={()=>{setImageUrl(url)}}></img>
        </div>
    )
}

const SingleMessage = (props) => {
    if (props.speaker===2){
        return (
            <div className="red normal mw5 br3 f5 pa2 ma1 tc self-center">
                {props.isImage?displayImage(props.text, props.setImageUrl):backslash2br(props.text)}
            </div>
        )
    }
    else{
        return (
            <div className="items-start ma1">
                {speaker[props.speaker]?<div className="silver f6 ml3 mb0">{speaker[props.speaker]}</div>:null}
                <div className={`white normal mw5 br3 f5 pa2 ma1 tl ${props.speaker===0?"bg-blue self-end":"bg-gray self-start"}`}>
                    {props.isImage?displayImage(props.text, props.setImageUrl):backslash2br(props.text)}
                </div>
            </div>
        )
    }
}

export default SingleMessage;