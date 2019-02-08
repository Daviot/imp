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
const term = require('terminal-kit').terminal;
const menu = new Menu();
logo.write();

console.log(c.dim('v'), c.green(pjson.version));

// load user settings
const cwd = jetpack.cwd();
console.log(cwd);

// get the current users home directory
const homedir = require('os').homedir();

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
const env = new Env(
    new EventEmitter(),
    (mood, message) => {
        if (mood) {
            console.log(c.green(emoji.get(mood)), c.dim(message));
        }
    },
    pjson
);

if (parseInt(pjson.version.split('.')[0], 10) < 1) {
    env.echo('confused', 'Work currently in progress!!!');
    console.log(
        c.red(
            `Don't use this before version ${c.bold('1.x')} and it's currently in version ${c.bold(
                pjson.version
            )}, seriously`
        )
    );
    console.log('');
}

// bind events
env.event.on('imp:module:add', data => {
    console.log('imp:module:add', data);
    if (data != null && data.hasOwnProperty('config')) {
        if (data.hasOwnProperty('menu')) {
            menu.add(data.config, data.menu);
        }
    }
});

// Autoload the modules of the configuration
const modules = new Autoloader(jetpack, config_modules, env);
console.log('#', modules);

console.log('');
console.log('Menu');
const menuEntries = menu.allNames();

console.log(menuEntries);
const options = {
    y: 0,
    selectedStyle: term.green,
    cancelable: true
};
console.log('Select module');
term.singleLineMenu(menuEntries, options, function(error, response) {
    term('\n').eraseLineAfter.green(
        '#%s selected: %s (%s,%s)\n',
        response.selectedIndex,
        response.selectedText,
        response.x,
        response.y
    );
    process.exit();
});

async function test() {
    const response = await enquirer.prompt({
        type: 'input',
        name: 'username',
        message: 'What is your username?'
    });
    console.log(response);
}
