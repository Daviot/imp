import { Env } from './../../models/env';

export default class About {
    constructor(env: Env) {
        env.event.emit('imp:module:add', {
            // defines the menu entries for quick navigation and the select menu
            menu: {
                _: () => {
                    env.echo('happy', "Hy I'm your personal imp for development tasks");
                    console.log('copyright Daviot<daviot@live.at>');
                },
                website: () => {
                    console.log(env.package.homepage);
                }
            }
        });
    }
}
