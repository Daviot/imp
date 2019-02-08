import { Env } from './../../models/env';

export default class Magento2 {
    constructor(config, env: Env) {
        env.event.emit('imp:module:add', {
            config: config,
            menu: {
                entry: {

                },
                cache: () => {
                    console.log('cache');
                }
            }
        });
    }
}
