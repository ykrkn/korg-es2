import React, { Component } from 'react';
import Pattern from './Pattern';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const _onMouseMove = (e) => { 
      window.mx = e.clientX; 
      window.my = e.clientY; 
    }
    
    return (
      <div className="App" onMouseMove={_onMouseMove}>
        <header className="App-header"></header>
        <Pattern />
      </div>
    );
  }
}

export default App;
