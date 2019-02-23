import { Env } from '../models/env';
import { MethodResult } from '../models/method';
import { timingSafeEqual } from 'crypto';

export default class AutoComplete {
    config;
    env: Env;
    menu: any;
    list: string[];
    constructor(env: Env, list: string[], menu: any) {
        this.list = list;
        if (env != null) {
            this.env = env;
            this.menu = menu;
            this.config = {
                autoComplete: list,
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
    build(autoComplete: string[] = null, next: Function = null) {
        if (autoComplete == null) {
            autoComplete = this.list;
        }
        // fallback callback
        if (next == null) {
            next = (err, input) => {
                this.next(err, input);
            };
        }
        this.config.autoComplete = autoComplete;
        this.env.terminal.inputField(this.config, next);
    }

    next(err, input) {
        this.env.terminal.clear();
        // canceled input
        if ((input == null || input == '') && err == null) {
            this.env.event.emit('imp:auto-complete:start');
        } else {
            if (this.list.indexOf(input) >= 0) {
                //@todo insert fuzzy search/best match
                if(err != null) {
                    this.env.echo('dead', 'An error occured')
                    console.log(err);
                    process.exit();
                }
                //@todo call the selected method
                const methodResult = this.findMethod(input);
                if (methodResult != null && methodResult.method != null) {
                    this.env.echo('happy', `method "${this.env.terminal.str.green(input)}" found`);
                    // display infos about the module
                    if (methodResult.config != null) {
                        this.env.terminal('Module ').bold(`${methodResult.config.name}\n`);
                        if (methodResult.config.description != null && methodResult.config.description != '') {
                            this.env.terminal.dim(`${methodResult.config.description}\n`);
                        }
                    }
                    this.env.terminal('\n');
                    methodResult.method(this.env);
                } else {
                    this.env.echo('sad', `can't find the method "${this.env.terminal.str.red(input)}"`);
                }
                process.exit();
            } else {
                this.env.echo('confused', `I don't know what "${this.env.terminal.str.green(input)}" means?`);
                this.env.event.emit('imp:auto-complete:start');
            }
        }
    }

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
}
