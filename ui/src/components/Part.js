import React, { Component } from 'react';
import A from './A';
import Step from './Step';
import ToggleButton from './ToggleButton';
import './Part.css';

export default class Part extends Component {
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
        const steps = Array(16).fill(0).map(e => <Step className="Step" />);
        const partToggleOnClick = (e) => {
            this.setState({showDetails : e});    
        };
        return <div className="Part">
            <div className="part-pads-row">
                <ToggleButton onToggle={partToggleOnClick} label="X"/> {steps}
            </div>
            { showDetails ? <div className="part-details">X</div> : null }   
        </div>;
    }
}