import React, { Component } from 'react';
import A from './A';
import './ToggleButton.css';

export default class ToggleButton extends A {
    constructor(props) {
        super(props);
        this.state = {
            label : this.props.label,
            selected : this.props.selected 
        };
    }

    render() {
        const _onClick = (e) => {
            const { selected } = this.state;
            this.setState({selected : !selected}); 
            this.props.onToggle(!selected);   
        };
        const className = (this.props.className || "ToggleButton") + (this.state.selected ? " selected" : "");
        return <button className={className} onClick={_onClick}>{this.state.label}</button>;
    }
}