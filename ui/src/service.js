// TODO: document.location.protocol == 'href:'
import patern from './pattern.json';

class ServiceWebpack {
    async loadPattern() {
        return patern;
    }
}

class ServiceJavaFX {
    async loadPattern() {
        return patern;
        //const response = await fetch('http://localhost:3000/pattern.json', {method:'GET',mode:'no-cors'});
        //const json = await response.json();
        //return json;
    }
}

const service = (document.location.protocol === 'href:' ? new ServiceWebpack() : new ServiceJavaFX());

export default service;