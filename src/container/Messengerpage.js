import React from 'react'
import Messages from './Messages'
import ChatBar from '../component/ChatBar'
import '../App.css'

class Messengerpage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messages: []
        }
        
        fetch('/api/post')
        .then(res => res.json())
        .then(data => {
            this.setState({messages: data});
        })
        .catch(err => console.error(err));
    }

    render(){
        return (
            <div className="fixed flex flex-column justify-between w-100 h-100 bg-black">
                <div className="w-100 h4 bg-black o-80 flex flex-row justify-start items-center pa3">
                    <div className="img-container mw3 mh3">
                        <img alt="" className="br-100" src="/images/blackman.jpg"></img>
                    </div>
                    <h4 className="white f4 normal ml3">身分不明的研究員</h4>
                </div>
                <Messages messages={this.state.messages}></Messages>
                <ChatBar></ChatBar>
            </div>
        )
    }
}

export default Messengerpage;