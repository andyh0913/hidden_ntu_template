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

        this.state.socket.on('message', (obj) => {
            this.pushNewMessage(obj);
        })

        console.log(this.props);
        
        fetch('/api/user')
        .then(res => res.json())
        .then(user => {
            console.log(user);
            if (user._id !== 'none'){
                this.props.setUser(user);
                this.state.socket.emit('login', user);
            }
            else{
                window.alert('請先登入帳號！');
                window.location='/login';
            }
        })
    }

    componentDidMount(){
        fetch(`/api/message?user=${this.props.account}`)
        .then(res => res.json())
        .then(data => {
            this.setState({messages: data});
        })
        .catch(err => console.error(err));
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
                <ChatBar user={this.props.account} socket={this.state.socket} pushNewMessage={this.pushNewMessage}></ChatBar>
            </div>
        )
    }
}

export default Messengerpage;