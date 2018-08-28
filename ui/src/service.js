"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var data_mock_1 = require("./data-mock");
// get pattern dump
// put pattern dump
// get all dump
// get file dump
var SXObject = /** @class */ (function () {
    function SXObject(data) {
        this.data = data;
    }
    SXObject.prototype.pack = function () { return new Uint8Array(0); };
    SXObject.prototype.validate = function () {
        return false;
    };
    return SXObject;
}());
var ba2slice = function (chunk, ba) {
    return ba.slice(chunk.offset, chunk.offset + chunk.length);
};
var ba2string = function (chunk, ba) {
    var s = "";
    for (var i = 0; i < chunk.length; i++) {
        var n = ba[chunk.offset + i];
        if (n == 0)
            break;
        s = s.concat(String.fromCharCode(n));
    }
    return s;
};
var ba2byte = function (chunk, ba) {
    return ba[chunk.offset];
};
var ba2short = function (chunk, ba) {
    var _ba = ba.slice(chunk.offset, chunk.offset + chunk.length);
    return (((_ba[1] & 0xFF) << 8) | _ba[0] & 0xFF);
};
var ba2int = function (chunk, ba) {
    var _ba = ba.slice(chunk.offset, chunk.offset + chunk.length);
    return ((_ba[3] & 0xFF) << 24) | ((_ba[2] & 0xFF) << 16) | ((_ba[1] & 0xFF) << 8) | _ba[0] & 0xFF;
};
var DataChunk = /** @class */ (function () {
    function DataChunk(name, length, ba2val) {
        this.offset = 0;
        this.length = 0;
        this.name = null;
        this._comment = null;
        this._ba2val = null;
        this._val2ba = null;
        this.name = name;
        this.length = length;
        this._ba2val = ba2val;
    }
    DataChunk.prototype.comment = function (value) {
        this._comment = value;
        return this;
    };
    DataChunk.prototype.ba2val = function (ba) {
        if (this._ba2val == null)
            return null;
        return this._ba2val(this, ba);
    };
    DataChunk.byteArray = function (name, length) {
        return new DataChunk(name, length, ba2slice);
    };
    DataChunk.byte = function (name) {
        return new DataChunk(name, 1, ba2byte);
    };
    DataChunk.short = function (name) {
        return new DataChunk(name, 2, ba2short);
    };
    DataChunk.int = function (name) {
        return new DataChunk(name, 4, ba2int);
    };
    DataChunk.string = function (name, length) {
        return new DataChunk(name, length, ba2string);
    };
    DataChunk.padding = function (length) {
        return new DataChunk("_padding_" + length, length, null);
    };
    return DataChunk;
}());
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
var Step = /** @class */ (function (_super) {
    __extends(Step, _super);
    function Step() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Step;
}(SXObject));
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
var Part = /** @class */ (function (_super) {
    __extends(Part, _super);
    function Part() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Part;
}(SXObject));
var Pattern = /** @class */ (function (_super) {
    __extends(Pattern, _super);
    function Pattern(data) {
        var _this = _super.call(this, data) || this;
        _this.props = {};
        for (var i = 0, offset = 0; i < Pattern.chunks.length; ++i) {
            var chunk = Pattern.chunks[i];
            chunk.offset = offset;
            _this.props[chunk.name] = chunk.ba2val(data);
            offset += chunk.length;
            console.log(chunk, chunk.ba2val(data));
        }
        if (!_this.validate()) {
            throw new Error('Invalid data');
        }
        return _this;
    }
    Pattern.prototype.validate = function () {
        if (this.data.length !== 16384)
            return false;
        if (this.props['header'] !== 'PTST')
            return false;
        if (this.props['footer'] !== 'PTED')
            return false;
        return true;
    };
    Pattern.chunks = [
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
        DataChunk.byteArray("motion_seq_slots", 24 * 64).comment("0~127 for each"),
        DataChunk.padding(208),
        // TODO: korg_e2_part
        DataChunk.padding(16 * (48 + (64 * 12))),
        DataChunk.padding(252),
        DataChunk.string("footer", 4).comment("'PTED' = 44455450[HEX]"),
        DataChunk.padding(1024)
    ];
    return Pattern;
}(SXObject));
var Dataset = /** @class */ (function (_super) {
    __extends(Dataset, _super);
    function Dataset() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.patterns = [];
        return _this;
    }
    return Dataset;
}(SXObject));
var ES2Service = /** @class */ (function () {
    function ES2Service() {
    }
    ES2Service.prototype.getPattern = function () {
        var data = data_mock_1.default();
        return new Pattern(data);
    };
    return ES2Service;
}());
exports.ES2Service = ES2Service;
//# sourceMappingURL=service.js.map