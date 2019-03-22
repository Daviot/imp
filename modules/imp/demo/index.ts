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
    async default(next) {
        this.log('default2');
        const data = await this.env.jetpack.readAsync('./file.txt');

        this.log(data)
        // this.env.jetpack.readAsync('./file.txt').then(data => {
        //     console.log(data);
        //     next();
        // });
        //console.log(image.data);
        this.log('end');
        next();
    }
    @method({
        name: 'Website',
        aliases: ['ws']
    })
    website(next) {
        this.env.terminal(this.env.packageJson.homepage + '\n');
        next();
    }

    @method()
    author(next) {
        this.env.terminal(this.env.packageJson.author + '\n');
        next();
    }
}
