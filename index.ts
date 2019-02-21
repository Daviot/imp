#!/usr/bin/env node

const pjson = require('./package.json');
const config_modules = require('./config/modules.json');
// main tool dependencies
const { spawn } = require('child_process');
const commander = require('commander');
const enquirer = require('enquirer');
const c = require('ansi-colors');
import * as jetpack from 'fs-jetpack';
import Logo from './ui/logo';
import Emoji from './ui/emoji';
import Menu from './system/menu';
import Autoloader from './system/autoloader';
import { Env } from './models/env';
import { EventEmitter } from 'events';
// define modules to compile them -.-
import About from './modules/about/index';
import Magento2 from './modules/magento2/index';

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
        terminal.green(emoji.get(mood) + '- ').defaultColor(message + '\n');
    },
    pjson,
    terminal
);
// create menu
const menu = new Menu(env);

if (parseInt(pjson.version.split('.')[0], 10) < 1) {
    env.echo('confused', 'Work currently in progress!!!');
    console.log(`Don't use this before version ${'1.x'} and it's currently in version ${pjson.version}, seriously`);
    console.log('');
}

// bind events
env.event.on('imp:module:add', data => {
    //console.log('imp:module:add', data);
    if (data != null && data.hasOwnProperty('config')) {
        if (data.hasOwnProperty('menu')) {
            menu.add(data.config, data.menu);
        }
    }
});

// Autoload the modules of the configuration
const modules = new Autoloader(jetpack, config_modules, env);

menu.build();