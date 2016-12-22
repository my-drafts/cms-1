'use strict';
var util = require('util');
var simpleManager = (function () {
    function simpleManager() {
        this.storage = [];
    }
    simpleManager.prototype.get = function (index) {
        if (index === void 0) { index = 0; }
        if (index in this.storage) {
            return this.storage[index];
        }
        else {
            throw new TypeError('Error: manager index out of range');
        }
    };
    simpleManager.prototype.set = function (value, index) {
        if (index === void 0) { index = -1; }
        if (index in this.storage) {
        }
    };
    return simpleManager;
}());
exports.simpleManager = simpleManager;
//# sourceMappingURL=simpleManager.js.map