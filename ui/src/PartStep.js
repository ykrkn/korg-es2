import React, { PureComponent } from 'react';
import {NumberInput, NoteInput, BooleanInput, note2str} from './components';
import service from './service';

const sortnum = (a, b) => a-b;

/**
 * @Deprecated
 */
export class PartStep extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          selectedNote : -1,
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

    setStateAndNotify(obj) {
      this.setState(obj);
      service.changePartStep(this.props.partIdx, this.props.idx, obj);
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
      value = parseInt(value);
      if (value < 1) value = 1;
      if (value > 127) value = 127;
      this.setStateAndNotify({velocity : value}); 
    };

    onChangeGateTime = (value) => {
      if (value < 0) value = 0;
      else if (value > 96 && value < 127) value = 127;
      else if (value === 127) value = 96;
      this.setStateAndNotify({gateTime : value}); 
    };

    onSelectNote = (idx) => {
      let { selectedNote } = this.state;
      selectedNote = (selectedNote == idx ? -1 : idx);
      this.setState({selectedNote});
    }

    onChangeNote = (value, idx) => {
      if (value < 0) value = 0;
      if (value > 128) value = 128;
      const notes = [...this.state.notes];
      notes[idx] = value; 
      this.setStateAndNotify({notes}); 
    };

    resetStep = () => {
      this.setStateAndNotify({notes:[0,0,0,0], enabled: 0, triggerEnabled: 0, velocity: 96, gateTime: 72});
    }

    onChangeEnabled = (enabled) => {      
      // OFF -> ON set C4
      const notes = [...this.state.notes];
      if (!this.state.enabled && enabled) {
        const emptyNotes = (0 === notes.reduce((acc,x)=>acc+x, 0));
        if (emptyNotes) notes[0] = 61; 
      }

      this.setStateAndNotify({enabled:(1*enabled), notes});
    };

    onChangeTriggerEnabled = (enabled) => {
      this.setStateAndNotify({triggerEnabled:(1*enabled)});
    }

    renderLabel(notes) {
      const n = notes.filter(e => e > 0).sort(sortnum);
      if (n.length > 1) return <strong style={{color:'white'}}>{note2str(n[0])}</strong>
      if (n.length === 1) return note2str(n[0]);
      else return null;
    }

    render() {      
      const { notes, selectedNote, velocity, gateTime, enabled, triggerEnabled } = this.state;
      const { selected } = this.props;

      const style = this.createStyleByData();

      return <div className='PartStep'>
        <button className='pad' style={style} 
          onDoubleClick={() => this.resetStep()} 
          onClick={() => this.setStateAndNotify({enabled : 1*(!enabled)})}>{this.renderLabel(notes)}</button>

        { selected ? notes.map((note, i) => {
          return <NoteInput key={'note_'+i} 
            selected={selectedNote == i} 
            onSelect={() => this.onSelectNote(i)} 
            onChange={d => this.onChangeNote(d, i)} 
            value={note} />;
        }).reverse() : null }

        { selected ? <NumberInput onChange={this.onChangeVelocity} value={velocity} /> : null }
        { selected ? <NumberInput onChange={this.onChangeGateTime} value={gateTime} /> : null }
        { selected ? <BooleanInput onChange={(enabled) => this.onChangeEnabled(enabled)} value={enabled} /> : null }
        { selected ? <BooleanInput onChange={(triggerEnabled) => this.onChangeTriggerEnabled(triggerEnabled)} value={triggerEnabled} /> : null }
      </div>;
    }
}
