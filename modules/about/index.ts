import { Env } from './../../models/env';
import Emoji from '../../ui/emoji';

export default class About {
    constructor(config, env: Env) {
        env.event.emit('imp:module:add', {
            config: config,
            // defines the menu entries for quick navigation and the select menu
            menu: {
                _: () => {
                    env.echo('happy', "Hy I'm your personal imp for development tasks");
                    env.terminal('copyright Daviot https://github.com/Daviot ' + env.packageJson.license + '\n');
                },
                version: () => {
                    env.terminal(env.packageJson.version + '\n');
                },
                website: {
                    _description: `Prints the website for ${env.packageJson.name}`,
                    _: () => {
                        env.terminal(env.packageJson.homepage + '\n');
                    }
                },
                author: () => {
                    env.terminal(env.packageJson.author + '\n');
                },
                test: {
                    emoji: () => {
                        const emoji = new Emoji();
                        const keys = emoji.keys();
                        keys.map(name => {
                            console.log(`console ${name} ${emoji.get(name, true)}`);
                            env.terminal.green(`terminal-kit ${name} ${emoji.get(name)}\n`);
                        });
                    }
                }
            }
        });
    }
}
