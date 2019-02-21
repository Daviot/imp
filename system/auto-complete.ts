import { Env } from '../models/env';

export default class AutoComplete {
    config;
    env: Env;
    list: string[];
    constructor(env: Env, list: string[]) {
        this.list = list;
        if (env != null) {
            this.env = env;
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
                console.log('err', err);
                console.log('input', input);
                //@todo call the selected method
                console.log('@todo call the selected method');
                process.exit();
            } else {
                this.env.echo('confused', `I don't know what "${this.env.terminal.str.green(input)}" means?`);
                this.env.event.emit('imp:auto-complete:start');
            }
        }
    }
}
