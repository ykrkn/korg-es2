
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

const traverse = (struct, offset) => {
    for(let i=0; i<struct.length; ++i) {
        let type = struct[i];
        if (type.length == 2) {
            type[2] = offset;
            offset += type[1];
        } else if (type.length == 3) {
            let sizeof = type[1];
            let next_type = type[2];
            let next_struct = [];
            for(let j=0; j<sizeof; ++j) {
                next_struct[j] = [ ... next_type];
            }
            for(let j=0; j<sizeof; ++j) {
                offset = traverse(next_struct, offset);
                next_struct[j][3] = offset;
            }
            type[3] = next_struct;
        }
    }
    return offset;
};

traverse(korg_e2_pattern, 0);
console.log(korg_e2_pattern);
export default korg_e2_pattern;