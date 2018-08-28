import getData from './data-mock';

// get pattern dump
// put pattern dump
// get all dump
// get file dump

class SXObject {
    protected data:Uint8Array;
    constructor(data:Uint8Array) {
        this.data = data;
    }
    pack():Uint8Array { return new Uint8Array(0); }
}

class DataChunk {

    public offset:number;
    public length:number;
    public name:string;
    public ba2val:Function;
    public val2ba:Function;

    static byteArray(name, from, length):DataChunk {
        const p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = length;
        p.ba2val = (ba) => ba.slice(from, from+length);
        p.val2ba = (v) => v.slice(0);
        return p;
    }

    static byte(name, from):DataChunk {
        const p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = 1;
        p.ba2val = (ba) => ba[from];
        p.val2ba = (v) => [v];
        return p;
    }

    static short(name, from):DataChunk {
        const p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = 2;
        p.ba2val = (ba) => {
            const _ba = ba.slice(from, from+2);
            return (((_ba[1] & 0xFF) << 8) | _ba[0] & 0xFF);
        }
        p.val2ba = null; // TODO:
        return p;
    }

    static int(name, from):DataChunk {
        const p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = 4;
        p.ba2val = (ba) => {
            const _ba = ba.slice(from, from+4);
            return ((_ba[3] & 0xFF) << 24) | ((_ba[2] & 0xFF) << 16) | ((_ba[1] & 0xFF) << 8) | _ba[0] & 0xFF;
        }
        p.val2ba = null; // TODO:
        return p;
    }

    static string(name, from, length):DataChunk {
        const p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = length;
        p.ba2val = (ba) => {
            let s = "";
            for (let i = 0; i < length; i++) {
                let n = ba[from+i];
                if(n == 0) break;
                s = s.concat(String.fromCharCode(n));
            }
            return s;
        };
        p.val2ba = null; // TODO:
        return p;
    }
}

class Pattern extends SXObject {
    static chunks = [
        DataChunk.string("header", 0, 4),
        DataChunk.int("size", 4),
        DataChunk.byteArray("version", 12, 2),
        DataChunk.string("patternName", 16, 18),
        DataChunk.short("tempo10x", 34),
        DataChunk.byte("swing", 36),
        DataChunk.byte("length", 37),
        DataChunk.byte("beat", 38),
        DataChunk.byte("key", 39),
        DataChunk.byte("scale", 40),
        DataChunk.byte("chordset", 41),
        DataChunk.byte("playLevel", 42),
        // touch scale offset = 44
        DataChunk.byte("gateArpPattern", 44+5),
        DataChunk.byte("gateArpSpeed", 44+6),
        // TODO: check gateArpTime! should be -100 ~ 100
        DataChunk.short("gateArpTime", 44+8),
        // Master Fx offset = 60
        DataChunk.byte("masterFxType", 61),
        DataChunk.byte("masterFxPadX", 62),
        DataChunk.byte("masterFxPadY", 63),
        DataChunk.byte("masterFxHold", 65),
        DataChunk.byte("alt1314", 68),
        DataChunk.byte("alt1516", 69),
        // TODO: motion seq
        // TODO: parts
        DataChunk.string("footer", 15356, 4)
    ];

    private props;

    constructor(data:Uint8Array) {
        super(data);
        this.props = {};
        for(let i in Pattern.chunks) {
            let chunk = Pattern.chunks[i];
            this.props[chunk.name] = chunk.ba2val(data);
        }
    }
}

class Dataset extends SXObject {
    public patterns:Pattern[] = [];
}

export class ES2Service {
    public getPattern():Pattern {
        const data = getData();
        return new Pattern(data); 
    }
}