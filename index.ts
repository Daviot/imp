#!/usr/bin/env node

// DEVELOPER TIP run
// tsc index -w

const pjson = require('./package.json');
// main tool dependencies
const commander = require('commander');
const enquirer = require('enquirer');
const c = require('ansi-colors');
import Logo from './ui/logo';

// cli arguments
commander.version(pjson.version).parse(process.argv);
const logo = new Logo();
logo.write();
// test();
console.log(c.green('<(-.-)>'), c.dim('Work currently in progress!!!'));
console.log(
    c.red(
        `Don't use this before version ${c.bold('1.x')} and it's currently in version ${c.bold(
            pjson.version
        )}, seriously`
    )
);

async function test() {
    const response = await enquirer.prompt({
        type: 'input',
        name: 'username',
        message: 'What is your username?'
    });
    console.log(response);
}
