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
        const socket = this.props.socket;
        const message = {
            user: this.props.user,
			text: this.state.value,
			isUser: true,
			image: "none",
			date: new Date()
        }
        this.props.pushNewMessage(message);
        socket.emit('message', message);
        this.setState({value: ""});
    }

    render(){
        return (
            <div className="w-100 h--5 bg-black o-80 ph4 flex-shrink-0 flex flex-row justify-between items-center">
                <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="說點什麼吧..." className="br-pill h2 ph2 bg-gray ba b--gray ph-silver white flex-grow-1 fw2"/>
                <button id="chatButton" className="bg-transparent h2 w2 border-none ml3 grow"
                onClick={this.handleButtonClick}></button>
            </div>
        )
    }
}

export default ChatBar;