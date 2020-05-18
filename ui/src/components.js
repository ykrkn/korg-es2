import React, { PureComponent } from 'react';
import { Pattern } from './Pattern';
import { NotesMap } from './constants';
import service from './service';

export class NumberInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected : false,
    };  
  }

  onChange(value) {
    const { min, max, onChange } = this.props;
    if (min !== undefined && value < min) value = min;
    else if (max !== undefined && value > max) value = max;
    onChange(value);
  }

  render() {
    const { value, min, max } = this.props;
    const { selected } = this.state; 
    const cn = ['number', selected ? 'selected' : ''].join(' ');
    return (selected 
      ? <input type='number' autoFocus={true} min={min} max={max} onChange={(e) => this.onChange(e.target.value)} value={value} className={cn} onBlur={() => this.setState({selected:false})}/> 
      : <button onClick={() => this.setState({selected:true})}>{value}</button>
      );
  }
}

export const note2str = (v) => {
  if (v === 0) return '---';
  let n = ((v - 1) % 12);
  let o = Math.floor((v-1)/12);//Math.floor(v/11)-1;
  return NotesMap[n] + (o-1);
};

export class NoteInput extends PureComponent {
  constructor(props) {
    super(props); 
    this.state = {
      initialValue : 0,
      changed : false
    }
  }

  // 0,1~128=Off,Note No 0~127

  setOctaveWithNote(octave, note) {
    this.setState({changed:true});
    if (octave == -1) {
      this.props.onChange(note);
      return;  
    } 

    let v = note + 1 + (octave*12);
    if (v > 128) v = 128;
    //console.log(`o=${octave} n=${note} v=${v} n=${note2str(v)}`);
    this.props.onChange(v);
  }

  onSelect() {
    this.props.onSelect();
  }

  render() {
    const { value, selected } = this.props;
    
    const cn = ['note', selected ? 'selected' : ''].join(' ');

    const c = [<button className={cn} 
        onClick={() => this.onSelect()}>
    {note2str(value)}</button>];

    if (selected) {
      const note = (value-1)%12;
      const octave = Math.floor((value-1)/12);

      c.push(<div className='note-slider-wrapper'>
        <input type='range' className={'octave-slider'} min={-1} max={10} title='Octave'
            onChange={(e) => this.setOctaveWithNote(parseInt(e.target.value), note)} value={octave}/>
        <input type='range' min={0} max={11} title='Note'
            onChange={(e) => this.setOctaveWithNote(octave, parseInt(e.target.value))} value={note}/>
      </div>);
    }
    
    return c;
  }
}

export class TextInput extends PureComponent {
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

export const BooleanInput = ({value, onChange, onDoubleClick}) => {
  const cn = 'toggle' + (value ? ' selected' : '');
  return <button className={cn} 
    onDoubleClick={() => onDoubleClick !== undefined ? onDoubleClick() : null}
    onClick={() => onChange(!value)}>  
      {value ? 'ON' : 'OFF'}
  </button>
}

export class Selector extends PureComponent {

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

export class App extends PureComponent {

  constructor(props) {
    super(props);
    this.menuItems = [];
    this.state = {};
  }

  async componentDidMount() {
    this.menuItems.push(<button onClick={() => service.savePattern()}>S</button>);
    const pattern = await service.loadPattern();
    this.setState({pattern});
  }

  render() {
    const { pattern } = this.state;
    if (!pattern) return null;
    return (<Pattern data={pattern} menuItems={this.menuItems} />);
  }
};