import React, { Component } from 'react';
import { KorgES2Pattern, types } from './korg-es2';

class EditableButton extends Component {

  constructor(props) {
    super(props);
    this.capture = false;
    this.x = this.y = this.dx = this.dy = 0;
  }

  down = (e) => {
    console.log('down', e);
    this.capture = true;
    this.x = e.pageX;
    this.y = e.pageY;
    this.dx = this.dy = 0;
    e.target.setPointerCapture(e.pointerId);
  };

  up = (e) => {
    console.log('up', e);
    this.capture = false;
    e.target.releasePointerCapture(e.pointerId);
  };

  move = (e) => {
    if (!this.capture) return;
    this.dx = Math.floor(this.x - e.pageX);
    this.dy = Math.floor((this.y - e.pageY)/8);
    if (this.props.onChangeValue && this.dy !== 0) this.props.onChangeValue(this.dy); 
  };

  render() {
    return <button className='note' onPointerDown={this.down} onPointerUp={this.up} onPointerMove={this.move}>{this.props.children}</button>
  }
}

class Step extends Component {
    constructor(props) {
        super(props);
        this.state = {
          on_off : false, 
          trigger_on_off : false, 
          velocity : 0,
          gate_time : 0,
          notes: [0,0,0,0],
        };
    }

    // LOOKATME
    static getDerivedStateFromProps(nextProps, prevState) {
      const { data } = nextProps;

      const propsData = {
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

      const newState = {};
      
      if (propsData.on_off != prevState.on_off) newState.on_off = propsData.on_off;
      if (propsData.gate_time != prevState.gate_time) newState.gate_time = propsData.gate_time;
      if (propsData.velocity != prevState.velocity) newState.velocity = propsData.velocity;
      if (propsData.trigger_on_off != prevState.trigger_on_off) newState.trigger_on_off = propsData.trigger_on_off;
      
      const notes = [...prevState.notes];
      let notesChanged = false;

      if (propsData.notes[0] != prevState.notes[0]) {
        notes[0] = propsData.notes[0];
        notesChanged = true;
      }
      
      if (propsData.notes[1] != prevState.notes[1]) {
        notes[1] = propsData.notes[1];
        notesChanged = true;
      }
      
      if (propsData.notes[2] != prevState.notes[2]) {
        notes[2] = propsData.notes[2];
        notesChanged = true;
      }
      
      if (propsData.notes[3] != prevState.notes[3]) {
        notes[3] = propsData.notes[3];
        notesChanged = true;
      }
      
      if (notesChanged) {
        newState.notes = notes;
      }

      if (Object.keys(newState).length == 0) return null;
      console.log('getDerivedStateFromProps', nextProps, prevState, newState);
      return newState;
    }

    note2str = (v) => {
      if (v === 0) return '---';
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

    createStyleByData() {
      const { velocity, on_off } = this.state;
      const style = {};
      style.color = `rgb(${2*velocity}, 0, 0)`;
      style.opacity = (on_off ? 1 : .2);
      if (on_off) {
        const velocityShadow = (velocity>>2)-26;
        style.boxShadow = `0 0 32px ${velocityShadow}px rgb(116, 28, 120) inset`;
      }
      // console.log(data, style);
      return style;
    }

    incrementVelocity = (delta) => {
      const oldValue = this.state.velocity;
      let value = oldValue + delta;
      if (value < 1) value = 1;
      if (value > 127) value = 127;
      if (value === oldValue) return;
      this.setState({velocity : value}); 
    };

    incrementGateTime = (delta) => {
      const oldValue = this.state.velocity;
      let value = oldValue + delta;
      if (value < 0) value = 0;
      if (value > 96) value = 127;
      if (value === oldValue) return;
      this.setState({gate_time : value}); 
    };

    incrementNote = (delta, idx) => {
      const oldValue = this.state.notes[idx];
      let value = oldValue + delta;
      if (value < 0) value = 0;
      if (value > 128) value = 128;
      if (value === oldValue) return;
      const { notes } = this.state;
      notes[idx] = value; 
      this.setState({notes}); 
    };

    renderNoteButton = (note, i) => {
      return <EditableButton key={'note_'+i} onChangeValue={d => this.incrementNote(d, i)}>{this.note2str(note)}</EditableButton>;
    };

    render() {      
      const { notes, velocity, gate_time, on_off, trigger_on_off } = this.state;
    
      if (this.props.showDetails) {
        return <div className='part-step-details'>
          { notes.map(this.renderNoteButton) }
          <EditableButton className='note' onChangeValue={this.incrementVelocity}>{velocity}</EditableButton>
          <EditableButton className='note' onChangeValue={this.incrementGateTime}>{gate_time !== 127 ? gate_time : 'TIE'}</EditableButton>
          <EditableButton className='note'>{String(on_off)}</EditableButton>
          <EditableButton className='note'>{String(trigger_on_off)}</EditableButton>
        </div>;
      } else {
        const style = this.createStyleByData();
        const n = notes.filter(e => e > 0).map(e => this.note2str(e));
        return <div className='part-step' style={style}>
          <span>{[n[0], n[1]].join(' ')}<br/>{[n[2], n[3]].join(' ')}</span>
        </div>;
      }
    }
}

class Part extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails : false
        };
    }

    renderToggleButton() {
      const { idx } = this.props;
      const { showDetails } = this.state;
      let cn = 'toggle-button';
      if (showDetails) cn += ' selected';
      return <button className={cn} onClick={() => this.setState({showDetails : !showDetails})}>{(1+idx)}</button>;
    }

    renderPartDetails() {
      const { data } = this.props;
      const { oscillator_type } = data;
      return <div className="part-details">OSC: {types.short(oscillator_type)}</div>;
    }

    render() {
        const { data, bar } = this.props;
        const { showDetails } = this.state;
        const firstStep = 16*bar;
        const steps = data.steps.slice(firstStep, firstStep+16);        
        return <div className="part">
            <div className="part-pads-row">
                {this.renderToggleButton()}
                {steps.map((e, i) => <Step key={i} idx={firstStep+i} data={e} showDetails={showDetails} />)}
            </div>
            { showDetails ? this.renderPartDetails() : null }   
        </div>;
    }
}

class Bar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { idx, parts, patternLength, visible } = this.props;
    if (!visible) return null;
    return (<div className='bar'>{parts.map((e, i) => <Part key={i} data={e} patternLength={patternLength} bar={idx} idx={i} />)}</div>);
  }
}

class Pattern extends Component {
    constructor(props) {
        super(props);
        this.state = {
          selectedBar : 0,
          patternLength : 1,
        }
    }

    renderBarButton(idx) {
      const { selectedBar } = this.state;
      return <button key={idx} onClick={() => this.setState({selectedBar : idx})} className={selectedBar == idx ? 'selected' : null}>{idx+1}</button>;
    }

    renderBar(idx) {
      const { data } = this.props;
      const { patternLength, selectedBar } = this.state;
      return <Bar key={idx} idx={idx} parts={data.parts} patternLength={patternLength} visible={selectedBar == idx} />;
    }

    render() {
      const arr = [0,1,2,3];
      return (<div className='pattern'>
        <div className='bars-buttons'>{arr.map(idx => this.renderBarButton(idx))}</div>
        <div className='bars'>{arr.map(idx => this.renderBar(idx))}</div>
      </div>);
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

    // 138 - 2 bars
    // 243 - init
    const id = Math.round(Math.random()*json.length); 

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
      <div>
        <header>
          <button onClick={this.getDataset}>get</button><br />
          <span> Name: {types.string(pattern.name)}</span><br />
          <span> Tempo: {.1*types.short(pattern.tempo)}</span><br />
          <span> Length: {(1+types.byte(pattern.length))}</span><br />
        </header>
        <Pattern data={pattern} />
      </div>
    );
  }
}

export default App;