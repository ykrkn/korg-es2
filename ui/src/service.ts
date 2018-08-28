import getData from './data-mock';

// get pattern dump
// put pattern dump
// get all dump
// get file dump

class SXObject {
    protected data:number[];
    unpack(data:number[]) {}
    pack():number[] { return []; }
}

class Pattern extends SXObject {
    unpack(data:number[]) {
        this.data = data;
    }
}

class Dataset extends SXObject {
    public patterns:Pattern[] = [];
}

export class ES2Service {
    public getPattern():Pattern {
        const pattern = new Pattern();    
        const data = getData();
        pattern.unpack(data);
        return pattern;
    }
}