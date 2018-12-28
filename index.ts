#!/usr/bin/env node

// DEVELOPER TIP run
// tsc index -w

const pjson = require('./package.json');
// main tool dependencies
const commander = require('commander');
const enquirer = require('enquirer');
const c = require('ansi-colors');

// cli arguments
commander.version(pjson.version).parse(process.argv);
// test();
console.log(c.green('<(-.-)>'), c.dim('Work currently in progress!!!'));

async function test() {
    const response = await enquirer.prompt({
        type: 'input',
        name: 'username',
        message: 'What is your username?'
    });
    console.log(response);
}
