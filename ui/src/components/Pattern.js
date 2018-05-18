import React, { Component } from 'react';
import A from './A';
import Part from './Part';
import MotionSeq from './MotionSeq';

export default class Pattern extends A {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const parts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(e => <Part partNumber={e} />);
        const mseqs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map(e => <MotionSeq />);
        return <div className={"Pattern"}>{parts} {mseqs}</div>;
    }
}