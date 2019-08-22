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
            socket: io(),
            disabled: true,
            progress: 0
        }

        this.state.socket.on('message', (obj) => {
            this.pushNewMessage(obj);
        })

        this.state.socket.on('enable', (obj) => {
            this.setState({disabled: false, progress: obj.progress});
        })

        this.state.socket.on('disable', (obj) => {
            this.setState({disabled: true, progress: obj.progress});
        })

        setInterval(() => {
            if (!this.state.socket.connected) this.setState({socket: io()});
        },500);

        console.log(this.props);
        
        fetch('/api/user')
        .then(res => res.json())
        .then(user => {
            console.log(user);
            if (user._id !== 'none'){
                this.props.setUser(user);
                this.state.socket.emit('login', user);
                fetch(`/api/message?user=${user.account}`)
                .then(res => res.json())
                .then(data => {
                    this.setState({messages: data});
                })
                .catch(err => console.error(err));
            }
            else{
                window.alert('請先登入帳號！');
                window.location='/login';
            }
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
                <ChatBar disabled={this.state.disabled} progress={this.state.progress} user={this.props.account} socket={this.state.socket} pushNewMessage={this.pushNewMessage}></ChatBar>
            </div>
        )
    }
}

export default Messengerpage;