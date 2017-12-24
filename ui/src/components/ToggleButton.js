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
            if(this.props.onToggle)
                this.props.onToggle(!selected);   
        };

        const _onMouseDown = (e) => { 
            // this.setState({mx : e.clientX, my : e.clientY});
            this.onMouseMove(dx, dy);
            setTimeout(() => {
                this.onMouseMove(dx, dy);
            }, 20);
        }
        const _onMouseUp = (e) => { console.log(e) }
        const _onMouseMove = (e) => { console.log(e) }

        const className = (this.props.className || "ToggleButton") + (this.state.selected ? " selected" : "");
        return <button className={className} 
            onClick={_onClick} 
            onMouseDown={_onMouseDown} 
            onMouseUp={_onMouseUp}>{this.state.label}</button>;
    }
}