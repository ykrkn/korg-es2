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
    function SXObject() {
    }
    SXObject.prototype.unpack = function (data) { };
    SXObject.prototype.pack = function () { return []; };
    return SXObject;
}());
var Pattern = /** @class */ (function (_super) {
    __extends(Pattern, _super);
    function Pattern() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pattern.prototype.unpack = function (data) {
        this.data = data;
    };
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
        var pattern = new Pattern();
        var data = data_mock_1.default();
        pattern.unpack(data);
        return pattern;
    };
    return ES2Service;
}());
exports.ES2Service = ES2Service;
//# sourceMappingURL=service.js.map