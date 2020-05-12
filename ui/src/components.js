import React, { Component } from 'react';
import { KorgES2Pattern } from './korg-es2';
import { Pattern } from './Pattern';

const service = new KorgES2Pattern();

export const NumberInput = ({value, onChange, onClick, labelRenderer, backgroundRenderer}) => {

  const wheel = ({deltaY}) => {
    if (undefined === onChange) return; 
    const dy = deltaY >> 2;
    if (dy > 0) value--;
    if (dy < 0) value++;    
    onChange(value);
  }

  const style = {};

  if (backgroundRenderer !== undefined) {
    const bgcolor = backgroundRenderer();
    if (bgcolor !== null) style.backgroundColor = bgcolor;    
  }

  const label = labelRenderer ? labelRenderer(value) : value;

  return (<button className='number' style={style} onClick={onClick} onWheel = {wheel}>{label}</button>);
}

export class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};  
  }

  static getDerivedStateFromProps(props, state) { 
    if (props.value !== state._value) return { 
      _value : props.value, 
      value : props.value 
    };
    return null;
  }

  onChange(value) {
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    return <input maxLength={18} value={this.state.value} onChange={(e) => this.onChange(e.target.value)} />
  }
}

export const BooleanInput = ({value, onChange}) => {
  const cn = 'toggle' + (value ? ' selected' : '');
  return <button className={cn} onClick={() => onChange(!value)}>{value ? 'ON' : 'OFF'}</button>
}

export class Selector extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }
  
  static getDerivedStateFromProps(props, state) {  
    const newState = {};
    if (props.values != state.values) newState.values = props.values;
    if (props.value != state._value) newState._value = newState.value = props.value;
    if (Object.keys(newState).length != 0) return newState;
    return null;
  }
  
  onChange(idx) {
    this.setState({value : idx});
    if (this.props.onChange) {
      this.props.onChange(idx);
    }  
  }

  render() {
    const { values } = this.props;
    const { value } = this.state;
    return <select value={value} onChange={(e) => this.onChange(e.target.value)}>
      { Object.keys(values)
        .map(k => parseInt(k))
        .map(k => <option key={k} value={k}>{values[k]}</option>) 
      }</select>
  }
}



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const response = await fetch('/ds.json');
    const json = await response.json();
    // 138 - 2 bars, 243 - init
    const id = Math.round(Math.random()*json.length); 
    console.log("Pattern " + id);
    
    service.loadAllPatternsDump(json[id]);
    window.s = service;
    this.setState({pattern : service.data});
  }

  render() {
    const { pattern } = this.state;
    if (!pattern) return null;
    return (
      <div>
        <header>
          <button onClick={this.getDataset}>get</button>
        </header>
        <Pattern data={pattern} />
      </div>
    );
  }
}

export default App;