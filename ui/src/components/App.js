import React, { Component } from 'react';
import Pattern from './Pattern';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <Pattern />
      </div>
    );
  }
}

export default App;
