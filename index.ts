#!/usr/bin/env node

const pjson = require('./package.json');
const configModules = require('./config/modules.json');
// main tool dependencies
const { spawn } = require('child_process');
const winston = require('winston');
const c = require('ansi-colors');
import * as jetpack from 'fs-jetpack';
import Logo from './ui/logo';
import Emoji from './ui/emoji';
import Menu from './system/menu';
import Autoloader from './system/autoloader';
import { Env, EnvConfig } from './models/env';
import { EventEmitter } from 'events';
import Events from './system/events';
import { Logger } from './system/logger';
import { getDateTime } from './system/helper';

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
const envConfig = new EnvConfig();
envConfig.runningSince = new Date();
const env = new Env(
    new EventEmitter(),
    (mood, message) => {
        if (mood == null) {
            mood = 'normal';
        }
        terminal.green(emoji.get(mood) + ' ').defaultColor(message + '\n');
    },
    pjson,
    envConfig,
    terminal,
    cwd,
    homedir,
    new Logger(jetpack),
    jetpack
);

env.logger.log('app', `started ${getDateTime(new Date())}`);

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
