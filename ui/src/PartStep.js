import React, { Component } from 'react';
import { NumberInput, BooleanInput } from './components';
import { NotesMap } from './constants';
import { types } from './korg-es2';

const note2str = (v) => {
    if (v === 0) return '---';
    let n = ((v - 1) % 12);
    let o = Math.floor(v/11)-1;
    return NotesMap[n] + o;
  };
  
const sortnum = (a, b) => a-b;

export class PartStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data : null,
          on_off : false, 
          trigger_on_off : false, 
          velocity : 0,
          gate_time : 0,
          notes: [0,0,0,0],
        };
    }

    static getDerivedStateFromProps(props, state) {      
      if (state.data !== props.data) {
        const { data } = props; 
        console.log('getDerivedStateFromProps');
        return {
          data : data,
          on_off : types.bool(data.step_on_off),
          gate_time : types.byte(data.step_gate_time),
          velocity : types.byte(data.step_velocity),
          trigger_on_off : types.bool(data.step_trigger_on_off),
          notes : [
            types.byte(data.step_note_slot1),
            types.byte(data.step_note_slot2),
            types.byte(data.step_note_slot3),
            types.byte(data.step_note_slot4),
          ]
        };
      }

      return null;
    }

    createStyleByData() {
      const { velocity, on_off } = this.state;
      const style = {};
      // style.color = `rgb(${2*velocity}, 0, 0)`;
      style.opacity = (on_off ? 1 : .2);
      if (on_off) {
        const velocityShadow = (velocity>>2)-26;
        style.boxShadow = `0 0 32px ${velocityShadow}px rgb(116, 28, 120) inset`;
      }
      // console.log(data, style);
      return style;
    }

    onChangeVelocity = (value) => {
      if (value < 1) value = 1;
      if (value > 127) value = 127;
      this.setState({velocity : value}); 
    };

    onChangeGateTime = (value) => {
      if (value < 0) value = 0;
      else if (value > 96 && value < 127) value = 127;
      else if (value === 127) value = 96;
      this.setState({gate_time : value}); 
    };

    onChangeNote = (value, idx) => {
      if (value < 0) value = 0;
      if (value > 128) value = 128;
      const notes = [...this.state.notes];
      notes[idx] = value; 
      this.setState({notes}); 
    };

    renderLabel(notes) {
      const n = notes.filter(e => e > 0).sort(sortnum);
      if (n.length > 1) return <strong style={{color:'white'}}>{note2str(n[0])}</strong>
      if (n.length === 1) return note2str(n[0]);
      else return null;
    }

    render() {      
      const { notes, velocity, gate_time, on_off, trigger_on_off } = this.state;
      const { selected } = this.props;

      const style = this.createStyleByData();

      return <div className='PartStep'>
        <button className='pad' style={style} onClick={() => this.setState({on_off : !on_off})}>{this.renderLabel(notes)}</button>

        { selected ? notes.map((note, i) => {
          return <NumberInput key={'note_'+i} onChange={d => this.onChangeNote(d, i)} value={note} labelRenderer={note2str} />;
        }) : null }

        { selected ? <NumberInput onChange={this.onChangeVelocity} value={velocity} /> : null }
        { selected ? <NumberInput onChange={this.onChangeGateTime} value={gate_time} /> : null }
        { selected ? <BooleanInput onChange={(on_off) => this.setState({on_off})} value={on_off} /> : null }
        { selected ? <BooleanInput onChange={(trigger_on_off) => this.setState({trigger_on_off})} value={trigger_on_off} /> : null }
      </div>;
    }
}