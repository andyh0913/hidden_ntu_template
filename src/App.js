import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css';
import Homepage from './container/Homepage'
import MenuContainer from './container/MenuContainer'
import Messengerpage from './container/Messengerpage'
import Loginpage from './container/Loginpage'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      _id: null,
      name: null,
      account: null,
      progress: null
    }

    console.log("test0");

    fetch('/api/user')
    .then(res => res.json())
    .then(user => {
        console.log(user);
        if (user._id !== 'none'){
            this.setUser(user);
        }
    })
  }

  setUser = (user) => {
    this.setState(user);
  }

  setProgress = (p) => {
    if (p > this.state.progress){
      console.log("setProgress:", p);
      this.setState({progress: p});
    }
  }

  render(){
    return (
      <BrowserRouter>
        <div className="App">
          <MenuContainer name={this.state.name}></MenuContainer>
          <Route exact path="/" component={Homepage}></Route>
          <Route exact path="/login" render={()=> <Loginpage name={this.state.name}></Loginpage>}></Route>
          <Route exact path="/messenger" render={() => <Messengerpage {...this.state} setUser={this.setUser} setProgress={this.setProgress} ></Messengerpage>} ></Route>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
