import React, { Component } from 'react';
import Pattern from './Pattern';
import { ES2Service } from '../service';

const data = {};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.service = new ES2Service();
    this.getDataset();
  }

  getDataset = () => {
    const result = this.service.getPattern();
    console.log(result);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <button onClick={this.getDataset}>getData</button>
        <Pattern payload={data}/>
      </div>
    );
  }
}

export default App;
