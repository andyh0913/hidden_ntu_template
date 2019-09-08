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
            isGroup: true,
            senderName: "不明人士",
            largeImageUrl: ""
        }

        this.state.socket.on('message', (obj) => {
            this.pushNewMessage(obj);
            this.props.setProgress(obj.progress);
        })
        this.state.socket.on('enable', (obj) => {
            this.setState({disabled: false});
            this.props.setProgress(obj.progress);
        })
        this.state.socket.on('disable', (obj) => {
            this.setState({disabled: true});
            this.props.setProgress(obj.progress);
        })
        this.state.socket.on('setSender', (obj) => {
            this.setState(obj);
        })
        this.state.socket.on('test', (obj)=>{
            console.log(obj);
        })

        setInterval(() => {
            if (!this.state.socket.connected){
                const newSocket = io();
                this.setState({socket: newSocket});
                const user = {
                    _id: this.props._id,
                    account: this.props.account,
                    progress: this.props.progress,
                    name: this.props.name
                }
                newSocket.emit('login', user);
                newSocket.on('message', (obj) => {
                    this.pushNewMessage(obj);
                    this.props.setProgress(obj.progress);
                })
                newSocket.on('enable', (obj) => {
                    this.setState({disabled: false});
                    this.props.setProgress(obj.progress);
                })
                newSocket.on('disable', (obj) => {
                    this.setState({disabled: true});
                    this.props.setProgress(obj.progress);
                })
                newSocket.on('setSender', (obj) => {
                    this.setState(obj);
                })
            }
        },1000);

        console.log(this.props);
        
        fetch('/api/user')
        .then(res => res.json())
        .then(user => {
            console.log(user);
            if (user._id !== 'none'){
                this.props.setUser(user);
                this.state.socket.emit('login', user);
                fetch(`/api/message?user=${user._id}`)
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

    // updateIcon = (p) => {
    //     if (p<=158) this.setState({isGroup: false});
    //     else this.setState({isGroup: true});
    // }

    // updateSenderName = (p) => {
    //     let name = "";
    //     if (p<=9) name = "不明人士";
    //     else if (p<=158) name = "漢森‧丹尼斯";
    //     else if (p<=162) name = "漢森‧丹尼斯、不明人士";
    //     else name = "漢森‧丹尼斯、喬伊";
    //     this.setState({senderName: name});
    // }

    pushNewMessage = (message) => {
        console.log("update message");
        this.setState((prevState) => ({
            messages: [...prevState.messages, message]
        }));
    }

    setImageUrl = (url) => {
        this.setState({largeImageUrl: url});
    }

    render(){
        return (
            <div className="fixed flex flex-column justify-between w-100 h-100 bg-black">
                {!this.state.largeImageUrl?null
                :<div className="fixed vw-100 vh-100 z-3 flex scale-big-1 justify-center items-center bg-black" 
                    onClick={()=>{this.setImageUrl("")}}>
                    <img alt="" src={this.state.largeImageUrl} ></img>
                </div>}
                <div className="flex-shrink-0 w-100 h4 bg-black o-80 flex flex-row justify-start items-center pa3">
                    <div className="w3 h3 relative">
                        {
                            this.state.isGroup?
                            <React.Fragment>
                                <div className="w--3 h--3 absolute top-0 right-0">
                                    <img alt="" className="br-100" src="/images/blackman.jpg"></img>
                                </div>
                                <div className="w--3 h--3 absolute bottom-0 left-0">
                                    <img alt="" className="br-100" src="/images/blackman.jpg"></img>
                                </div>
                            </React.Fragment>
                            :<img alt="" className="br-100" src="/images/blackman.jpg"></img>
                        }
                        
                    </div>
                    <h4 className="white f4 normal ml3">{this.state.senderName}</h4>
                </div>
                <MessageList messages={this.state.messages} setImageUrl={this.setImageUrl} ></MessageList>
                <ChatBar disabled={this.state.disabled} progress={this.props.progress} user={this.props._id} socket={this.state.socket} pushNewMessage={this.pushNewMessage}></ChatBar>
            </div>
        )
    }
}

export default Messengerpage;