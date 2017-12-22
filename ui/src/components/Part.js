import React, { Component } from 'react';
import Step from './Step';

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
        const steps = Array(16).fill(0).map(e => <Step />);
        const partToggleOnClick = (e) => {
            this.setState({showDetails : !showDetails});    
        };
        return <div className="part">
            <div className="part-pads-row">
                <button className="part-toggle-btn" onClick={partToggleOnClick} /> {steps}
            </div>
            { showDetails ? <div className="part-details">X</div> : null }   
        </div>;
    }
}