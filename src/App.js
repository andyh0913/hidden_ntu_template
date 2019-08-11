import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css';
import Homepage from './container/Homepage'
import MenuContainer from './container/MenuContainer'
import Messengerpage from './container/Messengerpage'
import Loginpage from './container/Loginpage.js'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MenuContainer></MenuContainer>
        <Route exact path="/" component={Homepage}></Route>
        <Route exact path="/login" component={Loginpage}></Route>
        <Route exact path="/messenger" component={Messengerpage}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
