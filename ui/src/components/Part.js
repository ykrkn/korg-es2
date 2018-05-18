import React, { Component } from 'react';
import PadButton from './PadButton';
import ToggleButton from './ToggleButton';

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
        const steps = Array(16).fill(0).map(e => <PadButton className="PadButton" />);
        const partToggleOnClick = (e) => {
            this.setState({showDetails : e});    
        };
        return <div className="Part">
            <div className="part-pads-row">
                <ToggleButton onToggle={partToggleOnClick} label={this.props.partNumber}/> {steps}
            </div>
            { showDetails ? <div className="part-details">X</div> : null }   
        </div>;
    }
}