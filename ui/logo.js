"use strict";
exports.__esModule = true;
var c = require('ansi-colors');
var Logo = /** @class */ (function () {
    function Logo() {
    }
    Logo.prototype.write = function () {
        Logo.data.map(function (row) {
            console.log(c.green(row));
        });
    };
    Logo.data = [
        '',
        ' ██▓ ███▄ ▄███▓ ██▓███',
        '▓██▒▓██▒▀█▀ ██▒▓██░  ██▒',
        '▒██▒▓██    ▓██░▓██░ ██▓▒',
        '░██░▒██    ▒██ ▒██▄█▓▒ ▒',
        '░██░▒██▒   ░██▒▒██▒ ░  ░',
        '░▓  ░ ▒░   ░  ░▒▓▒░ ░  ░',
        ' ▒ ░░  ░      ░░▒ ░',
        ' ▒ ░░      ░   ░░',
        ' ░         ░',
        ''
    ];
    return Logo;
}());
exports["default"] = Logo;
