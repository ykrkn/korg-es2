//
//  korg_e2.h
//  es2ed
//
//  Created by sx on 28.10.17.
//  Copyright © 2017 sx. All rights reserved.
//

#ifndef korg_e2_h
#define korg_e2_h

typedef unsigned char byte;


// TABLE 3
typedef struct {
    byte reserved1[5];
    byte gate_arp_pattern; // 0~49
    byte gate_arp_speed;   // 0~127
    byte reserved2;
    byte gate_arp_time[2]; // -100 ~ 100
    byte reserved3[6];
} korg_e2_touch_scale;

// TABLE 4
typedef struct {
    byte reserved1;
    byte type    ; // 0~31
    byte xy_pad_x; // 0~127
    byte xy_pad_y; // 0~127
    byte reserved2;
    byte mfx_hold; // 0,1~127 = OFF,ON
    byte reserved3[2];
} korg_e2_master_fx;

typedef struct {
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
} korg_e2_part;

typedef struct {
    byte header[4]; // 'PTST' = 54535450[HEX]
    byte size[4];
    byte reserved1[4];
    byte version_major;
    byte version_minor;
    byte reserved[2];
    byte name[18]; // null terminated
    byte tempo[2]; // 200~3000 = 20.0 ~ 300.0 UInt16LE
    byte swing   ; // -48 ~ 48
    byte length  ; // 0~3 = 1~4bar(s)
    byte beat    ; // 0, 1, 2, 3 = 16,32,8 Tri, 16 Tri
    byte key     ; // 0~11 = C~B
    byte scale   ; // 0~35
    byte chordset; // 0~4
    byte level   ; // 127 ~ 0 = 0 ~ 127
    byte reserved2;
    korg_e2_touch_scale touch_scale;
    korg_e2_master_fx master_fx;
    byte alt_1314; // 0~1=OFF,ON
    byte alt_1516; // 0~1=OFF,ON
    byte reserved3[8];
    byte reserved4[178];
    byte motion_seq_part_slot[24]  ; // 0,1~16,17=Off,Part1~16,Master FX
    byte motion_seq_destination[24]; // *T5-1
    byte motion_seq_slots[24][64]  ; // 0~127 for each
    byte reserved5[208];
    korg_e2_part parts[16];
    byte reserved6[252];
    byte footer[4]; // 'PTED' = 44455450[HEX]
    byte reserved7[1024];
} korg_e2_pattern;

#endif /* korg_e2_h */
