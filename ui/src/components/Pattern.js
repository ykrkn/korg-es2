import React, { Component } from 'react';
import A from './A';
import Part from './Part';
import MotionSeq from './MotionSeq';
import './Pattern.css';

export default class Pattern extends A {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const parts = Array(16).fill(0).map(e => <Part />);
        const mseqs = Array(24).fill(0).map(e => <MotionSeq />);
        return <div className="Pattern">{parts} {mseqs}</div>;
    }
}