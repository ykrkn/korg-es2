import React, { Component } from 'react';
import Part from './Part';

export default class Pattern extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const parts = Array(16).fill(0).map(e => <Part />);
        return <div className="pattern">{parts}</div>;
    }
}