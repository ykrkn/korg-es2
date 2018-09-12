import React, { Component } from 'react';
import { ES2Service } from './service';

class ToggleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label : this.props.label,
            className : props.className || "ToggleButton",
            selected : this.props.selected 
        };
    }

    render() {
        const _onClick = (e) => {
            let { selected } = this.state;
            selected = !selected;

            if(this.props.onToggle) this.props.onToggle(selected);
            let className = (this.props.className || "ToggleButton");
            if(selected) className += " selected";
            this.setState({selected : selected, className : className});
        };

        const { label, className } = this.state;
        return <button className={className} onClick={_onClick}>{label}</button>;
    }
}

class PadButton extends Component {
    constructor(props) {
        super(props);
        // this.state = {};
    }

    render() {
      const { className, payload } = this.props;
      //console.log(payload);
      const label = payload.notes.filter(e => e != -1).join(' ');
      return <button className={className}>{label}</button>;
    }
}

class Part extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails : false
        };
    }

    render() {
        const { payload, patternLength } = this.props;
        //console.log(payload);
        const { showDetails } = this.state;
        const visibleSteps = payload.steps.slice(0, 16*patternLength);
        const { oscillator_type } = payload;

        const partToggleOnClick = (e) => {
            this.setState({showDetails : e});    
        };
        
        return <div className="Part">
            <div className="part-pads-row">
                <ToggleButton onToggle={partToggleOnClick} label={oscillator_type}/> 
                {visibleSteps.map(e => <PadButton className="PadButton" payload={e} />)}
            </div>
            { showDetails ? <div className="part-details">X</div> : null }   
        </div>;
    }
}

class Pattern extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
      const { payload } = this.props;
        //const mseqs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map(e => <MotionSeq />);
        return (<div className={"Pattern"}>
          {payload.parts.map(e => <Part payload={e} patternLength={payload.length} />)} 
          {/*mseqs*/}
        </div>);
    }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    // this.service = new ES2Service();
    this.datasetPromise = async () => {
      const response = await fetch('/ds.json');
      return response.json();
    };
    this.getDataset();
  }

  getDataset = async () => {
    const json = await this.datasetPromise();
    const id = Math.round(Math.random()*json.length);
    window.ds = json[id];
    this.setState({pattern : json[id]});
  };

  render() {
    const { pattern } = this.state;
    return (
      <div className="App">
        <header className="App-header"></header>
        <button onClick={this.getDataset}>get</button>
        
        {pattern ? <span> {pattern.name}</span> : null}
        {pattern ? <span> {pattern.tempo}</span> : null}
        {pattern ? <Pattern payload={pattern} /> : null}
      </div>
    );
  }
}

export default App;