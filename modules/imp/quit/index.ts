import { Env } from '../../../models/env';
import { ImpModule, ImpModuleConfig } from '../../../models/module';
import { method } from '../../../system/decorators';

export default class QuitModule extends ImpModule {
    constructor(config: ImpModuleConfig, env: Env) {
        super(config, env);
        // configure the current module
        this.setConfig('name', 'Quit');
        this.setConfig('aliases', ['q', 'exit', 'cancel', 'abort', 'stop', 'end']);
        this.setConfig('description', 'Ends the conversation with imp');

        this.validateConfig();
    }
    // will be called when the module itself is called
    default() {
        process.exit();
    }
}
