import { Env } from '../../../models/env';
import { ImpModule, ImpModuleConfig } from '../../../models/module';
import { isMethod } from '../../../system/decorators';

export default class DemoModule extends ImpModule {
    constructor(config: ImpModuleConfig, env: Env) {
        super(config, env);
        // configure the current module
        this.config.name = 'Demo';
        this.config.description = 'This is a demo plugin to show how to build your first own plugin';
        // env.event.emit('imp:module:add', {
        //     config: config,
        //     // defines the menu entries for quick navigation and the select menu
        //     menu: {
        //         _: () => {
        //             env.echo('confused', "Hy I'm your personal imp for development tasks");
        //             console.log('copyright Daviot<daviot@live.at>');
        //         },
        //         website: () => {
        //             console.log(env.packageJson.homepage);
        //         }
        //     }
        // });
    }
    @isMethod({
        aliases: ['ws']
    })
    website() {
        console.log(this.env.packageJson.homepage);
    }

    @isMethod()
    author() {
        console.log(this.env.packageJson.author);
    }
}
