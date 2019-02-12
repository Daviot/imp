import { Env } from './../../models/env';

export default class Demo {
    constructor(config, env: Env) {
        env.event.emit('imp:module:add', {
            config: config,
            // defines the menu entries for quick navigation and the select menu
            menu: {
                _: () => {
                    env.echo('confused', "Hy I'm your personal imp for development tasks");
                    console.log('copyright Daviot<daviot@live.at>');
                },
                website: () => {
                    console.log(env.package.homepage);
                }
            }
        });
    }
}
