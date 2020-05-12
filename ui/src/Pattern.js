import React, { Component } from 'react';
import { Part } from './Part';
import { PatternBeatMap, NotesMap, PatternChordsetMap, PatternScaleMap } from './constants';
import { TextInput, NumberInput, Selector, BooleanInput } from './components';
import { types } from './korg-es2';

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
  
          {/*<div className='item'>
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
          </div>*/}
  
          <div className='item'>
            <legend>Level</legend>
            <NumberInput 
              value={127-types.byte(data.level)} min={0} max={127}
              onChange={(v) => onChange('level', 127-v)} />
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

export class Pattern extends Component {

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