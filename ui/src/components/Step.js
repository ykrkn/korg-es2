import React, { Component } from 'react';

export default class Pad extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return <button className="step">X</button>;
    }
}