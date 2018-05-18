import React from 'react';
import A from './A';
import PadButton from './PadButton';
import ToggleButton from './ToggleButton';

export default class MotionSeq extends A {
    constructor(props) {
        super(props);
        this.state = {
            showDetails : false
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const { showDetails } = this.state;
        const steps = Array(16).fill(0).map(e => <PadButton className="PadButton" />);
        const partToggleOnClick = (e) => {
            this.setState({showDetails : !showDetails});    
        };
        return <div className="MotionSeq">
            <div className="part-pads-row">
                <ToggleButton onToggle={partToggleOnClick}  label="S"/> {steps}
            </div>
            { showDetails ? <div className="part-details">X</div> : null }   
        </div>;
    }
}