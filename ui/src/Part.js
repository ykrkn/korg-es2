import React, {Component, PureComponent} from 'react';
import {NotesMap} from "./constants";
import {BooleanInput, KnobNumericInput, NumberInput} from "./components";
import service from "./service";

const note2str = (v) => {
    if (v === 0) return '---';
    let n = ((v - 1) % 12);
    let o = Math.floor((v-1)/12);//Math.floor(v/11)-1;
    return NotesMap[n] + (o-1);
};

const sortnum = (a, b) => a-b;



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

const PadButton = ({data, onClick, onDoubleClick}) => {
    const { velocity, notes, enabled } = data;
    const style = {};
    style.opacity = (enabled ? 1 : .2);
    if (enabled) {
        const velocityShadow = (velocity>>2)-26;
        style.boxShadow = `0 0 32px ${velocityShadow}px rgb(116, 28, 120) inset`;
    }

    const label = () => {
        const n = notes.filter(e => e > 0).sort(sortnum);
        if (n.length > 1) return <strong style={{color:'white'}}>{note2str(n[0])}</strong>
        if (n.length === 1) return note2str(n[0]);
        else return null;
    }

    return  <button className='pad' style={style} onDoubleClick={onDoubleClick} onClick={onClick}>{label()}</button>
};


export class Part extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails : false,
        };
    }

    changeStep(stepIdx, obj) {
        service.changePartStep(this.props.idx, stepIdx, obj);
    }

    onChangeNote = (stepIdx, noteIdx, value) => {
        const { data } = this.props;
        const notes = [...data.steps[stepIdx].notes];
        notes[noteIdx] = value;
        this.changeStep(stepIdx, {notes});
    };

    onChangeVelocity = (stepIdx, value) => {
        this.changeStep(stepIdx, {velocity : value});
    };

    onChangeGateTime = (stepIdx, value) => {
        if (value > 96 && value < 125) value = 127;
        else if (value > 125 && value < 127) value = 96;
        this.changeStep(stepIdx, {gateTime : value});
    };

    renderSteps() {
        const { firstStep, data } = this.props;
        const steps = data.steps.slice(firstStep, firstStep + 16);

        return (<div className='steps'>
            <div className='row'>
                <button className='toggle'>Note 1</button>
                {steps.map((e, i) => <KnobNumericInput key={i} value={e.notes[0]} min={0} max={128}
                                                       className={'step note'}
                                                       onChange={value => this.onChangeNote(firstStep+i, 0, value)}
                                                       labelRenderer={note2str}/>)}
            </div>
            <div className='row'>
                <button className='toggle'>Note 2</button>
                {steps.map((e, i) => <KnobNumericInput key={i} value={e.notes[1]} min={0} max={128}
                                                       className={'step note'}
                                                       onChange={value => this.onChangeNote(firstStep+i, 1, value)}
                                                       labelRenderer={note2str}/>)}
            </div>
            <div className='row'>
                <button className='toggle'>Note 3</button>
                {steps.map((e, i) => <KnobNumericInput key={i} value={e.notes[2]} min={0} max={128}
                                                       className={'step note'}
                                                       onChange={value => this.onChangeNote(firstStep+i, 2, value)}
                                                       labelRenderer={note2str}/>)}
            </div>
            <div className='row'>
                <button className='toggle'>Note 4</button>
                {steps.map((e, i) => <KnobNumericInput key={i} value={e.notes[3]} min={0} max={128}
                                                       className={'step note'}
                                                       onChange={value => this.onChangeNote(firstStep+i, 3, value)}
                                                       labelRenderer={note2str}/>)}
            </div>

            <div className='row'>
                <button className='toggle'>Velocity</button>
                {steps.map((e, i) => <KnobNumericInput key={i} value={e.velocity} min={1} max={127}
                                                       className={'step velocity'}
                                                       onChange={value => this.onChangeVelocity(firstStep+i, value)}/>)}
            </div>

            <div className='row'>
                <button className='toggle'>Gate</button>
                {steps.map((e, i) => <KnobNumericInput key={i} min={0} max={127} value={e.gateTime}
                                                       className={'step gate'}
                                                       onChange={value => this.onChangeGateTime(firstStep+i, value)}
                                                       labelRenderer={value => value == 127 ? 'TIE' : value} />)}
            </div>

            <div className='row'>
                <button className='toggle'>Trigger</button>
                {steps.map((e, i) => <BooleanInput key={i} value={e.triggerEnabled} className={'step'}
                                                       onChange={(triggerEnabled) => this.changeStep(firstStep+i, {triggerEnabled})} />)}
            </div>
        </div>);
    }

    render() {
        const { firstStep, data, selected, idx, onSelect } = this.props;
        const steps = data.steps.slice(firstStep, firstStep + 16);

        return <div className="Part">
                <div className='pads'>
                    <button onClick={() => onSelect(idx)} className={'toggle' + (selected ? ' selected' : '')}>{(1+idx)}</button>
                    {steps.map((e, i) => <PadButton key={i} idx={firstStep+i} data={e}
                                                    selected={selected}
                                                    onClick={() => this.changeStep(firstStep+i, {enabled : 1*!e.enabled})}
                                                    onDoubleClick={() => this.changeStep(firstStep+i, {notes:[0,0,0,0], enabled: 0, triggerEnabled: 0, velocity: 96, gateTime: 72})} />)}
                </div>
                {selected ? this.renderSteps() : null}
        </div>;
    }
}
