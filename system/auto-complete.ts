import { Env } from '../models/env';
import { MethodResult, Command } from '../models/method';
import { timingSafeEqual } from 'crypto';
import { ImpModuleDataNode, ImpModuleDataNodeType } from '../models/module';
import { readlink } from 'fs';

export default class AutoComplete {
    config;
    env: Env;
    menu: any;
    commandList: string[];
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
        } else {
            console.log('ERROR', 'missing environment');
            process.exit();
        }
    }
    build(commandList: string[] = null, next: Function = null) {
        if (commandList == null) {
            commandList = this.commandList;
            console.log(this.commandList);
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
            console.log(err);
            process.exit();
        }
        // canceled input
        if ((input == null || input == '') && err == null) {
            this.env.event.emit('imp:auto-complete:start');
        } else {
            const result = this.findCommand(input);
            if (result != null) {
                console.log(result);
                switch (result.type) {
                    case ImpModuleDataNodeType.Module:
                        result.func.apply(result.context);
                        break;
                    case ImpModuleDataNodeType.Method:
                        result.func.apply(result.context);
                        break;
                    default:
                        throw `Unknown node type ${result.type} of ${result.name}`;
                        break;
                }
                // if (result.method != null) {
                //     this.env.echo('happy', `method "${this.env.terminal.str.green(input)}" found`);
                //     // display infos about the module
                //     if (result.config != null) {
                //         this.env.terminal('Module ').bold(`${result.config.name}\n`);
                //         if (result.config.description != null && result.config.description != '') {
                //             this.env.terminal.dim(`${result.config.description}\n`);
                //         }
                //     }
                //     this.env.terminal('\n');
                //     result.method(this.env);
                // } else {
                //     this.env.echo('sad', `can't find the method "${this.env.terminal.str.red(input)}"`);
                // }
                process.exit();
            } else {
                //@todo insert fuzzy search/best match
                this.env.echo('confused', `I don't know what "${this.env.terminal.str.red(input)}" means?`);
                this.env.event.emit('imp:auto-complete:start');
            }
        }
    }

    findCommand(input: string): ImpModuleDataNode | null {
        return this.menu.getByCommand(input);
    }
    findMethod(input: string): MethodResult | null {
        let methodPath = input.split(':');

        let method = null,
            config = null;

        console.log(this.commandList);
        process.exit();
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
}
