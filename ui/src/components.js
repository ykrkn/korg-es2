import React, { Component } from 'react';
import { KorgES2Pattern, types } from './korg-es2';

const PatternBeatMap = {0:'16', 1:'32', 2:'8T', 3:'16T'};

const NotesMap = {0:'C', 1:'C♯', 2:'D', 3:'D♯', 4:'E', 5:'F', 6:'F♯', 7:'G', 8:'G♯', 9:'A', 10:'A♯', 11:'B'};

const PatternChordsetMap = {0:'1', 1:'2', 2:'3', 3:'4', 4:'5'};

const PatternScaleMap = [
  [1, 'Chromatic', 'C, D♭, D, E♭, E, F, G♭, G, A♭, A, B♭, B'],
  [2, 'Ionian', 'C, D, E, F, G, A, B'],
  [3, 'Dorian', 'C, D, E♭, F, G, A, B♭'],
  [4, 'Phrygian', 'C, D♭, E♭, F, G, A♭, B♭'],
  [5, 'Lydian', 'C, D, E, F♯, G, A, B'],
  [6, 'Mixolydian', 'C, D, E, F, G, A, B♭'],
  [7, 'Aeolian', 'C, D, E♭, F, G, A♭, B♭'],
  [8, 'Locrian', 'C, D♭, E♭, F, G♭, A♭, B♭'],
  [9, 'Harmonic minor', 'C, D, E♭, F, G, A♭, B'],
  [10, 'Melodic minor', 'C, D, E♭, F, G, A, B'],
  [11, 'Major Blues', 'C, D, E♭, E, G, A'],
  [12, 'minor Blues', 'C, E♭, F, G♭, G, B♭'],
  [13, 'Diminished', 'C, D, E♭, F, F♯, G♯, A, B'],
  [14, 'Combination Dim', 'C, D♭, E♭, E, F♯, G, A, B♭'],
  [15, 'Major Penta', 'C, D, E, G, A'],
  [16, 'minor Penta', 'C, E♭, F, G, B♭'],
  [17, 'Raga 1 (Bhairav)', 'C, D♭, E, F, G, A♭, B'],
  [18, 'Raga 2 (Gamanasrama)', 'C, D♭, E, F♯, G, A, B'],
  [19, 'Raga 3 (Todi)', 'C, D♭, E♭, F♯, G, A♭, B'],
  [20, 'Arabic', 'C, D, E, F, G♭, A♭, B♭'],
  [21, 'Spanish', 'C, D♭, E♭, E, F, G, A♭, B♭'],
  [22, 'Gypsy', 'C, D, E♭, F♯, G, A♭, B'],
  [23, 'Egyptian', 'C, D, F, G, B♭'],
  [24, 'Hawaiian', 'C, D, E♭, G, A'],
  [25, 'Pelog', 'C, D♭, E♭, G, A♭'],
  [26, 'Japanese', 'C, D♭, F, G, A♭'],
  [27, 'Ryuku', 'C, E, F, G, B'],
  [28, 'Chinese', 'C, E, F♯, G, B'],
  [29, 'Bass Line', 'C, G, B♭'],
  [30, 'Whole Tone', 'C, D, E, G♭, A♭, B♭'],
  [31, 'Minor 3rd', 'C, E♭, G♭, A'],
  [32, 'Major 3rd', 'C, E, A♭'],
  [33, '4th Interval', 'C, F, B♭'],
  [34, '5th Interval', 'C, G'],
  [35, 'Octave', 'C'],
].map(e => [e[0]-1, e[1], e[2]]);

const note2str = (v) => {
  if (v === 0) return '---';
  let n = ((v - 1) % 12);
  let o = Math.floor(v/11)-1;
  return NotesMap[n] + o;
};

const sortnum = (a, b) => a-b;

const NumberInput = ({value, onChange, onClick, labelRenderer, backgroundRenderer}) => {

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

class TextInput extends Component {
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

const BooleanInput = ({value, onChange}) => {
  const cn = 'toggle' + (value ? ' selected' : '');
  return <button className={cn} onClick={() => onChange(!value)}>{value ? 'ON' : 'OFF'}</button>
}

class Selector extends Component {

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

const PatternDetails = ({data, onChange}) => {
  const beatMap = PatternBeatMap;
  const keyMap = NotesMap;
  const scaleMap = PatternScaleMap.reduce((acc, x) => { acc[x[0]] = x[1]; return acc; }, {});
  const chordsetMap = PatternChordsetMap;

  return <div className='pattern-details'>
    <div className='col'>
      <div className='item'>
          <legend>Pattern Name</legend> 
          <TextInput 
            value={types.string(data.name)} 
            onChange={(v) => onChange('name', v)}/>
        </div>
        <div className='item'>
          <legend>Tempo</legend>
          <NumberInput 
            value={.1*types.short(data.tempo)} min={20} max={300}
            onChange={(v) => onChange('tempo', 10*v)} />
        </div>
        
        <div className='item'>
          <legend>Length</legend>
          <NumberInput 
            value={types.byte(data.length)} min={0} max={3}
            onChange={(v) => onChange('length', v)} />
        </div>
                
        <div className='item'>
          <legend>!Swing</legend>
          <NumberInput 
            value={types.byte(data.swing)} 
            onChange={(v) => onChange('swingFIXME', v)}/>
        </div>
        
        <div className='item'>
          <legend>Beat</legend>
          <Selector 
            values={beatMap} 
            value={types.byte(data.beat)} 
            onChange={(v) => onChange('beat', v)} />
        </div>

        <div className='item'>
          <legend>ALT 13/14</legend>
          <BooleanInput 
            value={types.bool(data.alt_1314)} 
            onChange={(v) => onChange('alt_1314', v)} />
        </div>
        
        <div className='item'>
          <legend>ALT 15/16</legend>
          <BooleanInput 
            value={types.bool(data.alt_1516)} 
            onChange={(v) => onChange('alt_1516', v)} />
        </div>
    </div>

    <div className='col'>
      <div className='item'>
          <legend>Key</legend>
          <Selector 
            values={keyMap} 
            value={types.byte(data.key)} 
            onChange={(v) => onChange('key', v)} />
        </div>
        
        <div className='item'>
          <legend>Scale</legend>
          <Selector 
            values={scaleMap} 
            value={types.byte(data.scale)} 
            onChange={(v) => onChange('scale', v)} />
        </div>
        
        <div className='item'>
          <legend>ChordSet</legend>
          <Selector 
            values={chordsetMap} 
            value={types.byte(data.chordset)} 
            onChange={(v) => onChange('chordset', v)} />
        </div>    

        <div className='item'>
          <legend>!Touch Scale</legend>
          <Selector 
            values={chordsetMap} 
            value={types.byte(data.chordset)} 
            onChange={(v) => onChange('chordset', v)} />
        </div>

        <div className='item'>
          <legend>!Master FX</legend>
          <Selector 
            values={chordsetMap} 
            value={types.byte(data.chordset)} 
            onChange={(v) => onChange('chordset', v)} />
        </div>

        <div className='item'>
          <legend>Level</legend>
          <NumberInput 
            value={127-types.byte(data.level)} min={0} max={127}
            onChange={(v) => onChange('level', 127-v)} />
        </div>
    </div>        

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

class PartStep extends Component {
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
      else if (value == 127) value = 96;
      this.setState({gate_time : value}); 
    };

    onChangeNote = (value, idx) => {
      if (value < 0) value = 0;
      if (value > 128) value = 128;
      console.log(value);
      const notes = [...this.state.notes];
      notes[idx] = value; 
      this.setState({notes}); 
    };

    renderLabel(notes) {
      const n = notes.filter(e => e > 0).sort(sortnum);
      if (n.length > 1) return <strong style={{color:'white'}}>{note2str(n[0])}</strong>
      if (n.length == 1) return note2str(n[0]);
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

        { selected ? <NumberInput onChange={this.onChangeVelocity} value={velocity}>{velocity}</NumberInput> : null }
        { selected ? <NumberInput onChange={this.onChangeGateTime} value={gate_time}>{gate_time}</NumberInput> : null }
        { selected ? <BooleanInput onChange={(on_off) => this.setState({on_off})} value={on_off} /> : null }
        { selected ? <BooleanInput onChange={(trigger_on_off) => this.setState({trigger_on_off})} value={trigger_on_off} /> : null }
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
        const { data, firstStep, selected, idx, onSelect } = this.props;
        const steps = data.steps.slice(firstStep, firstStep+16);   
        
        const stepLabels = selected ? [
          <div className='label'>&nbsp;</div>,
          <div className='label'>&nbsp;</div>,
          <div className='label'>&nbsp;</div>,
          <div className='label'>&nbsp;</div>,
          <div className='label'>Velocity</div>,
          <div className='label'>Gate Time</div>,
          <div className='label'>Step Enabled</div>,
          <div className='label'>Trigger Enabled</div>,
        ] : null;

        return <div className="Part">
                  <div className='part-menu'>
                    <button onClick={() => onSelect(idx)} className={'toggle' + (selected ? ' selected' : '')}>{(1+idx)}</button>
                    { stepLabels } 
                    {/* { selected ? <PartDetails data={data} /> : null }  */}
                  </div>
                  {steps.map((e, i) => <PartStep key={i} idx={firstStep+i} data={e} selected={selected} />)}
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
    return <div className={'PartDetails ' + (visible ? 'visible' : 'hidden')}>
      <button className='open' onClick={() => this.setState({visible : true})}>&rarr;</button>
      <button className='close' onClick={() => this.setState({visible : false})}>&larr;</button>

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

class Pattern extends Component {

    static DetailsView = 1;
    static PartsView = 2;
    static MotionsView = 3;

    constructor(props) {
        super(props);
        this.state = {
          data : null,
          viewState : Pattern.DetailsView,
          selectedBar : 0,
          selectedPart : 0,
          patternLength : 1,
        }
    }

    static getDerivedStateFromProps(props, state) {      
      if (state.data !== props.data) {
        const { data } = props; 
        console.log('getDerivedStateFromProps');
        return {
          data : data,
          selectedBar : 0,
          selectedPart : 0,
        };
      }
      return null;
    }

    renderBarButton(idx) {
      const { selectedBar } = this.state;
      return <button key={idx} 
        onClick={() => this.setState({selectedBar : idx})} 
        className={selectedBar === idx ? 'selected' : null}>{idx+1}</button>;
    }

    renderPart(data, idx) {
      const { selectedBar, selectedPart } = this.state;
      return (<Part data={data} idx={idx} 
        firstStep={16*selectedBar} 
        selected={selectedPart === idx} 
        onSelect={(selectedPart) => this.setState({selectedPart})} />);
    }

    onChangePatternProperty = (pname, value) => {
      console.log(pname, value);
    }

    render() {
      const { viewState } = this.state;
      const { data } = this.props;
      const { parts } = data;
      const arr = [0, 1, 2, 3];

      return (<div className='Pattern'>
        <div className='pattern-menu'>
        <button onClick={() => this.setState({viewState : Pattern.DetailsView})}
            className={(viewState === Pattern.DetailsView ? 'selected' : null)}>&#9776;</button>
          <button onClick={() => this.setState({viewState : Pattern.PartsView})}
            className={(viewState === Pattern.PartsView ? 'selected' : null)}>Parts</button>
          <button onClick={() => this.setState({viewState : Pattern.MotionsView})}
            className={(viewState === Pattern.MotionsView ? 'selected' : null)}>Motions</button>
          {viewState === Pattern.PartsView || viewState === Pattern.MotionsView 
            ? arr.map(idx => this.renderBarButton(idx)) : null}
        </div>
          {viewState === Pattern.DetailsView ? <PatternDetails data={data} onChange={this.onChangePatternProperty} /> : null}
          {viewState === Pattern.PartsView ? parts.map((e, i) => this.renderPart(e, i)) : null}
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