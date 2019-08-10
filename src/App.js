import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css';
import Homepage from './container/Homepage'
import MenuContainer from './container/MenuContainer'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MenuContainer></MenuContainer>
        <Route exact path="/" component={Homepage}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
