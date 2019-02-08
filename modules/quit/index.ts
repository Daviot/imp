import { Env } from './../../models/env';

export default class QuitMod {
    constructor(config, env: Env) {
        env.event.emit('imp:module:add', {
            config: config,
            // defines the menu entries for quick navigation and the select menu
            menu: {
                _: () => {
                    console.log('Quit!');
                },
                kill: ()=> {
                    console.log('kill n Quit!');
                }
            }
        });
    }
}
