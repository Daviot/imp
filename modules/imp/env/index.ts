import { Env } from './../../../models/env';
import Emoji from '../../../ui/emoji';

export default class EnvModule {
    constructor(config, env: Env) {
        env.event.emit('imp:module:add', {
            config: config,
            // defines the menu entries for quick navigation and the select menu
            menu: {
                scripts: (next) => {
                    if (env.packageJson != null && env.packageJson.scripts != null) {
                        Object.keys(env.packageJson.scripts).map(script => {
                            env.terminal
                                .green(script)
                                .dim(` npm run ${script}`)
                                .defaultColor(`\n${env.packageJson.scripts[script]}\n\n`);
                        });
                        next();
                    }
                }
            }
        });
    }
}
