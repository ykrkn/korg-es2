import React, {PureComponent} from "react";
import service from "./service";
import {Pattern} from "./Pattern";

export class App extends PureComponent {

    constructor(props) {
        super(props);
        this.menuItems = [];
        this.state = {};
    }

    async componentDidMount() {
        this.menuItems.push(<button onClick={() => service.savePattern()}>S</button>);
        service.onPatternUpdated(pattern => this.setState({pattern}));
        const pattern = await service.loadPattern();
        this.setState({pattern});
    }

    render() {
        const { pattern } = this.state;
        if (!pattern) return null;
        return (<Pattern data={pattern} />);
    }
};
