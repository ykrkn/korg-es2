import React, { Component } from 'react';
import { PartStep } from './PartStep';

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

export class Part extends Component {
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
          <div className='label'>Gate</div>,
          <div className='label'>Step</div>,
          <div className='label'>Trigger</div>,
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