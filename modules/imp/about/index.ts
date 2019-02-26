import { Env } from '.././../../models/env';
import Emoji from '../../../ui/emoji';

export default class AboutModule {
    constructor(config, env: Env) {
        /*
        env.event.emit('imp:module:add', {
            config: config,
            // defines the module itself
            menu: {
                _: () => {
                    env.echo('happy', "Hy I'm your personal imp, a little helper in development tasks, to simplify your life!");
                    env.terminal(`Find out more how to work with me at ${env.packageJson.homepage}\n`)
                    env.terminal(`copyright ${env.packageJson.author } ${env.packageJson.license }\n`);
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
                license: () => {
                    env.terminal(env.packageJson.license + '\n');
                },
                test: {
                    emoji: () => {
                        const emoji = new Emoji();
                        const keys = emoji.keys();
                        keys.map(name => {
                            console.log(`console ${name} ${emoji.get(name, true)}`);
                            env.terminal.green(`terminal-kit ${name} ${emoji.get(name)}\n`);
                        });
                    },
                    scripts: ()=> {
                        if(env.packageJson != null && env.packageJson.scripts != null) {
                            Object.keys(env.packageJson.scripts).map((script)=> {
                                env.terminal.green(script).dim(` npm run ${script}`).defaultColor(`\n${env.packageJson.scripts[script]}\n\n`)
                            });
                        }
                    }
                }
            }
        });
        */
    }
}
