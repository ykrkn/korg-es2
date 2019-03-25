import React, { Component } from 'react';
import { KorgES2Pattern, types } from './korg-es2';

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
    }

    note2str = (v) => {
      let n = ((v - 1) % 12);
      let o = Math.floor(v/11)-1;
      //console.log(v, o, n);
      switch (n) {
        case 0:  return 'C' +o;
        case 1:  return 'C#'+o;
        case 2:  return 'D' +o;
        case 3:  return 'D#'+o;
        case 4:  return 'E' +o;
        case 5:  return 'F' +o;
        case 6:  return 'F#'+o;
        case 7:  return 'G' +o;
        case 8:  return 'G#'+o;
        case 9:  return 'A' +o;
        case 10: return 'A#'+o;
        case 11: return 'B' +o;
      }
    };

    renderSlotNotes() {
      const { data } = this.props;
      return [data.step_note_slot1, data.step_note_slot2, data.step_note_slot3, data.step_note_slot4]
        .filter(e => e > 0)
        .map(e => this.note2str(e)).join(' ');
    }

    render() {
      const { className } = this.props;
      return <button className={className}>{ this.renderSlotNotes() }</button>;
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
        const { data } = this.props;
        const { showDetails } = this.state;
        const { oscillator_type } = data;

        const partToggleOnClick = (e) => {
            this.setState({showDetails : e});    
        };
        
        return <div className="Part">
            <div className="part-pads-row">
                <ToggleButton onToggle={partToggleOnClick} label={types.short(oscillator_type)}/>
                {data.steps.map((e, i) => <PadButton key={i} className="PadButton" data={e} />)}
            </div>
            { showDetails ? <div className="part-details">X</div> : null }   
        </div>;
    }
}

class Pattern extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      const { data } = this.props;
        return (<div className='Pattern'>{data.parts.map((e,i) => <Part key={i} data={e} />)}</div>);
    }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.datasetPromise = async () => {
      const response = await fetch('/ds.json');
      return response.json();
    };
    this.getDataset();
  }

  getDataset = async () => {
    const json = await this.datasetPromise();
    const id = 243;//Math.round(Math.random()*json.length);
    console.log("Pattern " + id);
    const dump = new KorgES2Pattern(json[id]);
    window.d = dump;
    // debugger;
    this.setState({pattern : dump.data});
  };

  render() {
    const { pattern } = this.state;
    if (!pattern) return null;
    return (
      <div className="App">
        <header className="App-header"></header>
        <button onClick={this.getDataset}>get</button>
        <span> {types.string(pattern.name)}</span>
        <span> {.1*types.short(pattern.tempo)}</span>
        <Pattern data={pattern} />
      </div>
    );
  }
}

export default App;