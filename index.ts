#!/usr/bin/env node

const pjson = require('./package.json');
const configModules = require('./config/modules.json');
// main tool dependencies
const { spawn } = require('child_process');
const commander = require('commander');
const enquirer = require('enquirer');
const winston = require('winston');
const c = require('ansi-colors');
import * as jetpack from 'fs-jetpack';
import Logo from './ui/logo';
import Emoji from './ui/emoji';
import Menu from './system/menu';
import Autoloader from './system/autoloader';
import { Env } from './models/env';
import { EventEmitter } from 'events';
import Events from './system/events';

// cli arguments
commander.version(pjson.version).parse(process.argv);

// ui
const logo = new Logo();
const emoji = new Emoji();
const terminal = require('terminal-kit').terminal;
logo.write();

terminal
    .dim('v ')
    .green(pjson.version)
    .defaultColor('\n');
// load user settings
const cwd = jetpack.cwd();
//console.log(cwd);

// get the current users home directory
const homedir = require('os').homedir();
//console.log(homedir);

// the environment for all modules
const env = new Env(
    new EventEmitter(),
    (mood, message) => {
        if (mood == null) {
            mood = 'normal';
        }
        terminal.green(emoji.get(mood) + ' ').defaultColor(message + '\n');
    },
    pjson,
    terminal,
    winston.createLogger({
        level: 'debug'
    })
);

// contains all events
const eventProvider = new Events(env);
// create menu
const menu = new Menu(env);
eventProvider.menu(menu);

if (parseInt(pjson.version.split('.')[0], 10) < 1) {
    env.echo('confused', 'Work currently in progress!!!');
    terminal.red(`Don't use this before version ${terminal.str.bold('1.x')} and it's currently in version ${terminal.str.bold(pjson.version)}, seriously\n`);
}


// Autoload the modules of the configuration
const autoloader = new Autoloader(jetpack, configModules, env);
eventProvider.autoloader(autoloader);
autoloader.init();

/*
env.event.emit('imp:auto-complete:start');
*/

//menu.build();
