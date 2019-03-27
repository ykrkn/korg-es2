import React, { Component } from 'react';
import { KorgES2Pattern, types } from './korg-es2';

class Step extends Component {
    constructor(props) {
        super(props);
    }

    // LOOKATME: https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops

    note2str = (v) => {
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

    renderSlotNotes(data) {
      const notes = [data.step_note_slot1, data.step_note_slot2, data.step_note_slot3, data.step_note_slot4]
        .filter(e => e > 0)
        .map(e => this.note2str(e));
        return <span>{[notes[0], notes[1]].join(' ')}<br/>{[notes[2], notes[3]].join(' ')}</span>;
    }

    render() {
      const { data } = this.props;
      const style = {};
      if (this.props.showDetails) style.height = 100;
      const velocity = types.byte(data.step_velocity);
      const on_off = types.bool(data.step_on_off);
      style.color = `rgb(${2*velocity}, 0, 0)`;
      style.opacity = (on_off ? 1 : .3);
      console.log(data, style);
      return <div className='part-step' style={style}>{ this.renderSlotNotes(data) }</div>;
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