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

    validate() {
        return false;
    }
}

const ba2slice = (chunk:DataChunk, ba:Uint8Array) => {
    return ba.slice(chunk.offset, chunk.offset+chunk.length);
};

const ba2string = (chunk:DataChunk, ba:Uint8Array) => {
    let s = "";
    for (let i = 0; i < chunk.length; i++) {
        let n = ba[chunk.offset+i];
        if(n == 0) break;
        s = s.concat(String.fromCharCode(n));
    }
    return s;
};

const ba2byte = (chunk:DataChunk, ba:Uint8Array) => {
    return ba[chunk.offset];
};

const ba2short = (chunk:DataChunk, ba:Uint8Array) => {
    const _ba = ba.slice(chunk.offset, chunk.offset+chunk.length);
    return (((_ba[1] & 0xFF) << 8) | _ba[0] & 0xFF);
};

const ba2int = (chunk:DataChunk, ba:Uint8Array) => {
    const _ba = ba.slice(chunk.offset, chunk.offset+chunk.length);
    return ((_ba[3] & 0xFF) << 24) | ((_ba[2] & 0xFF) << 16) | ((_ba[1] & 0xFF) << 8) | _ba[0] & 0xFF;
};

class DataChunk {

    public offset:number = 0;
    public length:number = 0;
    public name:string = null;
    private _comment:string = null;
    private _ba2val:Function = null;
    private _val2ba:Function = null;

    constructor(name:string, length:number, ba2val:Function) { // TODO: , val2ba:Function
        this.name = name;
        this.length = length;
        this._ba2val = ba2val;
    }

    comment(value:string) {
        this._comment = value;
        return this;
    }

    ba2val(ba:Uint8Array) {
        if (this._ba2val == null) return null;
        return this._ba2val(this, ba);
    }

    static byteArray(name, length):DataChunk {
        return new DataChunk(name, length, ba2slice);
    }

    static byte(name):DataChunk {
        return new DataChunk(name, 1, ba2byte);
    }

    static short(name):DataChunk {
        return new DataChunk(name, 2, ba2short);
    }

    static int(name):DataChunk {
        return new DataChunk(name, 4, ba2int);
    }

    static string(name, length):DataChunk {
        return new DataChunk(name, length, ba2string);
    }

    static padding(length):DataChunk {
        return new DataChunk("_padding_"+length, length, null);
    }
}

/*
    byte step_on_off             ; // 0,1=Off,On
    byte step_gate_time          ; // 0~96,127=0~96,TIE
    byte step_velocity           ; // 1~127
    byte step_trigger_on_off     ; // 0,1=Off,On
    byte step_note_slot1         ; // 0,1~128=Off,Note No 0~127
    byte step_note_slot2         ; // (same as Slot 1)
    byte step_note_slot3         ; // (same as Slot 1)
    byte step_note_slot4         ; // (same as Slot 1)
    byte reserved[4]             ; //
} korg_e2_step;
*/
class Step extends SXObject {

}

/*
// TABLE 6 :Part Parameter
typedef struct {
    byte last_step         ; // 0,1~15=16,1~15
    byte mute              ; // 0,1=OFF,ON
    byte voice_assign      ; // 0,1,2,3=Mono1, Mono2, Poly1, Poly2
    byte motion_sequence   ; // 0,1,2=Off, Smooth, TriggerHold
    byte trig_pad_velocity ; // 0,1=Off,On
    byte scale_mode        ; // 0,1=Off,On
    byte part_priority     ; // 0,1=Normal,High
    byte reserved1;
    byte oscillator_type[2]; // 0~500
    byte reserved2         ; //
    byte oscillator_edit   ; // 0~127
    byte filter_type       ; // 0~16
    byte filter_cutoff     ; // 0~127
    byte filter_resonance  ; // 0~127
    byte filter_eg_int     ; // -63~63
    byte modulation_type   ; // 0~71
    byte modulation_speed  ; // 0~127
    byte modulation_depth  ; // 0~127
    byte reserved3         ; //
    byte eg_attack         ; // 0~127
    byte eg_decay_release  ; // 0~127
    byte reserved4[2]      ; //
    byte amp_level         ; // 0~127
    byte amp_pan           ; // -63~0~64=L63~center~R63
    byte eg_on_off         ; // 0,1=Off,On
    byte mfx_send_on_off   ; // 0,1=Off,On
    byte groove_type       ; // 0~24
    byte groove_depth      ; // 0~127
    byte reserved5[2]      ; //
    byte ifx_on_off        ; // 0,1=Off,On
    byte ifx_type          ; // 0~37
    byte ifx_edit          ; // 0~127
    byte reserved6         ; //
    byte oscillator_pitch  ; // -63~+63
    byte oscillator_glide  ; // 0~127
    byte reserved7[10]     ; //
    korg_e2_step steps[64];
*/

class Part extends SXObject {

}

class Pattern extends SXObject {
    static chunks = [
        DataChunk.string("header", 4).comment("'PTST' = 54535450[HEX]"), 
        DataChunk.int("size"),
        DataChunk.padding(4),
        DataChunk.byteArray("version", 2),
        DataChunk.padding(2),
        DataChunk.string("name", 18),
        DataChunk.short("tempo10x").comment("200~3000 = 20.0 ~ 300.0 UInt16LE"),
        DataChunk.byte("swing").comment("-48 ~ 48"),
        DataChunk.byte("length").comment("0~3 = 1~4bar(s)"),
        DataChunk.byte("beat").comment("0, 1, 2, 3 = 16,32,8 Tri, 16 Tri"),
        DataChunk.byte("key").comment("0~11 = C~B"),
        DataChunk.byte("scale").comment("0~35"),
        DataChunk.byte("chordset").comment("0~4"),
        DataChunk.byte("level").comment("127 ~ 0 = 0 ~ 127"),
        DataChunk.padding(1),

        // korg_e2_touch_scale
        DataChunk.padding(5),
        DataChunk.byte("gate_arp_pattern").comment("0~49"),
        DataChunk.byte("gate_arp_speed").comment("0~127"),
        DataChunk.padding(1),
        DataChunk.short("gate_arp_time").comment("-100 ~ 100"),
        DataChunk.padding(6),

        // korg_e2_master_fx
        DataChunk.padding(1), 
        DataChunk.byte("master_fx_type").comment("0~31"),
        DataChunk.byte("master_fx_xy_pad_x").comment("0~127"),
        DataChunk.byte("master_fx_xy_pad_y").comment("0~127"),
        DataChunk.padding(1),
        DataChunk.byte("master_fx_mfx_hold").comment("0,1~127 = OFF,ON"),
        DataChunk.padding(2),

        DataChunk.byte("alt_1314").comment("0~1=OFF,ON"),
        DataChunk.byte("alt_1516").comment("0~1=OFF,ON"),
        DataChunk.padding(8),
        DataChunk.padding(178),
        
        // TODO: motion seq
        DataChunk.byteArray("motion_seq_part_slot", 24).comment("0,1~16,17=Off,Part1~16,Master FX"),
        DataChunk.byteArray("motion_seq_destination", 24).comment("*T5-1"),
        DataChunk.byteArray("motion_seq_slots", 24*64).comment("0~127 for each"),
        DataChunk.padding(208),

        // TODO: korg_e2_part
        DataChunk.padding(16*(48+(64*12))),

        DataChunk.padding(252),
        DataChunk.string("footer", 4).comment("'PTED' = 44455450[HEX]"),
        DataChunk.padding(1024)
    ];

    private props;

    constructor(data:Uint8Array) {
        super(data);
        this.props = {};

        for(let i=0, offset=0; i<Pattern.chunks.length; ++i) {
            let chunk = Pattern.chunks[i];
            chunk.offset = offset;
            this.props[chunk.name] = chunk.ba2val(data);
            offset += chunk.length;
            console.log(chunk, chunk.ba2val(data));
        }

        if(!this.validate()) {
            throw new Error('Invalid data');
        }
    }

    validate() {
        if (this.data.length !== 16384) return false;
        if (this.props['header'] !== 'PTST') return false;
        if (this.props['footer'] !== 'PTED') return false;
        return true;
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