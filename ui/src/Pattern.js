import React, { PureComponent } from 'react';
import { Part } from './Part';
import { PatternBeatMap, NotesMap, PatternChordsetMap, PatternScaleMap } from './constants';
import { TextInput, NumberInput, Selector, BooleanInput } from './components';
import { types } from './korg-es2';
import service from './service';

const scaleMap = PatternScaleMap.reduce((acc, x) => { acc[x[0]] = x[1]; return acc; }, {});
const beatMap = PatternBeatMap;
const keyMap = NotesMap;    
const chordsetMap = PatternChordsetMap;

const PatternDetails = ({data, onChange}) => {  
    return <div className='pattern-details'>
      <div className='col'>
        <div className='item'>
            <legend>Pattern Name</legend> 
            <TextInput value={data.name} onChange={(v) => onChange('name', v)}/>
        </div>
        <div className='item'>
            <legend>Tempo</legend>
            <NumberInput value={.1*data.tempo} min={20} max={300} onChange={(v) => onChange('tempo', 10*v)} />
        </div>
        <div className='item'>
            <legend>Length</legend>
            <NumberInput value={1+data.length} min={1} max={4} onChange={(v) => onChange('length', v)} />
        </div>          
        <div className='item'>
            <legend>!Swing</legend>
            <NumberInput value={data.swing} onChange={(v) => onChange('swingFIXME', v)}/>
        </div>  
        <div className='item'>
            <legend>Beat</legend>
            <Selector values={beatMap} value={data.beat} onChange={(v) => onChange('beat', v)} />
        </div>
        <div className='item'>
            <legend>Key</legend>
            <Selector values={keyMap} value={data.key} onChange={(v) => onChange('key', v)} />
        </div>
        <div className='item'>
            <legend>Scale</legend>
            <Selector values={scaleMap} value={data.scale} onChange={(v) => onChange('scale', v)} />
        </div>  
        <div className='item'>
            <legend>ChordSet</legend>
            <Selector values={chordsetMap} value={data.chordset} onChange={(v) => onChange('chordset', v)} />
        </div>    
        <div className='item'>
            <legend>Level</legend>
            <NumberInput value={127-data.level} min={0} max={127} onChange={(v) => onChange('level', 127-v)} />
        </div>
        <div className='item'>
            <legend>ALT 13/14</legend>
            <BooleanInput value={!!data.alt1314} onChange={(v) => onChange('alt1314', v)} />
        </div>  
        <div className='item'>
            <legend>ALT 15/16</legend>
            <BooleanInput value={!!data.alt1516} onChange={(v) => onChange('alt1516', v)} />
        </div>
      </div>
    </div>
  }

export class Pattern extends PureComponent {

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
        return {
          data : data,
          // selectedBar : 0,
          // selectedPart : 0,
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
      return (<Part data={data} 
        idx={idx} key={String(idx)} 
        firstStep={16*selectedBar} 
        selected={selectedPart === idx} 
        onSelect={(selectedPart) => this.setState({selectedPart})} />);
    }

    onChangePatternProperty = (pname, value) => {
      if (pname == 'alt1314' || pname == 'alt1516') {
          value = 1*value;
      } else if (pname == 'length') {
          value -= 1;
      } else if (['key', 'beat', 'chordset', 'scale'].indexOf(pname) != -1) {
        value = parseInt(value);
      }

      const { data } = this.state;
      data[pname] = value;
      service.changePattern({[pname]:value});
      this.setState(data);
    }

    render() {
      const { data, viewState } = this.state;
      const { parts } = data;
      const arr = Array.from(Array(1+data.length).keys());

      return (<div className='Pattern'>
        <div className='pattern-menu'>
        <button onClick={() => this.setState({viewState : Pattern.DetailsView})}
            className={(viewState === Pattern.DetailsView ? 'selected' : null)}>&#9776;</button>
          <button onClick={() => this.setState({viewState : Pattern.PartsView})}
            className={(viewState === Pattern.PartsView ? 'selected' : null)}>Parts</button>
          {/* <button onClick={() => this.setState({viewState : Pattern.MotionsView})}
            className={(viewState === Pattern.MotionsView ? 'selected' : null)}>Motions</button> */}
          {viewState === Pattern.PartsView || viewState === Pattern.MotionsView 
            ? arr.map(idx => this.renderBarButton(idx)) : null}
          <div className='header'>{data.name} {data.tempo*.1}bpm {keyMap[data.key]} {scaleMap[data.scale]}</div>  
        </div>
          {viewState === Pattern.DetailsView ? <PatternDetails data={data} onChange={this.onChangePatternProperty} /> : null}
          {viewState === Pattern.PartsView ? parts.map((e, i) => this.renderPart(e, i)) : null}
          {viewState === Pattern.MotionsView ? 'Motions will be here' : null}
        </div>);
    }
}
