import { Env } from '../models/env';
import { MethodResult, Command } from '../models/method';
import { timingSafeEqual } from 'crypto';
import { ImpModuleDataNode, ImpModuleDataNodeType } from '../models/module';
import { readlink } from 'fs';
import Interfaces from '../ui/interfaces';

export default class AutoComplete {
    config;
    env: Env;
    menu: any;
    commandList: string[];
    interfaces: Interfaces;
    constructor(env: Env, commandList: string[], menu: any) {
        this.commandList = commandList;
        if (env != null) {
            this.env = env;
            this.menu = menu;
            this.config = {
                autoComplete: commandList,
                autoCompleteHint: true,
                autoCompleteMenu: {
                    cancelable: true,
                    selectedStyle: this.env.terminal.green
                },
                cancelable: true,
                tokenHook: (token, isEndOfInput, previousTokens, term, config) => {
                    //console.log(token, isEndOfInput, previousTokens, term, config);
                    //process.exit();
                    //console.log(token);
                }
            };
            this.interfaces = new Interfaces(this.env.terminal);
        } else {
            console.log('[autocomplete]', 'missing environment');
            this.env.event.emit('imp:quit');
        }
    }
    build(commandList: string[] = null, next: Function = null, firstCall = false) {
        this.env.echo('amused', 'What can I do for you?');
        if (firstCall) {
            this.env.echo('happy', 'Tip: type ? to see everything I can do for you or ESC to end this conversation');
        }
        if (commandList == null) {
            commandList = this.commandList;
            //console.log(this.commandList);
        }
        // fallback callback
        if (next == null) {
            next = (err, input) => {
                this.next(err, input);
            };
        }
        this.config.autoComplete = commandList;
        this.env.terminal.inputField(this.config, next);
    }

    next(err, input) {
        this.env.terminal.clear();
        debugger;
        if (err != null) {
            this.env.echo('dead', 'An error occured');
            console.log('[autocomplete]', err);
            this.env.event.emit('imp:quit');
        }
        // canceled input
        if (input == null && err == null) {
            this.env.echo('happy', 'Have a nice day, Bye');
            this.env.event.emit('imp:quit');
        }
        if (input == '' && err == null) {
            this.env.event.emit('imp:auto-complete:start');
        } else {
            // try to find command
            const result = this.menu.findCommand(input);
            if (result != null) {
                //console.log('[autocomplete]', result);
                console.log('[autocomplete]', result)
                this.menu.execute(result)
            } else {
                //@todo insert fuzzy search/best match

                const fuzzy = this.findFuzzyCommand(input);

                this.env.echo('confused', `I don't know what "${this.env.terminal.str.red(input)}" means?`);
                if (fuzzy != null && fuzzy.length > 0) {
                    this.env.echo('normal', `Are you looking for one of these?`);
                    // display possible values
                    this.printFindResults(fuzzy, input);
                    this.env.event.emit('imp:auto-complete:start');
                } else {
                    this.env.echo('dead', 'Please retry');
                    this.env.event.emit('imp:quit');
                }
            }
        }
    }

    findFuzzyCommand(input: string) {
        return this.menu.find(input, true);
    }
    // unused
    findMethod(input: string): MethodResult | null {
        let methodPath = input.split(':');

        let method = null,
            config = null;

        
        if (methodPath.length > 0) {
            // the modules are build in another way
            const moduleMethod = this.menu.filter(m => m.config.module == methodPath[0]);
            method = moduleMethod[0].methods;
            if (moduleMethod[0].config != null) {
                config = moduleMethod[0].config;
            }
            // remove the first, to select the childs methods correctly
            methodPath.shift();

            if (methodPath.length > 0) {
                // search down the tree to get the correct method
                methodPath.map(name => {
                    if (method != null && method[name] != null) {
                        method = method[name];
                    }
                });
                // check if the item itself has a main method
                if (typeof method == 'object' && method.hasOwnProperty('_')) {
                    return new MethodResult(method._, config);
                }
                return new MethodResult(method, config);
            } else {
                // return the main method
                if (typeof method == 'object' && method.hasOwnProperty('_')) {
                    return new MethodResult(method._, config);
                }
            }
        }
        return null;
    }

    printFindResults(result: ImpModuleDataNode[], input: string) {
        if (result == null) {
            return null;
        }
        this.interfaces.commandList(result, input);
    }
}
