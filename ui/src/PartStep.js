import React, { Component } from 'react';
import { NumberInput, NoteInput, BooleanInput, note2str } from './components';
  
const sortnum = (a, b) => a-b;

export class PartStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data : null,
          enabled : false, 
          triggerEnabled : false, 
          velocity : 0,
          gateTime : 0,
          notes: [0,0,0,0],
        };
    }

    static getDerivedStateFromProps(props, state) {      
      if (state.data !== props.data) {
        const { data } = props; 
        const s = { ... data};
        s.data = data;
        return s;
      }

      return null;
    }

    createStyleByData() {
      const { velocity, enabled } = this.state;
      const style = {};
      // style.color = `rgb(${2*velocity}, 0, 0)`;
      style.opacity = (enabled ? 1 : .2);
      if (enabled) {
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
      this.setState({gateTime : value}); 
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
      const { notes, velocity, gateTime, enabled, triggerEnabled } = this.state;
      const { selected } = this.props;

      const style = this.createStyleByData();

      return <div className='PartStep'>
        <button className='pad' style={style} onClick={() => this.setState({enabled : !enabled})}>{this.renderLabel(notes)}</button>

        { selected ? notes.map((note, i) => {
          return <NoteInput key={'note_'+i} onChange={d => this.onChangeNote(d, i)} value={note} />;
        }) : null }

        { selected ? <NumberInput onChange={this.onChangeVelocity} value={velocity} /> : null }
        { selected ? <NumberInput onChange={this.onChangeGateTime} value={gateTime} /> : null }
        { selected ? <BooleanInput onChange={(enabled) => this.setState({enabled})} value={enabled} /> : null }
        { selected ? <BooleanInput onChange={(triggerEnabled) => this.setState({triggerEnabled})} value={triggerEnabled} /> : null }
      </div>;
    }
}