import React, { PureComponent } from 'react';

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
      ? <input type='number' autoFocus={true} min={min} max={max} value={value} className={cn}
               onChange={(e) => this.onChange(e.target.value)}
               onBlur={() => this.setState({selected:false})} />
      : <button onClick={() => this.setState({selected:true})}>{value}</button>
    );
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

export class KnobNumericInput extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {capture : false};
    this.x = this.y = this.dx = this.dy = 0;
  }

  down = (e) => {
    //console.log('down', e);
    this.setState({capture : true});
    this.x = e.pageX;
    this.y = e.pageY;
    this.dx = e.pageX;
    this.dy = e.pageY;
    e.target.setPointerCapture(e.pointerId);
  };

  up = (e) => {
    //console.log('up', e);
    this.setState({capture : false});
    e.target.releasePointerCapture(e.pointerId);
  };

  move = (e) => {
    if (!this.state.capture) return;
    let { value, min, max } = this.props;
    this.dx = this.x - e.pageX;
    this.dy = this.y - e.pageY;
    this.x = e.pageX;
    this.y = e.pageY;
    if (this.dy > 0) value++;
    if (this.dy < 0) value--;

    if (min !== undefined && value < min) value = min;
    if (max !== undefined && value > max) value = max;
    this.setState({value});
    if (undefined === this.props.onChange) return;
    this.props.onChange(value);
  };

  noClick = (e) => {};

  render() {
    const {value, labelRenderer} = this.props;
    const cn = [this.props.className];
    if (this.state.capture) cn.push('selected');
    let label = value;
    if (labelRenderer !== undefined) {
      label = labelRenderer(label);
    }
    return (<button className={cn.join(' ')}
                    onClick={this.props.onClick || this.noClick}
                    onPointerDown={this.down}
                    onPointerUp={this.up}
                    onPointerMove={this.move}>{label}</button>);
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
