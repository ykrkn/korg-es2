import React, {Component} from 'react';

export default class ToggleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label : this.props.label,
            className : props.className || "ToggleButton",
            selected : this.props.selected 
        };
    }

    render() {
        const _onClick = (e) => {
            let { selected } = this.state;
            selected = !selected;

            if(this.props.onToggle) this.props.onToggle(selected);
            let className = (this.props.className || "ToggleButton");
            if(selected) className += " selected";
            this.setState({selected : selected, className : className});
        };

        const { label, className } = this.state;
        return <button className={className} onClick={_onClick}>{label}</button>;
    }
}