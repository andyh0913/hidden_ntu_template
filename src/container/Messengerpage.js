import React from 'react'
import MessageList from './MessageList'
import ChatBar from '../component/ChatBar'
import '../App.css'
import io from 'socket.io-client';

class Messengerpage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            socket: io()
        }
        
        fetch('/api/post?user=test')
        .then(res => res.json())
        .then(data => {
            this.setState({messages: data});
        })
        .catch(err => console.error(err));

        this.state.socket.on('message', (obj) => {
            this.pushNewMessage(obj);
        })
    }

    pushNewMessage = (message) => {
        console.log("update message");
        this.setState((prevState) => ({
            messages: [...prevState.messages, message]
        }));
    }

    render(){
        return (
            <div className="fixed flex flex-column justify-between w-100 h-100 bg-black">
                <div className="flex-shrink-0 w-100 h4 bg-black o-80 flex flex-row justify-start items-center pa3">
                    <div className="img-container mw3 mh3">
                        <img alt="" className="br-100" src="/images/blackman.jpg"></img>
                    </div>
                    <h4 className="white f4 normal ml3">身分不明的研究員</h4>
                </div>
                <MessageList messages={this.state.messages}></MessageList>
                <ChatBar user="test" socket={this.state.socket} pushNewMessage={this.pushNewMessage}></ChatBar>
            </div>
        )
    }
}

export default Messengerpage;