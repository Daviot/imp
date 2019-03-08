import { Env } from '../../../models/env';
import { ImpModule, ImpModuleConfig } from '../../../models/module';
import { method } from '../../../system/decorators';

export default class DemoModule extends ImpModule {
    constructor(config: ImpModuleConfig, env: Env) {
        super(config, env);
        // configure the current module
        this.setConfig('name', 'Help');
        this.setConfig('aliases', ['?']);
        this.setConfig('description', 'Show all modules and their options');

        this.validateConfig();
    }
    // will be called when the module itself is called
    default() {
        this.env.event.emit('imp:module:all', list => {
            this.showList(list);
        });
    }

    showList(list) {
        list.map(entry => {
            this.env.terminal(`${entry.command}\n`);
            console.log(entry)
        });
    }
}
