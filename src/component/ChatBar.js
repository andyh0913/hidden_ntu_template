import React from 'react'
import '../App.css'

class ChatBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            value: ""
        }
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    handleButtonClick = () => {
        if (this.state.value){
            const socket = this.props.socket;
            const message = {
                progress: this.props.progress,
                user: this.props.user,
                text: this.state.value,
                isUser: true,
                isImage: false,
                date: new Date()
            }
            this.props.pushNewMessage(message);
            socket.emit('message', message);
            this.setState({value: ""});
        }
    }

    render(){
        return (
            <div className="w-100 h--5 bg-black o-80 flex-shrink-0 flex flex-row ph4 justify-start items-center">
                <input type="text" disabled={this.props.disabled} value={this.state.value} onChange={this.handleChange} 
                    placeholder={this.props.disabled?"現在無法使用此功能":"說點什麼吧..."}
                    className={`br-pill h2 ph2 bn ph-silver white flex-grow-1 fw2 ${this.props.disabled?"bg-dark-gray":"bg-gray"}`}/>
                <div id="chatButton" className="bg-transparent h2 w2 border-none ml3 grow flex-shrink-0"
                onClick={this.handleButtonClick}></div>
            </div>
        )
    }
}

export default ChatBar;