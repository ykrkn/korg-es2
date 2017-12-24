import React, { Component } from 'react';

export default class A extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        //console.log(this, 'Mount');
    }

    componentWillUnmount() {
    }

    render() {
        return null;
    }
}