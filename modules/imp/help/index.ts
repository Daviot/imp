import { Env } from '../../../models/env';
import { ImpModule, ImpModuleConfig } from '../../../models/module';
import { method } from '../../../system/decorators';
import Interfaces from '../../../ui/interfaces';

export default class DemoModule extends ImpModule {
    interfaces: Interfaces;
    constructor(config: ImpModuleConfig, env: Env) {
        super(config, env);
        // configure the current module
        this.setConfig('name', 'Help');
        this.setConfig('aliases', ['?']);
        this.setConfig('description', 'Show all modules and their options');
        this.interfaces = new Interfaces(env.terminal);
        this.validateConfig();
    }
    // will be called when the module itself is called
    default(next) {
        this.env.config.restartImp = true;
        this.env.event.emit('imp:module:all', list => {
            this.showList(list);
        });
        next();
    }

    showList(list) {
            this.env.echo('amused', 'Here is everything i can do for you');
            this.env.terminal('\n');
            for (let i in list) {
                const entry = list[i];
                let output = [];
                if(entry.aliases != null && entry.aliases .length >0) {
                    output.push(`${this.interfaces.highlight(entry.command, this.env.terminal.str.bold.green)} ${this.interfaces.highlight(
                        `[${entry.aliases.join(',')}]`,
                        this.env.terminal.str.styleReset
                    )}`);
                } else {
                    output.push(this.interfaces.highlight(entry.command, this.env.terminal.str.bold.green));
                }
                if (entry.description != null) {
                    output.push(
                        `  ${this.interfaces.highlight(entry.name, this.env.terminal.str.styleReset)} ${this.interfaces.highlight(
                            entry.description,
                            this.env.terminal.str.dim
                        )}`
                    );
                } else {
                    output.push(`  ${this.interfaces.highlight(entry.name, this.env.terminal.str.styleReset)}`);
                }
                output.push('');
                this.env.terminal(output.join(this.env.terminal.str.defaultColor('\n')));
            }
            this.env.terminal('\n');
        }
        
    }
}
