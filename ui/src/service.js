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
    return SXObject;
}());
var DataChunk = /** @class */ (function () {
    function DataChunk() {
    }
    DataChunk.byteArray = function (name, from, length) {
        var p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = length;
        p.ba2val = function (ba) { return ba.slice(from, from + length); };
        p.val2ba = function (v) { return v.slice(0); };
        return p;
    };
    DataChunk.byte = function (name, from) {
        var p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = 1;
        p.ba2val = function (ba) { return ba[from]; };
        p.val2ba = function (v) { return [v]; };
        return p;
    };
    DataChunk.short = function (name, from) {
        var p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = 2;
        p.ba2val = function (ba) {
            var _ba = ba.slice(from, from + 2);
            return (((_ba[1] & 0xFF) << 8) | _ba[0] & 0xFF);
        };
        p.val2ba = null; // TODO:
        return p;
    };
    DataChunk.int = function (name, from) {
        var p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = 4;
        p.ba2val = function (ba) {
            var _ba = ba.slice(from, from + 4);
            return ((_ba[3] & 0xFF) << 24) | ((_ba[2] & 0xFF) << 16) | ((_ba[1] & 0xFF) << 8) | _ba[0] & 0xFF;
        };
        p.val2ba = null; // TODO:
        return p;
    };
    DataChunk.string = function (name, from, length) {
        var p = new DataChunk();
        p.name = name;
        p.offset = from;
        p.length = length;
        p.ba2val = function (ba) {
            var s = "";
            for (var i = 0; i < length; i++) {
                var n = ba[from + i];
                if (n == 0)
                    break;
                s = s.concat(String.fromCharCode(n));
            }
            return s;
        };
        p.val2ba = null; // TODO:
        return p;
    };
    return DataChunk;
}());
var Pattern = /** @class */ (function (_super) {
    __extends(Pattern, _super);
    function Pattern(data) {
        var _this = _super.call(this, data) || this;
        _this.props = {};
        for (var i in Pattern.chunks) {
            var chunk = Pattern.chunks[i];
            _this.props[chunk.name] = chunk.ba2val(data);
        }
        return _this;
    }
    Pattern.chunks = [
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
        DataChunk.byte("gateArpPattern", 44 + 5),
        DataChunk.byte("gateArpSpeed", 44 + 6),
        // TODO: check gateArpTime! should be -100 ~ 100
        DataChunk.short("gateArpTime", 44 + 8),
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