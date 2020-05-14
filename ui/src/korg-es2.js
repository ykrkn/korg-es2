
// TABLE 3
const korg_e2_touch_scale = [
    ['reserved1',5],
    ['gate_arp_pattern',1], // 0~49
    ['gate_arp_speed',1],   // 0~127
    ['reserved2',1],
    ['gate_arp_time',2], // -100 ~ 100
    ['reserved3',6],
];

// TABLE 4
const korg_e2_master_fx = [
    ['reserved1',1],
    ['type',1], // 0~31
    ['xy_pad_x',1], // 0~127
    ['xy_pad_y',1], // 0~127
    ['reserved2',1],
    ['mfx_hold',1], // 0,1~127 = OFF,ON
    ['reserved3',2],
];

const korg_e2_step = [
    ['step_on_off',1], // 0,1=Off,On
    ['step_gate_time',1], // 0~96,127=0~96,TIE
    ['step_velocity',1], // 1~127
    ['step_trigger_on_off',1], // 0,1=Off,On
    ['step_note_slot1',1], // 0,1~128=Off,Note No 0~127
    ['step_note_slot2',1], // (same as Slot 1)
    ['step_note_slot3',1], // (same as Slot 1)
    ['step_note_slot4',1], // (same as Slot 1)
    ['reserved',4]
];

// TABLE 6 :Part Parameter
const korg_e2_part = [
    ['last_step',1], // 0,1~15=16,1~15
    ['mute',1], // 0,1=OFF,ON
    ['voice_assign',1], // 0,1,2,3=Mono1, Mono2, Poly1, Poly2
    ['motion_sequence',1], // 0,1,2=Off, Smooth, TriggerHold
    ['trig_pad_velocity',1], // 0,1=Off,On
    ['scale_mode',1], // 0,1=Off,On
    ['part_priority',1], // 0,1=Normal,High
    ['reserved1',1],
    ['oscillator_type',2], // 0~500
    ['reserved2',1], //
    ['oscillator_edit',1], // 0~127
    ['filter_type',1], // 0~16
    ['filter_cutoff',1], // 0~127
    ['filter_resonance',1], // 0~127
    ['filter_eg_int',1], // -63~63
    ['modulation_type',1], // 0~71
    ['modulation_speed',1], // 0~127
    ['modulation_depth',1], // 0~127
    ['reserved3',1],
    ['eg_attack',1], // 0~127
    ['eg_decay_release',1], // 0~127
    ['reserved4',2],
    ['amp_level',1], // 0~127
    ['amp_pan',1], // -63~0~64=L63~center~R63
    ['eg_on_off',1], // 0,1=Off,On
    ['mfx_send_on_off',1], // 0,1=Off,On
    ['groove_type',1], // 0~24
    ['groove_depth',1], // 0~127
    ['reserved5',2],
    ['ifx_on_off',1], // 0,1=Off,On
    ['ifx_type',1], // 0~37
    ['ifx_edit',1], // 0~127
    ['reserved6',1], //
    ['oscillator_pitch',1], // -63~+63
    ['oscillator_glide',1], // 0~127
    ['reserved7',10], //
    ['steps', 64, korg_e2_step]
];

const korg_e2_pattern = [
    ['header',4], // 'PTST' = 54535450[HEX]
    ['size',4],
    ['reserved1',4],
    ['version_major',1],
    ['version_minor',1],
    ['reserved',2],
    ['name',18], // null terminated
    ['tempo',2], // 200~3000 = 20.0 ~ 300.0 UInt16LE
    ['swing',1], // -48 ~ 48
    ['length',1], // 0~3 = 1~4bar(s)
    ['beat',1], // 0, 1, 2, 3 = 16,32,8 Tri, 16 Tri
    ['key',1], // 0~11 = C~B
    ['scale',1], // 0~35
    ['chordset',1], // 0~4
    ['level',1], // 127 ~ 0 = 0 ~ 127
    ['reserved2',1],
    ['touch_scale',1,korg_e2_touch_scale],
    ['master_fx',1,korg_e2_master_fx],
    ['alt_1314',1], // 0~1=OFF,ON
    ['alt_1516',1], // 0~1=OFF,ON
    ['reserved3',8],
    ['reserved4',178],
    ['motion_seq_part_slot', 24], // 0,1~16,17=Off,Part1~16,Master FX
    ['motion_seq_destination', 24], // *T5-1
    ['motion_seq_slots', 24*64], // 0~127 for each
    ['reserved5',208],
    ['parts',16,korg_e2_part],
    ['reserved6',252],
    ['footer',4], // 'PTED' = 44455450[HEX]
    ['reserved7',1024],
];

const stringConverter = {
    unpack : (v) => {
        let r = "";
        for(let i=0; i<v.length; ++i) {
            if (v[i] === 0) break;
            r += String.fromCharCode(v[i]);        
        }
        return r;
    },
    pack : (v) => {
        let r = new Array(18).fill(0); // FIXME:
        for(let i=0; i<v.length; ++i) {
            r[i] = v.codePointAt(i);
        }
        return r;        
    }
};

const ba2string = (chunk, ba) => {
    let s = "";
    for (let i = 0; i < chunk.length; i++) {
        let n = ba[chunk.offset+i];
        if(n === 0) break;
        s = s.concat(String.fromCharCode(n));
    }
    return s;
};

const ba2byte = (chunk, ba) => {
    return ba[chunk.offset];
};

const ba2short = (chunk, ba) => {
    const _ba = ba.slice(chunk.offset, chunk.offset+chunk.length);
    return (((_ba[1] & 0xFF) << 8) | (_ba[0] & 0xFF));
};

const ba2int = (chunk, ba) => {
    const _ba = ba.slice(chunk.offset, chunk.offset+chunk.length);
    return ((_ba[3] & 0xFF) << 24) | ((_ba[2] & 0xFF) << 16) | ((_ba[1] & 0xFF) << 8) | (_ba[0] & 0xFF);
};

const DUMP_SIZE = 16384;

class KorgES2Pattern {

    loadAllPatternsDump(source) {
        this.source = source;
        this.index = {};
        this.struct = this.multiplyType(korg_e2_pattern);
        const offset = this.calcOffset(this.struct, 0);
        if (offset !== DUMP_SIZE) throw new Error('Invalid struct size ' + offset);
        this.data = this.unpack(this.struct, {}, null);
    }

    import(data) {
        if (!Array.isArray(data)) { console.error('Invalid data'); return; }
        if (data.length !== DUMP_SIZE) { console.error('Invalid data size'); return; }
        this.data = data;
    }

    multiplyType = (type) => {
        const res = [];
        for(let i=0; i<type.length; ++i) {
            const prop = type[i];
            const o = {name:prop[0], size:prop[1], offset:0};
            if (prop.length === 3) {
                const iter = [];
                for(let j=0; j<prop[1]; j++) {
                    iter.push([...prop[2]]);
                }
                o.iter = iter.map((e) => this.multiplyType(e));
            }
            res.push(o);
        }
        return res;
    };

    calcOffset = (type, offset) => {
        for(let i=0; i<type.length; ++i) {
            const prop = type[i];
            prop.offset = offset;
            if (prop.iter) {
                for(let j=0; j<prop.iter.length; j++) {
                    offset = this.calcOffset(prop.iter[j], offset);
                }
            } else {
                offset += prop.size;    
            }
        }
        return offset;    
    };

    arr2val = (arr) => {
        return arr;
    }

    /**
     * struct: Array(30)
     * 0: {name: "header", size: 4, offset: 0}
     * @param src
     * @param sink {}
     */
    unpack = (src, sink, ipath) => {
        for (let i = 0; i < src.length; i++) {
            const e = src[i];
            if (e.name === 'header') continue;
            if (e.name === 'footer') continue;
            if (e.name.indexOf('reserved') === 0) continue;
            const path = ipath == null ? e.name : ipath.split(':').concat(e.name).join(':');
            if (e.iter !== undefined) {
                sink[e.name] = e.iter.map((it, i) => this.unpack(it, {}, path+':'+i));
            } else {
                const arr = this.source.slice(e.offset, e.offset+e.size);
                sink[e.name] = this.arr2val(arr);
                const { size, offset } = e;
                this.index[path] = {size, offset};
            }
        }
        return sink;
    }
}

const types = {
    bool  : (val) => val[0] !== 0,
    byte  : (val) => val[0],
    short : (val) => (((val[1] & 0xFF) << 8) | (val[0] & 0xFF)),
};

export { KorgES2Pattern, types };
