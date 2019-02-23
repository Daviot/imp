import { Env } from './../../models/env';

export default class QuitModule {
    constructor(config, env: Env) {
        env.event.emit('imp:module:add', {
            config: config,
            // defines the menu entries for quick navigation and the select menu
            menu: {
                _: () => {
                    env.echo('normal', `Bye`);
                    process.exit();
                }
            }
        });
    }
}
