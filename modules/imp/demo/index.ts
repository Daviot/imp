import { Env } from '../../../models/env';
import { ImpModule, ImpModuleConfig } from '../../../models/module';
import { method } from '../../../system/decorators';

export default class DemoModule extends ImpModule {
    constructor(config: ImpModuleConfig, env: Env) {
        super(config, env);
        // configure the current module
        this.setConfig('name', 'Demo');
        this.setConfig('description', 'This is a demo plugin to show how to build your first plugin');

        this.validateConfig();
    }
    // will be called when the module itself is called
    default() {
        console.log('default');
    }
    @method({
        name: 'Website',
        aliases: ['ws']
    })
    website() {
        this.env.terminal(this.env.packageJson.homepage+ '\n');
    }

    @method()
    author() {
        this.env.terminal(this.env.packageJson.author+ '\n');
    }
}
