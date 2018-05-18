import React, { Component } from 'react';
import Pattern from './Pattern';

const
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <Pattern payload={data}/>
      </div>
    );
  }
}

export default App;
