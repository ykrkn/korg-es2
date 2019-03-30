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
    this.dx = e.pageX;
    this.dy = e.pageY;
    e.target.setPointerCapture(e.pointerId);
  };

  up = (e) => {
    console.log('up', e);
    this.capture = false;
    e.target.releasePointerCapture(e.pointerId);
  };

  move = (e) => {
    if (!this.capture) return;
    this.dx = this.x - e.pageX;
    this.dy = this.y - e.pageY;
    this.x = e.pageX;
    this.y = e.pageY;
    if (undefined === this.props.onChangeValue) return; 
    if (this.dy > 0) this.props.onChangeValue(1);
    if (this.dy < 0) this.props.onChangeValue(-1);
  };

  render() {
    const { onClick, backgroundRenderer } = this.props;
    const style = {};
    if (this.props.backgroundRenderer !== undefined) {
      const bgcolor = backgroundRenderer();
      if (bgcolor !== null) style.backgroundColor = bgcolor;    
    }

    return (<button className='note' 
      style={style}
      onClick={onClick}
      onPointerDown={this.down} 
      onPointerUp={this.up} 
      onPointerMove={this.move}>{this.props.children}
    </button>);
  }
}

class Step extends Component {
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
      if (state.data != props.data) {
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
      // style.color = `rgb(${2*velocity}, 0, 0)`;
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
      const oldValue = this.state.gate_time;
      let value = oldValue + delta;
      if (value < 0) value = 0;
      else if (value > 96 && delta == 1) value = 127;
      else if (value > 96 && delta == -1) value = 96;
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
      const { selected } = this.props;

      const style = this.createStyleByData();
      const n = notes.filter(e => e > 0).map(e => this.note2str(e));
      return <div className='part-step'>
        <button className='pad' style={style} onClick={() => this.setState({on_off : !on_off})}>
          {[n[0], n[1]].join(' ') + '\n'}
          {[n[2], n[3]].join(' ')}
        </button>

        { selected ? notes.map(this.renderNoteButton) : null }
        { selected ? <EditableButton onChangeValue={this.incrementVelocity}>{velocity}</EditableButton> : null }
        { selected ? <EditableButton onChangeValue={this.incrementGateTime}>{gate_time !== 127 ? gate_time : 'TIE'}</EditableButton> : null }
        { selected ? <EditableButton onClick={() => this.setState({on_off : !on_off})} 
          backgroundRenderer={() => on_off ? 'rgb(107, 43, 65)' : null}>{on_off ? 'ON' : 'OFF'}</EditableButton> : null }
        { selected ? <EditableButton onClick={() => this.setState({trigger_on_off : !trigger_on_off})} 
          backgroundRenderer={() => trigger_on_off ? 'rgb(107, 43, 65)' : null}>{trigger_on_off ? 'ON' : 'OFF'}</EditableButton> : null }
      </div>;
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
        const { data, firstStep, selected } = this.props;
        const steps = data.steps.slice(firstStep, firstStep+16);        
        return <div className="part">
            <div className="steps-row">
                {steps.map((e, i) => <Step key={i} idx={firstStep+i} data={e} selected={selected} />)}
            </div>  
        </div>;
    }
}

class PartDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible : false
    }
  }

  render() {
    const { visible } = this.state;
    return <div className={'part-details ' + (visible ? 'visible' : 'hidden')}>
      <button class='open' onClick={() => this.setState({visible : true})}>&rarr;</button>
      <button class='close' onClick={() => this.setState({visible : false})}>&larr;</button>

    ['last_step',1], // 0,1~15=16,1~15
    ['mute',1], // 0,1=OFF,ON
    ['voice_assign',1], // 0,1,2,3=Mono1, Mono2, Poly1, Poly2
    ['motion_sequence',1], // 0,1,2=Off, Smooth, TriggerHold
    ['trig_pad_velocity',1], // 0,1=Off,On
    ['scale_mode',1], // 0,1=Off,On
    ['part_priority',1], // 0,1=Normal,High
    ['oscillator_type',2], // 0~500
    ['oscillator_edit',1], // 0~127
    ['filter_type',1], // 0~16
    ['filter_cutoff',1], // 0~127
    ['filter_resonance',1], // 0~127
    ['filter_eg_int',1], // -63~63
    ['modulation_type',1], // 0~71
    ['modulation_speed',1], // 0~127
    ['modulation_depth',1], // 0~127
    ['eg_attack',1], // 0~127
    ['eg_decay_release',1], // 0~127
    ['amp_level',1], // 0~127
    ['amp_pan',1], // -63~0~64=L63~center~R63
    ['eg_on_off',1], // 0,1=Off,On
    ['mfx_send_on_off',1], // 0,1=Off,On
    ['groove_type',1], // 0~24
    ['groove_depth',1], // 0~127
    ['ifx_on_off',1], // 0,1=Off,On
    ['ifx_type',1], // 0~37
    ['ifx_edit',1], // 0~127
    ['oscillator_pitch',1], // -63~+63
    ['oscillator_glide',1], // 0~127
    </div>;
  }
}

class EnumButtons extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  // LOOKATME:
  static getDerivedStateFromProps(props, state) {  
    const newState = {};
    if (props.values != state.values) newState.values = props.values;
    if (props.valueIndex != state.valueIndex) newState.valueIndex = props.valueIndex;
    if (Object.keys(newState).length != 0) return newState;
    return null;
  }
  
  onClick(idx) {
    this.setState({valueIndex : idx});
    if (this.props.onChangeValue) {
      this.props.onChangeValue(idx);
    }  
  }

  render() {
    const { values } = this.props;
    const { valueIndex } = this.state;
    return <div className='enum-buttons'>
      {values.map((e, i) => <button key={i} onClick={() => this.onClick(i)} className={valueIndex === i ? 'selected' : null}>{e}</button>)}
    </div>
  }
}

class Pattern extends Component {

    static DetailsView = 1;
    static PatternView = 2;
    static MotionsView = 3;

    constructor(props) {
        super(props);
        this.state = {
          data : null,
          viewState : Pattern.DetailsView,
          selectedBar : 0,
          selectedPart : -1,
          patternLength : 1,
        }
    }

    static getDerivedStateFromProps(props, state) {      
      if (state.data != props.data) {
        const { data } = props; 
        console.log('getDerivedStateFromProps');
        return {
          data : data,
          selectedBar : 0,
          selectedPart : -1,
        };
      }
      return null;
    }

    renderBarButton(idx) {
      const { selectedBar } = this.state;
      return <button key={idx} 
        onClick={() => this.setState({selectedBar : idx})} 
        className={selectedBar == idx ? 'selected' : null}>{idx+1}</button>;
    }

    renderPart(data, idx) {
      const { selectedBar, selectedPart } = this.state;

      const selectPart = () => {
        if (selectedPart === idx) 
          this.setState({selectedPart : -1});
        else   
          this.setState({selectedPart : idx});
      };

      return <div class='part'>
        <div class='part-toggle'>
          <button onClick={selectPart}
            className={'toggle-button' + (selectedPart === idx ? ' selected' : '')}>{(1+idx)}</button>
            { selectedPart === idx ? <PartDetails data={data} /> : null } 
        </div>
        <Part data={data} firstStep={16*selectedBar} selected={selectedPart === idx} />
      </div>
    }

    renderPatternDetails(data) {
// debugger;
      return <div className='pattern-details'>
          <span> name: {types.string(data.name)}</span><br />
          <span> tempo: {.1*types.short(data.tempo)}</span><br />
          <span> swing: {types.byte(data.swing)}</span><br />
          <span> length: <EnumButtons values={['1','2','3','4']} valueIndex={types.byte(data.length)} /></span><br />
          <span> beat: {<EnumButtons values={['16','32','8T','16T']} valueIndex={types.byte(data.beat)} />}</span><br />
          <span> key: {<EnumButtons values={['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']} valueIndex={types.byte(data.key)} />}</span><br />
          <span> scale: {types.byte(data.scale)}</span><br />
          <span> chordset: {types.byte(data.chordset)}</span><br />
          <span> level: {types.byte(data.level)}</span><br />
          {/* <span> touch_scale: {types.byte(data.touch_scale)}</span><br /> */}
          <span> alt_1314: {String(types.bool(data.alt_1314))}</span><br />
          <span> alt_1516: {String(types.bool(data.alt_1516))}</span><br />
    {/* ['name',18], // null terminated
    ['tempo',2], // 200~3000 = 20.0 ~ 300.0 UInt16LE
    ['swing',1], // -48 ~ 48
    ['length',1], // 0~3 = 1~4bar(s)
    ['beat',1], // 0, 1, 2, 3 = 16,32,8 Tri, 16 Tri
    ['key',1], // 0~11 = C~B
    ['scale',1], // 0~35
    ['chordset',1], // 0~4
    ['level',1], // 127 ~ 0 = 0 ~ 127
    ['touch_scale',1,korg_e2_touch_scale],
    ['master_fx',1,korg_e2_master_fx],
    ['alt_1314',1], // 0~1=OFF,ON
    ['alt_1516',1], // 0~1=OFF,ON */}
      </div>
    }

    render() {
      const { viewState } = this.state;
      const { data } = this.props;
      const { parts } = data;
      const arr = [0, 1, 2, 3];

      return (<div className='pattern'>
        <div className='bars-buttons'>
          <button onClick={() => this.setState({viewState : Pattern.DetailsView})}
            className={(viewState === Pattern.DetailsView ? 'selected' : null)}>Pattern Details</button>
          <button onClick={() => this.setState({viewState : Pattern.PatternView})}
            className={(viewState === Pattern.PatternView ? 'selected' : null)}>Parts</button>
          <button onClick={() => this.setState({viewState : Pattern.MotionsView})}
            className={(viewState === Pattern.MotionsView ? 'selected' : null)}>Motions</button>
          {viewState === Pattern.PatternView || viewState === Pattern.MotionsView 
            ? arr.map(idx => this.renderBarButton(idx)) : null}
        </div>
          {viewState === Pattern.DetailsView ? this.renderPatternDetails(data) : null}
          {viewState === Pattern.PatternView ? parts.map((e, i) => this.renderPart(e, i)) : null}
          {viewState === Pattern.MotionsView ? 'Motions will be here' : null}
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
          <button onClick={this.getDataset}>get</button>
        </header>
        <Pattern data={pattern} />
      </div>
    );
  }
}

export default App;