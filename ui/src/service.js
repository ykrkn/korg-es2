// TODO: document.location.protocol == 'href:'
import pattern from './pattern.json';

class ServiceWebpack {
    constructor() {
        this.pattern = null;
    }

    async loadPattern() {
        this.pattern = pattern;
        return this.pattern;
    }

    async savePattern() {
        console.log(this.pattern);
    }

    changePattern(obj) {
        console.log(obj);
        this.pattern = {...this.pattern, ...obj};
    }

    changePart(partIdx, obj) {
        console.log(partIdx, obj);
    }

    changePartStep(partIdx, stepIdx, obj) {
        console.log(partIdx, stepIdx, obj);
        const pattern = {
            ...this.pattern, 
            parts : this.pattern.parts.map((p,i) => i === partIdx ? {...p, steps : p.steps.map((s,j) => j === stepIdx ? {...s, ...obj} : s)} : p)};
        this.pattern = pattern;
    }
}

class ServiceJavaFX {
    async loadPattern() {
        return pattern;
        //const response = await fetch('http://localhost:3000/pattern.json', {method:'GET',mode:'no-cors'});
        //const json = await response.json();
        //return json;
    }
}
 
const service = new ServiceWebpack();

export default service;