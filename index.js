#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var pjson = require('./package.json');
var config_modules = require('./config/modules.json');
// main tool dependencies
var spawn = require('child_process').spawn;
var commander = require('commander');
var enquirer = require('enquirer');
var c = require('ansi-colors');
var jetpack = require("fs-jetpack");
var logo_1 = require("./ui/logo");
var emoji_1 = require("./ui/emoji");
var autoloader_1 = require("./system/autoloader");
var env_1 = require("./models/env");
var events_1 = require("events");
// cli arguments
commander.version(pjson.version).parse(process.argv);
// ui
var logo = new logo_1["default"]();
var emoji = new emoji_1["default"]();
logo.write();
// load user settings
var cwd = jetpack.cwd();
console.log(cwd);
// get the current users home directory
var homedir = require('os').homedir();
console.log(homedir);
// const ls = spawn('ls', ['-lh', '/usr']);
// ls.stdout.on('data', data => {
//     console.log(`stdout: ${data}`);
// });
// ls.stderr.on('data', data => {
//     console.log(`stderr: ${data}`);
// });
// ls.on('close', code => {
//     console.log(`child process exited with code ${code}`);
// });
// the environment for all modules
var env = new env_1.Env(new events_1.EventEmitter(), function (mood, message) {
    if (mood) {
        console.log(c.green(emoji.get(mood)), c.dim(message));
    }
}, pjson);
if (parseInt(pjson.version.split('.')[0], 10) < 1) {
    env.echo('confused', 'Work currently in progress!!!');
    console.log(c.red("Don't use this before version " + c.bold('1.x') + " and it's currently in version " + c.bold(pjson.version) + ", seriously"));
    console.log('');
}
// bind events
env.event.on('imp:module:add', function (data) {
    console.log('imp:module:add', data);
});
// Autoload the modules of the configuration
var modules = new autoloader_1["default"](jetpack, config_modules, env);
console.log(modules);
// test();
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, enquirer.prompt({
                        type: 'input',
                        name: 'username',
                        message: 'What is your username?'
                    })];
                case 1:
                    response = _a.sent();
                    console.log(response);
                    return [2 /*return*/];
            }
        });
    });
}
