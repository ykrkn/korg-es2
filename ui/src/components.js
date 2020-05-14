import React, { Component } from 'react';
import { Pattern } from './Pattern';
import { NotesMap } from './constants';

export const NumberInput = ({value, min, max, onChange, backgroundRenderer}) => {

  const style = {};

  if (backgroundRenderer !== undefined) {
    const bgcolor = backgroundRenderer();
    if (bgcolor !== null) style.backgroundColor = bgcolor;    
  }

  return (<input type='number' 
                  className='number' 
                  style={style} 
                  value={value} 
                  min={min} max={max}
                  onChange={(e) => onChange(e.target.value)} />);
}

export const note2str = (v) => {
  if (v === 0) return '---';
  let n = ((v - 1) % 12);
  let o = Math.floor(v/11)-1;
  return NotesMap[n] + o;
};

export const NoteInput = ({value, onChange}) => {
  return (<button className='note'>{note2str(value)}</button>);
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



export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const pattern = await this.props.service.loadPattern();
    this.setState({pattern});
  }

  render() {
    const { pattern } = this.state;
    if (!pattern) return null;
    return (<Pattern data={pattern} />);
  }
};